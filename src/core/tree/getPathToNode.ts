import { TreeNode } from './TreeNode';
import { validateFunction } from '../../utils/validators';

/**
 * Gets the path from root to a node matching a predicate.
 *
 * @param root - Root node to search from
 * @param predicate - Function to test each node
 * @returns Array of nodes from root to target, or empty array if not found
 * @throws {ValidationError} When predicate is not a function
 *
 * @example
 * ```typescript
 * const tree = createTreeNode('root', [
 *   createTreeNode('child', [
 *     createTreeNode('target')
 *   ])
 * ]);
 * getPathToNode(tree, node => node.data === 'target');
 * // Returns: [rootNode, childNode, targetNode]
 * ```
 *
 * @note Handles circular references safely - cycles are detected and skipped
 * @complexity O(n) - Where n is the number of nodes (worst case)
 * @since 1.0.0
 */
export function getPathToNode<T>(
  root: TreeNode<T> | null | undefined,
  predicate: (node: TreeNode<T>) => boolean
): TreeNode<T>[] {
  validateFunction(predicate, 'predicate');

  if (!root) {
    return [];
  }

  const visited = new WeakSet<TreeNode<T>>();

  const findPath = (node: TreeNode<T>, path: TreeNode<T>[]): TreeNode<T>[] | null => {
    // Detect circular references
    if (visited.has(node)) {
      return null;
    }
    visited.add(node);

    const currentPath = [...path, node];

    if (predicate(node)) {
      return currentPath;
    }

    if (node.children) {
      for (const child of node.children) {
        const result = findPath(child, currentPath);
        if (result) {
          return result;
        }
      }
    }

    return null;
  };

  return findPath(root, []) || [];
}