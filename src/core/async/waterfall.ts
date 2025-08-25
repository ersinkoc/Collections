import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Executes async operations in waterfall (output of one becomes input of next).
 * 
 * @param tasks - Array of async tasks to execute
 * @param initialValue - Initial value for the first task
 * @returns Promise resolving to final result
 * @throws {ValidationError} When tasks is not an array
 * 
 * @example
 * ```typescript
 * const tasks = [
 *   async (x: number) => x + 1,
 *   async (x: number) => x * 2,
 *   async (x: number) => x - 3
 * ];
 * await waterfall(tasks, 5); // Returns: 9 ((5+1)*2-3)
 * ```
 * 
 * @complexity O(n) - Where n is the number of tasks
 * @since 1.0.0
 */
export async function waterfall<T>(
  tasks: Array<(input: T) => Promise<T>>,
  initialValue: T
): Promise<T> {
  validateArray(tasks, 'tasks');

  tasks.forEach((task, index) => {
    validateFunction(task, `tasks[${index}]`);
  });

  let result = initialValue;

  for (const task of tasks) {
    result = await task(result);
  }

  return result;
}