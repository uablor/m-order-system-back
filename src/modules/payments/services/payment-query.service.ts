import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repository';
import { PaymentOrmEntity } from '../entities/payment.orm-entity';
import { PaymentListQueryDto } from '../dto/payment-list-query.dto';
import { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import { createSingleResponse, createPaginatedResponse } from '../../../common/base/helpers/response.helper';
import { ResponseInterface, ResponseWithPaginationInterface } from 'src/common/base/interfaces/response.interface';
import { PaymentResponseDto } from '../dto/payment-response.dto';

// Helper function to extract URL from image object
function extractPaymentProofUrl(paymentProofImage: any): string {
  if (!paymentProofImage) {
    return '';
  }
  
  return paymentProofImage.publicUrl || 
    `${process.env.R2_PUBLIC_URL}/${paymentProofImage.fileKey}`;
}

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

    return createSingleResponse({
      ...payment,
      paymentProofUrl: extractPaymentProofUrl(payment.paymentProofImage),
    }, 'Payment retrieved successfully');
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

    // ตรวจสอบว่าสถานะยังสามารถชำระได้
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

    return createSingleResponse({
      ...payment,
      paymentProofUrl: extractPaymentProofUrl(payment.paymentProofImage),
    }, 'Payment retrieved successfully');
  }

  async getList(query: PaymentListQueryDto): Promise<ResponseWithPaginationInterface<PaymentResponseDto>> {
    const response = await this.paymentRepository.findByMerchant(0, query); // สำหรับ admin (merchantId = 0 หมายถึงทั้งหมด)
    
    // Transform results to include paymentProofUrl
    const transformedResults = response.results.map(payment => ({
      ...payment,
      paymentProofUrl: extractPaymentProofUrl(payment.paymentProofImage),
    }));
    
    return createPaginatedResponse(transformedResults, response.pagination, 'Payments retrieved successfully');
  }

  async getListByMerchant(
    query: PaymentListQueryDto,
    currentUser: CurrentUserPayload,
  ): Promise<ResponseWithPaginationInterface<PaymentResponseDto> & { summary: any }> {
    if (!currentUser.merchantId) {
      throw new ForbiddenException('Only merchants can view their payments');
    }

    const response = await this.paymentRepository.findByMerchant(
      currentUser.merchantId,
      query,
    );
    const summary = await this.paymentRepository.getSummaryByMerchant(
      currentUser.merchantId,
      query,
    );
    
    // Transform results to include paymentProofUrl
    const transformedResults = response.results.map(payment => ({
      ...payment,
      paymentProofUrl: extractPaymentProofUrl(payment.paymentProofImage),
    }));
    
    const paginated = createPaginatedResponse(transformedResults, response.pagination, 'Payments retrieved successfully');
    return { ...paginated, summary };
  }

  async getListByCustomer(
    query: PaymentListQueryDto,
    currentUser: CurrentUserPayload,
  ): Promise<ResponseWithPaginationInterface<PaymentResponseDto>> {
    const response = await this.paymentRepository.findByCustomer(
      currentUser.userId,
      query,
    );
    
    // Transform results to include paymentProofUrl
    const transformedResults = response.results.map(payment => ({
      ...payment,
      paymentProofUrl: extractPaymentProofUrl(payment.paymentProofImage),
    }));
    
    return createPaginatedResponse(transformedResults, response.pagination, 'Payments retrieved successfully');
  }
}
