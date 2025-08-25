const { compose, pipe, curry, partial, memoize, debounce, throttle, once } = require('@oxog/collections');

// Example 1: Compose - Function composition (right to left)
console.log('=== Compose Example ===');
const add1 = x => x + 1;
const multiply2 = x => x * 2;
const square = x => x * x;

const composed = compose(square, multiply2, add1);
console.log('compose(square, multiply2, add1)(3):');
console.log('Step by step: 3 → add1(3)=4 → multiply2(4)=8 → square(8)=64');
console.log('Result:', composed(3)); // 64

// Example 2: Pipe - Function pipeline (left to right)
console.log('\n=== Pipe Example ===');
const piped = pipe(add1, multiply2, square);
console.log('pipe(add1, multiply2, square)(3):');
console.log('Step by step: 3 → add1(3)=4 → multiply2(4)=8 → square(8)=64');
console.log('Result:', piped(3)); // 64

// Example 3: Curry - Function currying
console.log('\n=== Curry Example ===');
const add3Numbers = (a, b, c) => a + b + c;
const curriedAdd = curry(add3Numbers);

console.log('Original function: add3Numbers(1, 2, 3) =', add3Numbers(1, 2, 3));
console.log('Curried: curriedAdd(1)(2)(3) =', curriedAdd(1)(2)(3));
console.log('Partial currying: curriedAdd(1, 2)(3) =', curriedAdd(1, 2)(3));

// Create specialized functions
const addTo10 = curriedAdd(10);
const add10And5 = addTo10(5);
console.log('Specialized: add10And5(7) =', add10And5(7)); // 22

// Example 4: Partial - Partial application
console.log('\n=== Partial Application Example ===');
const greet = (greeting, punctuation, name) => `${greeting} ${name}${punctuation}`;
const sayHello = partial(greet, 'Hello', '!');
const askQuestion = partial(greet, 'How are you', '?');

console.log('Original: greet("Hi", ".", "Alice") =', greet('Hi', '.', 'Alice'));
console.log('Partial: sayHello("Bob") =', sayHello('Bob'));
console.log('Partial: askQuestion("Charlie") =', askQuestion('Charlie'));

// Example 5: Memoization
console.log('\n=== Memoize Example ===');
let computeCount = 0;
const expensiveFunction = (n) => {
  computeCount++;
  console.log(`Computing fibonacci(${n})... (call #${computeCount})`);
  if (n <= 1) return n;
  return n * expensiveFunction(n - 1); // Intentionally inefficient
};

const memoizedFib = memoize(expensiveFunction);

console.log('First call:');
console.log('memoizedFib(5) =', memoizedFib(5));
console.log('\nSecond call (should use cache):');
console.log('memoizedFib(5) =', memoizedFib(5));
console.log('Cache size:', memoizedFib.cache.size);

// Example 6: Once - Execute only once
console.log('\n=== Once Example ===');
const expensiveInitialization = () => {
  console.log('Performing expensive initialization...');
  return { initialized: true, timestamp: Date.now() };
};

const initOnce = once(expensiveInitialization);

console.log('First call:');
console.log('Result:', initOnce());
console.log('Called status:', initOnce.called);

console.log('\nSecond call:');
console.log('Result:', initOnce());
console.log('Called status:', initOnce.called);

// Example 7: Debounce (simulated)
console.log('\n=== Debounce Example (Simulated) ===');
let searchCount = 0;
const search = (query) => {
  searchCount++;
  console.log(`Searching for "${query}" (search #${searchCount})`);
};

const debouncedSearch = debounce(search, 300);

console.log('Simulating rapid typing:');
debouncedSearch('a');
debouncedSearch('ap');
debouncedSearch('app');
debouncedSearch('appl');
debouncedSearch('apple');

setTimeout(() => {
  console.log('After 400ms - only the last search should have executed');
}, 400);

// Example 8: Throttle (simulated)
console.log('\n=== Throttle Example (Simulated) ===');
let scrollCount = 0;
const handleScroll = () => {
  scrollCount++;
  console.log(`Scroll event handled (#${scrollCount})`);
};

const throttledScroll = throttle(handleScroll, 100);

console.log('Simulating rapid scroll events:');
for (let i = 0; i < 5; i++) {
  setTimeout(() => throttledScroll(), i * 20); // Events every 20ms
}

setTimeout(() => {
  console.log('After 200ms - throttled function limits executions');
}, 200);

// Example 9: Combining functional utilities
console.log('\n=== Combining Utilities ===');

// Create a data processing pipeline
const processNumber = pipe(
  x => x + 1,           // Add 1
  x => x * 2,           // Multiply by 2  
  x => Math.pow(x, 2)   // Square
);

// Memoize the expensive processing
const memoizedProcess = memoize(processNumber);

// Create a debounced batch processor
const numbers = [];
const batchProcess = debounce(() => {
  console.log('Processing batch:', numbers.map(n => `${n} → ${memoizedProcess(n)}`));
  numbers.length = 0; // Clear array
}, 200);

// Simulate adding numbers to batch
console.log('Adding numbers to batch processing:');
[1, 2, 3, 4, 5].forEach(n => {
  numbers.push(n);
  batchProcess();
});

setTimeout(() => {
  console.log('Batch processing completed');
}, 300);