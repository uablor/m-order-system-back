import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerQueryRepository } from '../repositories/customer.query-repository';
import { CustomerListQueryDto } from '../dto/customer-list-query.dto';
import { CustomerResponseDto } from '../dto/customer-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { createPaginatedResponse, createSingleResponse } from '../../../common/base/helpers/response.helper';

@Injectable()
export class CustomerQueryService {
  constructor(private readonly customerQueryRepository: CustomerQueryRepository) {}

  async getById(id: number): Promise<CustomerResponseDto | null> {
    const entity = await this.customerQueryRepository.findOneByIdWithMerchant(id);
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getByIdOrFail(id: number): Promise<ResponseInterface<CustomerResponseDto>> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('Customer not found');
    return createSingleResponse(dto);
  }

  async getList(query: CustomerListQueryDto): Promise<ResponseWithPaginationInterface<CustomerResponseDto>> {
    const result = await this.customerQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      merchantId: query.merchantId,
      search: query.search,
    });
    return createPaginatedResponse(
      result.results.map((e) => this.toResponse(e)),
      result.pagination,
    );
  }

  private toResponse(entity: import('../entities/customer.orm-entity').CustomerOrmEntity): CustomerResponseDto {
    return {
      id: entity.id,
      merchantId: entity.merchant?.id ?? 0,
      customerName: entity.customerName,
      customerType: entity.customerType,
      shippingAddress: entity.shippingAddress,
      shippingProvider: entity.shippingProvider,
      shippingSource: entity.shippingSource,
      shippingDestination: entity.shippingDestination,
      paymentTerms: entity.paymentTerms,
      contactPhone: entity.contactPhone,
      contactFacebook: entity.contactFacebook,
      contactWhatsapp: entity.contactWhatsapp,
      contactLine: entity.contactLine,
      preferredContactMethod: entity.preferredContactMethod,
      uniqueToken: entity.uniqueToken,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
