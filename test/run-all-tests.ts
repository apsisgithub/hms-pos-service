import { execSync } from 'child_process';
import * as path from 'path';

const testFiles = [
  'buildings.e2e-spec.ts',
  'business-sources.e2e-spec.ts',
  'payment-modes.e2e-spec.ts',
  'currencies.e2e-spec.ts',
  'departments.e2e-spec.ts',
  'floors.e2e-spec.ts',
  'room-types.e2e-spec.ts',
  'taxes.e2e-spec.ts',
  'seasons.e2e-spec.ts',
  'guests.e2e-spec.ts',
  'roles.e2e-spec.ts',
  'sbu.e2e-spec.ts',
  'discounts.e2e-spec.ts',
];

console.log('🚀 Starting HMS Core Service E2E Tests...\n');

let passedTests = 0;
let failedTests = 0;
const results: { file: string; status: 'PASSED' | 'FAILED'; error?: string }[] = [];

for (const testFile of testFiles) {
  const testPath = path.join(__dirname, testFile);
  console.log(`📋 Running tests for: ${testFile}`);
  
  try {
    execSync(`npm run test:e2e -- ${testPath}`, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });
    
    console.log(`✅ ${testFile} - PASSED\n`);
    passedTests++;
    results.push({ file: testFile, status: 'PASSED' });
  } catch (error) {
    console.log(`❌ ${testFile} - FAILED\n`);
    failedTests++;
    results.push({ 
      file: testFile, 
      status: 'FAILED', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
}

// Print summary
console.log('\n' + '='.repeat(60));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(60));
console.log(`Total Tests: ${testFiles.length}`);
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`📈 Success Rate: ${((passedTests / testFiles.length) * 100).toFixed(1)}%`);

if (failedTests > 0) {
  console.log('\n❌ Failed Tests:');
  results
    .filter(r => r.status === 'FAILED')
    .forEach(r => console.log(`  - ${r.file}`));
}

console.log('\n' + '='.repeat(60));

process.exit(failedTests > 0 ? 1 : 0);