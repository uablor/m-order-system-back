import 'dotenv/config';
import { DataSource } from 'typeorm';

const type = (process.env.DB_TYPE as 'mysql' | 'postgres') ?? 'mysql';

export const AppDataSource = new DataSource({
  type,
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(
    process.env.DB_PORT ?? (type === 'postgres' ? '5432' : '3306'),
    10,
  ),
  username:
    process.env.DB_USERNAME ?? (type === 'postgres' ? 'postgres' : 'root'),
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_DATABASE ?? 'm_order_system',
  migrations: [
    __dirname + '/migrations/*.ts',
    __dirname + '/migrations/*.js',
  ],
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: false,
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
});

export default AppDataSource;
