import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleQueryRepository } from '../repositories/role.query-repository';
import { RoleListQueryDto } from '../dto/role-list-query.dto';
import { RoleResponseDto } from '../dto/role-response.dto';
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
export class RoleQueryService {
  constructor(
    private readonly roleQueryRepository: RoleQueryRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async getById(id: number): Promise<RoleResponseDto | null> {
    const entity = await this.roleQueryRepository.repository.findOne({
      where: { id },
    });
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getByIdOrFail(id: number): Promise<ResponseInterface<RoleResponseDto>> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('Role not found');
    return createSingleResponse(dto);
  }

  async getList(
    query: RoleListQueryDto,
  ): Promise<ResponseWithPaginationInterface<RoleResponseDto>> {
    return await this.transactionService.run(async (manager) => {
      const result = await this.roleQueryRepository.findWithPagination(
        {
          page: query.page,
          limit: query.limit,
        },
        manager,
      );
      return createPaginatedResponse(
        result.results.map((e) => this.toResponse(e)),
        result.pagination,
      );
    });
  }

  private toResponse(
    entity: import('../entities/role.orm-entity').RoleOrmEntity,
  ): RoleResponseDto {
    return {
      id: entity.id,
      roleName: entity.roleName,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
