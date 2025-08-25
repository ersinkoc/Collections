import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Executes async operations in parallel with optional concurrency limit.
 * 
 * @param tasks - Array of async tasks to execute
 * @param concurrency - Maximum number of concurrent tasks (default: unlimited)
 * @returns Promise resolving to array of results
 * @throws {ValidationError} When tasks is not an array or concurrency is invalid
 * 
 * @example
 * ```typescript
 * const tasks = [
 *   async () => await fetch('/api/1'),
 *   async () => await fetch('/api/2'),
 *   async () => await fetch('/api/3')
 * ];
 * await parallel(tasks, 2); // Max 2 concurrent requests
 * ```
 * 
 * @complexity O(n) - Where n is the number of tasks
 * @since 1.0.0
 */
export async function parallel<T>(
  tasks: Array<() => Promise<T>>,
  concurrency?: number
): Promise<T[]> {
  validateArray(tasks, 'tasks');
  
  if (concurrency !== undefined) {
    if (typeof concurrency !== 'number' || concurrency < 1 || !Number.isInteger(concurrency)) {
      throw new Error('concurrency must be a positive integer');
    }
  }

  tasks.forEach((task, index) => {
    validateFunction(task, `tasks[${index}]`);
  });

  if (!concurrency || concurrency >= tasks.length) {
    return Promise.all(tasks.map(task => task()));
  }

  const results: T[] = new Array(tasks.length);
  let index = 0;

  const executeNext = async (): Promise<void> => {
    const currentIndex = index++;
    if (currentIndex >= tasks.length) return;

    results[currentIndex] = await tasks[currentIndex]!();
    await executeNext();
  };

  const workers = Array(Math.min(concurrency, tasks.length))
    .fill(0)
    .map(() => executeNext());

  await Promise.all(workers);
  return results;
}