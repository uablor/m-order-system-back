import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { MerchantOrmEntity } from '../../merchants/entities/merchant.orm-entity';
import { UserOrmEntity } from '../../users/entities/user.orm-entity';
export declare class ImageOrmEntity extends BaseOrmEntity {
    merchant: MerchantOrmEntity;
    uploadedByUser: UserOrmEntity | null;
    originalName: string;
    fileName: string;
    filePath: string;
    fileKey: string;
    fileSize: number;
    mimeType: string;
    publicUrl: string | null;
    isActive: boolean;
    tags: string[] | null;
    description: string | null;
}
