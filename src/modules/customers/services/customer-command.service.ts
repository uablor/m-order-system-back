import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { TransactionService } from '../../../common/transaction/transaction.service';
import { CustomerRepository } from '../repositories/customer.repository';
import { MerchantRepository } from '../../merchants/repositories/merchant.repository';
import { CustomerCreateDto } from '../dto/customer-create.dto';
import { CustomerUpdateDto } from '../dto/customer-update.dto';
import { CustomerOrmEntity } from '../entities/customer.orm-entity';

function generateUniqueToken(): string {
  return randomBytes(24).toString('base64url');
}

@Injectable()
export class CustomerCommandService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly merchantRepository: MerchantRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async create(dto: CustomerCreateDto): Promise<{ id: number }> {
    return this.transactionService.run(async (manager) => {
      const merchant = await this.merchantRepository.findOneById(dto.merchantId, manager);
      if (!merchant) {
        throw new NotFoundException('Merchant not found');
      }
      let uniqueToken = dto.uniqueToken ?? generateUniqueToken();
      if (dto.uniqueToken) {
        const existingByToken = await this.customerRepository.findOneBy({ uniqueToken }, manager);
        if (existingByToken) {
          throw new ConflictException('Unique token already exists');
        }
      } else {
        let exists = await this.customerRepository.findOneBy({ uniqueToken }, manager);
        while (exists) {
          uniqueToken = generateUniqueToken();
          exists = await this.customerRepository.findOneBy({ uniqueToken }, manager);
        }
      }
      const entity = await this.customerRepository.create(
        {
          merchant,
          customerName: dto.customerName,
          customerType: dto.customerType,
          shippingAddress: dto.shippingAddress ?? null,
          shippingProvider: dto.shippingProvider ?? null,
          shippingSource: dto.shippingSource ?? null,
          shippingDestination: dto.shippingDestination ?? null,
          paymentTerms: dto.paymentTerms ?? null,
          contactPhone: dto.contactPhone ?? null,
          contactFacebook: dto.contactFacebook ?? null,
          contactWhatsapp: dto.contactWhatsapp ?? null,
          contactLine: dto.contactLine ?? null,
          preferredContactMethod: dto.preferredContactMethod ?? null,
          uniqueToken,
          isActive: dto.isActive ?? true,
        } as Partial<CustomerOrmEntity>,
        manager,
      );
      return { id: entity.id };
    });
  }

  async update(id: number, dto: CustomerUpdateDto): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const existing = await this.customerRepository.findOneById(id, manager);
      if (!existing) {
        throw new NotFoundException('Customer not found');
      }
      if (dto.uniqueToken !== undefined) {
        const duplicate = await this.customerRepository.findOneBy(
          { uniqueToken: dto.uniqueToken },
          manager,
        );
        if (duplicate && duplicate.id !== id) {
          throw new ConflictException('Unique token already in use');
        }
      }
      const updateData: Partial<CustomerOrmEntity> = {
        ...(dto.customerName !== undefined && { customerName: dto.customerName }),
        ...(dto.customerType !== undefined && { customerType: dto.customerType }),
        ...(dto.shippingAddress !== undefined && { shippingAddress: dto.shippingAddress }),
        ...(dto.shippingProvider !== undefined && { shippingProvider: dto.shippingProvider }),
        ...(dto.shippingSource !== undefined && { shippingSource: dto.shippingSource }),
        ...(dto.shippingDestination !== undefined && { shippingDestination: dto.shippingDestination }),
        ...(dto.paymentTerms !== undefined && { paymentTerms: dto.paymentTerms }),
        ...(dto.contactPhone !== undefined && { contactPhone: dto.contactPhone }),
        ...(dto.contactFacebook !== undefined && { contactFacebook: dto.contactFacebook }),
        ...(dto.contactWhatsapp !== undefined && { contactWhatsapp: dto.contactWhatsapp }),
        ...(dto.contactLine !== undefined && { contactLine: dto.contactLine }),
        ...(dto.preferredContactMethod !== undefined && { preferredContactMethod: dto.preferredContactMethod }),
        ...(dto.uniqueToken !== undefined && { uniqueToken: dto.uniqueToken }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      };
      await this.customerRepository.update(id, updateData, manager);
    });
  }

  async delete(id: number): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const found = await this.customerRepository.findOneById(id, manager);
      if (!found) {
        throw new NotFoundException('Customer not found');
      }
      await this.customerRepository.delete(id, manager);
    });
  }
}
