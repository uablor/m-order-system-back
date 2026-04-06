import { File } from 'multer';
export declare class UploadService {
    private s3;
    private bucket;
    constructor();
    uploadFiles(files: File[]): Promise<{
        key: string;
    }[]>;
    deleteFile(key: string): Promise<{
        message: string;
    }>;
    deleteFile_v2(key: string): Promise<{
        success: boolean;
        message: string;
    }>;
    uploadFiles_v2(files: File[]): Promise<{
        uploaded: {
            name: string;
            key: string;
            url: string;
        }[];
    }>;
}
