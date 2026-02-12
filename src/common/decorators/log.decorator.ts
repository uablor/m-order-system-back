import { SetMetadata } from '@nestjs/common';

export const LOG_METADATA = 'log:enabled';

/**
 * Optional per-controller or per-route logging.
 * When applied, the request will be explicitly logged by the logger (in addition to global middleware).
 *
 * @example
 * @Controller('users')
 * @Log()
 * export class UserController {}
 */
export const Log = () => SetMetadata(LOG_METADATA, true);
