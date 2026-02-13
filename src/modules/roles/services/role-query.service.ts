import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleQueryRepository } from '../repositories/role.query-repository';
import { RoleListQueryDto } from '../dto/role-list-query.dto';
import { RoleResponseDto } from '../dto/role-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { createPaginatedResponse, createSingleResponse } from '../../../common/base/helpers/response.helper';

@Injectable()
export class RoleQueryService {
  constructor(private readonly roleQueryRepository: RoleQueryRepository) {}

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

  async getList(query: RoleListQueryDto): Promise<ResponseWithPaginationInterface<RoleResponseDto>> {
    const result = await this.roleQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
    });
    return createPaginatedResponse(
      result.results.map((e) => this.toResponse(e)),
      result.pagination,
    );
  }

  private toResponse(entity: import('../entities/role.orm-entity').RoleOrmEntity): RoleResponseDto {
    return {
      id: entity.id,
      roleName: entity.roleName,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
