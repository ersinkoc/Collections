# @oxog/collections

[![npm version](https://img.shields.io/npm/v/@oxog/collections.svg)](https://www.npmjs.com/package/@oxog/collections)
[![npm downloads](https://img.shields.io/npm/dm/@oxog/collections.svg)](https://www.npmjs.com/package/@oxog/collections)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/oxog/collections)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive, **zero-dependency**, high-performance, type-safe collection utilities library for JavaScript and TypeScript. Built with strict @oxog standards, providing 100+ utility functions with complete test coverage.

## ✨ Features

- 🚀 **Zero Runtime Dependencies** - Every function implemented from scratch
- 📦 **100+ Utility Functions** - Comprehensive collection manipulation
- 🔒 **Full TypeScript Support** - Complete type definitions with strict mode
- ✅ **100% Test Coverage** - Every line, branch, and function tested
- ⚡ **High Performance** - Optimized algorithms and efficient implementations
- 🎯 **Tree-shakeable** - Import only what you need
- 📚 **Extensive Documentation** - Clear examples and API references
- 🔌 **Plugin System** - Extensible architecture

## 📦 Installation

```bash
npm install @oxog/collections
```

```bash
yarn add @oxog/collections
```

```bash
pnpm add @oxog/collections
```

## 🚀 Quick Start

```typescript
import { chunk, distinct, groupBy, deepMerge } from '@oxog/collections';

// Array operations
const chunks = chunk([1, 2, 3, 4, 5], 2);
// Result: [[1, 2], [3, 4], [5]]

const unique = distinct([1, 2, 2, 3, 3, 3]);
// Result: [1, 2, 3]

// Object operations
const merged = deepMerge(
  { a: 1, b: { c: 2 } },
  { b: { d: 3 }, e: 4 }
);
// Result: { a: 1, b: { c: 2, d: 3 }, e: 4 }

// Set operations
import { difference, intersection, union } from '@oxog/collections';

const setA = new Set([1, 2, 3]);
const setB = new Set([2, 3, 4]);

const diff = difference(setA, setB);  // Set {1}
const inter = intersection(setA, setB); // Set {2, 3}
const uni = union(setA, setB);        // Set {1, 2, 3, 4}
```

## 📚 API Documentation

### Array Functions

| Function | Description |
|----------|------------|
| `chunk(array, size)` | Split array into chunks of specified size |
| `distinct(array)` | Return unique elements |
| `distinctBy(array, selector)` | Return unique elements by key selector |
| `dropWhile(array, predicate)` | Drop elements while predicate is true |
| `dropLastWhile(array, predicate)` | Drop elements from end while predicate is true |
| `groupBy(array, selector)` | Group elements by key selector |
| `includesValue(array, value)` | Deep value inclusion check |
| `intersect(arrays...)` | Array intersection |
| `joinToString(array, options)` | Advanced join with separators and transforms |
| `mapNotNullish(array, mapper)` | Map and filter out null/undefined |
| `maxBy(array, selector)` | Find maximum element by selector |
| `minBy(array, selector)` | Find minimum element by selector |
| `partition(array, predicate)` | Split array by predicate |
| `permutations(array)` | Generate all permutations |
| `sample(array, count)` | Random sample from array |
| `shuffle(array)` | Randomly shuffle array (Fisher-Yates) |
| `slidingWindows(array, size, step)` | Create sliding window views |
| `sortBy(array, selector)` | Sort by selector function |
| `sumOf(array, selector)` | Sum elements by selector |
| `takeWhile(array, predicate)` | Take elements while predicate is true |
| `takeLastWhile(array, predicate)` | Take elements from end while predicate is true |
| `union(arrays...)` | Array union |
| `unzip(array)` | Unzip array of tuples |
| `withoutAll(array, values)` | Remove all specified elements |
| `zip(arrays...)` | Zip multiple arrays into tuples |

### Object Functions

| Function | Description |
|----------|------------|
| `deepMerge(objects...)` | Deep merge objects recursively |
| `filterEntries(object, predicate)` | Filter object entries |
| `filterKeys(object, predicate)` | Filter by keys |
| `filterValues(object, predicate)` | Filter by values |
| `mapEntries(object, mapper)` | Transform entries |
| `mapKeys(object, mapper)` | Transform keys |
| `mapValues(object, mapper)` | Transform values |
| `omit(object, keys)` | Omit specified keys |
| `pick(object, keys)` | Pick specified keys |
| `deepClone(object)` | Deep clone objects |
| `deepEquals(a, b)` | Deep equality check |
| `flattenObject(object)` | Flatten nested objects |
| `unflattenObject(object)` | Unflatten to nested structure |
| `invert(object)` | Invert keys and values |
| `defaults(object, defaults)` | Fill missing properties with defaults |

### Set Functions

| Function | Description |
|----------|------------|
| `difference(setA, setB)` | Set difference (A - B) |
| `intersection(setA, setB)` | Set intersection |
| `isDisjoint(setA, setB)` | Check if sets are disjoint |
| `isSubset(setA, setB)` | Check subset relationship |
| `isSuperset(setA, setB)` | Check superset relationship |
| `symmetricDifference(setA, setB)` | Symmetric difference |
| `union(setA, setB)` | Set union |

### Functional Programming

| Function | Description |
|----------|------------|
| `compose(...fns)` | Function composition (right to left) |
| `pipe(...fns)` | Function pipeline (left to right) |
| `curry(fn)` | Curry functions |
| `partial(fn, ...args)` | Partial application |
| `debounce(fn, delay)` | Debounce function calls |
| `throttle(fn, limit)` | Throttle function calls |
| `memoize(fn)` | Memoize function results |
| `once(fn)` | Execute function only once |
| `retry(fn, options)` | Retry failed operations |
| `timeout(fn, ms)` | Add timeout to async functions |

### Async Functions

| Function | Description |
|----------|------------|
| `asyncFilter(array, predicate)` | Async array filter |
| `asyncMap(array, mapper)` | Async array map |
| `asyncReduce(array, reducer, initial)` | Async array reduce |
| `asyncForEach(array, callback)` | Async forEach |
| `asyncSome(array, predicate)` | Async some check |
| `asyncEvery(array, predicate)` | Async every check |
| `asyncFind(array, predicate)` | Async find element |
| `asyncGroupBy(array, selector)` | Async group by |
| `parallel(fns)` | Execute async functions in parallel |
| `sequential(fns)` | Execute async functions sequentially |
| `race(fns)` | Race async operations |
| `delay(ms)` | Promise-based delay |

### Tree Functions

| Function | Description |
|----------|------------|
| `traverse(tree, order)` | Tree traversal (DFS/BFS) |
| `map(tree, mapper)` | Map tree nodes |
| `filter(tree, predicate)` | Filter tree nodes |
| `find(tree, predicate)` | Find node in tree |
| `flatten(tree)` | Flatten tree to array |
| `fromArray(array, options)` | Build tree from array |
| `toArray(tree)` | Convert tree to array |
| `depth(tree)` | Calculate tree depth |
| `breadth(tree)` | Calculate tree breadth |
| `prune(tree, predicate)` | Remove branches by predicate |

## 🔌 Plugin System

Extend functionality with the built-in plugin system:

```typescript
import { PluginManager } from '@oxog/collections/plugins';

// Register a plugin
const customPlugin = {
  name: 'custom-operations',
  version: '1.0.0',
  install(core, options) {
    // Add custom functionality
  }
};

PluginManager.register(customPlugin);
```

## ⚡ Performance

All functions are optimized for performance with documented time complexity:

```typescript
// O(n) - Linear time complexity
const unique = distinct(largeArray);

// O(n log n) - Efficient sorting
const sorted = sortBy(items, x => x.value);

// O(1) - Constant time lookups in groupBy result
const groups = groupBy(users, u => u.role);
```

## 🧪 Testing

Every function has 100% test coverage including:
- Normal cases
- Edge cases
- Error cases
- Performance tests
- Type safety tests

Run tests:

```bash
npm test           # Run all tests
npm run test:watch # Watch mode
npm run test:coverage # With coverage report
```

## 📖 Examples

### Chaining Operations

```typescript
import { pipe, chunk, distinct, flatten } from '@oxog/collections';

const process = pipe(
  (arr: number[]) => chunk(arr, 3),
  (chunks) => chunks.map(distinct),
  flatten
);

const result = process([1, 2, 2, 3, 3, 3, 4, 4, 4, 4]);
// Result: [1, 2, 3, 4]
```

### Working with Complex Data

```typescript
import { groupBy, mapValues, sortBy } from '@oxog/collections';

const orders = [
  { id: 1, customer: 'Alice', amount: 100, date: '2024-01-01' },
  { id: 2, customer: 'Bob', amount: 200, date: '2024-01-01' },
  { id: 3, customer: 'Alice', amount: 150, date: '2024-01-02' },
];

// Group by customer and calculate totals
const customerTotals = mapValues(
  groupBy(orders, o => o.customer),
  orders => orders.reduce((sum, o) => sum + o.amount, 0)
);
// Result: { Alice: 250, Bob: 200 }

// Sort orders by amount
const sortedOrders = sortBy(orders, o => o.amount);
```

### Async Operations

```typescript
import { asyncMap, parallel, retry } from '@oxog/collections';

// Process items asynchronously
const results = await asyncMap(items, async (item) => {
  const processed = await processItem(item);
  return processed;
});

// Parallel execution with retry
const tasks = urls.map(url => 
  retry(() => fetch(url), { attempts: 3, delay: 1000 })
);
const responses = await parallel(tasks);
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

## 📄 License

MIT © Ersin KOÇ

## 🔗 Links

- [GitHub Repository](https://github.com/ersinkoc/collections)
- [NPM Package](https://www.npmjs.com/package/@ersinkoc/collections)
- [API Documentation](https://ersinkoc.github.io/collections)
- [Changelog](CHANGELOG.md)

## 🙏 Acknowledgments

Built with ❤️ following the highest standards of quality and performance.