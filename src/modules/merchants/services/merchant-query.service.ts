import { Injectable, NotFoundException } from '@nestjs/common';
import { MerchantQueryRepository } from '../repositories/merchant.query-repository';
import { MerchantRepository } from '../repositories/merchant.repository';
import { MerchantListQueryDto } from '../dto/merchant-list-query.dto';
import { MerchantResponseDto } from '../dto/merchant-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { createPaginatedResponse, createSingleResponse } from '../../../common/base/helpers/response.helper';

@Injectable()
export class MerchantQueryService {
  constructor(
    private readonly merchantRepository: MerchantRepository,
    private readonly merchantQueryRepository: MerchantQueryRepository,
  ) {}

  async getById(id: number): Promise<MerchantResponseDto | null> {
    const entity = await this.merchantRepository.findOneById(id);
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getByIdOrFail(id: number): Promise<ResponseInterface<MerchantResponseDto>> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('Merchant not found');
    return createSingleResponse(dto);
  }

  async getList(
    query: MerchantListQueryDto,
    ownerUserId?: number,
  ): Promise<ResponseWithPaginationInterface<MerchantResponseDto>> {
    const result = await this.merchantQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      ownerUserId,
      search: query.search,
    });
    return createPaginatedResponse(
      result.results.map((e) => this.toResponse(e)),
      result.pagination,
    );
  }

  private toResponse(entity: import('../entities/merchant.orm-entity').MerchantOrmEntity): MerchantResponseDto {
    return {
      id: entity.id,
      ownerUserId: entity.ownerUserId,
      shopName: entity.shopName,
      shopLogoUrl: entity.shopLogoUrl,
      shopAddress: entity.shopAddress,
      contactPhone: entity.contactPhone,
      contactEmail: entity.contactEmail,
      contactFacebook: entity.contactFacebook,
      contactLine: entity.contactLine,
      contactWhatsapp: entity.contactWhatsapp,
      defaultCurrency: entity.defaultCurrency,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
