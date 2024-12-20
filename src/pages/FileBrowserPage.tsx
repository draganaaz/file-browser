import React, { useCallback, useState } from 'react';
import FileTreeView from '../components/FileTreeView/FileTreeView';
import { FileNode } from '../types/FileNode';
import { FILE_TYPE } from '../constants/fileTree';
import Header from '../components/Header/Header';
import { debounce } from '../utils/debounce';
import {
  filterTree,
  handleAddNode,
  handleDeleteNode,
  handleRenameNode,
  updateFileContent,
} from '../utils/treeService';
import FileViewer from '../components/FileViewer/FileViewer';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import { initialData } from '../constants/mocks';

const FileBrowserPage: React.FC = () => {
  const [fileTree, setFileTree] = useState<FileNode[]>(initialData);
  const [filter, setFilter] = useState('');
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);
  const [currentPath, setCurrentPath] = useState<string[]>(['My Files']);

  const debouncedFilter = useCallback(
    debounce((value: string) => setFilter(value), 500),
    []
  );

  const filteredTree = filterTree(fileTree, filter);

  const handleAdd = (parentId: string, name: string, type: FILE_TYPE) => {
    setFileTree((prevTree) => handleAddNode(prevTree, parentId, name, type));
  };

  const handleDelete = (nodeId: string) => {
    setFileTree((prevTree) => handleDeleteNode(prevTree, nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const handleSelect = (node: FileNode, path: string[]) => {
    setSelectedNode(node);
    setCurrentPath(path);
  };

  const handleRename = (nodeId: string, newName: string) => {
    setFileTree((prevTree) => handleRenameNode(prevTree, nodeId, newName));
  };

  const handleUpdateContent = (id: string, updatedContent: string) => {
    setFileTree((prevTree) => updateFileContent(prevTree, id, updatedContent));
  };

  const handleBreadcrumbClick = (index: number) => {
    const newPath: string[] = ['My Files'];
    let currentNode: FileNode | null = null;
    let currentTree = fileTree;

    // Iterate through the breadcrumb segments up to the clicked index
    for (let i = 1; i <= index; i++) {
      const segment = currentPath[i];
      newPath.push(segment);

      currentNode = currentTree.find((node) => node.name === segment) || null;
      currentTree = currentNode?.children || [];
    }

    setCurrentPath(newPath);
    setSelectedNode(currentNode);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header handleFilter={debouncedFilter} />
      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="lg:w-1/3 border-r p-4 w-full">
          <h2 className="text-lg font-bold mb-2">My Files</h2>
          <FileTreeView
            data={filteredTree}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onSelect={handleSelect}
            onRename={handleRename}
            selectedNode={selectedNode}
          />
        </div>
        <div className="flex-1 p-4">
          <Breadcrumbs path={currentPath} onClick={handleBreadcrumbClick} />
          <FileViewer
            selectedNode={selectedNode}
            onUpdateContent={handleUpdateContent}
          />
        </div>
      </div>
    </div>
  );
};

export default FileBrowserPage;
