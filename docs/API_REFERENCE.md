# API Reference

Complete API documentation for @oxog/collections - a zero-dependency TypeScript utility library.

## Table of Contents

1. [Array Operations](#array-operations)
2. [Object Operations](#object-operations)
3. [Set Operations](#set-operations)
4. [String Operations](#string-operations)
5. [Functional Programming](#functional-programming)
6. [Async Operations](#async-operations)
7. [Math Utilities](#math-utilities)
8. [Type Guards](#type-guards)
9. [Comparison Functions](#comparison-functions)
10. [Tree Operations](#tree-operations)
11. [Plugin System](#plugin-system)
12. [Error Classes](#error-classes)

---

## Array Operations

### `chunk<T>(array: T[], size: number): T[][]`

Splits an array into chunks of the specified size.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
chunk(['a', 'b', 'c'], 1); // [['a'], ['b'], ['c']]
```

**Parameters:**
- `array`: The array to chunk
- `size`: Size of each chunk (must be > 0)

**Throws:** `ValidationError` if size <= 0

---

### `compact<T>(array: (T | null | undefined | false | 0 | '')[]): T[]`

Removes falsy values from an array.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
compact([1, 0, 2, false, 3, '', null]); // [1, 2, 3]
compact([true, false, 'hello', '']); // [true, 'hello']
```

---

### `distinct<T>(array: T[]): T[]`

Returns unique elements from an array.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
distinct([1, 2, 2, 3, 3, 4]); // [1, 2, 3, 4]
distinct(['a', 'b', 'a', 'c']); // ['a', 'b', 'c']
```

---

### `distinctBy<T, K>(array: T[], selector: (item: T) => K): T[]`

Returns unique elements based on a key selector function.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
distinctBy(
  [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }, { id: 1, name: 'Bob' }],
  item => item.id
); // [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
```

---

### `flatten<T>(array: (T | T[])[]): T[]`

Flattens a nested array one level deep.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
flatten([1, [2, 3], 4, [5]]); // [1, 2, 3, 4, 5]
flatten(['a', ['b', 'c'], 'd']); // ['a', 'b', 'c', 'd']
```

---

### `flattenDeep<T>(array: any[]): T[]`

Recursively flattens a nested array.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
flattenDeep([1, [2, [3, [4]]]]); // [1, 2, 3, 4]
flattenDeep([['a'], [['b', ['c']]]]); // ['a', 'b', 'c']
```

---

### `groupBy<T, K extends PropertyKey>(array: T[], selector: (item: T) => K): Record<K, T[]>`

Groups array elements by a key selector function.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
groupBy(
  [{ type: 'fruit', name: 'apple' }, { type: 'vegetable', name: 'carrot' }],
  item => item.type
);
// { fruit: [{ type: 'fruit', name: 'apple' }], vegetable: [{ type: 'vegetable', name: 'carrot' }] }
```

---

### `partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]]`

Splits an array into two groups based on a predicate.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
partition([1, 2, 3, 4, 5], x => x % 2 === 0); // [[2, 4], [1, 3, 5]]
partition(['apple', 'banana', 'cherry'], s => s.length > 5); // [['banana', 'cherry'], ['apple']]
```

---

### `shuffle<T>(array: T[]): T[]`

Randomly shuffles array elements using Fisher-Yates algorithm.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
shuffle([1, 2, 3, 4, 5]); // [3, 1, 5, 2, 4] (random order)
shuffle(['a', 'b', 'c']); // ['c', 'a', 'b'] (random order)
```

---

### `take<T>(array: T[], count: number): T[]`

Takes the first n elements from an array.

**Time Complexity:** O(count)  
**Space Complexity:** O(count)

```typescript
take([1, 2, 3, 4, 5], 3); // [1, 2, 3]
take(['a', 'b', 'c', 'd'], 2); // ['a', 'b']
```

---

### `takeWhile<T>(array: T[], predicate: (item: T) => boolean): T[]`

Takes elements from the start while predicate is true.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
takeWhile([1, 2, 3, 4, 1, 2], x => x < 4); // [1, 2, 3]
takeWhile(['a', 'ab', 'abc', 'a'], s => s.length <= 2); // ['a', 'ab']
```

---

### `drop<T>(array: T[], count: number): T[]`

Drops the first n elements from an array.

**Time Complexity:** O(n - count)  
**Space Complexity:** O(n - count)

```typescript
drop([1, 2, 3, 4, 5], 2); // [3, 4, 5]
drop(['a', 'b', 'c', 'd'], 1); // ['b', 'c', 'd']
```

---

### `dropWhile<T>(array: T[], predicate: (item: T) => boolean): T[]`

Drops elements from the start while predicate is true.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
dropWhile([1, 2, 3, 4, 1, 2], x => x < 4); // [4, 1, 2]
dropWhile(['a', 'ab', 'abc', 'abcd'], s => s.length < 4); // ['abcd']
```

---

### `zip<T, U>(array1: T[], array2: U[]): Array<[T, U]>`

Combines two arrays element-wise into pairs.

**Time Complexity:** O(min(n, m))  
**Space Complexity:** O(min(n, m))

```typescript
zip([1, 2, 3], ['a', 'b', 'c']); // [[1, 'a'], [2, 'b'], [3, 'c']]
zip([1, 2, 3], ['a', 'b']); // [[1, 'a'], [2, 'b']]
```

---

### `unzip<T, U>(pairs: Array<[T, U]>): [T[], U[]]`

Splits an array of pairs into two separate arrays.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
unzip([[1, 'a'], [2, 'b'], [3, 'c']]); // [[1, 2, 3], ['a', 'b', 'c']]
```

---

### `sortBy<T, K>(array: T[], selector: (item: T) => K): T[]`

Sorts an array by a key selector function.

**Time Complexity:** O(n log n)  
**Space Complexity:** O(n)

```typescript
sortBy([{ age: 30 }, { age: 20 }, { age: 25 }], person => person.age);
// [{ age: 20 }, { age: 25 }, { age: 30 }]
```

---

### `reverse<T>(array: T[]): T[]`

Returns a new array with elements in reverse order.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
reverse([1, 2, 3, 4]); // [4, 3, 2, 1]
reverse(['a', 'b', 'c']); // ['c', 'b', 'a']
```

---

### `first<T>(array: T[]): T | undefined`

Returns the first element of an array.

**Time Complexity:** O(1)  
**Space Complexity:** O(1)

```typescript
first([1, 2, 3]); // 1
first([]); // undefined
```

---

### `last<T>(array: T[]): T | undefined`

Returns the last element of an array.

**Time Complexity:** O(1)  
**Space Complexity:** O(1)

```typescript
last([1, 2, 3]); // 3
last([]); // undefined
```

---

### `nth<T>(array: T[], index: number): T | undefined`

Returns the element at the specified index (supports negative indexing).

**Time Complexity:** O(1)  
**Space Complexity:** O(1)

```typescript
nth([1, 2, 3, 4], 1); // 2
nth([1, 2, 3, 4], -1); // 4
nth([1, 2, 3], 10); // undefined
```

---

### `range(start: number, end: number, step: number = 1): number[]`

Generates an array of numbers within a range.

**Time Complexity:** O((end - start) / step)  
**Space Complexity:** O((end - start) / step)

```typescript
range(1, 5); // [1, 2, 3, 4]
range(0, 10, 2); // [0, 2, 4, 6, 8]
range(5, 1, -1); // [5, 4, 3, 2]
```

---

### `permutations<T>(array: T[]): T[][]`

Generates all permutations of an array.

**Time Complexity:** O(n!)  
**Space Complexity:** O(n!)

```typescript
permutations([1, 2, 3]); 
// [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
```

⚠️ **Warning:** Exponential complexity - use with small arrays only

---

### `combinations<T>(array: T[], k: number): T[][]`

Generates all k-combinations of an array.

**Time Complexity:** O(C(n,k))  
**Space Complexity:** O(C(n,k))

```typescript
combinations([1, 2, 3, 4], 2); // [[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]
combinations(['a', 'b', 'c'], 1); // [['a'], ['b'], ['c']]
```

---

## Object Operations

### `pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>`

Creates an object with only the specified keys.

**Time Complexity:** O(k) where k is number of keys  
**Space Complexity:** O(k)

```typescript
pick({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'c']); // { a: 1, c: 3 }
pick({ name: 'John', age: 30, city: 'NYC' }, ['name', 'age']); 
// { name: 'John', age: 30 }
```

---

### `omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>`

Creates an object without the specified keys.

**Time Complexity:** O(n) where n is number of object properties  
**Space Complexity:** O(n - k) where k is number of omitted keys

```typescript
omit({ a: 1, b: 2, c: 3, d: 4 }, ['b', 'd']); // { a: 1, c: 3 }
omit({ name: 'John', age: 30, password: 'secret' }, ['password']); 
// { name: 'John', age: 30 }
```

---

### `merge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T`

Shallow merges multiple objects.

**Time Complexity:** O(k) where k is total number of properties  
**Space Complexity:** O(k)

```typescript
merge({ a: 1, b: 2 }, { b: 3, c: 4 }, { d: 5 }); 
// { a: 1, b: 3, c: 4, d: 5 }
```

---

### `deepMerge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T`

Deep merges multiple objects recursively.

**Time Complexity:** O(n) where n is total number of nested properties  
**Space Complexity:** O(n)

```typescript
deepMerge(
  { a: { x: 1, y: 2 }, b: 3 },
  { a: { y: 3, z: 4 }, c: 5 }
);
// { a: { x: 1, y: 3, z: 4 }, b: 3, c: 5 }
```

---

### `clone<T>(obj: T): T`

Creates a shallow copy of an object.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
const original = { a: 1, b: { c: 2 } };
const copy = clone(original);
copy.a = 10; // original.a is still 1
```

---

### `deepClone<T>(obj: T): T`

Creates a deep copy of an object.

**Time Complexity:** O(n) where n is total nested properties  
**Space Complexity:** O(n)

```typescript
const original = { a: 1, b: { c: 2 } };
const copy = deepClone(original);
copy.b.c = 10; // original.b.c is still 2
```

---

### `invert<T extends Record<PropertyKey, PropertyKey>>(obj: T): Record<T[keyof T], keyof T>`

Swaps object keys and values.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
invert({ a: 'x', b: 'y', c: 'z' }); // { x: 'a', y: 'b', z: 'c' }
invert({ 1: 'one', 2: 'two' }); // { one: '1', two: '2' }
```

---

### `keys<T extends Record<PropertyKey, any>>(obj: T): Array<keyof T>`

Returns an array of object keys with proper typing.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
keys({ a: 1, b: 2, c: 3 }); // ['a', 'b', 'c']
```

---

### `values<T extends Record<PropertyKey, any>>(obj: T): Array<T[keyof T]>`

Returns an array of object values with proper typing.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
values({ a: 1, b: 2, c: 3 }); // [1, 2, 3]
```

---

### `entries<T extends Record<PropertyKey, any>>(obj: T): Array<[keyof T, T[keyof T]]>`

Returns an array of [key, value] pairs with proper typing.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
entries({ a: 1, b: 2 }); // [['a', 1], ['b', 2]]
```

---

### `fromEntries<K extends PropertyKey, V>(entries: Array<[K, V]>): Record<K, V>`

Creates an object from [key, value] pairs.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
fromEntries([['a', 1], ['b', 2], ['c', 3]]); // { a: 1, b: 2, c: 3 }
```

---

### `mapKeys<T extends Record<PropertyKey, any>, K extends PropertyKey>(obj: T, mapper: (key: keyof T, value: T[keyof T]) => K): Record<K, T[keyof T]>`

Transforms object keys using a mapper function.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
mapKeys({ a: 1, b: 2 }, key => key.toUpperCase()); // { A: 1, B: 2 }
```

---

### `mapValues<T extends Record<PropertyKey, any>, V>(obj: T, mapper: (value: T[keyof T], key: keyof T) => V): Record<keyof T, V>`

Transforms object values using a mapper function.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
mapValues({ a: 1, b: 2, c: 3 }, value => value * 2); // { a: 2, b: 4, c: 6 }
```

---

### `has<T extends Record<PropertyKey, any>>(obj: T, key: PropertyKey): key is keyof T`

Type-safe property existence check.

**Time Complexity:** O(1)  
**Space Complexity:** O(1)

```typescript
const obj = { a: 1, b: 2 };
has(obj, 'a'); // true (type-safe)
has(obj, 'c'); // false
```

---

### `isEmpty(value: any): boolean`

Checks if a value is empty (null, undefined, empty object/array/string).

**Time Complexity:** O(1) for most types, O(n) for objects  
**Space Complexity:** O(1)

```typescript
isEmpty(null); // true
isEmpty({}); // true
isEmpty([]); // true
isEmpty(''); // true
isEmpty({ a: 1 }); // false
```

---

## Set Operations

### `setUnion<T>(setA: Set<T>, setB: Set<T>): Set<T>`

Returns the union of two sets.

**Time Complexity:** O(n + m)  
**Space Complexity:** O(n + m)

```typescript
setUnion(new Set([1, 2, 3]), new Set([3, 4, 5])); // Set([1, 2, 3, 4, 5])
```

---

### `setIntersection<T>(setA: Set<T>, setB: Set<T>): Set<T>`

Returns the intersection of two sets.

**Time Complexity:** O(min(n, m))  
**Space Complexity:** O(min(n, m))

```typescript
setIntersection(new Set([1, 2, 3]), new Set([2, 3, 4])); // Set([2, 3])
```

---

### `setDifference<T>(setA: Set<T>, setB: Set<T>): Set<T>`

Returns elements in setA but not in setB.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
setDifference(new Set([1, 2, 3]), new Set([2, 3, 4])); // Set([1])
```

---

### `setSymmetricDifference<T>(setA: Set<T>, setB: Set<T>): Set<T>`

Returns elements in either set but not in both.

**Time Complexity:** O(n + m)  
**Space Complexity:** O(n + m)

```typescript
setSymmetricDifference(new Set([1, 2, 3]), new Set([3, 4, 5])); 
// Set([1, 2, 4, 5])
```

---

### `isSubset<T>(subset: Set<T>, superset: Set<T>): boolean`

Checks if one set is a subset of another.

**Time Complexity:** O(n) where n is size of subset  
**Space Complexity:** O(1)

```typescript
isSubset(new Set([1, 2]), new Set([1, 2, 3, 4])); // true
isSubset(new Set([1, 5]), new Set([1, 2, 3, 4])); // false
```

---

### `isSuperset<T>(superset: Set<T>, subset: Set<T>): boolean`

Checks if one set is a superset of another.

**Time Complexity:** O(n) where n is size of subset  
**Space Complexity:** O(1)

```typescript
isSuperset(new Set([1, 2, 3, 4]), new Set([1, 2])); // true
isSuperset(new Set([1, 2, 3]), new Set([1, 5])); // false
```

---

### `isDisjoint<T>(setA: Set<T>, setB: Set<T>): boolean`

Checks if two sets have no elements in common.

**Time Complexity:** O(min(n, m))  
**Space Complexity:** O(1)

```typescript
isDisjoint(new Set([1, 2]), new Set([3, 4])); // true
isDisjoint(new Set([1, 2]), new Set([2, 3])); // false
```

---

## String Operations

### `camelCase(str: string): string`

Converts string to camelCase.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
camelCase('hello world'); // 'helloWorld'
camelCase('hello-world'); // 'helloWorld'
camelCase('hello_world'); // 'helloWorld'
```

---

### `snakeCase(str: string): string`

Converts string to snake_case.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
snakeCase('helloWorld'); // 'hello_world'
snakeCase('Hello World'); // 'hello_world'
snakeCase('hello-world'); // 'hello_world'
```

---

### `kebabCase(str: string): string`

Converts string to kebab-case.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
kebabCase('helloWorld'); // 'hello-world'
kebabCase('Hello World'); // 'hello-world'
kebabCase('hello_world'); // 'hello-world'
```

---

### `pascalCase(str: string): string`

Converts string to PascalCase.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
pascalCase('hello world'); // 'HelloWorld'
pascalCase('hello-world'); // 'HelloWorld'
pascalCase('hello_world'); // 'HelloWorld'
```

---

### `capitalize(str: string): string`

Capitalizes the first letter of a string.

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
capitalize('hello world'); // 'Hello world'
capitalize('HELLO'); // 'Hello'
```

---

### `truncate(str: string, length: number, suffix: string = '...'): string`

Truncates string to specified length with optional suffix.

**Time Complexity:** O(length)  
**Space Complexity:** O(length)

```typescript
truncate('Hello World', 8); // 'Hello...'
truncate('Hello World', 8, '***'); // 'Hello***'
truncate('Short', 10); // 'Short'
```

---

## Functional Programming

### `compose<T>(...fns: Array<(arg: any) => any>): (arg: T) => any`

Composes functions from right to left.

**Time Complexity:** O(1) to create, O(k) to execute where k is number of functions  
**Space Complexity:** O(1)

```typescript
const addOne = (x: number) => x + 1;
const double = (x: number) => x * 2;
const composed = compose(double, addOne);
composed(3); // 8 (addOne(3) = 4, then double(4) = 8)
```

---

### `pipe<T>(...fns: Array<(arg: any) => any>): (arg: T) => any`

Composes functions from left to right.

**Time Complexity:** O(1) to create, O(k) to execute where k is number of functions  
**Space Complexity:** O(1)

```typescript
const addOne = (x: number) => x + 1;
const double = (x: number) => x * 2;
const piped = pipe(addOne, double);
piped(3); // 8 (addOne(3) = 4, then double(4) = 8)
```

---

### `curry<T extends any[], R>(fn: (...args: T) => R): Curried<T, R>`

Converts a function to accept arguments one at a time.

**Time Complexity:** O(1) per partial application  
**Space Complexity:** O(k) where k is number of arguments

```typescript
const add = (a: number, b: number, c: number) => a + b + c;
const curried = curry(add);
curried(1)(2)(3); // 6
curried(1, 2)(3); // 6
curried(1)(2, 3); // 6
```

---

### `partial<T extends any[], R>(fn: (...args: T) => R, ...partialArgs: Partial<T>): (...remainingArgs: any[]) => R`

Partially applies arguments to a function.

**Time Complexity:** O(1)  
**Space Complexity:** O(k) where k is number of partial arguments

```typescript
const multiply = (a: number, b: number, c: number) => a * b * c;
const double = partial(multiply, 2);
double(3, 4); // 24 (2 * 3 * 4)
```

---

### `memoize<T extends any[], R>(fn: (...args: T) => R): (...args: T) => R`

Caches function results based on arguments.

**Time Complexity:** O(1) for cache hits, original function complexity for misses  
**Space Complexity:** O(k) where k is number of unique argument sets

```typescript
const fibonacci = memoize((n: number): number => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});
fibonacci(40); // Computed once and cached
```

---

### `debounce<T extends any[]>(fn: (...args: T) => void, delay: number): (...args: T) => void`

Delays function execution until after delay milliseconds of inactivity.

**Time Complexity:** O(1)  
**Space Complexity:** O(1)

```typescript
const debouncedSave = debounce((data: string) => {
  console.log('Saving:', data);
}, 300);

debouncedSave('hello'); // Will only execute if no more calls for 300ms
```

---

### `throttle<T extends any[]>(fn: (...args: T) => void, limit: number): (...args: T) => void`

Limits function execution to once per limit milliseconds.

**Time Complexity:** O(1)  
**Space Complexity:** O(1)

```typescript
const throttledUpdate = throttle((data: string) => {
  console.log('Updating:', data);
}, 100);

// Will execute at most once every 100ms
throttledUpdate('data');
```

---

### `once<T extends any[], R>(fn: (...args: T) => R): (...args: T) => R | undefined`

Ensures a function is called only once.

**Time Complexity:** O(1)  
**Space Complexity:** O(1)

```typescript
const initialize = once(() => {
  console.log('Initializing...');
  return 'initialized';
});

initialize(); // 'initialized' (logs message)
initialize(); // undefined (no log)
```

---

### `identity<T>(value: T): T`

Returns the input value unchanged.

**Time Complexity:** O(1)  
**Space Complexity:** O(1)

```typescript
identity(5); // 5
identity('hello'); // 'hello'
```

---

### `noop(): void`

A no-operation function that does nothing.

**Time Complexity:** O(1)  
**Space Complexity:** O(1)

```typescript
noop(); // Does nothing
```

---

## Async Operations

### `parallel<T>(tasks: Array<() => Promise<T>>, concurrency?: number): Promise<T[]>`

Executes async tasks in parallel with optional concurrency limit.

**Time Complexity:** O(max task time) with unlimited concurrency  
**Space Complexity:** O(n) where n is number of tasks

```typescript
const tasks = [
  () => fetch('/api/users'),
  () => fetch('/api/posts'),
  () => fetch('/api/comments')
];

// Execute all at once
const results = await parallel(tasks);

// Execute with concurrency limit of 2
const limited = await parallel(tasks, 2);
```

---

### `series<T>(tasks: Array<() => Promise<T>>): Promise<T[]>`

Executes async tasks sequentially.

**Time Complexity:** O(sum of all task times)  
**Space Complexity:** O(n) where n is number of tasks

```typescript
const tasks = [
  () => processStep1(),
  () => processStep2(),
  () => processStep3()
];

const results = await series(tasks); // Execute one after another
```

---

### `asyncMap<T, U>(array: T[], mapper: (item: T) => Promise<U>): Promise<U[]>`

Maps over an array with async transformation.

**Time Complexity:** O(max mapper time) - all run in parallel  
**Space Complexity:** O(n)

```typescript
const users = [1, 2, 3];
const userDetails = await asyncMap(users, async id => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
});
```

---

### `asyncFilter<T>(array: T[], predicate: (item: T) => Promise<boolean>): Promise<T[]>`

Filters an array with async predicate.

**Time Complexity:** O(max predicate time) - all run in parallel  
**Space Complexity:** O(n)

```typescript
const files = ['file1.txt', 'file2.txt', 'file3.txt'];
const existingFiles = await asyncFilter(files, async filename => {
  return fs.promises.access(filename).then(() => true).catch(() => false);
});
```

---

### `asyncReduce<T, R>(array: T[], reducer: (acc: R, item: T) => Promise<R>, initialValue: R): Promise<R>`

Reduces an array with async accumulator (sequential).

**Time Complexity:** O(sum of all reducer times)  
**Space Complexity:** O(1)

```typescript
const numbers = [1, 2, 3, 4];
const sum = await asyncReduce(numbers, async (acc, num) => {
  await delay(10); // Simulate async work
  return acc + num;
}, 0); // Result: 10
```

---

### `delay(ms: number): Promise<void>`

Creates a promise that resolves after specified milliseconds.

**Time Complexity:** O(1)  
**Space Complexity:** O(1)

```typescript
await delay(1000); // Wait 1 second
console.log('1 second has passed');
```

---

### `timeout<T>(promise: Promise<T>, ms: number): Promise<T>`

Adds timeout to a promise.

**Time Complexity:** O(1)  
**Space Complexity:** O(1)

```typescript
try {
  const result = await timeout(fetch('/api/data'), 5000);
  console.log(result);
} catch (error) {
  console.log('Request timed out after 5 seconds');
}
```

---

### `retry<T>(fn: () => Promise<T>, maxAttempts: number = 3, delayMs: number = 1000): Promise<T>`

Retries an async function with exponential backoff.

**Time Complexity:** O(max attempts * function time)  
**Space Complexity:** O(1)

```typescript
const unreliableApi = () => fetch('/api/unreliable');
const result = await retry(unreliableApi, 3, 500);
// Will retry up to 3 times with 500ms, 1000ms, 2000ms delays
```

---

## Math Utilities

### `sum(numbers: number[]): number`

Calculates the sum of an array of numbers.

**Time Complexity:** O(n)  
**Space Complexity:** O(1)

```typescript
sum([1, 2, 3, 4, 5]); // 15
sum([]); // 0
```

---

### `average(numbers: number[]): number`

Calculates the average of an array of numbers.

**Time Complexity:** O(n)  
**Space Complexity:** O(1)

```typescript
average([1, 2, 3, 4, 5]); // 3
average([10, 20]); // 15
```

**Throws:** `ValidationError` if array is empty

---

### `min(numbers: number[]): number`

Finds the minimum value in an array.

**Time Complexity:** O(n)  
**Space Complexity:** O(1)

```typescript
min([3, 1, 4, 1, 5]); // 1
min([-1, -5, -2]); // -5
```

**Throws:** `ValidationError` if array is empty

---

### `max(numbers: number[]): number`

Finds the maximum value in an array.

**Time Complexity:** O(n)  
**Space Complexity:** O(1)

```typescript
max([3, 1, 4, 1, 5]); // 5
max([-1, -5, -2]); // -1
```

**Throws:** `ValidationError` if array is empty

---

### `median(numbers: number[]): number`

Calculates the median of an array of numbers.

**Time Complexity:** O(n log n) due to sorting  
**Space Complexity:** O(n)

```typescript
median([1, 2, 3, 4, 5]); // 3
median([1, 2, 3, 4]); // 2.5 (average of 2 and 3)
```

**Throws:** `ValidationError` if array is empty

---

### `mode(numbers: number[]): number[]`

Finds the most frequently occurring value(s).

**Time Complexity:** O(n)  
**Space Complexity:** O(n)

```typescript
mode([1, 2, 2, 3, 3, 3]); // [3]
mode([1, 1, 2, 2, 3]); // [1, 2] (both appear twice)
```

**Throws:** `ValidationError` if array is empty

---

### `clamp(value: number, min: number, max: number): number`

Clamps a number within the given range.

**Time Complexity:** O(1)  
**Space Complexity:** O(1)

```typescript
clamp(5, 1, 10); // 5
clamp(-5, 1, 10); // 1
clamp(15, 1, 10); // 10
```

---

### `gcd(a: number, b: number): number`

Calculates the greatest common divisor using Euclidean algorithm.

**Time Complexity:** O(log(min(a, b)))  
**Space Complexity:** O(1)

```typescript
gcd(48, 18); // 6
gcd(7, 5); // 1
```

---

### `lcm(a: number, b: number): number`

Calculates the least common multiple.

**Time Complexity:** O(log(min(a, b)))  
**Space Complexity:** O(1)

```typescript
lcm(4, 6); // 12
lcm(3, 5); // 15
```

---

### `factorial(n: number): number`

Calculates the factorial of a number.

**Time Complexity:** O(n)  
**Space Complexity:** O(1)

```typescript
factorial(5); // 120
factorial(0); // 1
```

**Throws:** `ValidationError` if n < 0 or not an integer

---

### `isPrime(n: number): boolean`

Checks if a number is prime.

**Time Complexity:** O(√n)  
**Space Complexity:** O(1)

```typescript
isPrime(17); // true
isPrime(18); // false
isPrime(2); // true
```

---

### `fibonacci(n: number): number`

Calculates the nth Fibonacci number using iterative approach.

**Time Complexity:** O(n)  
**Space Complexity:** O(1)

```typescript
fibonacci(10); // 55
fibonacci(0); // 0
fibonacci(1); // 1
```

---

## Type Guards

### `isArray(value: any): value is any[]`

Type-safe array check.

```typescript
if (isArray(value)) {
  // TypeScript knows value is any[]
  console.log(value.length);
}
```

---

### `isObject(value: any): value is Record<string, any>`

Type-safe object check (excludes null and arrays).

```typescript
if (isObject(value)) {
  // TypeScript knows value is Record<string, any>
  console.log(Object.keys(value));
}
```

---

### `isString(value: any): value is string`

Type-safe string check.

```typescript
if (isString(value)) {
  // TypeScript knows value is string
  console.log(value.length);
}
```

---

### `isNumber(value: any): value is number`

Type-safe number check (excludes NaN).

```typescript
if (isNumber(value)) {
  // TypeScript knows value is number
  console.log(value.toFixed(2));
}
```

---

### `isBoolean(value: any): value is boolean`

Type-safe boolean check.

```typescript
if (isBoolean(value)) {
  // TypeScript knows value is boolean
  console.log(value ? 'true' : 'false');
}
```

---

### `isFunction(value: any): value is Function`

Type-safe function check.

```typescript
if (isFunction(value)) {
  // TypeScript knows value is Function
  value();
}
```

---

### `isNull(value: any): value is null`

Type-safe null check.

```typescript
if (isNull(value)) {
  // TypeScript knows value is null
  console.log('Value is null');
}
```

---

### `isUndefined(value: any): value is undefined`

Type-safe undefined check.

```typescript
if (isUndefined(value)) {
  // TypeScript knows value is undefined
  console.log('Value is undefined');
}
```

---

### `isDate(value: any): value is Date`

Type-safe Date check.

```typescript
if (isDate(value)) {
  // TypeScript knows value is Date
  console.log(value.getFullYear());
}
```

---

### `isRegExp(value: any): value is RegExp`

Type-safe RegExp check.

```typescript
if (isRegExp(value)) {
  // TypeScript knows value is RegExp
  console.log(value.test('string'));
}
```

---

## Comparison Functions

### `equals(a: any, b: any): boolean`

Deep equality comparison.

**Time Complexity:** O(n) where n is total number of properties  
**Space Complexity:** O(d) where d is max depth (call stack)

```typescript
equals({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }); // true
equals([1, 2, 3], [1, 2, 3]); // true
equals(null, undefined); // false
```

---

### `isEqual<T>(a: T, b: T): boolean`

Type-safe equality comparison (alias for equals).

```typescript
isEqual([1, 2], [1, 2]); // true
isEqual('hello', 'hello'); // true
```

---

### `compare<T>(a: T, b: T): number`

Generic comparison function returning -1, 0, or 1.

**Time Complexity:** O(1) for primitives, O(n) for objects  
**Space Complexity:** O(1)

```typescript
compare(1, 2); // -1
compare(2, 1); // 1
compare(1, 1); // 0
compare('a', 'b'); // -1
```

---

## Tree Operations

### `TreeNode<T>` Interface

```typescript
interface TreeNode<T> {
  value: T;
  children?: TreeNode<T>[];
}
```

### `traverseDepthFirst<T>(node: TreeNode<T>, callback: (value: T) => void): void`

Traverses a tree depth-first (pre-order).

**Time Complexity:** O(n) where n is number of nodes  
**Space Complexity:** O(h) where h is tree height

```typescript
const tree = {
  value: 1,
  children: [
    { value: 2, children: [{ value: 4 }, { value: 5 }] },
    { value: 3 }
  ]
};

traverseDepthFirst(tree, value => console.log(value));
// Output: 1, 2, 4, 5, 3
```

---

### `traverseBreadthFirst<T>(node: TreeNode<T>, callback: (value: T) => void): void`

Traverses a tree breadth-first (level-order).

**Time Complexity:** O(n) where n is number of nodes  
**Space Complexity:** O(w) where w is maximum width

```typescript
const tree = {
  value: 1,
  children: [
    { value: 2, children: [{ value: 4 }, { value: 5 }] },
    { value: 3 }
  ]
};

traverseBreadthFirst(tree, value => console.log(value));
// Output: 1, 2, 3, 4, 5
```

---

### `findInTree<T>(node: TreeNode<T>, predicate: (value: T) => boolean): TreeNode<T> | null`

Finds the first node matching a predicate.

**Time Complexity:** O(n) worst case  
**Space Complexity:** O(h) where h is tree height

```typescript
const foundNode = findInTree(tree, value => value === 4);
// Returns: { value: 4 }
```

---

### `mapTree<T, U>(node: TreeNode<T>, mapper: (value: T) => U): TreeNode<U>`

Transforms all values in a tree.

**Time Complexity:** O(n) where n is number of nodes  
**Space Complexity:** O(n) for new tree

```typescript
const doubledTree = mapTree(tree, value => value * 2);
// All values in the tree are doubled
```

---

### `filterTree<T>(node: TreeNode<T>, predicate: (value: T) => boolean): TreeNode<T> | null`

Filters tree nodes based on predicate.

**Time Complexity:** O(n) where n is number of nodes  
**Space Complexity:** O(n) for filtered tree

```typescript
const evenNodes = filterTree(tree, value => value % 2 === 0);
// Only keeps nodes with even values
```

---

## Plugin System

### `PluginSystem` Class

Main plugin management system.

```typescript
const pluginSystem = new PluginSystem();
```

#### Methods

##### `install(plugin: Plugin): void`

Installs a plugin into the system.

```typescript
const mathPlugin = createPlugin('math', '1.0.0')
  .install(system => {
    system.registerFunction('add', (a, b) => a + b);
    system.registerFunction('multiply', (a, b) => a * b);
  });

pluginSystem.install(mathPlugin);
```

##### `uninstall(name: string): void`

Uninstalls a plugin by name.

```typescript
pluginSystem.uninstall('math');
```

##### `call(functionName: string, ...args: any[]): any`

Calls a plugin function.

```typescript
const result = pluginSystem.call('add', 2, 3); // 5
```

##### `getFunction(functionName: string): Function | null`

Gets a plugin function directly.

```typescript
const addFn = pluginSystem.getFunction('add');
if (addFn) {
  const result = addFn(2, 3);
}
```

##### `hasPlugin(name: string): boolean`

Checks if a plugin is installed.

```typescript
if (pluginSystem.hasPlugin('math')) {
  // Math plugin is available
}
```

##### `listPlugins(): string[]`

Lists all installed plugin names.

```typescript
const plugins = pluginSystem.listPlugins(); // ['math', 'validation']
```

##### `on(event: string, listener: (...args: any[]) => void): void`

Adds event listener.

```typescript
pluginSystem.on('pluginInstalled', (name) => {
  console.log(`Plugin ${name} installed`);
});
```

---

### `createPlugin(name: string, version: string): PluginBuilder`

Creates a new plugin builder.

```typescript
const plugin = createPlugin('myPlugin', '1.0.0')
  .author('John Doe')
  .description('My awesome plugin')
  .install(system => {
    system.registerFunction('greet', name => `Hello, ${name}!`);
  });
```

#### Plugin Builder Methods

##### `author(name: string): PluginBuilder`

Sets plugin author.

##### `description(desc: string): PluginBuilder`

Sets plugin description.

##### `dependencies(deps: string[]): PluginBuilder`

Sets plugin dependencies.

##### `install(installer: (system: PluginSystem) => void): Plugin`

Sets installation function and creates the plugin.

---

## Error Classes

### `ValidationError extends Error`

Thrown when validation fails.

```typescript
throw new ValidationError('Array cannot be empty');
```

### `PluginError extends Error`

Thrown for plugin-related errors.

```typescript
throw new PluginError('Plugin not found: math');
```

### `TreeError extends Error`

Thrown for tree operation errors.

```typescript
throw new TreeError('Invalid tree structure');
```

---

## Performance Notes

### Time Complexity Legend
- **O(1)**: Constant time
- **O(log n)**: Logarithmic time
- **O(n)**: Linear time
- **O(n log n)**: Linearithmic time
- **O(n²)**: Quadratic time
- **O(2^n)**: Exponential time
- **O(n!)**: Factorial time

### Performance Tips

1. **Use appropriate data structures**: Sets for uniqueness, Maps for key-value lookups
2. **Consider algorithmic complexity**: Avoid O(n²) operations on large datasets
3. **Leverage memoization**: Cache expensive computations
4. **Use tree shaking**: Import only what you need
5. **Profile your code**: Use the provided benchmarking utilities

### Memory Considerations

- Most functions create new data structures rather than mutating inputs
- Use `chunk` for processing large datasets in batches
- Consider streaming operations for very large data
- Clean up memoization caches in long-running applications

---

## TypeScript Support

All functions include comprehensive TypeScript definitions with:
- Generic type parameters where appropriate
- Strict null checking compatibility
- Proper return type inference
- Type guards for runtime type checking
- Utility types for complex transformations

---

## Examples and Patterns

### Common Patterns

```typescript
import { pipe, map, filter, sortBy, chunk } from '@oxog/collections';

// Functional pipeline
const processUsers = pipe(
  (users: User[]) => filter(users, user => user.active),
  (users: User[]) => sortBy(users, user => user.name),
  (users: User[]) => chunk(users, 10)
);

// Async processing with error handling
const fetchUserData = async (ids: number[]) => {
  try {
    return await asyncMap(ids, async id => {
      const user = await timeout(fetchUser(id), 5000);
      return user;
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
};

// Plugin-based architecture
const dataProcessor = new PluginSystem();
dataProcessor.install(validationPlugin);
dataProcessor.install(transformationPlugin);

const processData = (data: any) => {
  const validated = dataProcessor.call('validate', data);
  return dataProcessor.call('transform', validated);
};
```

For more examples and advanced usage patterns, see the [examples](./examples/) directory and [Performance Guide](./docs/PERFORMANCE_GUIDE.md).