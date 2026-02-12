import { AppDataSource } from './data-source';

async function runMigrations(): Promise<void> {
  try {
    await AppDataSource.initialize();
    const executed = await AppDataSource.runMigrations({ transaction: 'all' });
    console.log(
      executed.length > 0
        ? `Migrations completed: ${executed.map((m) => m.name).join(', ')}`
        : 'No pending migrations.',
    );
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await AppDataSource.destroy().catch(() => {});
  }
}

runMigrations();
