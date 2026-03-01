import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { ImageOrmEntity } from '../entities/image.orm-entity';
import { fetchWithPagination } from '../../../common/utils/pagination.util';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';
import { SortDirection } from '../../../common/base/enums/base.query.enum';
import { ImageListQueryDto } from '../dto/image-list-query.dto';

@Injectable()
export class ImageQueryRepository extends BaseQueryRepository<ImageOrmEntity> {
  constructor(
    @InjectRepository(ImageOrmEntity)
    repository: Repository<ImageOrmEntity>,
  ) {
    super(repository);
  }

  async findWithPagination(
    options: ImageListQueryDto,
    manager?: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<ImageOrmEntity>> {
    const repo = this.getRepo(manager);
    const qb = repo
      .createQueryBuilder('image')
      .leftJoinAndSelect('image.merchant', 'merchant')
      .leftJoinAndSelect('image.uploadedByUser', 'uploadedByUser');

    if (options.merchantId != null) {
      qb.andWhere('merchant.id = :merchantId', { merchantId: options.merchantId });
    }

    if (options.uploadedByUserId != null) {
      qb.andWhere('uploadedByUser.id = :uploadedByUserId', { uploadedByUserId: options.uploadedByUserId });
    }

    if (options.mimeType != null) {
      qb.andWhere('image.mimeType = :mimeType', { mimeType: options.mimeType });
    }

    if (options.tags != null && options.tags.length > 0) {
      qb.andWhere('image.tags && :tags', { tags: options.tags });
    }

    if (options.isActive !== undefined) {
      qb.andWhere('image.isActive = :isActive', { isActive: options.isActive });
    }

    if (options.minFileSize != null) {
      qb.andWhere('image.fileSize >= :minFileSize', { minFileSize: options.minFileSize });
    }

    if (options.maxFileSize != null) {
      qb.andWhere('image.fileSize <= :maxFileSize', { maxFileSize: options.maxFileSize });
    }

    if (options.search) {
      qb.andWhere(
        '(image.originalName ILIKE :search OR image.description ILIKE :search)',
        { search: `%${options.search}%` },
      );
    }

    return fetchWithPagination({
      qb,
      page: options.page ?? 1,
      limit: options.limit ?? 10,
      manager: manager || repo.manager,
      sort: options.sort || SortDirection.DESC,
      search: options.search ? { kw: options.search, field: 'image.originalName' } : undefined,
    });
  }

  async findByIdWithRelations(id: number, manager?: import('typeorm').EntityManager): Promise<ImageOrmEntity | null> {
    return this.getRepo(manager).findOne({
      where: { id },
      relations: ['merchant', 'uploadedByUser'],
    });
  }

  async findByFileKeyWithRelations(fileKey: string, manager?: import('typeorm').EntityManager): Promise<ImageOrmEntity | null> {
    return this.getRepo(manager).findOne({
      where: { fileKey },
      relations: ['merchant', 'uploadedByUser'],
    });
  }
}