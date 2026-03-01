import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionService } from '../../../common/transaction/transaction.service';
import { MerchantRepository } from '../repositories/merchant.repository';
import { MerchantCreateDto } from '../dto/merchant-create.dto';
import { MerchantUpdateDto } from '../dto/merchant-update.dto';
import { MerchantOrmEntity } from '../entities/merchant.orm-entity';
import { ImageQueryRepository } from 'src/modules/images/repositories/image.query-repository';
import { ImageOrmEntity } from 'src/modules/images/entities/image.orm-entity';

@Injectable()
export class MerchantCommandService {
  constructor(
    private readonly merchantRepository: MerchantRepository,
    private readonly transactionService: TransactionService,
    private readonly imageQueryRepository: ImageQueryRepository,
  ) { }

  async create(
    ownerUserId: number,
    dto: MerchantCreateDto,
  ): Promise<{ id: number }> {
    return this.transactionService.run(async (manager) => {

      let image: ImageOrmEntity | null = null;
      if (dto.shopLogoUrl) {
        image = await this.imageQueryRepository.findByIdWithRelations(Number(dto.shopLogoUrl));
        if (!image) {
          throw new NotFoundException('Image not found');
        }
      }
      const entity = await this.merchantRepository.create(
        {
          ownerUserId,
          shopName: dto.shopName,
          shopLogoUrlId: dto.shopLogoUrl ? Number(dto.shopLogoUrl) : null,
          shopLogoUrl: image ? image : null,
          shopAddress: dto.shopAddress ?? null,
          contactPhone: dto.contactPhone ?? null,
          contactEmail: dto.contactEmail ?? null,
          contactFacebook: dto.contactFacebook ?? null,
          contactLine: dto.contactLine ?? null,
          contactWhatsapp: dto.contactWhatsapp ?? null,
          defaultCurrency: dto.defaultCurrency ?? 'THB',
          isActive: dto.isActive ?? true,
        } as Partial<MerchantOrmEntity>,
        manager,
      );
      return { id: entity.id };
    });
  }

  async update(id: number, dto: MerchantUpdateDto): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const existing = await this.merchantRepository.findOneById(id, manager);
      if (!existing) {
        throw new NotFoundException('Merchant not found');
      }
      
      let image: ImageOrmEntity | null = null;
      if (dto.shopLogoUrl) {
        image = await this.imageQueryRepository.findByIdWithRelations(Number(dto.shopLogoUrl));
        if (!image) {
          throw new NotFoundException('Image not found');
        }
      }
      
      const updateData: Partial<MerchantOrmEntity> = {
        ...(dto.shopName !== undefined && { shopName: dto.shopName }),
        ...(dto.shopLogoUrl !== undefined && { shopLogoUrlId: dto.shopLogoUrl ? Number(dto.shopLogoUrl) : null }),

        ...(dto.shopAddress !== undefined && { shopAddress: dto.shopAddress }),
        ...(dto.contactPhone !== undefined && { contactPhone: dto.contactPhone }),
        ...(dto.contactEmail !== undefined && { contactEmail: dto.contactEmail }),
        ...(dto.contactFacebook !== undefined && { contactFacebook: dto.contactFacebook }),
        ...(dto.contactLine !== undefined && { contactLine: dto.contactLine }),
        ...(dto.contactWhatsapp !== undefined && { contactWhatsapp: dto.contactWhatsapp }),
        ...(dto.defaultCurrency !== undefined && { defaultCurrency: dto.defaultCurrency }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      };
      await this.merchantRepository.update(id, updateData, manager);
    });
  }

  async delete(id: number): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const found = await this.merchantRepository.findOneById(id, manager);
      if (!found) {
        throw new NotFoundException('Merchant not found');
      }
      await this.merchantRepository.delete(id, manager);
    });
  }
}
