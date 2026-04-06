"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => ({
    port: parseInt(process.env.PORT ?? '4000', 10),
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
//# sourceMappingURL=app.config.js.map