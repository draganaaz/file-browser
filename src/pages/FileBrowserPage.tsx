import React, { useState } from 'react';
import FileTreeView from '../components/FileTreeView/FileTreeView';
import { FileNode } from '../types/FileNode';
import Header from '../components/Header/Header';
import FileViewer from '../components/FileViewer/FileViewer';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import { useFileTree } from '../contexts/FileTreeContext';

const FileBrowserPage: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string[]>(['My Files']);

  const { setSelectedNode } = useFileTree();

  const handleSelect = (node: FileNode, path: string[]) => {
    setSelectedNode(node);
    setCurrentPath(path);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="lg:w-1/3 border-r p-4 w-full">
          <h2 className="text-lg font-bold mb-2">My Files</h2>
          <FileTreeView onSelect={handleSelect} />
        </div>
        <div className="flex-1 p-4">
          <Breadcrumbs path={currentPath} setPath={setCurrentPath} />
          <FileViewer />
        </div>
      </div>
    </div>
  );
};

export default FileBrowserPage;
