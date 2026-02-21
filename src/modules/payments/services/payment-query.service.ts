import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repository';
import { PaymentOrmEntity } from '../entities/payment.orm-entity';
import { PaymentListQueryDto } from '../dto/payment-list-query.dto';
import { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import { createSingleResponse, createPaginatedResponse } from '../../../common/base/helpers/response.helper';
import { ResponseInterface, ResponseWithPaginationInterface } from 'src/common/base/interfaces/response.interface';
import { PaymentResponseDto } from '../dto/payment-response.dto';

@Injectable()
export class PaymentQueryService {
  constructor(private readonly paymentRepository: PaymentRepository) { }

  async getById(id: number): Promise<ResponseInterface<PaymentResponseDto>> {
    const payment = await this.paymentRepository.findById(id, [
      'customerOrder',
      'customerOrder.order',
      'customerOrder.customer',
      'verifiedBy',
      'rejectedBy',
    ]);

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return createSingleResponse(payment, 'Payment retrieved successfully');
  }

  async getByIdWithOwnership(
    id: number,
    currentUser: CurrentUserPayload,
  ): Promise<ResponseInterface<PaymentResponseDto>> {
    const payment = await this.paymentRepository.findById(id, [
      'customerOrder',
      'customerOrder.order',
      'customerOrder.customer',
      'verifiedBy',
      'rejectedBy',
    ]);

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // ตรวจสอบสิทธิ์การเข้าถึง
    if (currentUser.roleName === 'CUSTOMER') {
      // Customer สามารถดูได้เฉพาะของตัวเอง
      if (payment.customerOrder.customer.id !== currentUser.userId) {
        throw new ForbiddenException('You can only view your own payments');
      }
    } else if (currentUser.roleName === 'MERCHANT') {
      // Merchant สามารถดูได้เฉพาะของ merchant ตัวเอง
      if (payment.customerOrder.order.merchant.id !== currentUser.merchantId) {
        throw new ForbiddenException('You can only view payments for your own orders');
      }
    }
    // Staff และ Admin สามารถดูได้ทั้งหมด

    return createSingleResponse(payment, 'Payment retrieved successfully');
  }

  async getList(query: PaymentListQueryDto): Promise<ResponseWithPaginationInterface<PaymentResponseDto>> {
    const response = await this.paymentRepository.findByMerchant(0, query); // สำหรับ admin (merchantId = 0 หมายถึงทั้งหมด)
    return createPaginatedResponse(response.results, response.pagination, 'Payments retrieved successfully');
  }

  async getListByMerchant(
    query: PaymentListQueryDto,
    currentUser: CurrentUserPayload,
  ): Promise<ResponseWithPaginationInterface<PaymentResponseDto>> {
    if (!currentUser.merchantId) {
      throw new ForbiddenException('Only merchants can view their payments');
    }

    const response = await this.paymentRepository.findByMerchant(
      currentUser.merchantId,
      query,
    );
    return createPaginatedResponse(response.results, response.pagination, 'Payments retrieved successfully');
  }

  async getListByCustomer(
    query: PaymentListQueryDto,
    currentUser: CurrentUserPayload,
  ): Promise<ResponseWithPaginationInterface<PaymentResponseDto>> {
    const response = await this.paymentRepository.findByCustomer(
      currentUser.userId,
      query,
    );
    return createPaginatedResponse(response.results, response.pagination, 'Payments retrieved successfully');
  }
}
