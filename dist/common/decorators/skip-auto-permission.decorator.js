"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipAutoPermission = exports.SKIP_AUTO_PERMISSION_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.SKIP_AUTO_PERMISSION_KEY = 'skipAutoPermission';
const SkipAutoPermission = () => (0, common_1.SetMetadata)(exports.SKIP_AUTO_PERMISSION_KEY, true);
exports.SkipAutoPermission = SkipAutoPermission;
//# sourceMappingURL=skip-auto-permission.decorator.js.map