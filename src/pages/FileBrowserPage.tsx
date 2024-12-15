import React, { useState } from 'react';
import FileTreeView from '../components/FileTreeView/FileTreeView';
import { FileNode } from '../types/FileNode';
import { FILE_TYPE } from '../constants/enums';
import Header from '../components/Header/Header';

const initialData: FileNode[] = [
  { id: '1', name: 'public', type: FILE_TYPE.FOLDER },
  { id: '2', name: 'server', type: FILE_TYPE.FOLDER },
  { id: '3', name: 'src', type: FILE_TYPE.FOLDER },
];

const FileBrowserPage: React.FC = () => {
  const [fileTree, setFileTree] = useState<FileNode[]>(initialData);

  const handleAdd = (parentId: string) => {
    const newItem: FileNode = {
      id: Date.now().toString(),
      name: 'New file',
      type: FILE_TYPE.FOLDER,
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

    setFileTree((prevTree) => addNode(prevTree));
  };

  const handleDelete = (nodeId: string) => {
    const deleteNode = (tree: FileNode[]): FileNode[] => {
      return tree
        .filter((node) => node.id !== nodeId)
        .map((node) => ({
          ...node,
          children: node.children ? deleteNode(node.children) : [],
        }));
    };

    setFileTree((prevTree) => deleteNode(prevTree));
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <div className="w-1/3 border-r p-4">
          <h2 className="text-lg font-bold mb-2">File Browser</h2>
          <FileTreeView
            data={fileTree}
            onAdd={handleAdd}
            onDelete={handleDelete}
          />
        </div>
        <div className="w-2/3 p-4">
          <h2 className="text-lg font-bold">File Viewer</h2>
          <p>Select a file to view its contents.</p>
        </div>
      </div>
    </div>
  );
};

export default FileBrowserPage;
