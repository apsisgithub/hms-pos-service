import { DatabaseSeeder } from './database-seeder';

async function setupTests() {
  // Ensure we're in test environment
  process.env.NODE_ENV = 'test';
  console.log('🔧 Setting up E2E tests...');

  const seeder = new DatabaseSeeder();

  try {
    await seeder.initialize();
    await seeder.seedTestData();
    console.log('✅ Test setup completed successfully');
  } catch (error) {
    console.error('❌ Test setup failed:', error);
    process.exit(1);
  } finally {
    await seeder.close();
  }
}

async function teardownTests() {
  // Ensure we're in test environment
  process.env.NODE_ENV = 'test';
  console.log('🧹 Cleaning up after E2E tests...');

  const seeder = new DatabaseSeeder();

  try {
    await seeder.initialize();
    await seeder.cleanupTestData();
    console.log('✅ Test cleanup completed successfully');
  } catch (error) {
    console.error('❌ Test cleanup failed:', error);
    process.exit(1);
  } finally {
    await seeder.close();
  }
}

// Check command line arguments
const command = process.argv[2];

if (command === 'setup') {
  setupTests();
} else if (command === 'teardown') {
  teardownTests();
} else {
  console.log('Usage: ts-node setup-tests.ts [setup|teardown]');
  process.exit(1);
}