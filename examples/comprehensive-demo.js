/**
 * Comprehensive demonstration of @oxog/collections
 * 
 * This example showcases all major functionality including:
 * - Array operations
 * - Object operations
 * - Set operations
 * - Functional programming utilities
 * - Async operations
 * - Tree functions
 * - Plugin system
 */

// Import from the built distribution
const {
  // Array functions
  chunk, distinct, groupBy, partition, shuffle, zip,
  
  // Object functions
  deepMerge, pick, omit, flattenObject,
  
  // Set functions
  setUnion, intersection, difference,
  
  // Comparison functions
  equals, maxOf, minOf,
  
  // Functional programming
  compose, pipe, curry, partial, memoize, debounce,
  
  // Async operations
  asyncFilter, asyncMap, parallel, series, delay,
  
  // Tree functions
  createTreeNode, traverseDepthFirst, traverseBreadthFirst, mapTree,
  
  // Plugin system
  PluginSystem, createPlugin,
  
  // Error classes
  ValidationError
} = require('../dist/index.js');

async function demonstrateArrayFunctions() {
  console.log('\n=== Array Functions Demo ===');
  
  const numbers = [1, 2, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10];
  
  console.log('Original array:', numbers);
  console.log('Distinct values:', distinct(numbers));
  console.log('Chunked by 3:', chunk(numbers, 3));
  console.log('Shuffled:', shuffle([...numbers]));
  
  const users = [
    { name: 'Alice', age: 25, department: 'Engineering' },
    { name: 'Bob', age: 30, department: 'Engineering' },
    { name: 'Carol', age: 28, department: 'Marketing' },
    { name: 'David', age: 32, department: 'Marketing' }
  ];
  
  console.log('Grouped by department:', groupBy(users, user => user.department));
  console.log('Partitioned by age >= 30:', partition(users, user => user.age >= 30));
  
  const names = ['Alice', 'Bob', 'Carol'];
  const ages = [25, 30, 28];
  console.log('Zipped names and ages:', zip(names, ages));
}

function demonstrateObjectFunctions() {
  console.log('\n=== Object Functions Demo ===');
  
  const obj1 = { a: 1, b: { x: 10, y: 20 }, c: 3 };
  const obj2 = { a: 2, b: { y: 30, z: 40 }, d: 4 };
  
  console.log('Object 1:', obj1);
  console.log('Object 2:', obj2);
  console.log('Deep merged:', deepMerge(obj1, obj2));
  
  const person = { name: 'Alice', age: 25, email: 'alice@example.com', password: 'secret' };
  console.log('Original person:', person);
  console.log('Picked fields:', pick(person, ['name', 'email']));
  console.log('Omitted sensitive:', omit(person, ['password']));
  
  const nested = { user: { profile: { name: 'Alice', settings: { theme: 'dark' } } } };
  console.log('Nested object:', nested);
  console.log('Flattened:', flattenObject(nested));
}

function demonstrateSetFunctions() {
  console.log('\n=== Set Functions Demo ===');
  
  const set1 = new Set([1, 2, 3, 4]);
  const set2 = new Set([3, 4, 5, 6]);
  
  console.log('Set 1:', Array.from(set1));
  console.log('Set 2:', Array.from(set2));
  console.log('Union:', Array.from(setUnion(set1, set2)));
  console.log('Intersection:', Array.from(intersection(set1, set2)));
  console.log('Difference:', Array.from(difference(set1, set2)));
}

function demonstrateComparisonFunctions() {
  console.log('\n=== Comparison Functions Demo ===');
  
  console.log('Objects equal:', equals({ a: 1, b: 2 }, { a: 1, b: 2 }));
  console.log('Arrays equal:', equals([1, 2, 3], [1, 2, 3]));
  console.log('Max of numbers:', maxOf([5, 2, 8, 1, 9]));
  console.log('Min of numbers:', minOf([5, 2, 8, 1, 9]));
}

function demonstrateFunctionalProgramming() {
  console.log('\n=== Functional Programming Demo ===');
  
  // Function composition
  const add1 = x => x + 1;
  const multiply2 = x => x * 2;
  const subtract3 = x => x - 3;
  
  const composed = compose(subtract3, multiply2, add1);
  const piped = pipe(add1, multiply2, subtract3);
  
  console.log('Composed (5):', composed(5)); // ((5+1)*2)-3 = 9
  console.log('Piped (5):', piped(5));       // ((5+1)*2)-3 = 9
  
  // Currying
  const add = (a, b, c) => a + b + c;
  const curriedAdd = curry(add);
  
  console.log('Curried add(1)(2)(3):', curriedAdd(1)(2)(3));
  console.log('Curried add(1, 2)(3):', curriedAdd(1, 2)(3));
  
  // Partial application
  const greet = (greeting, name, punctuation) => `${greeting} ${name}${punctuation}`;
  const sayHello = partial(greet, 'Hello');
  
  console.log('Partial greeting:', sayHello('World', '!'));
  
  // Memoization
  const fibonacci = memoize(n => {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  });
  
  console.time('Fibonacci(40)');
  console.log('Fibonacci(40):', fibonacci(40));
  console.timeEnd('Fibonacci(40)');
  
  // Second call should be instant due to memoization
  console.time('Fibonacci(40) cached');
  console.log('Fibonacci(40) cached:', fibonacci(40));
  console.timeEnd('Fibonacci(40) cached');
}

