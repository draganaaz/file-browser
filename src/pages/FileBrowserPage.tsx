import React, { useCallback, useState } from 'react';
import FileTreeView from '../components/FileTreeView/FileTreeView';
import { FileNode } from '../types/FileNode';
import { FILE_TYPE } from '../constants/enums';
import Header from '../components/Header/Header';
import { debounce } from '../utils/debounce';
import {
  filterTree,
  handleAddNode,
  handleDeleteNode,
} from '../utils/treeService';
import FileViewer from '../components/FileViewer/FileViewer';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';

const initialData: FileNode[] = [
  { id: '1', name: 'public', type: FILE_TYPE.FOLDER },
  { id: '2', name: 'server', type: FILE_TYPE.FOLDER },
  { id: '3', name: 'src', type: FILE_TYPE.FOLDER },
];

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

  const handleUpdateContent = (id: string, updatedContent: string) => {
    const updateFileContent = (nodes: FileNode[]): FileNode[] =>
      nodes.map((node) => {
        if (node.id === id) {
          return { ...node, fileContent: updatedContent };
        }
        if (node.children) {
          return { ...node, children: updateFileContent(node.children) };
        }
        return node;
      });

    setFileTree((prevTree) => updateFileContent(prevTree));
  };

  const handleBreadcrumbClick = (index: number) => {
    setCurrentPath((prevPath) => prevPath.slice(0, index + 1));
    setSelectedNode(null);
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
