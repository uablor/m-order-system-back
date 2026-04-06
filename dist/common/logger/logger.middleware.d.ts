import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';
declare global {
    namespace Express {
        interface Request {
            correlationId?: string;
            startTime?: number;
        }
    }
}
export declare class LoggerMiddleware implements NestMiddleware {
    private readonly logger;
    constructor(logger: LoggerService);
    use(req: Request, res: Response, next: NextFunction): void;
}