async function demonstrateAsyncOperations() {
  console.log('\n=== Async Operations Demo ===');
  
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  // Async filter
  const evenNumbers = await asyncFilter(numbers, async x => {
    await delay(1); // Simulate async work
    return x % 2 === 0;
  });
  console.log('Async filtered evens:', evenNumbers);
  
  // Async map
  const doubled = await asyncMap(numbers.slice(0, 5), async x => {
    await delay(1);
    return x * 2;
  });
  console.log('Async doubled:', doubled);
  
  // Parallel execution
  const tasks = [
    async () => { await delay(10); return 'Task 1'; },
    async () => { await delay(20); return 'Task 2'; },
    async () => { await delay(15); return 'Task 3'; }
  ];
  
  console.time('Parallel execution');
  const parallelResults = await parallel(tasks);
  console.timeEnd('Parallel execution');
  console.log('Parallel results:', parallelResults);
  
  // Series execution
  console.time('Series execution');
  const seriesResults = await series(tasks);
  console.timeEnd('Series execution');
  console.log('Series results:', seriesResults);
}

function demonstrateTreeFunctions() {
  console.log('\n=== Tree Functions Demo ===');
  
  // Create a tree structure
  const tree = createTreeNode('Root', [
    createTreeNode('Branch 1', [
      createTreeNode('Leaf 1.1'),
      createTreeNode('Leaf 1.2')
    ]),
    createTreeNode('Branch 2', [
      createTreeNode('Leaf 2.1'),
      createTreeNode('Branch 2.1', [
        createTreeNode('Leaf 2.1.1'),
        createTreeNode('Leaf 2.1.2')
      ])
    ])
  ]);
  
  console.log('Depth-first traversal:', traverseDepthFirst(tree, node => node.data));
  console.log('Breadth-first traversal:', traverseBreadthFirst(tree, node => node.data));
  
  // Transform tree data
  const uppercased = mapTree(tree, data => data.toUpperCase());
  console.log('Uppercased tree:', traverseDepthFirst(uppercased, node => node.data));
}

async function demonstratePluginSystem() {
  console.log('\n=== Plugin System Demo ===');
  
  const pluginSystem = new PluginSystem();
  
  // Create a math utilities plugin
  const mathPlugin = createPlugin('math-utils', '1.0.0')
    .description('Mathematical utility functions')
    .install((system) => {
      system.registerFunction('square', (x) => x * x);
      system.registerFunction('cube', (x) => x * x * x);
      system.registerFunction('factorial', (n) => {
        if (n <= 1) return 1;
        return n * system.call('factorial', n - 1);
      });
    })
    .uninstall((system) => {
      system.unregisterFunction('square');
      system.unregisterFunction('cube');
      system.unregisterFunction('factorial');
    })
    .build();
  
  // Create a string utilities plugin
  const stringPlugin = createPlugin('string-utils', '1.0.0')
    .description('String utility functions')
    .install((system) => {
      system.registerFunction('reverse', (s) => s.split('').reverse().join(''));
      system.registerFunction('capitalize', (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase());
    })
    .build();
  
  // Install plugins
  await pluginSystem.install(mathPlugin);
  await pluginSystem.install(stringPlugin);
  
  console.log('Installed plugins:', pluginSystem.getPlugins().map(p => p.name));
  console.log('Available functions:', pluginSystem.getFunctionNames());
  
  // Use plugin functions
  console.log('Square of 5:', pluginSystem.call('square', 5));
  console.log('Cube of 3:', pluginSystem.call('cube', 3));
  console.log('Factorial of 5:', pluginSystem.call('factorial', 5));
  console.log('Reverse "hello":', pluginSystem.call('reverse', 'hello'));
  console.log('Capitalize "world":', pluginSystem.call('capitalize', 'world'));
  
  // Demonstrate event system
  pluginSystem.on('custom-event', (data) => {
    console.log('Custom event received:', data);
  });
  
  pluginSystem.emit('custom-event', { message: 'Hello from event system!' });
  
  // Uninstall plugin
  await pluginSystem.uninstall('string-utils');
  console.log('After uninstalling string-utils:', pluginSystem.getFunctionNames());
}

function demonstrateErrorHandling() {
  console.log('\n=== Error Handling Demo ===');
  
  try {
    // This should throw a ValidationError
    chunk(null, 3);
  } catch (error) {
    console.log('Caught validation error:', error.message);
    console.log('Error type:', error.name);
    console.log('Is ValidationError:', error instanceof ValidationError);
  }
  
  try {
    // This should throw a ValidationError
    pick(null, ['key']);
  } catch (error) {
    console.log('Caught object validation error:', error.message);
  }
  
  try {
    // This should throw an error
    const pluginSystem = new PluginSystem();
    pluginSystem.call('nonexistent-function');
  } catch (error) {
    console.log('Caught plugin error:', error.message);
  }
}

async function runCompleteDemo() {
  console.log('🚀 @oxog/collections Comprehensive Demo');
  console.log('=====================================');
  
  try {
    demonstrateArrayFunctions();
    demonstrateObjectFunctions();
    demonstrateSetFunctions();
    demonstrateComparisonFunctions();
    demonstrateFunctionalProgramming();
    await demonstrateAsyncOperations();
    demonstrateTreeFunctions();
    await demonstratePluginSystem();
    demonstrateErrorHandling();
    
    console.log('\n✅ Demo completed successfully!');
  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

// Run the demo
runCompleteDemo();