import { FileNode } from '../types/FileNode';
import { FILE_TYPE } from '../constants/fileTree';

/**
 * Recursively filters the file tree based on a search query.
 * If a node's name includes the query string (case insensitive), the node is included.
 * If a folder's children match the query, the folder is included with its filtered children.
 *
 * @param nodes - The current file tree nodes.
 * @param query - The search query string to match node names.
 * @returns A new filtered file tree containing only matching nodes and their ancestors.
 */
export const filterTree = (nodes: FileNode[], query: string): FileNode[] => {
  if (!query) {
    return nodes;
  }

  return nodes.reduce<FileNode[]>((acc, node) => {
    if (node.name.toLowerCase().includes(query.toLowerCase())) {
      acc.push(node);
    } else if (node.children) {
      const filteredChildren = filterTree(node.children, query);
      if (filteredChildren.length > 0) {
        acc.push({ ...node, children: filteredChildren });
      }
    }
    return acc;
  }, []);
};

/**
 * Adds a new node (file or folder) to the tree at the specified parent folder.
 *
 * @param tree - The current file tree structure.
 * @param parentId - The ID of the parent folder where the new node will be added.
 * @param newNodeName - The name of the new node.
 * @param type - The type of the new node ('file' or 'folder').
 * @returns The updated file tree with the new node added.
 */
export const handleAddNode = (
  tree: FileNode[],
  parentId: string,
  newNodeName: string,
  type: FILE_TYPE
): FileNode[] => {
  const newItem: FileNode = {
    id: Date.now().toString(),
    name:
      newNodeName || (type === FILE_TYPE.FOLDER ? 'New Folder' : 'New File'),
    type,
  };

  const addNode = (tree: FileNode[]): FileNode[] => {
    return tree.map((node) => {
      if (node.id === parentId && node.type === 'folder') {
        return { ...node, children: [...(node.children || []), newItem] };
      } else if (node.children) {
        return { ...node, children: addNode(node.children) };
      }
      return node;
    });
  };

  return addNode(tree);
};

/**
 * Deletes a node (file or folder) from the tree based on its ID.
 *
 * @param tree - The current file tree structure.
 * @param nodeId - The ID of the node to be deleted.
 * @returns The updated file tree with the specified node removed.
 */
export const handleDeleteNode = (
  tree: FileNode[],
  nodeId: string
): FileNode[] => {
  const deleteNode = (nodes: FileNode[]): FileNode[] =>
    nodes.reduce<FileNode[]>((acc, node) => {
      if (node.id === nodeId) {
        return acc;
      }

      acc.push({
        ...node,
        children: node.children ? deleteNode(node.children) : [],
      });

      return acc;
    }, []);

  return deleteNode(tree);
};

/**
 * Renames a node in the tree based on its ID.
 *
 * @param nodes - The current file tree structure.
 * @param nodeId - The ID of the node to be renamed.
 * @param newName - The new name for the node.
 * @returns The updated file tree with the specified node renamed.
 */
export const handleRenameNode = (
  nodes: FileNode[],
  nodeId: string,
  newName: string
): FileNode[] => {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      return { ...node, name: newName };
    }
    if (node.children) {
      return {
        ...node,
        children: handleRenameNode(node.children, nodeId, newName),
      };
    }
    return node;
  });
};

/**
 * Updates the content of a specific file node in the tree.
 *
 * @param nodes - The current file tree structure.
 * @param id - The ID of the file to be updated.
 * @param updatedContent - The new content to be assigned to the file.
 * @returns The updated file tree with the specified file content modified.
 */
export const updateFileContent = (
  nodes: FileNode[],
  id: string,
  updatedContent: string
): FileNode[] =>
  nodes.map((node) => {
    if (node.id === id) {
      return { ...node, fileContent: updatedContent };
    }
    if (node.children) {
      return {
        ...node,
        children: updateFileContent(node.children, node.id, updatedContent),
      };
    }
    return node;
  });
