import { SetMetadata } from '@nestjs/common';
import { CACHE_TTL_METADATA } from '@nestjs/cache-manager';

/**
 * Mark a GET endpoint as cacheable with optional TTL override.
 * TTL is in seconds. When omitted, the global CACHE_TTL from config is used.
 *
 * @param ttlSeconds - Cache TTL in seconds (optional)
 *
 * @example
 * @Get()
 * @Cacheable()           // use default TTL
 * @Cacheable(120)        // cache for 2 minutes
 */
export const Cacheable = (ttlSeconds?: number) =>
  SetMetadata(CACHE_TTL_METADATA, ttlSeconds ? ttlSeconds * 1000 : undefined);
