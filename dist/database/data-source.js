"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("dotenv/config");
const path_1 = require("path");
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? process.env.DB_DATABASE ?? 'm_order_system',
    entities: [
        (0, path_1.join)(__dirname, '../common/base/base.orm-entities.ts'),
        (0, path_1.join)(__dirname, '../modules/**/*.orm-entity.{ts,js}'),
    ],
    synchronize: false,
    logging: process.env.DB_LOGGING === 'true',
    migrationsTableName: 'migrations',
    migrations: [(0, path_1.join)(__dirname, 'migrations', '*.{ts,js}')],
});
//# sourceMappingURL=data-source.js.map