import React from 'react';

interface FileNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
}

const FileTreeView: React.FC = () => {
  const initialData: FileNode[] = [
    { id: '1', name: 'public', type: 'folder' },
    { id: '2', name: 'server', type: 'folder' },
    { id: '3', name: 'src', type: 'folder' },
  ];

  return (
    <ul className="p-4">
      {initialData.map((node) => (
        <li key={node.id} className="mb-1 flex items-center">
          📁 {node.name}
        </li>
      ))}
    </ul>
  );
};

export default FileTreeView;
