/**
 * Comprehensive demonstration of plugin usage with @oxog/collections
 * Shows how to create, install, and use multiple plugins together
 */

const { PluginSystem } = require('../../dist/plugins/PluginSystem.js');
const mathPlugin = require('./math-plugin.js');
const validationPlugin = require('./validation-plugin.js');
const stringUtilsPlugin = require('./string-utils-plugin.js');

async function demonstratePluginSystem() {
  console.log('🔌 Plugin System Comprehensive Demonstration');
  console.log('==========================================\n');

  // Create plugin system
  const pluginSystem = new PluginSystem();

  // Set up event listeners to track plugin activity
  pluginSystem.on('plugin:installed', (plugin) => {
    console.log(`📦 Plugin installed: ${plugin.name} v${plugin.version}`);
  });

  pluginSystem.on('plugin:uninstalled', (plugin) => {
    console.log(`🗑️  Plugin uninstalled: ${plugin.name} v${plugin.version}`);
  });

  pluginSystem.on('function:registered', (name, fn) => {
    console.log(`🔧 Function registered: ${name}`);
  });

  // Install plugins with different configurations
  console.log('📋 Installing Plugins...\n');

  // Install math plugin with custom config
  await pluginSystem.install(mathPlugin, {
    precision: 6,
    angleUnit: 'degrees',
    enableStatistics: true,
    enableGeometry: true,
    enableNumberTheory: true
  });

  // Install validation plugin
  await pluginSystem.install(validationPlugin, {
    strictMode: false,
    enableDetailedErrors: true
  });

  // Install string utils plugin
  await pluginSystem.install(stringUtilsPlugin, {
    defaultLocale: 'en-US',
    caseSensitive: false,
    trimWhitespace: true
  });

  console.log(`\n✅ All plugins installed successfully!`);
  console.log(`📊 Total functions available: ${pluginSystem.getFunctionNames().length}\n`);

  // Demonstrate math plugin functionality
  console.log('🔢 Math Plugin Demonstrations');
  console.log('-----------------------------');

  console.log('Basic arithmetic:');
  console.log(`  5 + 3 = ${pluginSystem.call('add', 5, 3)}`);
  console.log(`  10 - 4 = ${pluginSystem.call('subtract', 10, 4)}`);
  console.log(`  6 × 7 = ${pluginSystem.call('multiply', 6, 7)}`);
  console.log(`  15 ÷ 3 = ${pluginSystem.call('divide', 15, 3)}`);

  console.log('\nAdvanced math:');
  console.log(`  5! = ${pluginSystem.call('factorial', 5)}`);
  console.log(`  Fibonacci(10) = ${pluginSystem.call('fibonacci', 10)}`);
  console.log(`  GCD(48, 18) = ${pluginSystem.call('gcd', 48, 18)}`);
  console.log(`  LCM(12, 18) = ${pluginSystem.call('lcm', 12, 18)}`);

  console.log('\nTrigonometry (using degrees):');
  console.log(`  sin(30°) = ${pluginSystem.call('sin', 30).toFixed(3)}`);
  console.log(`  cos(60°) = ${pluginSystem.call('cos', 60).toFixed(3)}`);
  console.log(`  tan(45°) = ${pluginSystem.call('tan', 45).toFixed(3)}`);

  console.log('\nStatistics:');
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  console.log(`  Data: [${data.join(', ')}]`);
  console.log(`  Mean: ${pluginSystem.call('mean', data)}`);
  console.log(`  Median: ${pluginSystem.call('median', data)}`);
  console.log(`  Standard Deviation: ${pluginSystem.call('standardDeviation', data).toFixed(3)}`);

  const data2 = [2, 4, 6, 8, 10];
  console.log(`  Correlation with [${data2.join(', ')}]: ${pluginSystem.call('correlation', data, data2).toFixed(3)}`);

  console.log('\nGeometry:');
  console.log(`  Circle area (r=5): ${pluginSystem.call('circleArea', 5).toFixed(2)}`);
  console.log(`  Rectangle area (10×6): ${pluginSystem.call('rectangleArea', 10, 6)}`);
  console.log(`  Distance (0,0) to (3,4): ${pluginSystem.call('distance', 0, 0, 3, 4)}`);

  console.log('\nNumber theory:');
  console.log(`  Is 17 prime? ${pluginSystem.call('isPrime', 17)}`);
  console.log(`  Prime factors of 60: [${pluginSystem.call('primeFactors', 60).join(', ')}]`);
  console.log(`  10th prime: ${pluginSystem.call('nthPrime', 10)}`);

  // Demonstrate validation plugin functionality
  console.log('\n✅ Validation Plugin Demonstrations');
  console.log('-----------------------------------');

  console.log('Type validation:');
  console.log(`  isString('hello'): ${pluginSystem.call('isString', 'hello')}`);
  console.log(`  isNumber(42): ${pluginSystem.call('isNumber', 42)}`);
  console.log(`  isEmail('user@example.com'): ${pluginSystem.call('isEmail', 'user@example.com')}`);
  console.log(`  isUrl('https://example.com'): ${pluginSystem.call('isUrl', 'https://example.com')}`);

  console.log('\nString validation:');
  console.log(`  isAlphanumeric('abc123'): ${pluginSystem.call('isAlphanumeric', 'abc123')}`);
  console.log(`  isAlpha('hello'): ${pluginSystem.call('isAlpha', 'hello')}`);
  console.log(`  minLength('test', 3): ${pluginSystem.call('minLength', 'test', 3)}`);

  console.log('\nNumber validation:');
  console.log(`  isPositive(5): ${pluginSystem.call('isPositive', 5)}`);
  console.log(`  isEven(8): ${pluginSystem.call('isEven', 8)}`);
  console.log(`  inRange(7, 1, 10): ${pluginSystem.call('inRange', 7, 1, 10)}`);

  // Schema validation example
  console.log('\nSchema validation:');
  const userSchema = {
    name: { required: true, type: 'string', minLength: 2 },
    email: { required: true, isEmail: true },
    age: { required: true, type: 'number', inRange: [0, 120] },
    website: { isUrl: true }
  };

  const validUser = {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    age: 25,
    website: 'https://alice.dev'
  };

  const invalidUser = {
    name: 'A',
    email: 'invalid-email',
    age: -5
  };

  const validResult = pluginSystem.call('validateSchema', validUser, userSchema);
  const invalidResult = pluginSystem.call('validateSchema', invalidUser, userSchema);

  console.log(`  Valid user validation: ${validResult.valid ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`  Invalid user validation: ${invalidResult.valid ? '✅ PASSED' : '❌ FAILED'}`);
  if (!invalidResult.valid) {
    console.log(`  Errors: ${invalidResult.errors.length} found`);
    invalidResult.errors.forEach(error => {
      console.log(`    - ${error.field}: ${error.message}`);
    });
  }

  // Validation chaining example
  console.log('\nValidation chaining:');
  try {
    const chainResult = pluginSystem.call('chain', 'test@example.com')
      .required()
      .type('string')
      .isEmail()
      .minLength(5)
      .validate();

    console.log(`  Email chain validation: ${chainResult.valid ? '✅ PASSED' : '❌ FAILED'}`);
  } catch (error) {
    console.log(`  Chain validation error: ${error.message}`);
  }

  // Demonstrate string plugin functionality
  console.log('\n📝 String Utils Plugin Demonstrations');
  console.log('-------------------------------------');

  const testString = 'Hello World Example Text';

  console.log('Case transformations:');
  console.log(`  Original: "${testString}"`);
  console.log(`  camelCase: "${pluginSystem.call('camelCase', testString)}"`);
  console.log(`  pascalCase: "${pluginSystem.call('pascalCase', testString)}"`);
  console.log(`  kebabCase: "${pluginSystem.call('kebabCase', testString)}"`);
  console.log(`  snakeCase: "${pluginSystem.call('snakeCase', testString)}"`);

  console.log('\nString analysis:');
  console.log(`  Word count: ${pluginSystem.call('wordCount', testString)}`);
  console.log(`  Character count: ${pluginSystem.call('characterCount', testString)}`);
  console.log(`  Character count (no spaces): ${pluginSystem.call('characterCount', testString, false)}`);

  console.log('\nString manipulation:');
  console.log(`  Reversed: "${pluginSystem.call('reverse', testString)}"`);
  console.log(`  Truncated (15): "${pluginSystem.call('truncate', testString, 15)}"`);
  console.log(`  Slugified: "${pluginSystem.call('slugify', testString)}"`);

  const text = 'JavaScript is awesome! Contact us at info@example.com or visit https://example.com';
  console.log('\nString extraction:');
  console.log(`  Original: "${text}"`);
  console.log(`  Emails found: [${pluginSystem.call('extractEmails', text).join(', ')}]`);
  console.log(`  URLs found: [${pluginSystem.call('extractUrls', text).join(', ')}]`);

  console.log('\nString similarity:');
  const str1 = 'hello world';
  const str2 = 'helo word';
  console.log(`  "${str1}" vs "${str2}"`);
  console.log(`  Levenshtein distance: ${pluginSystem.call('levenshteinDistance', str1, str2)}`);
  console.log(`  Similarity: ${(pluginSystem.call('similarity', str1, str2) * 100).toFixed(1)}%`);

  console.log('\nRandom string generation:');
  console.log(`  Random string (8 chars): "${pluginSystem.call('randomString', 8)}"`);
  console.log(`  Random alpha (6 chars): "${pluginSystem.call('randomAlpha', 6)}"`);
  console.log(`  Random numeric (4 chars): "${pluginSystem.call('randomNumeric', 4)}"`);

  // Demonstrate cross-plugin functionality
  console.log('\n🔗 Cross-Plugin Integration');
  console.log('---------------------------');

  console.log('Using validation with math operations:');
  try {
    // Validate input before math operation
    pluginSystem.call('assertType', 25, 'number', 'radius');
    pluginSystem.call('assertInRange', 25, 0, 100, 'radius');
    
    const area = pluginSystem.call('circleArea', 25);
    console.log(`  Circle area (r=25): ${pluginSystem.call('round', area, 2)}`);
  } catch (error) {
    console.log(`  Validation failed: ${error.message}`);
  }

  console.log('\nUsing string utils with validation:');
  const email = '  USER@EXAMPLE.COM  ';
  const sanitized = pluginSystem.call('sanitizeEmail', email);
  const isValid = pluginSystem.call('isEmail', sanitized);
  
  console.log(`  Original: "${email}"`);
  console.log(`  Sanitized: "${sanitized}"`);
  console.log(`  Is valid email: ${isValid}`);

  // Demonstrate plugin management
  console.log('\n⚙️ Plugin Management');
  console.log('--------------------');

  console.log('Installed plugins:');
  pluginSystem.getPlugins().forEach(plugin => {
    console.log(`  📦 ${plugin.name} v${plugin.version} - ${plugin.description}`);
  });

  console.log(`\nAvailable functions (${pluginSystem.getFunctionNames().length} total):`);
  const functions = pluginSystem.getFunctionNames().sort();
  const chunks = [];
  for (let i = 0; i < functions.length; i += 6) {
    chunks.push(functions.slice(i, i + 6));
  }
  chunks.forEach(chunk => {
    console.log(`  ${chunk.join(', ')}`);
  });

  // Performance comparison
  console.log('\n⚡ Performance Comparison');
  console.log('------------------------');

  const iterations = 10000;
  
  // Math operations
  console.time('Plugin factorial(10)');
  for (let i = 0; i < iterations; i++) {
    pluginSystem.call('factorial', 10);
  }
  console.timeEnd('Plugin factorial(10)');

  // Native factorial for comparison
  function nativeFactorial(n) {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  console.time('Native factorial(10)');
  for (let i = 0; i < iterations; i++) {
    nativeFactorial(10);
  }
  console.timeEnd('Native factorial(10)');

  // String operations
  const testStr = 'Test String for Performance';
  
  console.time('Plugin camelCase');
  for (let i = 0; i < iterations; i++) {
    pluginSystem.call('camelCase', testStr);
  }
  console.timeEnd('Plugin camelCase');

  // Cleanup - uninstall plugins
  console.log('\n🧹 Plugin Cleanup');
  console.log('------------------');

  await pluginSystem.uninstall('string-utils');
  await pluginSystem.uninstall('validation-utils');
  await pluginSystem.uninstall('math-utils');

  console.log(`✅ All plugins uninstalled. Functions remaining: ${pluginSystem.getFunctionNames().length}`);

  console.log('\n🎉 Plugin System Demonstration Complete!');
  console.log('\n💡 Key Takeaways:');
  console.log('  • Plugins provide modular, extensible functionality');
  console.log('  • Multiple plugins can work together seamlessly');
  console.log('  • Cross-plugin integration enables powerful combinations');
  console.log('  • Plugin system adds minimal performance overhead');
  console.log('  • Event system provides visibility into plugin lifecycle');
  console.log('  • Configuration allows customization per use case');
}

// Error handling
process.on('uncaughtException', (error) => {
  console.error('\n💥 Uncaught exception:', error.message);
  process.exit(1);
});

// Run the demonstration
demonstratePluginSystem().catch(error => {
  console.error('\n💥 Demo failed:', error);
  process.exit(1);
});