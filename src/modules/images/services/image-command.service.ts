import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ImageRepository } from '../repositories/image.repository';
import { ImageQueryRepository } from '../repositories/image.query-repository';
import { ImageCreateDto } from '../dto/image-create.dto';
import { ImageUpdateDto } from '../dto/image-update.dto';
import { ImageOrmEntity } from '../entities/image.orm-entity';
import { ImageResponseDto } from '../dto/image-response.dto';
import { UploadService } from './upload.service';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';

@Injectable()
export class ImageCommandService {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly imageQueryRepository: ImageQueryRepository,
    private readonly uploadService: UploadService,
  ) {}

  async create(
    createDto: ImageCreateDto,
    currentUser: CurrentUserPayload,
  ): Promise<ImageResponseDto> {
    // Check if file key already exists
    const existingImage = await this.imageRepository.findByFileKey(createDto.fileKey);
    if (existingImage) {
      throw new BadRequestException('Image with this file key already exists');
    }

    const saved = await this.imageRepository.create({
      ...createDto,
      merchant: { id: currentUser.merchantId } as any,
      uploadedByUser: { id: currentUser.userId } as any,
    });

    return this.toResponse(saved);
  }

  async createFromUpload(
    files: any[],
    currentUser: CurrentUserPayload,
  ): Promise<ImageResponseDto[]> {
    const results: ImageResponseDto[] = [];

    for (const file of files) {
      const createDto: ImageCreateDto = {
        originalName: file.originalname,
        fileName: file.fileName,
        filePath: file.filePath || '',
        fileKey: file.key,
        fileSize: file.size,
        mimeType: file.mimetype,
        publicUrl: file.url || null,
      };

      const saved = await this.imageRepository.create({
        ...createDto,
        merchant: { id: currentUser.merchantId } as any,
        uploadedByUser: { id: currentUser.userId } as any,
      });

      results.push(this.toResponse(saved));
    }

    return results;
  }

  async update(
    id: number,
    updateDto: ImageUpdateDto,
  ): Promise<ImageResponseDto> {
    const entity = await this.imageQueryRepository.findByIdWithRelations(id);
    if (!entity) {
      throw new NotFoundException('Image not found');
    }

    const updated = await this.imageRepository.update(id, updateDto);
    if (!updated) {
      throw new NotFoundException('Image not found');
    }

    return this.toResponse(updated);
  }

  async delete(id: number): Promise<void> {
    const entity = await this.imageQueryRepository.findByIdWithRelations(id);
    if (!entity) {
      throw new NotFoundException('Image not found');
    }

    // Delete file from storage
    await this.uploadService.deleteFile_v2(entity.fileKey);

    // Delete from database
    await this.imageRepository.delete(id);
  }

  async softDelete(id: number): Promise<ImageResponseDto> {
    const entity = await this.imageQueryRepository.findByIdWithRelations(id);
    if (!entity) {
      throw new NotFoundException('Image not found');
    }

    const updated = await this.imageRepository.update(id, { isActive: false });
    if (!updated) {
      throw new NotFoundException('Image not found');
    }

    return this.toResponse(updated);
  }

  async restore(id: number): Promise<ImageResponseDto> {
    const entity = await this.imageQueryRepository.findByIdWithRelations(id);
    if (!entity) {
      throw new NotFoundException('Image not found');
    }

    const updated = await this.imageRepository.update(id, { isActive: true });
    if (!updated) {
      throw new NotFoundException('Image not found');
    }

    return this.toResponse(updated);
  }

  private toResponse(entity: ImageOrmEntity): ImageResponseDto {
    return {
      id: entity.id,
      merchantId: entity.merchant?.id ?? 0,
      uploadedByUser: entity.uploadedByUser
        ? {
            id: entity.uploadedByUser.id,
            fullName: entity.uploadedByUser.fullName,
            email: entity.uploadedByUser.email,
          }
        : null,
      originalName: entity.originalName,
      fileName: entity.fileName,
      filePath: entity.filePath,
      fileKey: entity.fileKey,
      fileSize: entity.fileSize,
      mimeType: entity.mimeType,
      publicUrl: entity.publicUrl,
      isActive: entity.isActive,
      tags: entity.tags,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
