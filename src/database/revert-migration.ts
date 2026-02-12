import { AppDataSource } from './data-source';

async function revertMigration(): Promise<void> {
  try {
    await AppDataSource.initialize();
    await AppDataSource.undoLastMigration({ transaction: 'all' });
    console.log('Last migration reverted.');
  } catch (err) {
    console.error('Revert failed:', err);
    process.exit(1);
  } finally {
    await AppDataSource.destroy().catch(() => {});
  }
}

revertMigration();
