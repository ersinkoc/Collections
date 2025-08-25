import { flattenObject, FlattenOptions } from '../../core/object/flatten-object';
import { ValidationError } from '../../utils/errors';

describe('flattenObject', () => {
  // Normal cases
  it('should flatten nested object with default delimiter', () => {
    const input = {
      a: {
        b: {
          c: 1
        }
      },
      d: 2
    };
    const result = flattenObject(input);
    
    expect(result).toEqual({
      'a.b.c': 1,
      'd': 2
    });
  });

  it('should flatten object with mixed data types', () => {
    const input = {
      string: 'value',
      number: 42,
      boolean: true,
      nullValue: null,
      undefinedValue: undefined,
      nested: {
        array: [1, 2, 3],
        date: new Date('2023-01-01'),
        regex: /test/
      }
    };
    const result = flattenObject(input);
    
    expect(result['string']).toBe('value');
    expect(result['number']).toBe(42);
    expect(result['boolean']).toBe(true);
    expect(result['nullValue']).toBe(null);
    expect(result['undefinedValue']).toBe(undefined);
    expect(result['nested.array']).toEqual([1, 2, 3]);
    expect(result['nested.date']).toBeInstanceOf(Date);
    expect(result['nested.regex']).toBeInstanceOf(RegExp);
  });

  it('should handle custom delimiter', () => {
    const input = {
      a: {
        b: {
          c: 1
        }
      }
    };
    const options: FlattenOptions = { delimiter: '_' };
    const result = flattenObject(input, options);
    
    expect(result).toEqual({ 'a_b_c': 1 });
  });

  it('should handle custom delimiter with special characters', () => {
    const input = {
      a: {
        b: {
          c: 1
        }
      }
    };
    const options: FlattenOptions = { delimiter: ' -> ' };
    const result = flattenObject(input, options);
    
    expect(result).toEqual({ 'a -> b -> c': 1 });
  });

  it('should respect maxDepth option', () => {
    const input = {
      a: {
        b: {
          c: {
            d: 1
          }
        }
      }
    };
    const options: FlattenOptions = { maxDepth: 2 };
    const result = flattenObject(input, options);
    
    expect(result).toEqual({
      'a.b.c': { d: 1 }
    });
  });

  it('should handle maxDepth of 0', () => {
    const input = {
      a: {
        b: 1
      }
    };
    const options: FlattenOptions = { maxDepth: 0 };
    const result = flattenObject(input, options);
    
    expect(result).toEqual({
      'a': { b: 1 }
    });
  });

  it('should handle maxDepth of 1', () => {
    const input = {
      a: {
        b: {
          c: 1
        }
      }
    };
    const options: FlattenOptions = { maxDepth: 1 };
    const result = flattenObject(input, options);
    
    expect(result).toEqual({
      'a.b': { c: 1 }
    });
  });

  // Edge cases
  it('should handle empty object', () => {
    const input = {};
    const result = flattenObject(input);
    
    expect(result).toEqual({});
  });

  it('should handle flat object (no nesting)', () => {
    const input = { a: 1, b: 2, c: 3 };
    const result = flattenObject(input);
    
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('should handle single nested level', () => {
    const input = {
      a: { b: 1 },
      c: { d: 2 }
    };
    const result = flattenObject(input);
    
    expect(result).toEqual({
      'a.b': 1,
      'c.d': 2
    });
  });

  it('should handle arrays as leaf values', () => {
    const input = {
      a: {
        b: [1, 2, 3]
      },
      c: ['x', 'y', 'z']
    };
    const result = flattenObject(input);
    
    expect(result).toEqual({
      'a.b': [1, 2, 3],
      'c': ['x', 'y', 'z']
    });
  });

  it('should handle Date objects as leaf values', () => {
    const date = new Date('2023-01-01');
    const input = {
      a: {
        b: date
      }
    };
    const result = flattenObject(input);
    
    expect(result).toEqual({
      'a.b': date
    });
  });

  it('should handle RegExp objects as leaf values', () => {
    const regex = /test/g;
    const input = {
      a: {
        b: regex
      }
    };
    const result = flattenObject(input);
    
    expect(result).toEqual({
      'a.b': regex
    });
  });

  it('should handle null values in nested structure', () => {
    const input = {
      a: {
        b: null,
        c: {
          d: null
        }
      }
    };
    const result = flattenObject(input);
    
    expect(result).toEqual({
      'a.b': null,
      'a.c.d': null
    });
  });

  it('should handle undefined values in nested structure', () => {
    const input = {
      a: {
        b: undefined,
        c: {
          d: undefined
        }
      }
    };
    const result = flattenObject(input);
    
    expect(result).toEqual({
      'a.b': undefined,
      'a.c.d': undefined
    });
  });

  it('should handle deeply nested objects', () => {
    const input = {
      level1: {
        level2: {
          level3: {
            level4: {
              level5: 'deep'
            }
          }
        }
      }
    };
    const result = flattenObject(input);
    
    expect(result).toEqual({
      'level1.level2.level3.level4.level5': 'deep'
    });
  });

  it('should handle keys with special characters', () => {
    const input = {
      'key-with-dashes': {
        'key.with.dots': {
          'key with spaces': 1
        }
      }
    };
    const result = flattenObject(input);
    
    expect(result).toEqual({
      'key-with-dashes.key.with.dots.key with spaces': 1
    });
  });

  it('should handle numeric keys', () => {
    const input = {
      0: {
        1: {
          2: 'value'
        }
      }
    };
    const result = flattenObject(input);
    
    expect(result).toEqual({
      '0.1.2': 'value'
    });
  });

  it('should handle mixed key types', () => {
    const input = {
      stringKey: {
        0: {
          'another-string': 'value'
        }
      }
    };
    const result = flattenObject(input);
    
    expect(result).toEqual({
      'stringKey.0.another-string': 'value'
    });
  });

  it('should skip inherited properties', () => {
    const parent = { inherited: { value: 'inherited' } };
    const input = Object.create(parent);
    input.own = { value: 'own' };
    
    const result = flattenObject(input);
    
    expect(result).toEqual({
      'own.value': 'own'
    });
    expect(result).not.toHaveProperty('inherited.value');
  });

  it('should handle empty nested objects', () => {
    const input = {
      a: {},
      b: {
        c: {}
      }
    };
    const result = flattenObject(input);
    
    expect(result).toEqual({
      // Empty objects don't contribute to flattened result
    });
  });

  it('should handle combination of empty and non-empty objects', () => {
    const input = {
      a: {},
      b: {
        c: 1,
        d: {}
      }
    };
    const result = flattenObject(input);
    
    expect(result).toEqual({
      'b.c': 1
    });
  });

  // Error cases
  it('should throw ValidationError for null input', () => {
    expect(() => flattenObject(null as any)).toThrow(ValidationError);
  });

  it('should throw ValidationError for undefined input', () => {
    expect(() => flattenObject(undefined as any)).toThrow(ValidationError);
  });

  it('should throw ValidationError for string input', () => {
    expect(() => flattenObject('string' as any)).toThrow(ValidationError);
  });

  it('should throw ValidationError for number input', () => {
    expect(() => flattenObject(123 as any)).toThrow(ValidationError);
  });

  it('should throw ValidationError for boolean input', () => {
    expect(() => flattenObject(true as any)).toThrow(ValidationError);
  });

  it('should throw ValidationError for array input', () => {
    expect(() => flattenObject([1, 2, 3] as any)).toThrow(ValidationError);
  });

  it('should throw ValidationError for function input', () => {
    expect(() => flattenObject((() => {}) as any)).toThrow(ValidationError);
  });

  // Performance tests
  it('should handle performance with large nested objects', () => {
    const input: Record<string, any> = {};
    for (let i = 0; i < 100; i++) {
      input[`level1_${i}`] = {
        [`level2_${i}`]: {
          [`level3_${i}`]: `value_${i}`
        }
      };
    }
    
    const start = performance.now();
    const result = flattenObject(input);
    const end = performance.now();
    
    expect(end - start).toBeLessThan(50); // Should complete in under 50ms
    expect(Object.keys(result)).toHaveLength(100);
  });

  it('should handle performance with deep nesting', () => {
    let current: Record<string, any> = {};
    let ref = current;
    
    // Create deeply nested object (50 levels)
    for (let i = 0; i < 50; i++) {
      ref[`level${i}`] = {};
      ref = ref[`level${i}`];
    }
    ref['value'] = 'deep';
    
    const start = performance.now();
    const result = flattenObject(current);
    const end = performance.now();
    
    expect(end - start).toBeLessThan(20); // Should complete in under 20ms
    expect(Object.keys(result)).toHaveLength(1);
  });

  // Options combinations
  it('should handle both delimiter and maxDepth options together', () => {
    const input = {
      a: {
        b: {
          c: {
            d: 1
          }
        }
      }
    };
    const options: FlattenOptions = { delimiter: '_', maxDepth: 2 };
    const result = flattenObject(input, options);
    
    expect(result).toEqual({
      'a_b_c': { d: 1 }
    });
  });

  it('should handle empty delimiter', () => {
    const input = {
      a: {
        b: 1
      }
    };
    const options: FlattenOptions = { delimiter: '' };
    const result = flattenObject(input, options);
    
    expect(result).toEqual({
      'ab': 1
    });
  });

  it('should preserve original object immutability', () => {
    const input = {
      a: {
        b: {
          c: 1
        }
      }
    };
    const originalInput = JSON.parse(JSON.stringify(input));
    
    flattenObject(input);
    
    expect(input).toEqual(originalInput);
  });

  it('should handle maxDepth with nested objects correctly', () => {
    const input: any = {
      a: {
        b: {
          c: 'value',
          d: 'another'
        }
      }
    };
    
    const options: FlattenOptions = { maxDepth: 1 };
    const result = flattenObject(input, options);
    
    // With maxDepth 1, it should flatten to 'a.b' and include the whole b object
    expect(result).toEqual({ 
      'a.b': { c: 'value', d: 'another' }
    });
  });
});