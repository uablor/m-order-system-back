import { Injectable, NotFoundException } from '@nestjs/common';
import { UserQueryRepository } from '../repositories/user.query-repository';
import { UserListQueryDto } from '../dto/user-list-query.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserOrmEntity } from '../entities/user.orm-entity';
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
export class UserQueryService {
  constructor(
    private readonly userQueryRepository: UserQueryRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async getById(id: number): Promise<UserResponseDto | null> {
    const entity = await this.userQueryRepository.repository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getByIdOrFail(id: number): Promise<ResponseInterface<UserResponseDto>> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('User not found');
    return createSingleResponse(dto);
  }

  async getList(
    query: UserListQueryDto,
    merchantId?: number,
  ): Promise<ResponseWithPaginationInterface<UserResponseDto>> {
    return this.transactionService.run(async (manager) => {
      const result = await this.userQueryRepository.findWithPagination(
        {
          merchantId,
          page: query.page,
          limit: query.limit,
          isActive: query.isActive,
          search: query.search,
          searchField: query.searchField,
          sort: query.sort,
          startDate: query.startDate,
          endDate: query.endDate,
        },
        manager,
      );
      return createPaginatedResponse(result.results, result.pagination);
    });
  }

  private toResponse(entity: UserOrmEntity): UserResponseDto {
    return {
      id: entity.id,
      email: entity.email,
      fullName: entity.fullName,
      roleId: entity.roleId,
      roleName: entity.role?.roleName,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      lastLogin: entity.lastLogin,
    };
  }
}
