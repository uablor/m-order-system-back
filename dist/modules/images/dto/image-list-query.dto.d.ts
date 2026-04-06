import { BaseQueryDto } from 'src/common/base/dtos/base.query.dto';
export declare class ImageListQueryDto extends BaseQueryDto {
    merchantId?: number;
    uploadedByUserId?: number;
    mimeType?: string;
    tags?: string[];
    isActive?: boolean;
    minFileSize?: number;
    maxFileSize?: number;
}
