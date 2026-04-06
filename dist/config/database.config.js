"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = getDatabaseConfig;
const path_1 = require("path");
function getDatabaseConfig(config) {
    const type = config.get('DB_TYPE') ?? 'mysql';
    const host = config.get('DB_HOST') ?? 'localhost';
    const port = Number(config.get('DB_PORT')) ?? (type === 'postgres' ? 5432 : 3306);
    const username = config.get('DB_USERNAME') ?? (type === 'postgres' ? 'postgres' : 'root');
    const password = config.get('DB_PASSWORD') ?? '';
    const database = config.get('DB_DATABASE') ?? 'm_order_system';
    const logging = config.get('DB_LOGGING') === 'true';
    return {
        type: type,
        host,
        port,
        username,
        password,
        database,
        logging,
        synchronize: false,
        autoLoadEntities: true,
        entities: [(0, path_1.join)(__dirname, '/../**/*.orm-entity.js')],
    };
}
//# sourceMappingURL=database.config.js.map