import 'dotenv/config';
import { join } from 'path';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? process.env.DB_DATABASE ?? 'm_order_system',
  // src/common/database/typeorm/*.ts
  entities: [
    join(__dirname, '../common/base/base.orm-entities.ts'),
    join(__dirname, '../modules/**/*.orm-entity.{ts,js}'),
  ],
  synchronize: false, // ปิดใน production
  logging: process.env.DB_LOGGING === 'true',
  migrationsTableName: 'migrations',
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
});
