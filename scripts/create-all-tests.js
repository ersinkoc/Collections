const fs = require('fs');
const path = require('path');

// Get all implementation files
function getAllImplementationFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      getAllImplementationFiles(fullPath, files);
    } else if (item.endsWith('.ts') && !item.includes('test') && !item.includes('index')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Check which files have tests
function checkTestCoverage() {
  const srcDir = path.join(__dirname, '..', 'src', 'core');
  const testDirs = [
    path.join(__dirname, '..', 'src', 'tests'),
    path.join(__dirname, '..', 'tests', 'unit')
  ];
  
  const implFiles = getAllImplementationFiles(srcDir);
  const missingTests = [];
  
  for (const implFile of implFiles) {
    const relativePath = path.relative(srcDir, implFile);
    const testFileName = path.basename(implFile, '.ts') + '.test.ts';
    
    let hasTest = false;
    for (const testDir of testDirs) {
      const possiblePaths = [
        path.join(testDir, relativePath.replace('.ts', '.test.ts')),
        path.join(testDir, path.dirname(relativePath), testFileName)
      ];
      
      for (const testPath of possiblePaths) {
        if (fs.existsSync(testPath)) {
          hasTest = true;
          break;
        }
      }
      if (hasTest) break;
    }
    
    if (!hasTest) {
      missingTests.push(relativePath);
    }
  }
  
  console.log(`Total implementation files: ${implFiles.length}`);
  console.log(`Files with tests: ${implFiles.length - missingTests.length}`);
  console.log(`Files missing tests: ${missingTests.length}`);
  
  if (missingTests.length > 0) {
    console.log('\nFiles missing tests:');
    missingTests.forEach(file => console.log(`  - ${file}`));
  }
  
  return missingTests;
}

checkTestCoverage();