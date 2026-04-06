import { ImageRepository } from '../repositories/image.repository';
import { ImageQueryRepository } from '../repositories/image.query-repository';
import { ImageCreateDto } from '../dto/image-create.dto';
import { ImageUpdateDto } from '../dto/image-update.dto';
import { ImageResponseDto } from '../dto/image-response.dto';
import { UploadService } from './upload.service';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
export declare class ImageCommandService {
    private readonly imageRepository;
    private readonly imageQueryRepository;
    private readonly uploadService;
    constructor(imageRepository: ImageRepository, imageQueryRepository: ImageQueryRepository, uploadService: UploadService);
    create(createDto: ImageCreateDto, currentUser: CurrentUserPayload): Promise<ImageResponseDto>;
    createFromUpload(files: any[], currentUser: CurrentUserPayload): Promise<ImageResponseDto[]>;
    createFromUploadForCustomer(files: Array<{
        originalname: string;
        key: string;
        size: number;
        mimetype: string;
        url?: string | null;
    }>, merchantId: number): Promise<ImageResponseDto[]>;
    update(id: number, updateDto: ImageUpdateDto): Promise<ImageResponseDto>;
    delete(id: number): Promise<void>;
    softDelete(id: number): Promise<ImageResponseDto>;
    restore(id: number): Promise<ImageResponseDto>;
    private toResponse;
}
