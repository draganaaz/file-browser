import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useContext,
  useState,
} from 'react';
import { FileNode } from '../types/FileNode';
import {
  filterTree,
  findNodeById,
  handleAddNode,
  handleDeleteNode,
  handleRenameNode,
} from '../utils/treeService';
import { debounce } from '../utils/debounce';
import { FILE_TYPE } from '../constants/fileTree';
import { validateNameAndExtension } from '../utils/validations';
import { ERROR_MESSAGES } from '../constants/errorMessages';

export interface FileTreeContextProps {
  fileTree: FileNode[];
  setFileTree: Dispatch<SetStateAction<FileNode[]>>;
  searchTree: (value: string) => void;
  handleAdd: (parentId: string) => void;
  fileExtension: string | null;
  setFileExtension: Dispatch<SetStateAction<string | null>>;
  itemType: FILE_TYPE | null;
  setItemType: Dispatch<SetStateAction<FILE_TYPE | null>>;
  newItemName: string;
  setNewItemName: Dispatch<SetStateAction<string>>;
  activeParentId: string | null;
  setActiveParentId: Dispatch<SetStateAction<string | null>>;
  closeMenus: () => void;
  errorMessage: string;
  menuNode: string | null;
  setMenuNode: Dispatch<SetStateAction<string | null>>;
  handleRename: (nodeId: string, newName: string) => void;
  isRenaming: boolean;
  setIsRenaming: Dispatch<SetStateAction<boolean>>;
  selectedNode: FileNode | null;
  setSelectedNode: Dispatch<SetStateAction<FileNode | null>>;
  handleDelete: (e: SyntheticEvent, nodeId: string) => void;
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
  const [menuNode, setMenuNode] = useState<string | null>(null);
  const [activeParentId, setActiveParentId] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [fileExtension, setFileExtension] = useState<string | null>(null);
  const [itemType, setItemType] = useState<FILE_TYPE | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);

  const searchTree = debounce((value: string) => setFilter(value), 500);

  const filteredTree = filterTree(fileTree, filter);

  const closeMenus = useCallback(() => {
    setMenuNode(null);
    setErrorMessage('');
  }, []);

  // Helper function to reset state after operation
  const resetState = () => {
    setActiveParentId(null);
    setNewItemName('');
    setErrorMessage('');
  };

  // Validates and confirms adding a new file or folder, then updates the tree.
  const handleAdd = (parentId: string) => {
    const name = newItemName.trim();
    if (!name) {
      resetState();
      return;
    }

    const validation = validateNameAndExtension(
      name,
      itemType as FILE_TYPE,
      fileExtension
    );
    if (!validation.valid) {
      setErrorMessage(
        validation.error || ERROR_MESSAGES.INVALID_NAME_OR_EXTENSION
      );
      return;
    }

    const parentFolder = fileTree.find((node) => node.id === parentId);
    if (
      parentFolder?.children?.some(
        (child) => child.name === validation.processedName
      )
    ) {
      setErrorMessage(ERROR_MESSAGES.ITEM_EXISTS);
      return;
    }

    setFileTree((prevTree) =>
      handleAddNode(
        prevTree,
        parentId,
        validation?.processedName || '',
        itemType as FILE_TYPE
      )
    );
    resetState();
  };

  // Validates and confirms renaming a file or folder, then updates the tree.
  const handleRename = (nodeId: string, newName: string) => {
    setActiveParentId(null);

    const node = findNodeById(fileTree, nodeId);
    if (!node) {
      setErrorMessage(ERROR_MESSAGES.FILE_NOT_FOUND);
      return;
    }

    const validation = validateNameAndExtension(
      newName,
      node.type,
      node.name.split('.').pop() || ''
    );
    if (!validation.valid) {
      setErrorMessage(
        validation.error || ERROR_MESSAGES.INVALID_NAME_OR_EXTENSION
      );
      return;
    }

    setFileTree((prevTree) =>
      handleRenameNode(prevTree, nodeId, validation?.processedName || '')
    );
    setIsRenaming(false);
    setErrorMessage('');
  };

  const handleDelete = (e: SyntheticEvent, nodeId: string) => {
    e.stopPropagation();

    setFileTree((prevTree) => handleDeleteNode(prevTree, nodeId));

    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }

    closeMenus();
  };

  return (
    <FileTreeContext.Provider
      value={{
        fileTree: filteredTree,
        setFileTree,
        searchTree,
        handleAdd,
        fileExtension,
        setFileExtension,
        itemType,
        setItemType,
        newItemName,
        setNewItemName,
        activeParentId,
        setActiveParentId,
        closeMenus,
        errorMessage,
        menuNode,
        setMenuNode,
        handleRename,
        isRenaming,
        setIsRenaming,
        selectedNode,
        setSelectedNode,
        handleDelete,
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
