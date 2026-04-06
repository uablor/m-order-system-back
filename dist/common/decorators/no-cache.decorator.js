"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoCache = exports.NO_CACHE_METADATA_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.NO_CACHE_METADATA_KEY = 'no_cache';
const NoCache = () => (0, common_1.SetMetadata)(exports.NO_CACHE_METADATA_KEY, true);
exports.NoCache = NoCache;
//# sourceMappingURL=no-cache.decorator.js.map