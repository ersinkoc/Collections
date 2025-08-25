import { asyncFilter } from '../../core/async/asyncFilter';
import { ValidationError } from '../../utils/errors';

describe('asyncFilter', () => {
  test('should filter array with async predicate', async () => {
    const array = [1, 2, 3, 4, 5];
    const isEven = async (x: number) => x % 2 === 0;
    
    const result = await asyncFilter(array, isEven);
    
    expect(result).toEqual([2, 4]);
  });

  test('should handle empty array', async () => {
    const result = await asyncFilter([], async () => true);
    expect(result).toEqual([]);
  });

  test('should handle all elements matching', async () => {
    const array = [2, 4, 6];
    const isEven = async (x: number) => x % 2 === 0;
    
    const result = await asyncFilter(array, isEven);
    
    expect(result).toEqual([2, 4, 6]);
  });

  test('should handle no elements matching', async () => {
    const array = [1, 3, 5];
    const isEven = async (x: number) => x % 2 === 0;
    
    const result = await asyncFilter(array, isEven);
    
    expect(result).toEqual([]);
  });

  test('should pass correct arguments to predicate', async () => {
    const array = ['a', 'b', 'c'];
    const predicate = jest.fn().mockResolvedValue(true);
    
    await asyncFilter(array, predicate);
    
    expect(predicate).toHaveBeenCalledTimes(3);
    expect(predicate).toHaveBeenNthCalledWith(1, 'a', 0, array);
    expect(predicate).toHaveBeenNthCalledWith(2, 'b', 1, array);
    expect(predicate).toHaveBeenNthCalledWith(3, 'c', 2, array);
  });

  test('should handle async predicate with delays', async () => {
    const array = [1, 2, 3];
    const slowPredicate = async (x: number) => {
      await new Promise(resolve => setTimeout(resolve, 10));
      return x > 1;
    };
    
    const result = await asyncFilter(array, slowPredicate);
    
    expect(result).toEqual([2, 3]);
  });

  test('should validate array parameter', async () => {
    const predicate = async () => true;
    
    await expect(asyncFilter(null as any, predicate)).rejects.toThrow(ValidationError);
    await expect(asyncFilter(undefined as any, predicate)).rejects.toThrow(ValidationError);
    await expect(asyncFilter('not-array' as any, predicate)).rejects.toThrow(ValidationError);
  });

  test('should validate predicate parameter', async () => {
    await expect(asyncFilter([1, 2, 3], null as any)).rejects.toThrow(ValidationError);
    await expect(asyncFilter([1, 2, 3], undefined as any)).rejects.toThrow(ValidationError);
    await expect(asyncFilter([1, 2, 3], 'not-function' as any)).rejects.toThrow(ValidationError);
  });

  test('should handle predicate rejection', async () => {
    const error = new Error('Predicate failed');
    const failingPredicate = async () => {
      throw error;
    };
    
    await expect(asyncFilter([1, 2, 3], failingPredicate)).rejects.toThrow('Predicate failed');
  });

  test('should handle complex objects', async () => {
    const users = [
      { id: 1, age: 25, active: true },
      { id: 2, age: 17, active: false },
      { id: 3, age: 30, active: true }
    ];
    
    const isAdultAndActive = async (user: any) => user.age >= 18 && user.active;
    
    const result = await asyncFilter(users, isAdultAndActive);
    
    expect(result).toEqual([
      { id: 1, age: 25, active: true },
      { id: 3, age: 30, active: true }
    ]);
  });
});