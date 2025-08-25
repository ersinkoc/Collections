#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const COVERAGE_THRESHOLD = {
  branches: 100,
  functions: 100,
  lines: 100,
  statements: 100
};

const coveragePath = path.join(__dirname, '..', 'coverage', 'coverage-summary.json');

if (!fs.existsSync(coveragePath)) {
  console.error('Coverage summary not found. Run tests with coverage first: npm run test:coverage');
  process.exit(1);
}

const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
const totals = coverage.total;

console.log('=== Coverage Report ===');
console.log(`Branches:   ${totals.branches.pct}% (required: ${COVERAGE_THRESHOLD.branches}%)`);
console.log(`Functions:  ${totals.functions.pct}% (required: ${COVERAGE_THRESHOLD.functions}%)`);
console.log(`Lines:      ${totals.lines.pct}% (required: ${COVERAGE_THRESHOLD.lines}%)`);
console.log(`Statements: ${totals.statements.pct}% (required: ${COVERAGE_THRESHOLD.statements}%)`);

let hasFailure = false;

Object.keys(COVERAGE_THRESHOLD).forEach(metric => {
  if (totals[metric].pct < COVERAGE_THRESHOLD[metric]) {
    console.error(`\n✗ ${metric} coverage (${totals[metric].pct}%) is below threshold (${COVERAGE_THRESHOLD[metric]}%)`);
    hasFailure = true;
  }
});

if (hasFailure) {
  console.error('\n❌ Coverage requirements not met!');
  process.exit(1);
} else {
  console.log('\n✅ All coverage requirements met!');
  process.exit(0);
}