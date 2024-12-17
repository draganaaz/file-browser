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

const initialData: FileNode[] = [
  { id: '1', name: 'public', type: FILE_TYPE.FOLDER },
  { id: '2', name: 'server', type: FILE_TYPE.FOLDER },
  { id: '3', name: 'src', type: FILE_TYPE.FOLDER },
];

const FileBrowserPage: React.FC = () => {
  const [fileTree, setFileTree] = useState<FileNode[]>(initialData);
  const [filter, setFilter] = useState('');

  const debouncedFilter = useCallback(
    debounce((value: string) => setFilter(value), 500),
    []
  );

  const filteredTree = filterTree(fileTree, filter);

  const handleAdd = useCallback(
    (parentId: string, name: string, type: FILE_TYPE) => {
      setFileTree((prevTree) => handleAddNode(prevTree, parentId, name, type));
    },
    []
  );

  const handleDelete = useCallback((nodeId: string) => {
    setFileTree((prevTree) => handleDeleteNode(prevTree, nodeId));
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header handleFilter={debouncedFilter} />
      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="lg:w-1/3 border-r p-4 w-full">
          <h2 className="text-lg font-bold mb-2">File Browser</h2>
          <FileTreeView
            data={filteredTree}
            onAdd={handleAdd}
            onDelete={handleDelete}
          />
        </div>
        <FileViewer />
      </div>
    </div>
  );
};

export default FileBrowserPage;
