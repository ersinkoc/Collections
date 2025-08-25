import { get } from '../../core/object/get';
import { ValidationError } from '../../utils/errors';

describe('get', () => {
  const testObj = {
    a: {
      b: {
        c: 3,
        d: null,
        e: undefined
      },
      f: [1, 2, { g: 'nested' }]
    },
    h: 'root level'
  };

  it('should get value using dot notation string path', () => {
    expect(get(testObj, 'a.b.c')).toBe(3);
    expect(get(testObj, 'h')).toBe('root level');
    expect(get(testObj, 'a.b.d')).toBe(null);
  });

  it('should get value using array path', () => {
    expect(get(testObj, ['a', 'b', 'c'])).toBe(3);
    expect(get(testObj, ['h'])).toBe('root level');
    expect(get(testObj, ['a', 'b', 'd'])).toBe(null);
  });

  it('should get value from array using numeric index', () => {
    expect(get(testObj, 'a.f.0')).toBe(1);
    expect(get(testObj, 'a.f.2.g')).toBe('nested');
    expect(get(testObj, ['a', 'f', 1])).toBe(2);
    expect(get(testObj, ['a', 'f', 2, 'g'])).toBe('nested');
  });

  it('should return undefined for non-existent paths', () => {
    expect(get(testObj, 'a.b.x')).toBe(undefined);
    expect(get(testObj, 'x.y.z')).toBe(undefined);
    expect(get(testObj, 'a.f.10')).toBe(undefined);
  });

  it('should return default value for non-existent paths', () => {
    expect(get(testObj, 'a.b.x', 'default')).toBe('default');
    expect(get(testObj, 'x.y.z', null)).toBe(null);
    expect(get(testObj, 'a.f.10', 0)).toBe(0);
  });

  it('should return undefined (not default) for existing undefined values', () => {
    expect(get(testObj, 'a.b.e')).toBe(undefined);
    expect(get(testObj, 'a.b.e', 'default')).toBe('default');
  });

  it('should handle null and undefined objects', () => {
    expect(get(null, 'a.b.c', 'default')).toBe('default');
    expect(get(undefined, 'a.b.c', 'default')).toBe('default');
  });

  it('should handle empty string path', () => {
    expect(get(testObj, '', 'default')).toBe('default');
  });

  it('should handle empty array path', () => {
    expect(get(testObj, [], 'default')).toBe(testObj);
  });

  it('should handle paths that traverse through non-objects', () => {
    expect(get(testObj, 'h.nonexistent', 'default')).toBe('default');
    expect(get(testObj, 'a.b.c.nonexistent', 'default')).toBe('default');
  });

  it('should work with arrays at root level', () => {
    const arr = [{ name: 'John' }, { name: 'Jane' }];
    expect(get(arr, '0.name')).toBe('John');
    expect(get(arr, [1, 'name'])).toBe('Jane');
    expect(get(arr, '2.name', 'default')).toBe('default');
  });

  it('should handle mixed numeric and string keys', () => {
    const mixedObj = {
      '0': 'zero',
      // 0: 'numeric zero', // Commented out to avoid duplicate key
      a: { '1': 'string one' /* 1: 'numeric one' */ }
    };
    
    expect(get(mixedObj, '0')).toBe('zero'); // String key access
    expect(get(mixedObj, 'a.1')).toBe('string one'); // String key access
  });

  it('should handle deep nesting', () => {
    const deep = { a: { b: { c: { d: { e: { f: 'deep' } } } } } };
    expect(get(deep, 'a.b.c.d.e.f')).toBe('deep');
    expect(get(deep, ['a', 'b', 'c', 'd', 'e', 'f'])).toBe('deep');
    expect(get(deep, 'a.b.c.d.e.f.g', 'default')).toBe('default');
  });

  it('should work with complex values', () => {
    const complex = {
      fn: () => 'function',
      date: new Date('2023-01-01'),
      regex: /test/,
      nested: {
        set: new Set([1, 2, 3]),
        map: new Map([['key', 'value']])
      }
    };
    
    expect(typeof get(complex, 'fn')).toBe('function');
    expect(get(complex, 'date')).toBeInstanceOf(Date);
    expect(get(complex, 'regex')).toBeInstanceOf(RegExp);
    expect(get(complex, 'nested.set')).toBeInstanceOf(Set);
    expect(get(complex, 'nested.map')).toBeInstanceOf(Map);
  });

  it('should throw ValidationError for non-object first argument', () => {
    expect(() => get('string' as any, 'path')).toThrow(ValidationError);
    expect(() => get(123 as any, 'path')).toThrow(ValidationError);
    expect(() => get(true as any, 'path')).toThrow(ValidationError);
  });

  it('should handle performance with deep paths', () => {
    const deepObj = { level1: { level2: { level3: { level4: { value: 42 } } } } };
    const start = performance.now();
    
    for (let i = 0; i < 1000; i++) {
      get(deepObj, 'level1.level2.level3.level4.value');
    }
    
    const end = performance.now();
    expect(end - start).toBeLessThan(100); // Should complete in under 100ms
  });

  it('should maintain type safety with default values', () => {
    expect(get(testObj, 'nonexistent', 'string')).toBe('string');
    expect(get(testObj, 'nonexistent', 42)).toBe(42);
    expect(get(testObj, 'nonexistent', true)).toBe(true);
    expect(get(testObj, 'nonexistent', null)).toBe(null);
  });
});