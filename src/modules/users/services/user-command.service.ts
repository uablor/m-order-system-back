import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  comparePassword,
  hashPassword,
} from '../../../common/utils/password.util';
import { TransactionService } from '../../../common/transaction/transaction.service';
import { UserRepository } from '../repositories/user.repository';
import { RoleRepository } from '../../roles/repositories/role.repository';
import { MerchantRepository } from '../../merchants/repositories/merchant.repository';
import { UserCreateDto } from '../dto/user-create.dto';
import { UserUpdateDto } from '../dto/user-update.dto';
import { UserMerchantCreateDto } from '../dto/user-merchant-create.dto';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { MerchantOrmEntity } from '../../merchants/entities/merchant.orm-entity';
import {
  ADMIN_MERCHANT_ROLE_NAME,
  ADMIN_ROLE_NAME,
  EMPLOYEE_MERCHANT_ROLE_NAME,
  SUPERADMIN_ROLE_NAME,
} from 'src/database/seeds/role.seeder';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { AcitveDto } from 'src/common/base/dtos/active.dto';

@Injectable()
export class UserCommandService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly merchantRepository: MerchantRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async create(
    dto: UserCreateDto,
    auth?: CurrentUserPayload,
  ): Promise<{ id: number }> {
    return this.transactionService.run(async (manager) => {
      const existing = await this.userRepository.findOneBy(
        { email: dto.email },
        manager,
      );
      if (existing) {
        throw new ConflictException('User with this email already exists');
      }
      const role = await this.roleRepository.findOneById(
        Number(dto.roleId),
        manager,
      );
      
      if (!role) {
        throw new NotFoundException('Role not found');
      }
      const passwordHash = await hashPassword(dto.password);
      let entity: UserOrmEntity;
      if (auth?.merchantId) {
        entity = await this.userRepository.create(
          {
            email: dto.email,
            passwordHash,
            fullName: dto.fullName,
            merchantId: auth.merchantId,
            roleId: role.id,
            role: role,
            isActive: dto.isActive ?? true,
          } as Partial<UserOrmEntity>,
          manager,
        );
      } else {
        entity = await this.userRepository.create(
          {
            email: dto.email,
            passwordHash,
            fullName: dto.fullName,
            roleId: role.id,
            role: role,
            isActive: dto.isActive ?? true,
          } as Partial<UserOrmEntity>,
          manager,
        );
      }

      return { id: entity.id };
  })}

  async createUserWithMerchant(
    dto: UserMerchantCreateDto,
  ): Promise<{ userId: number; merchantId: number }> {
    return this.transactionService.run(async (manager) => {
      const existing = await this.userRepository.findOneBy(
        { email: dto.email },
        manager,
      );
      if (existing) {
        throw new ConflictException('User with this email already exists');
      }

      const passwordHash = await hashPassword(dto.password);

      const role = await this.roleRepository.findOneBy(
        { roleName: ADMIN_MERCHANT_ROLE_NAME },
        manager,
      );
      if (!role) {
        throw new NotFoundException('Role not found');
      }

      const userEntity = await this.userRepository.create(
        {
          email: dto.email,
          passwordHash,
          fullName: dto.fullName,
          roleId: role.id,
          role,
        } as Partial<UserOrmEntity>,
        manager,
      );

      const merchantEntity = await this.merchantRepository.create(
        {
          ownerUserId: userEntity.id,
          shopName: dto.shopName ?? userEntity.fullName ?? '',
          shopLogoUrl: dto.shopLogoUrl ?? null,
          shopAddress: dto.shopAddress ?? null,
          contactPhone: dto.contactPhone ?? null,
          contactEmail: dto.contactEmail ?? null,
          contactFacebook: dto.contactFacebook ?? null,
          contactLine: dto.contactLine ?? null,
          contactWhatsapp: dto.contactWhatsapp ?? null,
          defaultCurrency: dto.defaultCurrency ?? 'LAK',
          isActive: true,
        } as Partial<MerchantOrmEntity>,
        manager,
      );

      await this.userRepository.update(
        userEntity.id,
        {
          merchantId: merchantEntity.id,
          merchant: merchantEntity,
        } as Partial<UserOrmEntity>,
        manager,
      );

      return {
        userId: userEntity.id,
        merchantId: merchantEntity.id,
      };
    });
  }

  async update(
    id: number,
    dto: UserUpdateDto,
    currentUser?: CurrentUserPayload,
  ): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const existing = await this.userRepository.findOneById(id, manager, {
        relations: ['role'],
      });
      if (!existing) {
        throw new NotFoundException('User not found');
      }
      if (dto.email !== undefined) {
        const duplicate = await this.userRepository.findOneBy(
          { email: dto.email },
          manager,
          { relations: ['role'] },
        );
        if (duplicate && duplicate.id !== id) {
          throw new ConflictException('User with this email already exists');
        }
      }
      if (dto.roleId !== undefined) {
        const role = await this.roleRepository.findOneById(dto.roleId, manager);
        if (!role) throw new NotFoundException('Role not found');
      }
      const updateData: Partial<UserOrmEntity> = {
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.fullName !== undefined && { fullName: dto.fullName }),
        ...(dto.roleId !== undefined && { roleId: dto.roleId }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      };
      await this.userRepository.update(id, updateData, manager);
    });
  }

  async delete(id: number): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const found = await this.userRepository.findOneById(id, manager, {
        relations: ['role'],
      });
      if (!found) {
        throw new NotFoundException('User not found');
      }
      if (found.role) {
        throw new ConflictException('Cannot delete user with role');
      }
      await this.userRepository.delete(id, manager);
    });
  }

  async setActive(id: number, dto: AcitveDto): Promise<void> {
    await this.update(id, { isActive: dto.isActive } as UserUpdateDto);
  }

  async changePassword(id: number, dto: ChangePasswordDto): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const found = await this.userRepository.findOneById(id, manager, {
        relations: ['role', 'merchant'],
      });
      if (!found) throw new NotFoundException('User not found');

      const match = await comparePassword(
        dto.currentPassword,
        found.passwordHash,
      );
      if (!match) throw new BadRequestException('Invalid current password');

      found.passwordHash = await hashPassword(dto.password);
      await this.userRepository.update(id, found, manager);
    });
  }
}
