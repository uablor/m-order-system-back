import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
export function getDatabaseConfig(config: ConfigService): TypeOrmModuleOptions {
  const type = config.get<'mysql' | 'postgres'>('database.type', { infer: true }) ?? 'mysql';
  const host = config.get<string>('database.host', { infer: true }) ?? 'localhost';
  const port = config.get<number>('database.port', { infer: true }) ?? (type === 'postgres' ? 5432 : 3306);
  const username = config.get<string>('database.username', { infer: true }) ?? (type === 'postgres' ? 'postgres' : 'root');
  const password = config.get<string>('database.password', { infer: true }) ?? '';
  const database = config.get<string>('database.database', { infer: true }) ?? 'm_order_system';
  const logging = config.get<boolean>('database.logging', { infer: true }) ?? (type === 'postgres');
  const entities = [join(__dirname, '/../**/*.orm-entity.{ts,js}')];
  return {
    type: type as 'mysql' | 'postgres',
    host,
    port,
    username,
    password,
    database,
    logging,
    synchronize: false,
    entities,
    autoLoadEntities: true,
  };
}
