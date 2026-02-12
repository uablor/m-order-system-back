import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Mark a route as public (no JWT required).
 * Use on login, health, or docs endpoints.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
