import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { ImageOrmEntity } from '../entities/image.orm-entity';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';
import { ImageListQueryDto } from '../dto/image-list-query.dto';
export declare class ImageQueryRepository extends BaseQueryRepository<ImageOrmEntity> {
    constructor(repository: Repository<ImageOrmEntity>);
    findWithPagination(options: ImageListQueryDto, manager?: import('typeorm').EntityManager): Promise<PaginatedResult<ImageOrmEntity>>;
    findByIdWithRelations(id: number, manager?: import('typeorm').EntityManager): Promise<ImageOrmEntity | null>;
    findByFileKeyWithRelations(fileKey: string, manager?: import('typeorm').EntityManager): Promise<ImageOrmEntity | null>;
}
