import { Injectable, NotFoundException } from '@nestjs/common';
import { UserQueryRepository } from '../repositories/user.query-repository';
import { UserListQueryDto } from '../dto/user-list-query.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { PaginatedResult } from '../../../common/base/base.query-repository';
import { UserOrmEntity } from '../entities/user.orm-entity';

@Injectable()
export class UserQueryService {
  constructor(private readonly userQueryRepository: UserQueryRepository) {}

  async getById(id: number): Promise<UserResponseDto | null> {
    const entity = await this.userQueryRepository.repository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getByIdOrFail(id: number): Promise<UserResponseDto> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('User not found');
    return dto;
  }

  async getList(query: UserListQueryDto): Promise<PaginatedResult<UserResponseDto>> {
    const result = await this.userQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      isActive: query.isActive,
      search: query.search,
    });
    const withRole = await Promise.all(
      result.data.map(async (e) => {
        const full = await this.userQueryRepository.repository.findOne({
          where: { id: e.id },
          relations: ['role'],
        });
        return full ? this.toResponse(full) : this.toResponse(e);
      }),
    );
    return {
      ...result,
      data: withRole,
    };
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
