import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';
import { FileNode } from '../types/FileNode';
import { filterTree } from '../utils/treeService';
import { debounce } from '../utils/debounce';

export interface FileTreeContextProps {
  fileTree: FileNode[];
  setFileTree: Dispatch<SetStateAction<FileNode[]>>;
  searchTree: (value: string) => void;
}

const FileTreeContext = createContext<FileTreeContextProps | undefined>(
  undefined
);

export const FileTreeProvider: React.FC<{
  value: FileNode[];
  children: ReactNode;
}> = ({ value: initialData, children }) => {
  const [fileTree, setFileTree] = useState<FileNode[]>(initialData);
  const [filter, setFilter] = useState('');

  const debouncedSearch = useCallback(
    debounce((value: string) => setFilter(value), 500),
    []
  );

  const filteredTree = filterTree(fileTree, filter);

  return (
    <FileTreeContext.Provider
      value={{
        fileTree: filteredTree,
        setFileTree,
        searchTree: debouncedSearch,
      }}
    >
      {children}
    </FileTreeContext.Provider>
  );
};

export const useFileTree = () => {
  const context = useContext(FileTreeContext);

  if (!context) {
    throw new Error('UseFileTree must be used within a FileTreeProvider.');
  }

  return context;
};
