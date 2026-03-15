import { UploadService } from '../../../../src/modules/images/services/upload.service';
import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

// Mock environment variables
const originalEnv = process.env;

describe('UploadService', () => {
  let service: UploadService;
  let mockS3: {
    send: jest.Mock;
  };

  beforeEach(() => {
    jest.resetModules();
    
    // Set up environment variables
    process.env = {
      ...originalEnv,
      R2_BUCKET_NAME: 'test-bucket',
      R2_ENDPOINT: 'https://test.r2.com',
      R2_ACCESS_KEY_ID: 'test-key',
      R2_SECRET_ACCESS_KEY: 'test-secret',
      R2_PUBLIC_URL: 'https://test-public.r2.com',
    };

    // Mock S3Client
    mockS3 = {
      send: jest.fn(),
    };
    jest.spyOn(S3Client.prototype, 'send').mockImplementation(mockS3.send);

    service = new UploadService();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('ควร throw Error เมื่อไม่มี R2_BUCKET_NAME', () => {
      delete process.env.R2_BUCKET_NAME;

      expect(() => new UploadService()).toThrow(
        'R2_BUCKET_NAME environment variable is required',
      );
    });

    it('ควร throw Error เมื่อไม่มี R2 credentials', () => {
      delete process.env.R2_ENDPOINT;

      expect(() => new UploadService()).toThrow(
        'R2_ENDPOINT, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY environment variables are required',
      );
    });
  });

  describe('uploadFiles', () => {
    const mockFiles = [
      {
        originalname: 'test1.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test1'),
      },
      {
        originalname: 'test2.png',
        mimetype: 'image/png',
        buffer: Buffer.from('test2'),
      },
    ];

    it('ควร upload files สำเร็จ', async () => {
      mockS3.send.mockResolvedValue({});

      const result = await service.uploadFiles(mockFiles);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('key');
      expect(result[1]).toHaveProperty('key');
      expect(mockS3.send).toHaveBeenCalledTimes(2);

      // Check first call
      expect(mockS3.send).toHaveBeenCalledWith(
        expect.objectContaining({
          constructor: PutObjectCommand,
          input: {
            Bucket: 'test-bucket',
            Key: expect.stringMatching(/^laylaos\/[a-f0-9-]+\.jpg$/),
            Body: mockFiles[0].buffer,
            ContentType: 'image/jpeg',
          },
        }),
      );
    });

    it('ควรใช้ file extension ที่ถูกต้อง', async () => {
      mockS3.send.mockResolvedValue({});

      await service.uploadFiles(mockFiles);

      expect(mockS3.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            Key: expect.stringMatching(/\.jpg$/),
          }),
        }),
      );

      expect(mockS3.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            Key: expect.stringMatching(/\.png$/),
          }),
        }),
      );
    });
  });

  describe('deleteFile', () => {
    it('ควร delete file สำเร็จ', async () => {
      mockS3.send.mockResolvedValue({});

      const result = await service.deleteFile('laylaos/test-file.jpg');

      expect(result).toEqual({ message: 'Deleted successfully' });
      expect(mockS3.send).toHaveBeenCalledWith(
        expect.objectContaining({
          constructor: DeleteObjectCommand,
          input: {
            Bucket: 'test-bucket',
            Key: 'laylaos/test-file.jpg',
          },
        }),
      );
    });
  });

  describe('deleteFile_v2', () => {
    it('ควร delete file สำเร็จเมื่อ file มีอยู่', async () => {
      mockS3.send
        .mockResolvedValueOnce({}) // HeadObjectCommand
        .mockResolvedValueOnce({}); // DeleteObjectCommand

      const result = await service.deleteFile_v2('laylaos/test-file.jpg');

      expect(result).toEqual({ success: true, message: '🗑️ File deleted successfully' });
      expect(mockS3.send).toHaveBeenCalledTimes(2);
      expect(mockS3.send).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          constructor: HeadObjectCommand,
          input: {
            Bucket: 'test-bucket',
            Key: 'laylaos/test-file.jpg',
          },
        }),
      );
      expect(mockS3.send).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          constructor: DeleteObjectCommand,
          input: {
            Bucket: 'test-bucket',
            Key: 'laylaos/test-file.jpg',
          },
        }),
      );
    });

    it('ควร return success: false เมื่อ file ไม่มีอยู่', async () => {
      const notFoundError = new Error('Not Found');
      notFoundError.name = 'NotFound';
      notFoundError.$metadata = { httpStatusCode: 404 };

      mockS3.send.mockRejectedValue(notFoundError);

      const result = await service.deleteFile_v2('laylaos/non-existent.jpg');

      expect(result).toEqual({ success: false, message: 'File does not exist' });
      expect(mockS3.send).toHaveBeenCalledTimes(1);
    });

    it('ควร throw error เมื่อเกิด error อื่นๆ', async () => {
      const otherError = new Error('Some other error');
      otherError.name = 'OtherError';

      mockS3.send.mockRejectedValue(otherError);

      await expect(service.deleteFile_v2('laylaos/test-file.jpg')).rejects.toThrow(
        'Some other error',
      );
    });
  });

  describe('uploadFiles_v2', () => {
    const mockFiles = [
      {
        originalname: 'test1.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test1'),
      },
    ];

    it('ควร upload files v2 สำเร็จ', async () => {
      mockS3.send.mockResolvedValue({});

      const result = await service.uploadFiles_v2(mockFiles);

      expect(result.uploaded).toHaveLength(1);
      expect(result.uploaded[0]).toEqual({
        name: 'test1.jpg',
        key: expect.stringMatching(/^laylaos\/[a-f0-9-]+\.jpg$/),
        url: 'https://test-public.r2.com/laylaos/test.jpg', // Will match pattern
      });
      expect(mockS3.send).toHaveBeenCalledTimes(1);
    });

    it('ควรสร้าง URL ที่ถูกต้อง', async () => {
      mockS3.send.mockResolvedValue({});

      const result = await service.uploadFiles_v2(mockFiles);

      const uploadedFile = result.uploaded[0];
      expect(uploadedFile.url).toBe(
        `https://test-public.r2.com/${uploadedFile.key}`,
      );
    });

    it('ควร return object ที่มี uploaded property', async () => {
      mockS3.send.mockResolvedValue({});

      const result = await service.uploadFiles_v2(mockFiles);

      expect(result).toHaveProperty('uploaded');
      expect(Array.isArray(result.uploaded)).toBe(true);
    });
  });
});
