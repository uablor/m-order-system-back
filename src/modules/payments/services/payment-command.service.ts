import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repository';
import { PaymentOrmEntity } from '../entities/payment.orm-entity';
import { PaymentCreateDto } from '../dto/payment-create.dto';
import { PaymentRejectDto, PaymentBulkRejectDto } from '../dto/payment-reject.dto';
import { CustomerOrderOrmEntity } from '../../orders/entities/customer-order.orm-entity';
import { TransactionService } from '../../../common/transaction/transaction.service';
import { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import { createSingleResponse } from '../../../common/base/helpers/response.helper';
import { ImageQueryRepository } from 'src/modules/images/repositories/image.query-repository';
import { OrderOrmEntity } from 'src/modules/orders/entities/order.orm-entity';
import { PaymentStatusEnum, PaymentVerificationStatusEnum } from '../enum/payment.enum';
import { EntityManager } from 'typeorm';
import { CustomerOrderRepository } from 'src/modules/orders/repositories/customer-order.repository';
import { OrderRepository } from 'src/modules/orders/repositories/order.repository';

@Injectable()
export class PaymentCommandService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly transactionService: TransactionService,
    private readonly imageQueryRepository: ImageQueryRepository,
    private readonly orderRepository: OrderRepository,
    private readonly customerOrderRepository: CustomerOrderRepository,
  ) { }

  async create(
    dto: PaymentCreateDto,
    currentUser: CurrentUserPayload,
  ) {
    const payment = await this.transactionService.run(async (manager) => {
      const customerOrderRepo = manager.getRepository(CustomerOrderOrmEntity);
      const customerOrder = await customerOrderRepo.findOne({
        where: { id: dto.customerOrderId },
        relations: ['order', 'order.merchant'],
      });

      if (!customerOrder) {
        throw new NotFoundException('Customer order not found');
      }
      if (!customerOrder.order.arrivedAt) {
        throw new BadRequestException('Order must be arrived before making a payment');
      }

      // For public customer payments, we don't check merchant authorization
      // The customer can only pay for their own orders via token-based access
      if (currentUser && currentUser.merchantId && currentUser.merchantId !== customerOrder.order.merchant.id) {
        throw new ForbiddenException('You are not authorized to make a payment for this order');
      }

      const image = dto.paymentProofImageId != null
        ? await this.imageQueryRepository.findByIdWithRelations(dto.paymentProofImageId, manager)
        : null;

      // ตรวจสอบว่า payment amount ไม่เกิน remaining amount
      if (dto.paymentAmount > customerOrder.remainingAmount) {
        throw new BadRequestException(
          `Payment amount (${dto.paymentAmount}) cannot exceed remaining amount (${customerOrder.remainingAmount})`,
        );
      }

      // ตรวจสอบว่าสถานะยังสามารถชำระได้
      if (customerOrder.paymentStatus != PaymentStatusEnum.NOT_CREATED) {
        throw new BadRequestException('This order already has a payment created');
      }
      // สร้าง payment
      const newPayment = await this.paymentRepository.create(
        {
          customerOrderId: dto.customerOrderId,
          paymentAmount: dto.paymentAmount,
          paymentProofImageId: image?.id ?? undefined,
          paymentProofImage: image ?? undefined,
          customerMessage: dto.customerMessage,
          status: PaymentVerificationStatusEnum.PENDING,
          paymentDate: new Date(),
        },
        manager,
      );

      // // Update customer order payment status to UNPAID (waiting for approval)
      await customerOrderRepo.update(customerOrder.id, {
        paymentStatus: PaymentStatusEnum.UNPAID,
      });
      //  await customerOrderRepo.update(customerOrder.id, {
      //   paymentStatus: PaymentVerificationStatusEnum.PENDING, })

      return newPayment;
    });

    return createSingleResponse(payment, 'Payment created successfully');
  }

  async delete(id: number): Promise<void> {
    return this.transactionService.run(async (manager) => {
      const paymentRepo = manager.getRepository(PaymentOrmEntity);
      const payment = await paymentRepo.findOne({
        where: { id },
      });

      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      if (payment.status !== 'PENDING') {
        throw new BadRequestException('Only pending payments can be deleted');
      }

      await paymentRepo.delete(id);
    });
  }

  private async rejectInternal(
    id: number,
    dto: PaymentRejectDto,
    currentUser: CurrentUserPayload,
    manager: EntityManager,
  ): Promise<PaymentOrmEntity> {
    const payment = await this.paymentRepository.findById(id, [
      'customerOrder',
      'customerOrder.order',
      'customerOrder.order.merchant',
    ]);

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentVerificationStatusEnum.PENDING) {
      throw new BadRequestException('Only pending payments can be rejected');
    }

    const customerOrder = await this.customerOrderRepository.findOneById(
      payment.customerOrderId,
    );
    if (!customerOrder) {
      throw new NotFoundException('Customer order not found');
    }

    const order = await this.orderRepository.findOneById(
      payment.customerOrder?.order?.id,
    );

    const paymentMerchantId = payment.customerOrder?.order?.merchant?.id;
    if (typeof currentUser.merchantId === 'number' && typeof paymentMerchantId === 'number') {
      if (paymentMerchantId !== currentUser.merchantId) {
        throw new ForbiddenException('You can only reject payments for your own store');
      }
    }

    const updatedPayment = await this.paymentRepository.update(
      id,
      {
        status: PaymentVerificationStatusEnum.REJECTED,
        rejectedById: currentUser.userId,
        rejectedAt: new Date(),
        rejectReason: dto.rejectReason,
      },
      manager,
    );

    await this.customerOrderRepository.update(
      customerOrder.id,
      {
        paymentStatus: PaymentStatusEnum.UNPAID,
      },
      manager,
    );

    // Check all Customer Orders for this Main Order to determine correct status
    const customerOrderRepo = manager.getRepository(CustomerOrderOrmEntity);
    const allCustomerOrders = await customerOrderRepo.find({
      where: { order: { id: order!.id } }
    });

    const allPaid = allCustomerOrders.every(co => co.paymentStatus === PaymentStatusEnum.PAID);
    const allUnpaid = allCustomerOrders.every(co => co.paymentStatus === PaymentStatusEnum.UNPAID);

    let orderStatus: PaymentStatusEnum;
    if (allPaid) {
      orderStatus = PaymentStatusEnum.PAID;
    } else if (allUnpaid) {
      orderStatus = PaymentStatusEnum.UNPAID;
    } else {
      orderStatus = PaymentStatusEnum.UNPAID; // Mixed status - default to UNPAID
    }

    await this.orderRepository.update(
      order!.id,
      {
        paymentStatus: orderStatus,
      },
      manager,
    );

    return updatedPayment

  }

  async reject(
    id: number,
    dto: PaymentRejectDto,
    currentUser: CurrentUserPayload,
  ): Promise<PaymentOrmEntity> {
    return this.transactionService.run(async (manager) => {
      return this.rejectInternal(id, dto, currentUser, manager);
    });
  }

  async bulkReject(
    dto: PaymentBulkRejectDto,
    currentUser: CurrentUserPayload,
  ): Promise<PaymentOrmEntity[]> {
    return this.transactionService.run(async (manager) => {
      const results: PaymentOrmEntity[] = [];

      for (const id of dto.paymentIds) {
        const result = await this.rejectInternal(
          id,
          { rejectReason: dto.rejectReason },
          currentUser,
          manager,
        );
        results.push(result);
      }

      return results;
    });
  }

  private async verifyInternal(
    id: number,
    currentUser: CurrentUserPayload,
    manager: EntityManager,
  ): Promise<PaymentOrmEntity> {
    const payment = await this.paymentRepository.findById(id, [
      'customerOrder',
      'customerOrder.order',
      'customerOrder.order.merchant',
    ]);

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentVerificationStatusEnum.PENDING) {
      throw new BadRequestException('Only pending payments can be verified');
    }

    const paymentMerchantId = payment.customerOrder?.order?.merchant?.id;
    if (typeof currentUser.merchantId === 'number' && typeof paymentMerchantId === 'number') {
      if (paymentMerchantId !== currentUser.merchantId) {
        throw new ForbiddenException('You can only verify payments for your own store');
      }
    }
    const customerOrderRepo = manager.getRepository(CustomerOrderOrmEntity);

    const customerOrder = await customerOrderRepo.findOne({
      where: { id: payment.customerOrderId },
      relations: ['order'],
    });

    if (!customerOrder) {
      throw new NotFoundException('Customer order not found');
    }

    const orderRepo = manager.getRepository(OrderOrmEntity);
    const orderEntity = await orderRepo.findOne({
      where: { id: customerOrder?.order.id }, relations: ['merchant', 'customerOrders'],
    });


    const updatedPayment = await this.paymentRepository.update(
      id,
      {
        status: PaymentVerificationStatusEnum.VERIFIED,
        verifiedById: currentUser.userId,
        verifiedAt: new Date(),
      },
      manager,
    );


    let remainingAmount: number | undefined;

      const currentPaid = Number(customerOrder.totalPaid) || 0;
      const paymentAmount = Number(updatedPayment.paymentAmount) || 0;
      const currentRemaining = Number(customerOrder.remainingAmount) || 0;
      const newPaid = currentPaid + paymentAmount;
      remainingAmount = currentRemaining - paymentAmount;

      await customerOrderRepo.update(customerOrder.id, {
        totalPaid: newPaid,
        remainingAmount: remainingAmount,
        paymentStatus: PaymentStatusEnum.PAID,
      });
    

    // Check all Customer Orders for this Main Order to determine correct status
    const allCustomerOrders = await customerOrderRepo.find({
      where: { order: { id: orderEntity!.id } }
    });
    
    const allPaid = allCustomerOrders.every(co => co.paymentStatus === PaymentStatusEnum.PAID);
    
    await this.orderRepository.update(orderEntity!.id, {
      paymentStatus: allPaid ? PaymentStatusEnum.PAID : PaymentStatusEnum.UNPAID,
    }, manager);

    return updatedPayment;
  }

  async verify(
    id: number,
    currentUser: CurrentUserPayload,
  ): Promise<PaymentOrmEntity> {
    return this.transactionService.run(async (manager) => {
      return this.verifyInternal(id, currentUser, manager);
    });
  }

  async bulkVerify(
    paymentIds: number[],
    currentUser: CurrentUserPayload,
  ): Promise<PaymentOrmEntity[]> {
    return this.transactionService.run(async (manager) => {
      const results: PaymentOrmEntity[] = [];

      for (const id of paymentIds) {
        const result = await this.verifyInternal(id, currentUser, manager);
        results.push(result);
      }

      return results;
    });
  }

  async markAsRead(
    id: number,
    currentUser: CurrentUserPayload,
  ): Promise<PaymentOrmEntity> {
    const payment = await this.paymentRepository.findById(id);
    
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Check if user can mark this payment as read
    if (currentUser.roleName === 'MERCHANT') {
      if (!payment.customerOrder?.order?.merchant) {
        throw new NotFoundException('Payment order not found');
      }
      if (payment.customerOrder.order.merchant.id !== currentUser.merchantId) {
        throw new ForbiddenException('You can only mark your own payments as read');
      }
    }

    // Update readAt timestamp
    await this.paymentRepository.update(id, {
      readAt: new Date(),
    });

    // Return updated payment
    const updatedPayment = await this.paymentRepository.findById(id);
    return updatedPayment!;
  }

}
