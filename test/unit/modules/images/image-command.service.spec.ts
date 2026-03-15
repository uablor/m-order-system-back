import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ImageCommandService } from '../../../../src/modules/images/services/image-command.service';
import { ImageRepository } from '../../../../src/modules/images/repositories/image.repository';
import { ImageQueryRepository } from '../../../../src/modules/images/repositories/image.query-repository';
import { UploadService } from '../../../../src/modules/images/services/upload.service';
import { ImageOrmEntity } from '../../../../src/modules/images/entities/image.orm-entity';
import type { CurrentUserPayload } from '../../../../src/common/decorators/current-user.decorator';

describe('ImageCommandService', () => {
  let service: ImageCommandService;
  let imageRepository: {
    findByFileKey: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  let imageQueryRepository: {
    findByIdWithRelations: jest.Mock;
  };
  let uploadService: {
    deleteFile_v2: jest.Mock;
  };

  const mockCurrentUser: CurrentUserPayload = {
    userId: 1,
    email: 'test@example.com',
    roleId: 2,
    merchantId: 10,
  };

  const mockImage: ImageOrmEntity = {
    id: 1,
    originalName: 'test.jpg',
    fileName: 'test.jpg',
    filePath: '/uploads/test.jpg',
    fileKey: 'laylaos/uuid-test.jpg',
    fileSize: 1024,
    mimeType: 'image/jpeg',
    publicUrl: 'https://example.com/test.jpg',
    isActive: true,
    tags: [],
    description: null,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    merchant: { id: 10, shopName: 'Test Shop' } as any,
    uploadedByUser: { id: 1, fullName: 'Test User', email: 'test@example.com' } as any,
  } as ImageOrmEntity;

  beforeEach(() => {
    imageRepository = {
      findByFileKey: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    imageQueryRepository = {
      findByIdWithRelations: jest.fn(),
    };

    uploadService = {
      deleteFile_v2: jest.fn(),
    };

    service = new ImageCommandService(
      imageRepository as any,
      imageQueryRepository as any,
      uploadService as any,
    );
  });

  describe('create', () => {
    const createDto = {
      originalName: 'test.jpg',
      fileName: 'test.jpg',
      filePath: '/uploads/test.jpg',
      fileKey: 'laylaos/unique-key.jpg',
      fileSize: 1024,
      mimeType: 'image/jpeg',
      publicUrl: 'https://example.com/test.jpg',
    };

    it('ควร throw BadRequestException เมื่อ file key ซ้ำ', async () => {
      imageRepository.findByFileKey.mockResolvedValue(mockImage);

      await expect(service.create(createDto, mockCurrentUser)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('ควรสร้าง image สำเร็จ', async () => {
      imageRepository.findByFileKey.mockResolvedValue(null);
      imageRepository.create.mockResolvedValue(mockImage);

      const result = await service.create(createDto, mockCurrentUser);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.originalName).toBe('test.jpg');
      expect(imageRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createDto,
          merchant: { id: 10 },
          uploadedByUser: { id: 1 },
        }),
      );
    });
  });

  describe('createFromUpload', () => {
    const mockFiles = [
      {
        originalname: 'test1.jpg',
        fileName: 'test1.jpg',
        filePath: '/uploads/test1.jpg',
        key: 'laylaos/uuid1.jpg',
        size: 1024,
        mimetype: 'image/jpeg',
        url: 'https://example.com/test1.jpg',
      },
      {
        originalname: 'test2.jpg',
        fileName: 'test2.jpg',
        key: 'laylaos/uuid2.jpg',
        size: 2048,
        mimetype: 'image/jpeg',
      },
    ];

    it('ควรสร้าง images จาก files หลายไฟล์สำเร็จ', async () => {
      imageRepository.create
        .mockResolvedValueOnce({ ...mockImage, id: 1, fileKey: 'laylaos/uuid1.jpg' })
        .mockResolvedValueOnce({ ...mockImage, id: 2, fileKey: 'laylaos/uuid2.jpg' });

      const result = await service.createFromUpload(mockFiles, mockCurrentUser);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(imageRepository.create).toHaveBeenCalledTimes(2);
    });

    it('ควรจัดการกรณีไม่มี url', async () => {
      const filesWithoutUrl = [mockFiles[1]];
      imageRepository.create.mockResolvedValue(mockImage);

      await service.createFromUpload(filesWithoutUrl, mockCurrentUser);

      expect(imageRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          originalName: 'test2.jpg',
          publicUrl: null,
          merchant: { id: 10 },
          uploadedByUser: { id: 1 },
        }),
      );
    });
  });

  describe('createFromUploadForCustomer', () => {
    const mockCustomerFiles = [
      {
        originalname: 'customer.jpg',
        key: 'laylaos/customer-uuid.jpg',
        size: 1024,
        mimetype: 'image/jpeg',
        url: 'https://example.com/customer.jpg',
      },
    ];

    it('ควรสร้าง images สำหรับ customer สำเร็จ', async () => {
      imageRepository.create.mockResolvedValue(mockImage);

      const result = await service.createFromUploadForCustomer(
        mockCustomerFiles,
        10,
      );

      expect(result).toHaveLength(1);
      expect(result[0].originalName).toBe('customer.jpg');
      expect(imageRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          originalName: 'customer.jpg',
          merchant: { id: 10 },
          uploadedByUser: null,
        }),
      );
    });

    it('ควรจัดการกรณี url เป็น undefined', async () => {
      const filesWithoutUrl = [
        {
          originalname: 'no-url.jpg',
          key: 'laylaos/no-url.jpg',
          size: 1024,
          mimetype: 'image/jpeg',
        },
      ];
      imageRepository.create.mockResolvedValue(mockImage);

      await service.createFromUploadForCustomer(filesWithoutUrl, 10);

      expect(imageRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          originalName: 'no-url.jpg',
          publicUrl: undefined,
        }),
      );
    });
  });

  describe('update', () => {
    const updateDto = {
      description: 'Updated description',
      tags: ['tag1', 'tag2'],
    };

    it('ควร throw NotFoundException เมื่อหา image ไม่เจอ', async () => {
      imageQueryRepository.findByIdWithRelations.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('ควร update image สำเร็จ', async () => {
      imageQueryRepository.findByIdWithRelations.mockResolvedValue(mockImage);
      imageRepository.update.mockResolvedValue(mockImage);

      const result = await service.update(1, updateDto);

      expect(result).toBeDefined();
      expect(imageRepository.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('ควร throw NotFoundException เมื่อ update ไม่สำเร็จ', async () => {
      imageQueryRepository.findByIdWithRelations.mockResolvedValue(mockImage);
      imageRepository.update.mockResolvedValue(null);

      await expect(service.update(1, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('ควร throw NotFoundException เมื่อหา image ไม่เจอ', async () => {
      imageQueryRepository.findByIdWithRelations.mockResolvedValue(null);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
    });

    it('ควร delete image สำเร็จ', async () => {
      imageQueryRepository.findByIdWithRelations.mockResolvedValue(mockImage);
      uploadService.deleteFile_v2.mockResolvedValue({ success: true });
      imageRepository.delete.mockResolvedValue(true);

      await service.delete(1);

      expect(uploadService.deleteFile_v2).toHaveBeenCalledWith('laylaos/uuid-test.jpg');
      expect(imageRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('softDelete', () => {
    it('ควร throw NotFoundException เมื่อหา image ไม่เจอ', async () => {
      imageQueryRepository.findByIdWithRelations.mockResolvedValue(null);

      await expect(service.softDelete(999)).rejects.toThrow(NotFoundException);
    });

    it('ควร soft delete image สำเร็จ', async () => {
      imageQueryRepository.findByIdWithRelations.mockResolvedValue(mockImage);
      imageRepository.update.mockResolvedValue({ ...mockImage, isActive: false });

      const result = await service.softDelete(1);

      expect(result.isActive).toBe(false);
      expect(imageRepository.update).toHaveBeenCalledWith(1, { isActive: false });
    });
  });

  describe('restore', () => {
    it('ควร throw NotFoundException เมื่อหา image ไม่เจอ', async () => {
      imageQueryRepository.findByIdWithRelations.mockResolvedValue(null);

      await expect(service.restore(999)).rejects.toThrow(NotFoundException);
    });

    it('ควร restore image สำเร็จ', async () => {
      imageQueryRepository.findByIdWithRelations.mockResolvedValue({
        ...mockImage,
        isActive: false,
      });
      imageRepository.update.mockResolvedValue(mockImage);

      const result = await service.restore(1);

      expect(result.isActive).toBe(true);
      expect(imageRepository.update).toHaveBeenCalledWith(1, { isActive: true });
    });
  });

  describe('toResponse', () => {
    it('ควร map entity ไปเป็น response DTO อย่างถูกต้อง', async () => {
      imageQueryRepository.findByIdWithRelations.mockResolvedValue(mockImage);
      imageRepository.update.mockResolvedValue(mockImage);

      const result = await service.update(1, {});

      expect(result).toEqual({
        id: 1,
        merchantId: {
          id: 10,
          shopName: 'Test Shop',
        },
        uploadedByUser: {
          id: 1,
          fullName: 'Test User',
          email: 'test@example.com',
        },
        originalName: 'test.jpg',
        fileName: 'test.jpg',
        filePath: '/uploads/test.jpg',
        fileKey: 'laylaos/uuid-test.jpg',
        fileSize: 1024,
        mimeType: 'image/jpeg',
        publicUrl: 'https://example.com/test.jpg',
        isActive: true,
        tags: [],
        description: null,
        createdAt: mockImage.createdAt,
        updatedAt: mockImage.updatedAt,
      });
    });

    it('ควรจัดการกรณี merchant หรือ uploadedByUser เป็น null', async () => {
      const imageWithoutRelations = {
        ...mockImage,
        merchant: null,
        uploadedByUser: null,
      };
      imageQueryRepository.findByIdWithRelations.mockResolvedValue(imageWithoutRelations);
      imageRepository.update.mockResolvedValue(imageWithoutRelations);

      const result = await service.update(1, {});

      expect(result.merchantId).toBeNull();
      expect(result.uploadedByUser).toBeNull();
    });
  });
});
