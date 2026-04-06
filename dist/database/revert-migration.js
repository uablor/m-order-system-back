"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./data-source");
async function revertMigration() {
    try {
        await data_source_1.AppDataSource.initialize();
        await data_source_1.AppDataSource.undoLastMigration({ transaction: 'all' });
        console.log('Last migration reverted.');
    }
    catch (err) {
        console.error('Revert failed:', err);
        process.exit(1);
    }
    finally {
        await data_source_1.AppDataSource.destroy().catch(() => { });
    }
}
revertMigration();
//# sourceMappingURL=revert-migration.js.map