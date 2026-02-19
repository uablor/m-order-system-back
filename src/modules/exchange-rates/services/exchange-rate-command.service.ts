import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionService } from '../../../common/transaction/transaction.service';
import { ExchangeRateRepository } from '../repositories/exchange-rate.repository';
import { MerchantRepository } from '../../merchants/repositories/merchant.repository';
import { ExchangeRateCreateDto, ExchangeRateCreateManyDto } from '../dto/exchange-rate-create.dto';
import { ExchangeRateUpdateDto } from '../dto/exchange-rate-update.dto';
import { ExchangeRateOrmEntity } from '../entities/exchange-rate.orm-entity';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
import { UserOrmEntity } from 'src/modules/users/entities/user.orm-entity';

@Injectable()
export class ExchangeRateCommandService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly exchangeRateRepository: ExchangeRateRepository,
    private readonly merchantRepository: MerchantRepository,
  ) {}

  async create(
    dto: ExchangeRateCreateDto,
    currentUser: CurrentUserPayload,
  ): Promise<{ id: number }> {
    if (!currentUser?.merchantId) {
      throw new ForbiddenException('Merchant context required for this action');
    }
    return this.transactionService.run(async (manager) => {
      const merchant = await this.merchantRepository.findOneById(
        currentUser.merchantId!,
        manager,
      );
      if (!merchant) throw new NotFoundException('Merchant not found');
  
      const rateDate = new Date();
  
      await this.exchangeRateRepository.getRepo(manager).update(
        { 
          merchant: { id: currentUser.merchantId! },
          rateType: dto.rateType,
          isActive: true,
        },
        { isActive: false },
      );
  
      const entity = await this.exchangeRateRepository.create(
        {
          merchant,
          baseCurrency: dto.baseCurrency,
          targetCurrency: dto.targetCurrency,
          rateType: dto.rateType,
          rate: String(dto.rate),
          isActive: true,
          rateDate,
          createdByUser: { id: currentUser.userId } as UserOrmEntity,
        } as Partial<ExchangeRateOrmEntity>,
        manager,
      );
  
      return { id: entity.id };
    });
  }

  async createMany(
    dto: ExchangeRateCreateManyDto,
    currentUser: CurrentUserPayload,
  ): Promise<{ ids: number[] }> {
    if (!currentUser?.merchantId) {
      throw new ForbiddenException('Merchant context required for this action');
    }
  
    return this.transactionService.run(async (manager) => {
      const merchant = await this.merchantRepository.findOneById(
        currentUser.merchantId!,
        manager,
      );
  
      if (!merchant) throw new NotFoundException('Merchant not found');
  
      const rateDate = new Date();
      const ids: number[] = [];
  
      for (const item of dto.items) {
  
        // ปิดเรทเก่าที่ active อยู่
        await this.exchangeRateRepository.getRepo(manager).update(
          {
            merchant: { id: currentUser.merchantId! },
            rateType: item.rateType,
            isActive: true,
          },
          { isActive: false },
        );
  
        // สร้างเรทใหม่
        const entity = await this.exchangeRateRepository.create(
          {
            merchant,
            baseCurrency: item.baseCurrency,
            targetCurrency: item.targetCurrency,
            rateType: item.rateType,
            rate: String(item.rate),
            isActive: true,
            rateDate,
            createdByUser: { id: currentUser.userId } as UserOrmEntity,
          } as Partial<ExchangeRateOrmEntity>,
          manager,
        );
  
        ids.push(entity.id);
      }
  
      return { ids };
    });
  }
  

  async update(id: number, dto: ExchangeRateUpdateDto): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const existing = await this.exchangeRateRepository.findOneById(
        id,
        manager,
      );
      if (!existing) throw new NotFoundException('Exchange rate not found');

      const updateData: Partial<ExchangeRateOrmEntity> = {};
      if (dto.baseCurrency !== undefined)
        updateData.baseCurrency = dto.baseCurrency;
      if (dto.targetCurrency !== undefined)
        updateData.targetCurrency = dto.targetCurrency;
      if (dto.rateType !== undefined) updateData.rateType = dto.rateType;
      if (dto.rate !== undefined) updateData.rate = String(dto.rate);
      if (dto.rateDate !== undefined)
        updateData.rateDate = new Date(dto.rateDate);
      if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

      await this.exchangeRateRepository.update(id, updateData, manager);
    });
  }

  async delete(id: number): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const existing = await this.exchangeRateRepository.findOneById(
        id,
        manager,
      );
      if (!existing) throw new NotFoundException('Exchange rate not found');
      await this.exchangeRateRepository.delete(id, manager);
    });
  }
}
