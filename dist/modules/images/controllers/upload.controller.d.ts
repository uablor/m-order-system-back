import { UploadService } from '../services/upload.service';
import { ImageCommandService } from '../services/image-command.service';
import type { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
import { File } from 'multer';
import { ImageResponseDto } from '../dto/image-response.dto';
import { CustomerRepository } from '../../customers/repositories/customer.repository';
export declare class UploadController {
    private readonly uploadService;
    private readonly imageCommandService;
    private readonly customerRepository;
    constructor(uploadService: UploadService, imageCommandService: ImageCommandService, customerRepository: CustomerRepository);
    uploadFiles(files: File[], currentUser: CurrentUserPayload): Promise<ImageResponseDto[]>;
    uploadFilesV2(files: File[], currentUser: CurrentUserPayload): Promise<ImageResponseDto[]>;
    deleteFile(deleteDto: {
        key: string;
    }): Promise<{
        message: string;
    }>;
    deleteFileV2(deleteDto: {
        key: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteFileById(id: string): Promise<{
        message: string;
    }>;
    uploadFilesV2Public(files: File[], body: {
        customerToken?: string;
    }): Promise<ImageResponseDto[]>;
}
