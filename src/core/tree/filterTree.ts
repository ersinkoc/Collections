import { TreeNode } from './TreeNode';
import { validateFunction } from '../../utils/validators';

/**
 * Filters a tree, keeping only nodes that match a predicate.
 * 
 * @param root - Root node to filter
 * @param predicate - Function to test each node
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
 * ```
 * 
 * @complexity O(n) - Where n is the number of nodes
 * @since 1.0.0
 */
export function filterTree<T>(
  root: TreeNode<T> | null | undefined,
  predicate: (node: TreeNode<T>) => boolean
): TreeNode<T> | undefined {
  validateFunction(predicate, 'predicate');

  if (!root || !predicate(root)) {
    return undefined;
  }

  const filteredChildren: TreeNode<T>[] = [];

  if (root.children) {
    for (const child of root.children) {
      const filteredChild = filterTree(child, predicate);
      if (filteredChild) {
        filteredChildren.push(filteredChild);
      }
    }
  }

  const filteredRoot: TreeNode<T> = {
    data: root.data,
    children: filteredChildren.length > 0 ? filteredChildren : undefined
  };

  filteredChildren.forEach(child => {
    child.parent = filteredRoot;
  });

  return filteredRoot;
}