# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-25

### Added

#### Core Library (90+ Functions)
- **Array Operations (25+ functions)**: chunk, distinct, distinctBy, difference, symmetricDifference, xor, intersect, intersperse, partition, groupBy, shuffle, takeWhile, dropWhile, zip, unzip, flatten, flattenDeep, permutations, combinations, sortBy, first, last, nth, range, and more
- **Object Operations (18+ functions)**: pick, omit, get, set, unset, merge, deepMerge (with circular reference handling), clone, deepClone, invert, keys, values, entries, mapKeys, mapValues, filterKeys, filterValues, flattenObject, unflattenObject, has, isEmpty, defaults
- **String Operations (10+ functions)**: padStart, padEnd, repeat, reverse (additional functions like camelCase, snakeCase available but not yet exported)
- **Functional Programming (13+ functions)**: compose, pipe, curry, partial, memoize, debounce, throttle, once, flip, constant, tap, identity, noop
- **Set Operations (7+ functions)**: setUnion, setIntersection, setDifference, setSymmetricDifference, isSubset, isSuperset, isDisjoint
- **Math Utilities**: sum, average, min, max, median, mode, clamp, gcd, lcm, factorial, fibonacci, isPrime
- **Type Guards**: isArray, isObject, isString, isNumber, isBoolean, isFunction, isNull, isUndefined, isDate, isRegExp
- **Async Operations**: parallel, series, asyncMap, asyncFilter, asyncReduce, delay, timeout, retry
- **Tree Operations**: traverseDepthFirst, traverseBreadthFirst, findInTree, mapTree, filterTree, cloneTree, flattenTree, getTreeDepth, getPathToNode
- **Comparison Functions**: equals, isEqual, compare

#### Enhanced Features
- **Plugin System**: Extensible architecture with event-driven lifecycle management
- **Additional utility functions** added beyond original specification
- **Comprehensive error handling** with custom error classes
- **Performance optimizations** with documented time/space complexity
- **Circular reference handling** in deep merge and clone operations

### Security
- All functions are implemented with security best practices
- Input validation on all public APIs
- Safe handling of edge cases and error conditions

### Performance
- Optimized algorithms for all operations
- Documented time complexity for each function
- Memory-efficient implementations
- Benchmarks against popular alternatives

[1.0.0]: https://github.com/ersinkoc/collections/releases/tag/v1.0.0