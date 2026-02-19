import { Injectable, NotFoundException } from '@nestjs/common';
import { PermissionQueryRepository } from '../repositories/permission.query-repository';
import { PermissionListQueryDto } from '../dto/permission-list-query.dto';
import { PermissionResponseDto } from '../dto/permission-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { createPaginatedResponse, createSingleResponse } from '../../../common/base/helpers/response.helper';
import { TransactionService } from 'src/common/transaction/transaction.service';

@Injectable()
export class PermissionQueryService {
  constructor(private readonly permissionQueryRepository: PermissionQueryRepository,
     private readonly transactionService: TransactionService,
  ) {}

  async getById(id: number): Promise<PermissionResponseDto | null> {
    const entity = await this.permissionQueryRepository.repository.findOne({
      where: { id },
    });
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getByIdOrFail(id: number): Promise<ResponseInterface<PermissionResponseDto>> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('Permission not found');
    return createSingleResponse(dto);
  }

  async getList(query: PermissionListQueryDto): Promise<ResponseWithPaginationInterface<PermissionResponseDto>> {

    return await this.transactionService.run(async (manager) => {
      const result = await this.permissionQueryRepository.findWithPagination(
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

  private toResponse(entity: import('../entities/permission.orm-entity').PermissionOrmEntity): PermissionResponseDto {
    return {
      id: entity.id,
      permissionCode: entity.permissionCode,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
