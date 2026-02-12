import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

export interface LogContext {
  correlationId?: string;
  method?: string;
  path?: string;
  userId?: string;
  statusCode?: number;
  duration?: number;
  [key: string]: unknown;
}

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly context = 'Application';

  log(message: string, context?: string, meta?: LogContext): void {
    this.write('log', message, context, meta);
  }

  error(message: string, trace?: string, context?: string, meta?: LogContext): void {
    this.write('error', message, context, { ...meta, stack: trace });
  }

  warn(message: string, context?: string, meta?: LogContext): void {
    this.write('warn', message, context, meta);
  }

  debug(message: string, context?: string, meta?: LogContext): void {
    this.write('debug', message, context, meta);
  }

  verbose(message: string, context?: string, meta?: LogContext): void {
    this.write('verbose', message, context, meta);
  }

  private write(
    level: 'log' | 'error' | 'warn' | 'debug' | 'verbose',
    message: string,
    context?: string,
    meta?: LogContext,
  ): void {
    const timestamp = new Date().toISOString();
    const payload = {
      timestamp,
      level,
      message,
      context: context ?? this.context,
      ...meta,
    };
    const line = JSON.stringify(payload);
    if (level === 'error') {
      process.stderr.write(line + '\n');
    } else {
      process.stdout.write(line + '\n');
    }
  }
}
