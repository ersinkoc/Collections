import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Executes async operations in series (one after another).
 * 
 * @param tasks - Array of async tasks to execute
 * @returns Promise resolving to array of results
 * @throws {ValidationError} When tasks is not an array
 * 
 * @example
 * ```typescript
 * const tasks = [
 *   async () => await processStep1(),
 *   async () => await processStep2(),
 *   async () => await processStep3()
 * ];
 * await series(tasks); // Executes sequentially
 * ```
 * 
 * @complexity O(n) - Where n is the number of tasks
 * @since 1.0.0
 */
export async function series<T>(
  tasks: Array<() => Promise<T>>
): Promise<T[]> {
  validateArray(tasks, 'tasks');

  tasks.forEach((task, index) => {
    validateFunction(task, `tasks[${index}]`);
  });

  const results: T[] = [];

  for (const task of tasks) {
    results.push(await task());
  }

  return results;
}