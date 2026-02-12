import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionService } from '../../../common/transaction/transaction.service';
import { RoleRepository } from '../repositories/role.repository';
import { RoleCreateDto } from '../dto/role-create.dto';
import { RoleUpdateDto } from '../dto/role-update.dto';
import { RoleOrmEntity } from '../entities/role.orm-entity';

@Injectable()
export class RoleCommandService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async create(dto: RoleCreateDto): Promise<{ id: number }> {
    return this.transactionService.run(async (manager) => {
      const existing = await this.roleRepository.findOneBy(
        { roleName: dto.roleName },
        manager,
      );
      if (existing) {
        throw new ConflictException('Role with this name already exists');
      }
      const entity = await this.roleRepository.create(
        {
          roleName: dto.roleName,
          description: dto.description ?? null,
        } as Partial<RoleOrmEntity>,
        manager,
      );
      return { id: entity.id };
    });
  }

  async update(id: number, dto: RoleUpdateDto): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const existing = await this.roleRepository.findOneById(id, manager);
      if (!existing) {
        throw new NotFoundException('Role not found');
      }
      if (dto.roleName !== undefined) {
        const duplicate = await this.roleRepository.findOneBy(
          { roleName: dto.roleName },
          manager,
        );
        if (duplicate && duplicate.id !== id) {
          throw new ConflictException('Role with this name already exists');
        }
      }
      await this.roleRepository.update(
        id,
        {
          ...(dto.roleName !== undefined && { roleName: dto.roleName }),
          ...(dto.description !== undefined && { description: dto.description }),
        } as Partial<RoleOrmEntity>,
        manager,
      );
    });
  }

  async delete(id: number): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const found = await this.roleRepository.findOneById(id, manager);
      if (!found) {
        throw new NotFoundException('Role not found');
      }
      await this.roleRepository.delete(id, manager);
    });
  }
}
