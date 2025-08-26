import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const fileName = process.argv[2]; // Get the first CLI argument
if (!fileName) {
  console.error('Error: You must provide a migration name as argument');
  process.exit(1);
}

const command = `yarn ts-node --esm -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate -d ./src/config/typeorm.config.ts ./migrations/${fileName}`;

async function generateMigration() {
  try {
    console.log('Generating migration...');
    console.log('Command:', command);
    
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    
    console.log(`stdout: ${stdout}`);
    console.log('Migration generated successfully!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

generateMigration();