import { SetMetadata } from '@nestjs/common';

export const NO_CACHE_METADATA_KEY = 'no_cache' as const;

/**
 * Disable server-side cache (CacheInterceptor) for this route/class.
 * ใช้เมื่อข้อมูลต้องสดเสมอ เช่น list ที่มีการ update บ่อย
 */
export const NoCache = () => SetMetadata(NO_CACHE_METADATA_KEY, true);

