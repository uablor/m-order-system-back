import { spawnSync } from 'child_process';

const args = process.argv.slice(2);
const nameArg = args.find((a) => !a.startsWith('-'));
const migrationName = nameArg ?? 'GeneratedMigration';
const timestamp = Date.now();
const migrationPath = `src/database/migrations/${timestamp}-${migrationName}`;

const result = spawnSync(
  'npx',
  [
    'typeorm-ts-node-commonjs',
    'migration:generate',
    migrationPath,
    '-d',
    'src/database/data-source.ts',
  ],
  {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd(),
  },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
