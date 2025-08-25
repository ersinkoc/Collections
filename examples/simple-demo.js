/**
 * Simple demonstration of @oxog/collections functionality
 * Testing core functions individually
 */

// Import specific functions directly
const { chunk } = require('../dist/core/array/chunk.js');
const { distinct } = require('../dist/core/array/distinct.js');
const { deepMerge } = require('../dist/core/object/deep-merge.js');
const { pick } = require('../dist/core/object/pick.js');
const { PluginSystem } = require('../dist/plugins/PluginSystem.js');
const { createPlugin } = require('../dist/plugins/createPlugin.js');

async function simpleDemo() {
  console.log('🚀 Simple @oxog/collections Demo');
  console.log('=================================');
  
  // Test array functions
  console.log('\n--- Array Functions ---');
  const numbers = [1, 2, 2, 3, 4, 4, 5];
  console.log('Original:', numbers);
  console.log('Chunked by 3:', chunk(numbers, 3));
  console.log('Distinct:', distinct(numbers));
  
  // Test object functions
  console.log('\n--- Object Functions ---');
  const obj1 = { a: 1, b: { x: 10 } };
  const obj2 = { a: 2, b: { y: 20 } };
  console.log('Obj1:', obj1);
  console.log('Obj2:', obj2);
  console.log('Deep merged:', deepMerge(obj1, obj2));
  
  const person = { name: 'Alice', age: 25, email: 'alice@example.com', password: 'secret' };
  console.log('Person:', person);
  console.log('Picked name and email:', pick(person, ['name', 'email']));
  
  // Test plugin system
  console.log('\n--- Plugin System ---');
  const pluginSystem = new PluginSystem();
  
  const mathPlugin = createPlugin('math', '1.0.0')
    .description('Math utilities')
    .install((system) => {
      system.registerFunction('add', (a, b) => a + b);
      system.registerFunction('multiply', (a, b) => a * b);
    })
    .build();
  
  await pluginSystem.install(mathPlugin);
  
  console.log('Installed plugins:', pluginSystem.getPlugins().map(p => p.name));
  console.log('Available functions:', pluginSystem.getFunctionNames());
  console.log('5 + 3 =', pluginSystem.call('add', 5, 3));
  console.log('4 * 6 =', pluginSystem.call('multiply', 4, 6));
  
  console.log('\n✅ Simple demo completed!');
}

simpleDemo().catch(console.error);