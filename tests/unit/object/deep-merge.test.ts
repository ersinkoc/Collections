import { deepMerge } from '../../../src/core/object/deep-merge';
import { ValidationError } from '../../../src/utils/errors';

describe('deepMerge', () => {
  describe('normal cases', () => {
    it('should merge two flat objects', () => {
      const result = deepMerge({ a: 1, b: 2 }, { c: 3, d: 4 });
      expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    });

    it('should merge nested objects', () => {
      const result = deepMerge(
        { a: 1, b: { c: 2, d: 3 } },
        { b: { d: 4, e: 5 }, f: 6 }
      );
      expect(result).toEqual({
        a: 1,
        b: { c: 2, d: 4, e: 5 },
        f: 6,
      });
    });

    it('should merge multiple objects', () => {
      const result = deepMerge(
        { a: 1 },
        { b: 2 },
        { c: 3 },
        { d: 4 }
      );
      expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    });

    it('should override values from left to right', () => {
      const result = deepMerge(
        { a: 1, b: 2 },
        { b: 3, c: 4 },
        { a: 5, c: 6 }
      );
      expect(result).toEqual({ a: 5, b: 3, c: 6 });
    });

    it('should replace arrays not merge them', () => {
      const result = deepMerge(
        { arr: [1, 2, 3] },
        { arr: [4, 5] }
      );
      expect(result).toEqual({ arr: [4, 5] });
    });

    it('should handle null and undefined in objects', () => {
      const result = deepMerge(
        { a: null, b: 2 },
        { a: 1, c: undefined }
      );
      expect(result).toEqual({ a: 1, b: 2, c: undefined });
    });

    it('should deep clone nested objects', () => {
      const source = { nested: { value: 1 } };
      const result = deepMerge({}, source);
      result.nested.value = 2;
      expect(source.nested.value).toBe(1);
    });

    it('should handle deeply nested structures', () => {
      const result = deepMerge(
        { a: { b: { c: { d: 1 } } } },
        { a: { b: { c: { e: 2 }, f: 3 } } }
      );
      expect(result).toEqual({
        a: { b: { c: { d: 1, e: 2 }, f: 3 } },
      });
    });
  });

  describe('edge cases', () => {
    it('should return empty object when no arguments', () => {
      const result = deepMerge();
      expect(result).toEqual({});
    });

    it('should handle single object', () => {
      const obj = { a: 1, b: { c: 2 } };
      const result = deepMerge(obj);
      expect(result).toEqual(obj);
      expect(result).not.toBe(obj); // Should be a new object
    });

    it('should skip null and undefined arguments', () => {
      const result = deepMerge(
        null as any,
        { a: 1 },
        undefined as any,
        { b: 2 }
      );
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should maintain immutability of source objects', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { b: { d: 3 }, e: 4 };
      const result = deepMerge(obj1, obj2);
      
      expect(obj1).toEqual({ a: 1, b: { c: 2 } });
      expect(obj2).toEqual({ b: { d: 3 }, e: 4 });
      
      result.b.c = 5;
      expect(obj1.b.c).toBe(2);
    });

    it('should handle objects with prototype chain correctly', () => {
      class CustomClass {
        method() { return 'test'; }
      }
      const instance = new CustomClass();
      const result = deepMerge({ obj: instance });
      expect(result.obj).toBe(instance); // Should not deep clone class instances
    });

    it('should handle Date objects', () => {
      const date = new Date();
      const result = deepMerge({ date });
      expect(result.date).toBe(date); // Should not clone Date objects
    });

    it('should handle RegExp objects', () => {
      const regex = /test/gi;
      const result = deepMerge({ regex });
      expect(result.regex).toBe(regex); // Should not clone RegExp objects
    });

    it('should handle circular references by not deep cloning them', () => {
      const obj: any = { a: 1 };
      obj.self = obj;
      const result = deepMerge({ circular: obj });
      
      // Should create a copy but break circular references
      expect(result.circular).not.toBe(obj);
      expect(result.circular.a).toBe(1);
      expect(result.circular.self).toBeDefined();
      // The circular reference should be broken in the copy
      expect(result.circular.self.a).toBe(1);
    });
  });

  describe('error cases', () => {
    it('should throw ValidationError for non-object arguments', () => {
      expect(() => deepMerge('string' as any)).toThrow(ValidationError);
      expect(() => deepMerge(123 as any)).toThrow(ValidationError);
      expect(() => deepMerge(true as any)).toThrow(ValidationError);
      expect(() => deepMerge([] as any)).toThrow(ValidationError);
    });

    it('should throw ValidationError with meaningful message', () => {
      try {
        deepMerge('string' as any);
      } catch (error: any) {
        expect(error.message).toContain('object');
        expect(error.code).toBe('VALIDATION_ERROR');
      }
    });

    it('should allow null/undefined but skip them', () => {
      expect(() => deepMerge(null as any, { a: 1 })).not.toThrow();
      expect(() => deepMerge(undefined as any, { a: 1 })).not.toThrow();
    });
  });

  describe('performance', () => {
    it('should handle large objects efficiently', () => {
      const largeObj1: any = {};
      const largeObj2: any = {};
      
      for (let i = 0; i < 10000; i++) {
        largeObj1[`key${i}`] = { value: i };
        largeObj2[`key${i + 5000}`] = { value: i };
      }
      
      const start = performance.now();
      const result = deepMerge(largeObj1, largeObj2);
      const end = performance.now();
      
      expect(Object.keys(result).length).toBe(15000);
      expect(end - start).toBeLessThan(500); // Should complete within 500ms
    });

    it('should handle deeply nested objects', () => {
      let deep1: any = { value: 1 };
      let deep2: any = { value: 2 };
      
      for (let i = 0; i < 100; i++) {
        deep1 = { nested: deep1 };
        deep2 = { nested: deep2 };
      }
      
      const start = performance.now();
      const result = deepMerge(deep1, deep2);
      const end = performance.now();
      
      expect(result).toBeDefined();
      expect(end - start).toBeLessThan(100); // Should complete within 100ms
    });
  });
});