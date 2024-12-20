import React, { useState, useRef, useCallback } from 'react';
import {
  FILE_TYPE,
  MENU_ITEMS,
  VALID_EXTENSIONS,
} from '../../constants/fileTree';
import { FileNode } from '../../types/FileNode';
import { isValidFileName } from '../../utils/validations';
import Modal from '../Modal/Modal';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { findNodeById } from '../../utils/treeService';

interface FileTreeViewProps {
  data: FileNode[];
  onAdd: (parentId: string, name: string, type: FILE_TYPE) => void;
  onDelete: (nodeId: string) => void;
  onSelect: (node: FileNode, path: string[]) => void;
  onRename: (nodeId: string, newName: string) => void;
  selectedNode: FileNode | null;
}

const FileTreeView: React.FC<FileTreeViewProps> = ({
  data,
  onAdd,
  onDelete,
  onRename,
  onSelect,
  selectedNode,
}) => {
  const [menuNodeId, setMenuNodeId] = useState<string | null>(null);
  const [submenuNodeId, setSubmenuNodeId] = useState<string | null>(null);
  const [activeParentId, setActiveParentId] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fileExtension, setFileExtension] = useState<string | null>(null);
  const [itemType, setItemType] = useState<FILE_TYPE | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenus = useCallback(() => {
    setMenuNodeId(null);
    setSubmenuNodeId(null);
    setErrorMessage('');
    setIsRenaming(false);
    setShowDetails(false);
  }, []);

  useOutsideClick(menuRef, () => closeMenus());

  const handleAdd = (parentId: string, type: FILE_TYPE, extension?: string) => {
    setActiveParentId(parentId);
    setItemType(type);
    extension && setFileExtension(extension);
    closeMenus();
  };

  const handleConfirmAdd = (parentId: string) => {
    let name = newItemName.trim();

    // When no name provided, discard the input
    if (!name) {
      setActiveParentId(null);
      setNewItemName('');
      setErrorMessage('');
      return;
    }

    if (itemType === FILE_TYPE.FILE) {
      const nameParts = name.split('.');
      const nameExtension =
        nameParts.length > 1 ? nameParts.pop() : fileExtension;

      if (
        nameExtension &&
        !Object.values(VALID_EXTENSIONS).includes(nameExtension)
      ) {
        setErrorMessage(
          'Invalid file extension. Please use a valid extension.'
        );
        return;
      }
      name = nameParts.join('.') + '.' + nameExtension;
    }

    if (!isValidFileName(name)) {
      setErrorMessage('Invalid name. Please avoid special characters.');
      return;
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

  const handleRename = (nodeId: string, newName: string) => {
    // Discard any ongoing addition before proceeding to renaming
    setActiveParentId(null);

    const node = findNodeById(data, nodeId);

    if (!node) {
      setErrorMessage('File/Folder not found.');
      return;
    }

    const nameParts = newName.trim().split('.');
    const newBaseName = nameParts.slice(0, -1).join('.') || nameParts[0];
    const newExtension = nameParts.length > 1 ? nameParts.pop() : null;

    if (node.type === FILE_TYPE.FILE) {
      const originalExtension = node.name.split('.').pop();

      // If no extension is provided, use the original one
      const finalExtension = newExtension || originalExtension;

      // Validate the new extension
      if (
        finalExtension &&
        !Object.values(VALID_EXTENSIONS).includes(finalExtension)
      ) {
        setErrorMessage(
          `Invalid file extension. You must use a valid extension.`
        );
        return;
      }

      newName = newBaseName + (finalExtension ? `.${finalExtension}` : '');
    } else {
      newName = newBaseName; // For folders, avoid adding any extensions.
    }

    // Validate the full name
    if (!isValidFileName(newName)) {
      setErrorMessage('Invalid name. Please avoid special characters.');
      return;
    }

    onRename(nodeId, newName);
    setIsRenaming(false);
    setErrorMessage('');
  };

  const handleModalClose = () => {
    setShowDetails(false);
    setMenuNodeId(null);
  };

  const handleDetailsClick = (nodeId: string) => {
    const node = data.find((node) => node.id === nodeId);
    if (node) {
      setShowDetails(true);
      setMenuNodeId(null);
    }
  };

  const renderAddInputField = (node: FileNode) => (
    <div className="ml-6 mt-2">
      <input
        type="text"
        placeholder={`Enter ${itemType === FILE_TYPE.FOLDER ? 'folder' : 'file'} name`}
        value={newItemName}
        onChange={(e) => setNewItemName(e.target.value)}
        onKeyDown={(e) => {
          e.key === 'Enter' && handleConfirmAdd(node.id);
        }}
        onBlur={() => {
          handleConfirmAdd(node.id);
        }}
        autoFocus
        className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );

  const renderRenameInputField = (node: FileNode) => (
    <div className="ml-6 mt-2">
      <input
        type="text"
        defaultValue={node.name}
        onBlur={(e) => handleRename(node.id, e.target.value)}
        onKeyDown={(e) =>
          e.key === 'Enter' && handleRename(node.id, e.currentTarget.value)
        }
        autoFocus
        className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );

  const renderMenuItems = (nodeId: string) => (
    <div
      className="absolute right-[-160px] top-0 bg-white border rounded shadow-md p-1 w-40 z-30 menu-container"
      ref={menuRef}
    >
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
            setSubmenuNodeId(submenuNodeId === nodeId ? null : nodeId)
          }
          className="w-full px-2 py-1 hover:bg-gray-200 text-left"
          data-testid="add-button"
        >
          Add New...
        </button>
      )}
      <button
        onClick={() => {
          setIsRenaming(true);
          setMenuNodeId(null);
        }}
        className="w-full px-2 py-1 hover:bg-gray-200 text-left"
        data-testid="rename-button"
      >
        Rename
      </button>
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
      <button
        onClick={() => handleDetailsClick(nodeId)}
        className="w-full px-2 py-1 hover:bg-gray-200 text-left"
        data-testid="details-button"
      >
        Details
      </button>
      {submenuNodeId === nodeId && renderMenuItems(nodeId)}
    </div>
  );

  const renderTree = (nodes: FileNode[], path: string[] = ['My Files']) =>
    nodes.map((node) => {
      const newPath = [...path, node.name];

      return (
        <li key={node.id} className="relative mb-2">
          <div
            className="flex items-center justify-between p-2 rounded hover:bg-gray-200 cursor-pointer"
            onClick={() => onSelect(node, newPath)}
          >
            {/* Renaming node */}
            {isRenaming && selectedNode?.id === node.id ? (
              renderRenameInputField(node)
            ) : (
              // Displaying regular node
              <span data-testid={`folder-name-${node.id}`}>
                {node.type === FILE_TYPE.FOLDER ? '📁' : '📄'} {node.name}
              </span>
            )}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuNodeId(menuNodeId === node.id ? null : node.id);
                }}
                className="text-gray-600 hover:text-gray-800 px-2 py-0.5"
                data-testid={`menu-button-${node.id}`}
              >
                ⋮
              </button>
              {menuNodeId === node.id &&
                renderActionsMenu(node.id, node.type === FILE_TYPE.FOLDER)}
            </div>
          </div>
          {activeParentId === node.id && renderAddInputField(node)}

          {/* Render subtree */}
          {node.children && (
            <ul className="ml-4">{renderTree(node.children, newPath)}</ul>
          )}
        </li>
      );
    });

  return (
    <>
      <ul className="p-2">
        {data.length > 0 ? renderTree(data) : <p>No files available</p>}
      </ul>
      {showDetails && selectedNode && (
        <Modal
          show={true}
          onClose={handleModalClose}
          title={`Details for ${selectedNode.name}`}
        >
          <div className="text-sm text-gray-600">
            <p>Created At: {selectedNode.createdAt?.toLocaleString()}</p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default FileTreeView;
