"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./data-source");
async function runMigrations() {
    try {
        await data_source_1.AppDataSource.initialize();
        const executed = await data_source_1.AppDataSource.runMigrations({ transaction: 'all' });
        console.log(executed.length > 0
            ? `Migrations completed: ${executed.map((m) => m.name).join(', ')}`
            : 'No pending migrations.');
    }
    catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
    finally {
        await data_source_1.AppDataSource.destroy().catch(() => { });
    }
}
runMigrations();
//# sourceMappingURL=run-migrations.js.map