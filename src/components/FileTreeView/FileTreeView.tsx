import React, { useState, useEffect } from 'react';
import { FILE_TYPE } from '../../constants/enums';
import { FileNode } from '../../types/FileNode';

interface FileTreeViewProps {
  data: FileNode[];
  onAdd: (parentId: string, name: string, type: FILE_TYPE) => void;
  onDelete: (nodeId: string) => void;
}

const VALID_EXTENSIONS = {
  TEXT: 'txt',
  JSON: 'json',
  IMAGE: 'png',
};

const MENU_ITEMS = [
  { label: 'New Folder', type: FILE_TYPE.FOLDER },
  {
    label: 'New Text Document',
    type: FILE_TYPE.FILE,
    extension: VALID_EXTENSIONS.TEXT,
  },
  {
    label: 'New JSON Document',
    type: FILE_TYPE.FILE,
    extension: VALID_EXTENSIONS.JSON,
  },
  {
    label: 'New Image',
    type: FILE_TYPE.FILE,
    extension: VALID_EXTENSIONS.IMAGE,
  },
];

const FileTreeView: React.FC<FileTreeViewProps> = ({
  data,
  onAdd,
  onDelete,
}) => {
  const [menuNodeId, setMenuNodeId] = useState<string | null>(null);
  const [addMenuOpenId, setAddMenuOpenId] = useState<string | null>(null);
  const [activeParentId, setActiveParentId] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fileExtension, setFileExtension] = useState<string | null>(null);
  const [itemType, setItemType] = useState<FILE_TYPE | null>(null);

  const closeMenus = () => {
    setMenuNodeId(null);
    setAddMenuOpenId(null);
    setErrorMessage('');
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.menu-container')) {
        closeMenus();
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleAdd = (parentId: string, type: FILE_TYPE, extension?: string) => {
    setActiveParentId(parentId);
    setItemType(type);
    setFileExtension(extension || null);
    closeMenus();
  };

  const handleConfirmAdd = (parentId: string) => {
    let name =
      newItemName.trim() ||
      (itemType === FILE_TYPE.FOLDER
        ? 'New Folder'
        : `New File.${fileExtension}`);
    if (itemType === FILE_TYPE.FILE && !name.includes('.') && fileExtension) {
      name += `.${fileExtension}`;
    }

    const parentFolder = data.find((node) => node.id === parentId);
    if (parentFolder?.children?.some((child) => child.name === name)) {
      setErrorMessage(
        'This item already exists at this location. Please choose a different name.'
      );
      return;
    }

    onAdd(parentId, name, itemType as FILE_TYPE);
    setActiveParentId(null);
    setNewItemName('');
    setErrorMessage('');
  };

  const renderMenuItems = (nodeId: string) => (
    <div className="absolute right-[-160px] top-0 bg-white border rounded shadow-md p-1 w-40 z-30 menu-container">
      {MENU_ITEMS.map((item) => (
        <button
          key={item.label}
          onClick={() => handleAdd(nodeId, item.type, item.extension)}
          className="w-full px-2 py-1 text-left hover:bg-gray-200"
          data-testid="menu-item"
        >
          {item.label}
        </button>
      ))}
    </div>
  );

  const renderActionsMenu = (nodeId: string, isFolder: boolean) => (
    <div className="absolute right-0 mt-1 bg-white border rounded shadow-md p-1 w-36 z-20 menu-container">
      {isFolder && (
        <button
          onClick={() =>
            setAddMenuOpenId(addMenuOpenId === nodeId ? null : nodeId)
          }
          className="w-full px-2 py-1 hover:bg-gray-200 text-left"
          data-testid="add-button"
        >
          Add New...
        </button>
      )}
      <button
        onClick={() => {
          onDelete(nodeId);
          closeMenus();
        }}
        className="w-full px-2 py-1 hover:bg-gray-200 text-left text-red-500"
        data-testid="delete-button"
      >
        Delete
      </button>
      {addMenuOpenId === nodeId && renderMenuItems(nodeId)}
    </div>
  );

  const renderTree = (nodes: FileNode[]) =>
    nodes.map((node) => (
      <li key={node.id} className="relative mb-2">
        <div className="flex items-center justify-between p-2 rounded hover:bg-gray-200 transition duration-200 cursor-pointer">
          <div className="flex items-center gap-2">
            <span>{node.type === FILE_TYPE.FOLDER ? '📁' : '📄'}</span>
            <span>{node.name}</span>
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuNodeId(menuNodeId === node.id ? null : node.id);
              }}
              className="text-gray-600 hover:text-gray-800 px-2 py-0.5"
              data-testid="menu-button"
            >
              ⋮
            </button>
            {menuNodeId === node.id &&
              renderActionsMenu(node.id, node.type === FILE_TYPE.FOLDER)}
          </div>
        </div>
        {activeParentId === node.id && (
          <div className="ml-6 mt-2">
            <input
              type="text"
              placeholder={`Enter ${itemType === FILE_TYPE.FOLDER ? 'folder' : 'file'} name`}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmAdd(node.id)}
              onBlur={() => handleConfirmAdd(node.id)}
              autoFocus
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
            )}
          </div>
        )}
        {node.children && <ul className="ml-6">{renderTree(node.children)}</ul>}
      </li>
    ));

  return (
    <ul className="p-2">
      {data.length > 0 ? renderTree(data) : <p>No data available</p>}
    </ul>
  );
};

export default FileTreeView;
