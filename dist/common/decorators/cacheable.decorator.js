"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cacheable = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const Cacheable = (ttlSeconds) => (0, common_1.SetMetadata)(cache_manager_1.CACHE_TTL_METADATA, ttlSeconds ? ttlSeconds * 1000 : undefined);
exports.Cacheable = Cacheable;
//# sourceMappingURL=cacheable.decorator.js.map