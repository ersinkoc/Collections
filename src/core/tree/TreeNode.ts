/**
 * Generic tree node interface.
 * 
 * @template T - The type of data stored in the node
 * @since 1.0.0
 */
export interface TreeNode<T = any> {
  data: T;
  children?: TreeNode<T>[];
  parent?: TreeNode<T>;
}

/**
 * Creates a new tree node.
 * 
 * @param data - Data to store in the node
 * @param children - Optional array of child nodes
 * @returns New tree node
 * 
 * @example
 * ```typescript
 * const root = createTreeNode('root', [
 *   createTreeNode('child1'),
 *   createTreeNode('child2')
 * ]);
 * ```
 * 
 * @complexity O(1) - Constant time complexity
 * @since 1.0.0
 */
export function createTreeNode<T>(data: T, children?: TreeNode<T>[]): TreeNode<T> {
  const node: TreeNode<T> = { data };
  
  if (children) {
    node.children = children;
    children.forEach(child => {
      child.parent = node;
    });
  }
  
  return node;
}