export declare class ImageResponseDto {
    id: number;
    merchantId: {
        id: number;
        shopName: string;
    } | null;
    uploadedByUser: {
        id: number;
        fullName: string;
        email: string;
    } | null;
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
    createdAt: Date;
    updatedAt: Date;
}
