import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { ImageOrmEntity } from '../entities/image.orm-entity';

@Injectable()
export class ImageRepository extends BaseRepository<ImageOrmEntity> {
  constructor(
    @InjectRepository(ImageOrmEntity)
    repository: Repository<ImageOrmEntity>,
  ) {
    super(repository);
  }

  async findByFileKey(fileKey: string): Promise<ImageOrmEntity | null> {
    return this.repository.findOne({
      where: { fileKey },
      relations: ['merchant', 'uploadedByUser'],
    });
  }

  async findByMerchant(merchantId: number): Promise<ImageOrmEntity[]> {
    return this.repository.find({
      where: { merchant: { id: merchantId } },
      relations: ['merchant', 'uploadedByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUploadedBy(userId: number): Promise<ImageOrmEntity[]> {
    return this.repository.find({
      where: { uploadedByUser: { id: userId } },
      relations: ['merchant', 'uploadedByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByMimeType(mimeType: string): Promise<ImageOrmEntity[]> {
    return this.repository.find({
      where: { mimeType },
      relations: ['merchant', 'uploadedByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByTags(tags: string[]): Promise<ImageOrmEntity[]> {
    return this.repository
      .createQueryBuilder('image')
      .where('image.tags && :tags', { tags })
      .leftJoinAndSelect('image.merchant', 'merchant')
      .leftJoinAndSelect('image.uploadedByUser', 'uploadedByUser')
      .orderBy('image.createdAt', 'DESC')
      .getMany();
  }

  async findActive(): Promise<ImageOrmEntity[]> {
    return this.repository.find({
      where: { isActive: true },
      relations: ['merchant', 'uploadedByUser'],
      order: { createdAt: 'DESC' },
    });
  }
}
