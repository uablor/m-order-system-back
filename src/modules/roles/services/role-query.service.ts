import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleQueryRepository } from '../repositories/role.query-repository';
import { RoleListQueryDto } from '../dto/role-list-query.dto';
import { RoleResponseDto } from '../dto/role-response.dto';
import { PaginatedResult } from '../../../common/base/base.query-repository';

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

  async getByIdOrFail(id: number): Promise<RoleResponseDto> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('Role not found');
    return dto;
  }

  async getList(query: RoleListQueryDto): Promise<PaginatedResult<RoleResponseDto>> {
    const result = await this.roleQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
    });
    return {
      ...result,
      data: result.data.map((e) => this.toResponse(e)),
    };
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
