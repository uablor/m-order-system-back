import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repository';
import { PaymentOrmEntity, PaymentStatus } from '../entities/payment.orm-entity';
import { PaymentCreateDto } from '../dto/payment-create.dto';
import { PaymentRejectDto, PaymentBulkRejectDto } from '../dto/payment-reject.dto';
import { CustomerOrderOrmEntity } from '../../orders/entities/customer-order.orm-entity';
import { TransactionService } from '../../../common/transaction/transaction.service';
import { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import { createSingleResponse } from '../../../common/base/helpers/response.helper';

@Injectable()
export class PaymentCommandService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly transactionService: TransactionService,
  ) { }

  async create(
    dto: PaymentCreateDto,
    currentUser: CurrentUserPayload,
  ) {
    const payment = await this.transactionService.run(async (manager) => {
      // ค้นหา customer order โดยตรงจาก id
      const customerOrderRepo = manager.getRepository(CustomerOrderOrmEntity);
      const customerOrder = await customerOrderRepo.findOne({
        where: { id: dto.customerOrderId },
      });

      if (!customerOrder) {
        throw new NotFoundException('Customer order not found');
      }

      // ตรวจสอบว่า payment amount ไม่เกิน remaining amount
      if (dto.paymentAmount > customerOrder.remainingAmount) {
        throw new BadRequestException(
          `Payment amount (${dto.paymentAmount}) cannot exceed remaining amount (${customerOrder.remainingAmount})`,
        );
      }

      // ตรวจสอบว่าสถานะยังสามารถชำระได้
      if (customerOrder.paymentStatus === 'PAID') {
        throw new BadRequestException('This order has already been fully paid');
      }

      // สร้าง payment
      const newPayment = await this.paymentRepository.create(
        {
          customerOrderId: dto.customerOrderId,
          paymentAmount: dto.paymentAmount,
          paymentProofUrl: dto.paymentProofUrl,
          customerMessage: dto.customerMessage,
          status: 'PENDING' as PaymentStatus,
          paymentDate: new Date(),
        },
        manager,
      );

      return newPayment;
    });

    return createSingleResponse(payment, 'Payment created successfully');
  }

  async reject(
    id: number,
    dto: PaymentRejectDto,
    currentUser: CurrentUserPayload,
  ): Promise<PaymentOrmEntity> {
    const payment = await this.paymentRepository.findById(id, [
      'customerOrder',
      'customerOrder.order',
    ]);

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== 'PENDING') {
      throw new BadRequestException('Only pending payments can be rejected');
    }

    return this.transactionService.run(async (manager) => {
      return this.paymentRepository.update(
        id,
        {
          status: 'REJECTED' as PaymentStatus,
          rejectedById: currentUser.userId,
          rejectedAt: new Date(),
          rejectReason: dto.rejectReason,
        },
        manager,
      );
    });
  }

  async verify(
    id: number,
    currentUser: CurrentUserPayload,
  ): Promise<PaymentOrmEntity> {
    const payment = await this.paymentRepository.findById(id, [
      'customerOrder',
      'customerOrder.order',
    ]);

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== 'PENDING') {
      throw new BadRequestException('Only pending payments can be verified');
    }

    return this.transactionService.run(async (manager) => {
      // อัปเดต payment
      const paymentRepo = manager.getRepository(PaymentOrmEntity);
      await this.paymentRepository.update(
        id,
        {
          status: 'VERIFIED' as PaymentStatus,
          verifiedById: currentUser.userId,
          verifiedAt: new Date(),
        },
        manager,
      );

      // อัปเดต customer order
      const customerOrderRepo = manager.getRepository(CustomerOrderOrmEntity);
      const customerOrder = await customerOrderRepo.findOne({
        where: { id: payment.customerOrderId },
      });

      if (customerOrder) {
        const currentPaid = customerOrder.totalPaid;
        const paymentAmount = payment.paymentAmount;
        const newPaid = currentPaid + paymentAmount;
        const remainingAmount = customerOrder.remainingAmount - paymentAmount;

        await customerOrderRepo.update(payment.customerOrderId, {
          totalPaid: newPaid,
          remainingAmount: remainingAmount,
          paymentStatus: remainingAmount <= 0 ? 'PAID' : 'PARTIAL',
        });
      }

      const verifiedPayment = await paymentRepo.findOne({
        where: { id },
        relations: ['customerOrder', 'customerOrder.order', 'customerOrder.customer', 'verifiedBy', 'rejectedBy'],
      });
      if (!verifiedPayment) {
        throw new Error('Payment verification failed');
      }
      return verifiedPayment;
    });
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

  async bulkVerify(
    paymentIds: number[],
    currentUser: CurrentUserPayload,
  ): Promise<PaymentOrmEntity[]> {
    const results: PaymentOrmEntity[] = [];

    for (const id of paymentIds) {
      try {
        const result = await this.verify(id, currentUser);
        results.push(result);
      } catch (error) {
        // สามารถ log error หรือเก็บไว้เพื่อรายงานผลลัพธ์
        console.error(`Failed to verify payment ${id}:`, error.message);
      }
    }

    return results;
  }

  async bulkReject(
    dto: PaymentBulkRejectDto,
    currentUser: CurrentUserPayload,
  ): Promise<PaymentOrmEntity[]> {
    const results: PaymentOrmEntity[] = [];

    for (const id of dto.paymentIds) {
      try {
        const result = await this.reject(id, { rejectReason: dto.rejectReason }, currentUser);
        results.push(result);
      } catch (error) {
        // สามารถ log error หรือเก็บไว้เพื่อรายงานผลลัพธ์
        console.error(`Failed to reject payment ${id}:`, error.message);
      }
    }

    return results;
  }
}
