import { Injectable, NotFoundException } from '@nestjs/common';
import { PermissionQueryRepository } from '../repositories/permission.query-repository';
import { PermissionListQueryDto } from '../dto/permission-list-query.dto';
import { PermissionResponseDto } from '../dto/permission-response.dto';
import { PaginatedResult } from '../../../common/base/base.query-repository';

@Injectable()
export class PermissionQueryService {
  constructor(private readonly permissionQueryRepository: PermissionQueryRepository) {}

  async getById(id: number): Promise<PermissionResponseDto | null> {
    const entity = await this.permissionQueryRepository.repository.findOne({
      where: { id },
    });
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getByIdOrFail(id: number): Promise<PermissionResponseDto> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('Permission not found');
    return dto;
  }

  async getList(query: PermissionListQueryDto): Promise<PaginatedResult<PermissionResponseDto>> {
    const result = await this.permissionQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
    });
    return {
      ...result,
      data: result.data.map((e) => this.toResponse(e)),
    };
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
