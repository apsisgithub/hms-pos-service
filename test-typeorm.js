const { exec } = require('child_process');

// Test the TypeORM configuration
const command = 'yarn ts-node --esm -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate -d ./src/config/typeorm.config.ts ./migrations/test-migration';

console.log('Testing TypeORM configuration...');
console.log('Command:', command);

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});