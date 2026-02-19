import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ExchangeRateQueryRepository } from '../repositories/exchange-rate.query-repository';
import { ExchangeRateRepository } from '../repositories/exchange-rate.repository';
import { ExchangeRateListQueryDto } from '../dto/exchange-rate-list-query.dto';
import { ExchangeRateResponseDto } from '../dto/exchange-rate-response.dto';
import type {
  ResponseInterface,
  ResponseWithPaginationInterface,
} from '../../../common/base/interfaces/response.interface';
import {
  createPaginatedResponse,
  createResponse,
  createSingleResponse,
} from '../../../common/base/helpers/response.helper';
import { ExchangeRateOrmEntity } from '../entities/exchange-rate.orm-entity';
import { TransactionService } from 'src/common/transaction/transaction.service';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';

@Injectable()
export class ExchangeRateQueryService {
  constructor(
    private readonly exchangeRateQueryRepository: ExchangeRateQueryRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async getById(id: number): Promise<ExchangeRateResponseDto | null> {
    const entity = await this.exchangeRateQueryRepository.repository.findOne({
      where: { id },
      relations: ['merchant', 'createdByUser'],
    });
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getByIdOrFail(
    id: number,
  ): Promise<ResponseInterface<ExchangeRateResponseDto>> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('Exchange rate not found');
    return createSingleResponse(dto);
  }

  async getList(
    query: ExchangeRateListQueryDto,
    currentUser?: CurrentUserPayload,
  ): Promise<ResponseWithPaginationInterface<ExchangeRateResponseDto>> {
    return this.transactionService.run(async (manager) => {
      const result = await this.exchangeRateQueryRepository.findWithPagination(
        {
          page: query.page,
          limit: query.limit,
          merchantId: currentUser?.merchantId
            ? currentUser.merchantId
            : query.merchantId,
          rateType: query.rateType,
          baseCurrency: query.baseCurrency,
          targetCurrency: query.targetCurrency,
          isActive: query.isActive,
        },
        manager,
      );
      return createPaginatedResponse(
        result.results.map((e) => this.toResponse(e)),
        result.pagination,
      );
    });
  }

  /**
   * Get today's active BUY and SELL rates for the authenticated merchant.
   * merchantId is extracted from the JWT token — no query param needed.
   * Returns standard ResponseInterface with results array (0–2 items).
   */
  async getTodayRates(
    currentUser: CurrentUserPayload,
  ): Promise<ResponseInterface<ExchangeRateResponseDto>> {
    if (!currentUser?.merchantId) {
      throw new ForbiddenException('Merchant context required');
    }

    const { buy, sell } = await this.exchangeRateQueryRepository.findTodayRates(
      currentUser.merchantId,
    );

    const results: ExchangeRateResponseDto[] = [];
    if (buy) results.push(this.toResponse(buy));
    if (sell) results.push(this.toResponse(sell));

    return createResponse(results, 'Success');
  }

  private toResponse(entity: ExchangeRateOrmEntity): ExchangeRateResponseDto {
    const rateDate =
      entity.rateDate instanceof Date
        ? entity.rateDate.toISOString().slice(0, 10)
        : String(entity.rateDate);
    return {
      id: entity.id,
      merchantId: entity.merchant?.id ?? 0,
      baseCurrency: entity.baseCurrency,
      targetCurrency: entity.targetCurrency,
      rateType: entity.rateType,
      rate: entity.rate,
      isActive: entity.isActive,
      rateDate,
      createdBy: entity.createdByUser?.id ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
