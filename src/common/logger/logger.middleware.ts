import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';
import { LoggerService } from './logger.service';

declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
      startTime?: number;
    }
  }
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const correlationId = (req.headers['x-correlation-id'] as string) || uuid();
    req.correlationId = correlationId;
    req.startTime = Date.now();

    res.setHeader('X-Correlation-Id', correlationId);

    res.on('finish', () => {
      const duration = req.startTime ? Date.now() - req.startTime : 0;
      const userId = (req as Request & { user?: { userId?: string } }).user?.userId;
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
}
