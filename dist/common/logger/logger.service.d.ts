import { LoggerService as NestLoggerService } from '@nestjs/common';
export interface LogContext {
    correlationId?: string;
    method?: string;
    path?: string;
    userId?: string;
    statusCode?: number;
    duration?: number;
    [key: string]: unknown;
}
export declare class LoggerService implements NestLoggerService {
    private readonly context;
    log(message: string, context?: string, meta?: LogContext): void;
    error(message: string, trace?: string, context?: string, meta?: LogContext): void;
    warn(message: string, context?: string, meta?: LogContext): void;
    debug(message: string, context?: string, meta?: LogContext): void;
    verbose(message: string, context?: string, meta?: LogContext): void;
    private write;
}
