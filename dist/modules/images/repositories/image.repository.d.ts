import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { ImageOrmEntity } from '../entities/image.orm-entity';
export declare class ImageRepository extends BaseRepository<ImageOrmEntity> {
    constructor(repository: Repository<ImageOrmEntity>);
    findByFileKey(fileKey: string): Promise<ImageOrmEntity | null>;
    findByMerchant(merchantId: number): Promise<ImageOrmEntity[]>;
    findByUploadedBy(userId: number): Promise<ImageOrmEntity[]>;
    findByMimeType(mimeType: string): Promise<ImageOrmEntity[]>;
    findByTags(tags: string[]): Promise<ImageOrmEntity[]>;
    findActive(): Promise<ImageOrmEntity[]>;
}
