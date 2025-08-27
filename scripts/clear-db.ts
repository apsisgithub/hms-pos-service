import { QueryManagerService } from 'src/common/query-manager/query.service';

const clearDb = async () => {
  const queryService = await new QueryManagerService().createTransaction();

  try {
    await queryService.startTransaction();

    // Disable foreign key checks to avoid constraint errors
    await queryService.query('SET FOREIGN_KEY_CHECKS = 0');

    // Get all table names from the current database
    const tables = await queryService.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_TYPE = 'BASE TABLE'
    `);

    // Drop all tables
    for (const table of tables) {
      await queryService.query(`DROP TABLE IF EXISTS \`${table.TABLE_NAME}\``);
    }

    // Get all views from the current database
    const views = await queryService.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.VIEWS 
      WHERE TABLE_SCHEMA = DATABASE()
    `);

    // Drop all views
    for (const view of views) {
      await queryService.query(`DROP VIEW IF EXISTS \`${view.TABLE_NAME}\``);
    }

    // Get all stored procedures from the current database
    const procedures = await queryService.query(`
      SELECT ROUTINE_NAME 
      FROM INFORMATION_SCHEMA.ROUTINES 
      WHERE ROUTINE_SCHEMA = DATABASE() 
      AND ROUTINE_TYPE = 'PROCEDURE'
    `);

    // Drop all stored procedures
    for (const procedure of procedures) {
      await queryService.query(`DROP PROCEDURE IF EXISTS \`${procedure.ROUTINE_NAME}\``);
    }

    // Get all functions from the current database
    const functions = await queryService.query(`
      SELECT ROUTINE_NAME 
      FROM INFORMATION_SCHEMA.ROUTINES 
      WHERE ROUTINE_SCHEMA = DATABASE() 
      AND ROUTINE_TYPE = 'FUNCTION'
    `);

    // Drop all functions
    for (const func of functions) {
      await queryService.query(`DROP FUNCTION IF EXISTS \`${func.ROUTINE_NAME}\``);
    }

    // Re-enable foreign key checks
    await queryService.query('SET FOREIGN_KEY_CHECKS = 1');

    await queryService.commitTransaction();

    console.log('Database cleared successfully');
  } catch (error) {
    await queryService.rollbackTransaction();
    console.log('Error clearing database:', error);
    process.exit(1);
  } finally {
    await queryService.release();
    process.exit(0)
  }
};

clearDb();