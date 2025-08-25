import { defaults } from '../../core/object/defaults';
import { ValidationError } from '../../utils/errors';

describe('defaults', () => {
  describe('basic functionality', () => {
    it('should fill missing properties with default values', () => {
      const source = { a: 1 };
      const defaultValues = { a: 2, b: 3, c: 4 };
      const result = defaults(source, defaultValues);
      
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
      expect(result).not.toBe(source);
      expect(result).not.toBe(defaultValues);
    });

    it('should preserve existing properties in source', () => {
      const source = { name: 'John', age: 25 };
      const defaultValues = { name: 'Jane', age: 30, city: 'New York' };
      const result = defaults(source, defaultValues);
      
      expect(result).toEqual({
        name: 'John',
        age: 25,
        city: 'New York'
      });
    });

    it('should handle empty source object', () => {
      const source = {};
      const defaultValues = { a: 1, b: 2, c: 3 };
      const result = defaults(source, defaultValues);
      
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should handle empty default values', () => {
      const source = { a: 1, b: 2 };
      const defaultValues = {};
      const result = defaults(source, defaultValues);
      
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should handle both objects being empty', () => {
      const source = {};
      const defaultValues = {};
      const result = defaults(source, defaultValues);
      
      expect(result).toEqual({});
    });
  });

  describe('undefined value handling', () => {
    it('should replace undefined values with defaults', () => {
      const source = { a: 1, b: undefined, c: 3 };
      const defaultValues = { b: 'default', d: 'new' };
      const result = defaults(source, defaultValues);
      
      expect(result).toEqual({
        a: 1,
        b: 'default',
        c: 3,
        d: 'new'
      });
    });

    it('should not replace null values with defaults', () => {
      const source = { a: null, b: 0, c: false, d: '' };
      const defaultValues = { a: 'default', b: 1, c: true, d: 'text' };
      const result = defaults(source, defaultValues);
      
      expect(result).toEqual({
        a: null,
        b: 0,
        c: false,
        d: ''
      });
    });

    it('should distinguish between missing properties and undefined values', () => {
      const source = { explicit: undefined };
      const defaultValues = { explicit: 'default', missing: 'new' };
      const result = defaults(source, defaultValues);
      
      expect(result).toEqual({
        explicit: 'default',
        missing: 'new'
      });
    });
  });

  describe('different data types', () => {
    it('should handle various data types', () => {
      const source = { string: 'text' };
      const defaultValues = {
        string: 'default',
        number: 42,
        boolean: true,
        array: [1, 2, 3],
        object: { nested: 'value' },
        date: new Date('2023-01-01'),
        regex: /test/g,
        fn: () => 'function'
      };
      const result = defaults(source, defaultValues);
      
      expect(result.string).toBe('text');
      expect(result.number).toBe(42);
      expect(result.boolean).toBe(true);
      expect(result.array).toEqual([1, 2, 3]);
      expect(result.object).toEqual({ nested: 'value' });
      expect(result.date).toBeInstanceOf(Date);
      expect(result.regex).toBeInstanceOf(RegExp);
      expect(typeof result.fn).toBe('function');
    });

    it('should handle complex nested objects', () => {
      const source = { user: { name: 'John' } };
      const defaultValues = {
        user: { name: 'Default', age: 25 },
        settings: { theme: 'dark', notifications: true }
      };
      const result = defaults(source, defaultValues);
      
      expect(result).toEqual({
        user: { name: 'John' }, // Original object reference preserved
        settings: { theme: 'dark', notifications: true }
      });
      expect(result.user).toBe(source.user); // Reference equality
    });

    it('should handle special number values', () => {
      const source = { existing: 1 };
      const defaultValues = {
        existing: 999,
        nan: NaN,
        infinity: Infinity,
        negativeInfinity: -Infinity,
        zero: 0,
        negativeZero: -0
      };
      const result = defaults(source, defaultValues);
      
      expect(result.existing).toBe(1);
      expect(result.nan).toBeNaN();
      expect(result.infinity).toBe(Infinity);
      expect(result.negativeInfinity).toBe(-Infinity);
      expect(result.zero).toBe(0);
      expect(Object.is(result.negativeZero, -0)).toBe(true);
    });
  });

  describe('property enumeration', () => {
    it('should only process enumerable properties from defaults', () => {
      const source = { a: 1 };
      const defaultValues = { b: 2 };
      
      // Add non-enumerable property
      Object.defineProperty(defaultValues, 'nonEnum', {
        value: 'hidden',
        enumerable: false
      });
      
      const result = defaults(source, defaultValues);
      
      expect(result).toEqual({ a: 1, b: 2 });
      expect(result).not.toHaveProperty('nonEnum');
    });

    it('should handle inherited properties correctly', () => {
      const parent = { inherited: 'parent' };
      const defaultValues = Object.create(parent);
      defaultValues.own = 'child';
      
      const source = { existing: 'source' };
      const result = defaults(source, defaultValues);
      
      expect(result).toEqual({
        existing: 'source',
        own: 'child'
      });
      expect(result).not.toHaveProperty('inherited');
    });

    it('should handle objects with overridden hasOwnProperty', () => {
      const source = { a: 1 };
      const defaultValues = { b: 2, hasOwnProperty: 'overridden' };
      const result = defaults(source, defaultValues);
      
      expect(result).toEqual({
        a: 1,
        b: 2,
        hasOwnProperty: 'overridden'
      });
    });
  });

  describe('immutability', () => {
    it('should not modify the source object', () => {
      const source = { a: 1, b: 2 };
      const defaultValues = { b: 99, c: 3 };
      const originalSource = { ...source };
      
      const result = defaults(source, defaultValues);
      
      expect(source).toEqual(originalSource);
      expect(result).not.toBe(source);
    });

    it('should not modify the default values object', () => {
      const source = { a: 1 };
      const defaultValues = { a: 2, b: 3 };
      const originalDefaults = { ...defaultValues };
      
      const result = defaults(source, defaultValues);
      
      expect(defaultValues).toEqual(originalDefaults);
      expect(result).not.toBe(defaultValues);
    });

    it('should create shallow copies of nested objects', () => {
      const nestedObj = { nested: 'value' };
      const source = { a: 1 };
      const defaultValues = { obj: nestedObj };
      
      const result = defaults(source, defaultValues);
      
      expect(result.obj).toBe(nestedObj); // Same reference
      expect(result.obj).toEqual(nestedObj);
    });
  });

  describe('edge cases', () => {
    it('should handle numeric string keys', () => {
      const source = { '0': 'zero', a: 'letter' };
      const defaultValues = { '0': 'default', '1': 'one', b: 'beta' };
      const result = defaults(source, defaultValues);
      
      expect(result).toEqual({
        '0': 'zero',
        '1': 'one',
        a: 'letter',
        b: 'beta'
      });
    });

    it('should handle symbol keys in source (but not in defaults)', () => {
      const sym = Symbol('test');
      const source = { [sym]: 'symbol value', a: 1 };
      const defaultValues = { a: 2, b: 3 };
      
      const result = defaults(source, defaultValues);
      
      expect(result.a).toBe(1);
      expect(result.b).toBe(3);
      expect(result[sym]).toBe('symbol value');
    });

    it('should preserve property descriptors from source', () => {
      const source: any = { a: 1 };
      Object.defineProperty(source, 'readonly', {
        value: 'cannot change',
        writable: false,
        enumerable: true
      });
      
      const defaultValues = { b: 2 };
      const result = defaults(source, defaultValues);
      
      expect(result.readonly).toBe('cannot change');
      expect(result.a).toBe(1);
      expect(result.b).toBe(2);
      
      const descriptor = Object.getOwnPropertyDescriptor(result, 'readonly');
      expect(descriptor?.writable).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should throw ValidationError for non-object source', () => {
      expect(() => defaults(null as any, {})).toThrow(ValidationError);
      expect(() => defaults(undefined as any, {})).toThrow(ValidationError);
      expect(() => defaults('string' as any, {})).toThrow(ValidationError);
      expect(() => defaults(123 as any, {})).toThrow(ValidationError);
      expect(() => defaults(true as any, {})).toThrow(ValidationError);
      expect(() => defaults([] as any, {})).toThrow(ValidationError);
      expect(() => defaults(new Date() as any, {})).toThrow(ValidationError);
    });

    it('should throw ValidationError for non-object defaultValues', () => {
      expect(() => defaults({}, null as any)).toThrow(ValidationError);
      expect(() => defaults({}, undefined as any)).toThrow(ValidationError);
      expect(() => defaults({}, 'string' as any)).toThrow(ValidationError);
      expect(() => defaults({}, 123 as any)).toThrow(ValidationError);
      expect(() => defaults({}, true as any)).toThrow(ValidationError);
      expect(() => defaults({}, [] as any)).toThrow(ValidationError);
      expect(() => defaults({}, new Date() as any)).toThrow(ValidationError);
    });

    it('should provide meaningful error messages', () => {
      expect(() => defaults(null as any, {})).toThrow('Expected source to be an object, got object');
      expect(() => defaults({}, null as any)).toThrow('Expected defaultValues to be an object, got object');
    });
  });

  describe('performance', () => {
    it('should handle large objects efficiently', () => {
      const source: Record<string, number> = {};
      const defaultValues: Record<string, number> = {};
      
      // Create objects with many properties
      for (let i = 0; i < 1000; i++) {
        if (i % 2 === 0) {
          source[`key${i}`] = i;
        }
        defaultValues[`key${i}`] = i * 10;
      }
      
      const start = performance.now();
      const result = defaults(source, defaultValues);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(50); // Should complete in under 50ms
      expect(Object.keys(result)).toHaveLength(1000);
    });

    it('should maintain performance with many defaults', () => {
      const source = { existing: 1 };
      const defaultValues: Record<string, number> = {};
      
      for (let i = 0; i < 5000; i++) {
        defaultValues[`default${i}`] = i;
      }
      
      const start = performance.now();
      const result = defaults(source, defaultValues);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(100); // Should complete in under 100ms
      expect(result.existing).toBe(1);
      expect(Object.keys(result)).toHaveLength(5001);
    });
  });

  describe('type safety', () => {
    it('should maintain type information', () => {
      interface UserConfig extends Record<string, unknown> {
        name: string;
        age?: number;
      }
      
      interface DefaultConfig extends Record<string, unknown> {
        name: string;
        age: number;
        theme: string;
      }
      
      const userConfig: UserConfig = { name: 'John' };
      const defaultConfig: DefaultConfig = { name: 'Default', age: 25, theme: 'light' };
      
      const result = defaults(userConfig, defaultConfig);
      
      // TypeScript should infer the merged type
      expect(result.name).toBe('John');
      expect(result.age).toBe(25);
      expect(result.theme).toBe('light');
      expect(typeof result.name).toBe('string');
      expect(typeof result.age).toBe('number');
      expect(typeof result.theme).toBe('string');
    });
  });

  describe('real-world scenarios', () => {
    it('should work with configuration objects', () => {
      const userConfig = {
        api: {
          timeout: 5000
        },
        debug: true
      };
      
      const defaultConfig = {
        api: {
          baseUrl: 'https://api.example.com',
          timeout: 3000,
          retries: 3
        },
        debug: false,
        logging: {
          level: 'info',
          format: 'json'
        }
      };
      
      const result = defaults(userConfig, defaultConfig);
      
      expect(result).toEqual({
        api: {
          timeout: 5000 // User's nested object completely overrides default
        },
        debug: true,
        logging: {
          level: 'info',
          format: 'json'
        }
      });
    });

    it('should work with optional parameters pattern', () => {
      function processData(_data: string[], options: { sort?: boolean; reverse?: boolean; limit?: number } = {}) {
        const config = defaults(options, {
          sort: true,
          reverse: false,
          limit: 10
        });
        
        return config;
      }
      
      expect(processData(['a', 'b'], { sort: false })).toEqual({
        sort: false,
        reverse: false,
        limit: 10
      });
      
      expect(processData(['a', 'b'], {})).toEqual({
        sort: true,
        reverse: false,
        limit: 10
      });
      
      expect(processData(['a', 'b'])).toEqual({
        sort: true,
        reverse: false,
        limit: 10
      });
    });
  });
});