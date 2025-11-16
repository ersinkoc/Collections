import { validateArray, validateFunction } from '../../utils/validators';

/**
 * Executes async operations in parallel with optional concurrency limit.
 * Uses Promise.allSettled to provide better error reporting with context about which tasks failed.
 *
 * @param tasks - Array of async tasks to execute
 * @param concurrency - Maximum number of concurrent tasks (default: unlimited)
 * @returns Promise resolving to array of results
 * @throws {ValidationError} When tasks is not an array or concurrency is invalid
 * @throws {Error} When any task fails, with details about which task indices failed
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

  // Unlimited concurrency path
  if (!concurrency || concurrency >= tasks.length) {
    const results = await Promise.allSettled(tasks.map(task => task()));

    const errors: Array<{ index: number; error: any }> = [];
    const values: T[] = [];

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        errors.push({ index, error: result.reason });
      } else {
        values.push(result.value);
      }
    });

    if (errors.length > 0) {
      const errorIndices = errors.map(e => e.index).join(', ');
      const errorMessages = errors.map(e =>
        e.error instanceof Error ? e.error.message : String(e.error)
      ).join('; ');

      throw new Error(
        `parallel execution failed at ${errors.length} task index(es) [${errorIndices}]: ${errorMessages}`
      );
    }

    return values;
  }

  // Limited concurrency path
  const results: Array<T | Error> = new Array(tasks.length);
  const errors: Array<{ index: number; error: any }> = [];
  let index = 0;

  const executeNext = async (): Promise<void> => {
    // Use while loop instead of recursion to prevent stack overflow
    while (true) {
      const currentIndex = index++;
      if (currentIndex >= tasks.length) return;

      try {
        results[currentIndex] = await tasks[currentIndex]!();
      } catch (error) {
        results[currentIndex] = error as Error;
        errors.push({ index: currentIndex, error });
      }
    }
  };

  const workers = Array(Math.min(concurrency, tasks.length))
    .fill(0)
    .map(() => executeNext());

  await Promise.all(workers);

  if (errors.length > 0) {
    const errorIndices = errors.map(e => e.index).join(', ');
    const errorMessages = errors.map(e =>
      e.error instanceof Error ? e.error.message : String(e.error)
    ).join('; ');

    throw new Error(
      `parallel execution failed at ${errors.length} task index(es) [${errorIndices}]: ${errorMessages}`
    );
  }

  return results as T[];
}