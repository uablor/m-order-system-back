"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = exports.LOG_METADATA = void 0;
const common_1 = require("@nestjs/common");
exports.LOG_METADATA = 'log:enabled';
const Log = () => (0, common_1.SetMetadata)(exports.LOG_METADATA, true);
exports.Log = Log;
//# sourceMappingURL=log.decorator.js.map