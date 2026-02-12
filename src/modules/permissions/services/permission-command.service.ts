import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { TransactionService } from '../../../common/transaction/transaction.service';
import { PermissionRepository } from '../repositories/permission.repository';
import { PermissionCreateDto } from '../dto/permission-create.dto';
import { PermissionUpdateDto } from '../dto/permission-update.dto';
import { PermissionOrmEntity } from '../entities/permission.orm-entity';

@Injectable()
export class PermissionCommandService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async create(dto: PermissionCreateDto): Promise<{ id: number }> {
    return this.transactionService.run(async (manager) => {
      const existing = await this.permissionRepository.findOneBy(
        { permissionCode: dto.permissionCode },
        manager,
      );
      if (existing) {
        throw new ConflictException('Permission with this code already exists');
      }
      const entity = await this.permissionRepository.create(
        {
          permissionCode: dto.permissionCode,
          description: dto.description ?? null,
        } as Partial<PermissionOrmEntity>,
        manager,
      );
      return { id: entity.id };
    });
  }

  async update(id: number, dto: PermissionUpdateDto): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const existing = await this.permissionRepository.findOneById(id, manager);
      if (!existing) {
        throw new NotFoundException('Permission not found');
      }
      if (dto.permissionCode !== undefined) {
        const duplicate = await this.permissionRepository.findOneBy(
          { permissionCode: dto.permissionCode },
          manager,
        );
        if (duplicate && duplicate.id !== id) {
          throw new ConflictException('Permission with this code already exists');
        }
      }
      await this.permissionRepository.update(
        id,
        {
          ...(dto.permissionCode !== undefined && { permissionCode: dto.permissionCode }),
          ...(dto.description !== undefined && { description: dto.description }),
        } as Partial<PermissionOrmEntity>,
        manager,
      );
    });
  }

  async delete(id: number): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const found = await this.permissionRepository.findOneById(id, manager);
      if (!found) {
        throw new NotFoundException('Permission not found');
      }
      await this.permissionRepository.delete(id, manager);
    });
  }
}
