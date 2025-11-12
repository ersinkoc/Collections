import { TreeNode } from './TreeNode';
import { validateFunction } from '../../utils/validators';

/**
 * Maps a tree, transforming each node's data with circular reference detection.
 *
 * @param root - Root node to map
 * @param mapper - Function to transform each node's data
 * @param seen - WeakMap to track visited nodes (internal use)
 * @returns New tree with transformed data
 * @throws {ValidationError} When mapper is not a function
 *
 * @example
 * ```typescript
 * const tree = createTreeNode(1, [
 *   createTreeNode(2),
 *   createTreeNode(3)
 * ]);
 * mapTree(tree, data => data * 2); // Returns: tree with data [2, 4, 6]
 *
 * // Handles circular references
 * const parent = createTreeNode(1);
 * const child = createTreeNode(2);
 * parent.children = [child];
 * child.children = [parent]; // circular
 * mapTree(parent, x => x * 2); // Works without stack overflow
 * ```
 *
 * @complexity O(n) - Where n is the number of nodes
 * @since 1.0.0
 */
export function mapTree<T, U>(
  root: TreeNode<T> | null | undefined,
  mapper: (data: T, node: TreeNode<T>) => U,
  seen: WeakMap<TreeNode<T>, TreeNode<U>> = new WeakMap()
): TreeNode<U> | undefined {
  validateFunction(mapper, 'mapper');

  if (!root) {
    return undefined;
  }

  // Check for circular reference
  if (seen.has(root)) {
    return seen.get(root);
  }

  const mappedChildren: TreeNode<U>[] = [];

  // Create mapped root early and add to seen map
  const mappedRoot: TreeNode<U> = {
    data: mapper(root.data, root),
    children: undefined
  };
  seen.set(root, mappedRoot);

  if (root.children) {
    for (const child of root.children) {
      const mappedChild = mapTree(child, mapper, seen);
      if (mappedChild) {
        mappedChildren.push(mappedChild);
      }
    }
  }

  mappedRoot.children = mappedChildren.length > 0 ? mappedChildren : undefined;

  mappedChildren.forEach(child => {
    child.parent = mappedRoot;
  });

  return mappedRoot;
}