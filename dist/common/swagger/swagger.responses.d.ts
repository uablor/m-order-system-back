export declare class ApiResponseDto<T = unknown> {
    success: boolean;
    Code: number;
    message: string;
    results?: T;
}
export declare class ApiPaginationResultDto {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
export declare class ApiPaginatedResponseDto<T = unknown> {
    success: boolean;
    Code: number;
    message: string;
    pagination: ApiPaginationResultDto;
    results: T[];
}
export declare class ApiLoginDto {
    email: string;
    password: string;
}
export declare class ApiAuthResponseDto {
    success: boolean;
    message: string;
    access_token: string;
    user?: unknown;
}
