import { Injectable, NotFoundException } from '@nestjs/common';
import { MerchantQueryRepository } from '../repositories/merchant.query-repository';
import { MerchantRepository } from '../repositories/merchant.repository';
import { MerchantListQueryDto } from '../dto/merchant-list-query.dto';
import { MerchantResponseDto } from '../dto/merchant-response.dto';
import {
  MerchantDetailResponseDto,
  MerchantDetailUserDto,
  MerchantDetailSummaryDto,
  MerchantDetailFinancialDto,
} from '../dto/merchant-detail-response.dto';
import type {
  ResponseInterface,
  ResponseWithPaginationInterface,
} from '../../../common/base/interfaces/response.interface';
import {
  createPaginatedResponse,
  createSingleResponse,
} from '../../../common/base/helpers/response.helper';
import { TransactionService } from 'src/common/transaction/transaction.service';

@Injectable()
export class MerchantQueryService {
  constructor(
    private readonly merchantRepository: MerchantRepository,
    private readonly merchantQueryRepository: MerchantQueryRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async getById(id: number): Promise<MerchantResponseDto | null> {
    const entity = await this.merchantRepository.findOneById(id);
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getByIdOrFail(
    id: number,
  ): Promise<ResponseInterface<MerchantResponseDto>> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('Merchant not found');
    return createSingleResponse(dto);
  }

  async getList(
    query: MerchantListQueryDto,
  ): Promise<ResponseWithPaginationInterface<MerchantResponseDto>> {
    return this.transactionService.run(async (manager) => {
      const result = await this.merchantQueryRepository.findWithPagination(
        {
          page: query.page,
          limit: query.limit,
          search: query.search,
        },
        manager,
      );
      return createPaginatedResponse(
        result.results.map((e) => this.toResponse(e)),
        result.pagination,
      );
    });
  }

  async findMerchantDetail(
    userId: number,
  ): Promise<ResponseInterface<MerchantResponseDto>> {
    return this.transactionService.run(async (manager) => {
      const entity = await this.merchantQueryRepository.findMerchantDetail(
        userId,
        manager,
      );
      if (!entity) throw new NotFoundException('Merchant not found');
      return createSingleResponse(this.toResponse(entity));
    });
  }

  async getDetailById(
    id: number,
  ): Promise<ResponseInterface<MerchantDetailResponseDto>> {
    return this.transactionService.run(async (manager) => {
      const merchant = await this.merchantQueryRepository.findByIdWithOwner(id, manager);
      if (!merchant) throw new NotFoundException('Merchant not found');

      const [customers, financialRaw] = await Promise.all([
        this.merchantQueryRepository.findCustomersByMerchantId(id, manager),
        this.merchantQueryRepository.getFinancialSummaryByMerchantId(id, manager),
      ]);

      const activeCustomers = customers.filter((c) => c.isActive).length;

      const financial: MerchantDetailFinancialDto = {
        totalOrders: financialRaw.totalOrders,
        ordersUnpaid: financialRaw.ordersUnpaid,
        ordersPartial: financialRaw.ordersPartial,
        ordersPaid: financialRaw.ordersPaid,
        totalIncomeLak: financialRaw.totalIncomeLak,
        totalIncomeThb: financialRaw.totalIncomeThb,
        totalExpenseLak: financialRaw.totalExpenseLak,
        totalExpenseThb: financialRaw.totalExpenseThb,
        totalProfitLak: financialRaw.totalProfitLak,
        totalProfitThb: financialRaw.totalProfitThb,
        totalPaidAmount: financialRaw.totalPaidAmount,
        totalRemainingAmount: financialRaw.totalRemainingAmount,
      };

      const summary: MerchantDetailSummaryDto = {
        totalCustomers: customers.length,
        activeCustomers,
        inactiveCustomers: customers.length - activeCustomers,
        customerTypeCustomer: customers.filter((c) => c.customerType === 'CUSTOMER').length,
        customerTypeAgent: customers.filter((c) => c.customerType === 'AGENT').length,
        financial,
      };

      const ownerDto: MerchantDetailUserDto | null = merchant.ownerUser
        ? {
            id: merchant.ownerUser.id,
            email: merchant.ownerUser.email,
            fullName: merchant.ownerUser.fullName,
            roleId: merchant.ownerUser.roleId,
            roleName: merchant.ownerUser.role?.roleName,
            isActive: merchant.ownerUser.isActive,
            createdAt: merchant.ownerUser.createdAt,
            lastLogin: merchant.ownerUser.lastLogin,
          }
        : null;

      const detail: MerchantDetailResponseDto = {
        id: merchant.id,
        ownerUserId: merchant.ownerUserId,
        shopName: merchant.shopName,
        shopLogoUrl: merchant.shopLogoUrl,
        shopAddress: merchant.shopAddress,
        contactPhone: merchant.contactPhone,
        contactEmail: merchant.contactEmail,
        contactFacebook: merchant.contactFacebook,
        contactLine: merchant.contactLine,
        contactWhatsapp: merchant.contactWhatsapp,
        defaultCurrency: merchant.defaultCurrency,
        isActive: merchant.isActive,
        createdAt: merchant.createdAt,
        updatedAt: merchant.updatedAt,
        owner: ownerDto,
        summary,
      };

      return createSingleResponse(detail);
    });
  }

  private toResponse(
    entity: import('../entities/merchant.orm-entity').MerchantOrmEntity,
  ): MerchantResponseDto {
    return {
      id: entity.id,
      ownerUserId: entity.ownerUserId,
      shopName: entity.shopName,
      shopLogoUrl: entity.shopLogoUrl 
    ? {
        id: entity.shopLogoUrl.id,
        fileKey: entity.shopLogoUrl.fileKey,
        originalName: entity.shopLogoUrl.originalName,
        publicUrl: entity.shopLogoUrl.publicUrl || `${process.env.R2_PUBLIC_URL}/${entity.shopLogoUrl.fileKey}`,
      }
    : null,
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
