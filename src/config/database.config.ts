import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export function getDatabaseConfig(config: ConfigService): TypeOrmModuleOptions {
  const type = config.get<'mysql' | 'postgres'>('DB_TYPE') ?? 'mysql';
  const host = config.get<string>('DB_HOST') ?? 'localhost';
  const port = Number(config.get<number>('DB_PORT')) ?? (type === 'postgres' ? 5432 : 3306);
  const username = config.get<string>('DB_USERNAME') ?? (type === 'postgres' ? 'postgres' : 'root');
  const password = config.get<string>('DB_PASSWORD') ?? '';
  const database = config.get<string>('DB_DATABASE') ?? 'm_order_system';
  const logging = config.get<string>('DB_LOGGING') === 'true';

  return {
    type: type as 'mysql' | 'postgres',
    host,
    port,
    username,
    password,
    database,
    logging,
    synchronize: false,
    autoLoadEntities: true,
    entities: [join(__dirname, '/../**/*.orm-entity.js')],
  };
}
