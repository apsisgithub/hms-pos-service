import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const fixMigration = () => {
  const migrationPath = join(__dirname, '../migrations/1753739841895-initiate-migration.ts');
  
  try {
    let content = readFileSync(migrationPath, 'utf8');
    
    // Fix timestamp columns - replace CURRENT_TIMESTAMP with CURRENT_TIMESTAMP(6) when precision is specified
    content = content.replace(
      /timestamp\(6\) NOT NULL DEFAULT CURRENT_TIMESTAMP(?!\()/g,
      'timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)'
    );
    
    // Fix timestamp columns with ON UPDATE - replace CURRENT_TIMESTAMP with CURRENT_TIMESTAMP(6) when precision is specified
    content = content.replace(
      /timestamp\(6\) NOT NULL DEFAULT CURRENT_TIMESTAMP\(6\) ON UPDATE CURRENT_TIMESTAMP(?!\()/g,
      'timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)'
    );
    
    // Also fix any remaining inconsistencies
    content = content.replace(
      /timestamp\(6\) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(?!\()/g,
      'timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)'
    );
    
    writeFileSync(migrationPath, content, 'utf8');
    console.log('Migration file fixed successfully!');
    
  } catch (error) {
    console.error('Error fixing migration:', error);
  }
};

fixMigration();