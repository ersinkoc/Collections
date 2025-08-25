import { TreeNode } from './TreeNode';
import { validateFunction } from '../../utils/validators';

/**
 * Maps a tree, transforming each node's data.
 * 
 * @param root - Root node to map
 * @param mapper - Function to transform each node's data
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
 * ```
 * 
 * @complexity O(n) - Where n is the number of nodes
 * @since 1.0.0
 */
export function mapTree<T, U>(
  root: TreeNode<T> | null | undefined,
  mapper: (data: T, node: TreeNode<T>) => U
): TreeNode<U> | undefined {
  validateFunction(mapper, 'mapper');

  if (!root) {
    return undefined;
  }

  const mappedChildren: TreeNode<U>[] = [];

  if (root.children) {
    for (const child of root.children) {
      const mappedChild = mapTree(child, mapper);
      if (mappedChild) {
        mappedChildren.push(mappedChild);
      }
    }
  }

  const mappedRoot: TreeNode<U> = {
    data: mapper(root.data, root),
    children: mappedChildren.length > 0 ? mappedChildren : undefined
  };

  mappedChildren.forEach(child => {
    child.parent = mappedRoot;
  });

  return mappedRoot;
}