import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '8000', 10),
  env: process.env.NODE_ENV ?? 'development',
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL ?? '60', 10) * 1000,
    limit: parseInt(process.env.THROTTLE_LIMIT ?? '10', 10),
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL ?? '60', 10) * 1000,
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-me-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
    expiresInSeconds: parseInt(process.env.JWT_EXPIRES_IN_SECONDS ?? '604800', 10),
  },
}));
