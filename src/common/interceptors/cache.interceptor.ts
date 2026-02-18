import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  Optional,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import type { Cache } from 'cache-manager';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CACHE_KEY_METADATA, CACHE_TTL_METADATA } from '@nestjs/cache-manager';
import { NO_CACHE_METADATA_KEY } from '../decorators/no-cache.decorator';

const isNil = (val: unknown): val is null | undefined => val == null;
const isFunction = (val: unknown): val is (...args: unknown[]) => unknown =>
  typeof val === 'function';

import { StreamableFile } from '@nestjs/common';

/**
 * Global cache interceptor. Caches GET responses only.
 * Default TTL from app.cache.ttl (env CACHE_TTL seconds).
 * Override per-route with @CacheTTL(ms) or @Cacheable(seconds) from common/decorators.
 */
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly allowedMethods = ['GET'];

  constructor(
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
    protected readonly reflector: Reflector,
    protected readonly configService: ConfigService,
    @Optional() protected readonly httpAdapterHost?: HttpAdapterHost,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const key = this.trackBy(context);
    if (!key) {
      return next.handle();
    }

    const ttlFromDecorator =
      this.reflector.get<number | ((ctx: ExecutionContext) => number | Promise<number>) | undefined>(
        CACHE_TTL_METADATA,
        context.getHandler(),
      ) ??
      this.reflector.get<number | ((ctx: ExecutionContext) => number | Promise<number>) | undefined>(
        CACHE_TTL_METADATA,
        context.getClass(),
      );

    const defaultTtl =
      this.configService.get<number>('app.cache.ttl', { infer: true }) ?? 60_000;

    let ttl: number | undefined;
    if (!isNil(ttlFromDecorator)) {
      ttl = isFunction(ttlFromDecorator)
        ? await ttlFromDecorator(context)
        : ttlFromDecorator;
    } else {
      ttl = defaultTtl;
    }

    try {
      const value = await this.cacheManager.get(key);
      this.setHeadersWhenHttp(context, value);
      if (!isNil(value)) {
        return of(value);
      }

      return next.handle().pipe(
        tap(async (response) => {
          if (response instanceof StreamableFile) return;
          const args: [string, unknown, number?] = [key, response];
          if (!isNil(ttl)) args.push(ttl);
          try {
            await this.cacheManager.set(...args);
          } catch (err) {
            // ignore cache set errors
          }
        }),
      );
    } catch {
      return next.handle();
    }
  }

  protected trackBy(context: ExecutionContext): string | undefined {
    const httpAdapter = this.httpAdapterHost?.httpAdapter;
    const isHttpApp = httpAdapter && typeof httpAdapter.getRequestMethod === 'function';
    const noCache =
      this.reflector.get<boolean | undefined>(NO_CACHE_METADATA_KEY, context.getHandler()) ??
      this.reflector.get<boolean | undefined>(NO_CACHE_METADATA_KEY, context.getClass());
    if (noCache) return undefined;

    const cacheKey =
      this.reflector.get<string | ((ctx: ExecutionContext) => string) | undefined>(
        CACHE_KEY_METADATA,
        context.getHandler(),
      ) ?? null;

    if (!isHttpApp || cacheKey) {
      return isFunction(cacheKey) ? cacheKey(context) : cacheKey ?? undefined;
    }

    const request = context.getArgByIndex(0);
    if (!this.isRequestCacheable(context)) return undefined;

    return httpAdapter!.getRequestUrl(request);
  }

  protected isRequestCacheable(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    return this.allowedMethods.includes(req.method);
  }

  protected setHeadersWhenHttp(context: ExecutionContext, value: unknown): void {
    if (!this.httpAdapterHost?.httpAdapter) return;
    const response = context.switchToHttp().getResponse();
    this.httpAdapterHost.httpAdapter.setHeader(
      response,
      'X-Cache',
      isNil(value) ? 'MISS' : 'HIT',
    );
  }
}
