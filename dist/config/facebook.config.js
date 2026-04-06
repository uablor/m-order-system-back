"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('facebook', () => ({
    messenger: {
        token: process.env.FACEBOOK_MESSENGER_TOKEN ?? '',
    },
    frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
}));
//# sourceMappingURL=facebook.config.js.map