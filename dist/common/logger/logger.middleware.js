"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const logger_service_1 = require("./logger.service");
let LoggerMiddleware = class LoggerMiddleware {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    use(req, res, next) {
        const correlationId = req.headers['x-correlation-id'] || (0, uuid_1.v4)();
        req.correlationId = correlationId;
        req.startTime = Date.now();
        res.setHeader('X-Correlation-Id', correlationId);
        res.on('finish', () => {
            const duration = req.startTime ? Date.now() - req.startTime : 0;
            const userId = req.user?.userId;
            this.logger.log('Incoming request', 'HTTP', {
                correlationId,
                method: req.method,
                path: req.url,
                userId,
                statusCode: res.statusCode,
                duration,
            });
        });
        next();
    }
};
exports.LoggerMiddleware = LoggerMiddleware;
exports.LoggerMiddleware = LoggerMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], LoggerMiddleware);
//# sourceMappingURL=logger.middleware.js.map