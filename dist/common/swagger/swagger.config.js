"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SWAGGER_PATH = exports.swaggerConfig = void 0;
const swagger_1 = require("@nestjs/swagger");
exports.swaggerConfig = new swagger_1.DocumentBuilder()
    .setTitle('Hotel Management API')
    .setDescription('API documentation for Hotel Platform')
    .setVersion('1.0')
    .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    name: 'Authorization',
    description: 'Enter JWT token',
    in: 'header',
}, 'BearerAuth')
    .build();
exports.SWAGGER_PATH = 'docs';
//# sourceMappingURL=swagger.config.js.map