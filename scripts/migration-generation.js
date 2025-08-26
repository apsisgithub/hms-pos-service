const { exec } = require('child_process');

const fileName = process.argv[2]; // Get the first CLI argument
if (!fileName) {
  console.error('Error: You must provide a argument"');
  process.exit(1);
}

const command = `yarn ts-node --esm -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate -d ./src/config/typeorm.config.ts ./migrations/${fileName}`;
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
