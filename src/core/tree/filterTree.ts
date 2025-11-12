import { TreeNode } from './TreeNode';
import { validateFunction } from '../../utils/validators';
import { deepClone } from '../object/deep-clone';

/**
 * Filters a tree, keeping only nodes that match a predicate with circular reference detection.
 *
 * @param root - Root node to filter
 * @param predicate - Function to test each node
 * @param seen - WeakMap to track visited nodes (internal use)
 * @returns Filtered tree or undefined if root doesn't match
 * @throws {ValidationError} When predicate is not a function
 *
 * @example
 * ```typescript
 * const tree = createTreeNode(1, [
 *   createTreeNode(2),
 *   createTreeNode(3)
 * ]);
 * filterTree(tree, node => node.data % 2 === 1); // Returns: tree with nodes 1 and 3
 *
 * // Handles circular references
 * const parent = createTreeNode(1);
 * const child = createTreeNode(2);
 * parent.children = [child];
 * child.children = [parent]; // circular
 * filterTree(parent, node => true); // Works without stack overflow
 * ```
 *
 * @complexity O(n) - Where n is the number of nodes
 * @since 1.0.0
 */
export function filterTree<T>(
  root: TreeNode<T> | null | undefined,
  predicate: (node: TreeNode<T>) => boolean,
  seen: WeakMap<TreeNode<T>, TreeNode<T> | undefined> = new WeakMap()
): TreeNode<T> | undefined {
  validateFunction(predicate, 'predicate');

  if (!root) {
    return undefined;
  }

  // Check for circular reference
  if (seen.has(root)) {
    return seen.get(root);
  }

  // Check predicate
  if (!predicate(root)) {
    seen.set(root, undefined);
    return undefined;
  }

  const filteredChildren: TreeNode<T>[] = [];

  // Create filtered root early and add to seen map
  const filteredRoot: TreeNode<T> = {
    data: deepClone(root.data),
    children: undefined
  };
  seen.set(root, filteredRoot);

  if (root.children) {
    for (const child of root.children) {
      const filteredChild = filterTree(child, predicate, seen);
      if (filteredChild) {
        filteredChildren.push(filteredChild);
      }
    }
  }

  filteredRoot.children = filteredChildren.length > 0 ? filteredChildren : undefined;

  filteredChildren.forEach(child => {
    child.parent = filteredRoot;
  });

  return filteredRoot;
}