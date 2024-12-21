import React, {
  useState,
  useRef,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  FILE_TYPE,
  MENU_ITEMS,
  VALID_EXTENSIONS,
} from '../../constants/fileTree';
import { FileNode } from '../../types/FileNode';
import { isValidFileName } from '../../utils/validations';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { findNodeById } from '../../utils/treeService';

interface FileTreeViewProps {
  data: FileNode[];
  setData: Dispatch<SetStateAction<FileNode[]>>;
  onAdd: (parentId: string, name: string, type: FILE_TYPE) => void;
  onDelete: (nodeId: string) => void;
  onSelect: (node: FileNode, path: string[]) => void;
  onRename: (nodeId: string, newName: string) => void;
  selectedNode: FileNode | null;
}

const FileTreeView: React.FC<FileTreeViewProps> = ({
  data,
  setData,
  onAdd,
  onDelete,
  onRename,
  onSelect,
  selectedNode,
}) => {
  const [menuNode, setMenuNode] = useState<string | null>(null);
  const [activeParentId, setActiveParentId] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fileExtension, setFileExtension] = useState<string | null>(null);
  const [itemType, setItemType] = useState<FILE_TYPE | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenus = useCallback(() => {
    setMenuNode(null);
    setErrorMessage('');
    setIsRenaming(false);
  }, []);

  const toggleNode = (nodeId: string, nodes: FileNode[]): FileNode[] =>
    nodes.map((node) => {
      if (node.id === nodeId) {
        return { ...node, isExpanded: !node.isExpanded };
      }
      if (node.children) {
        return { ...node, children: toggleNode(nodeId, node.children) };
      }
      return node;
    });

  const handleToggle = (nodeId: string) => {
    setData((prevData) => toggleNode(nodeId, prevData));
  };

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

  const renderTree = (nodes: FileNode[], path: string[] = ['My Files']) =>
    nodes.map((node) => {
      const isHovered = hoveredNodeId === node.id;
      const isFolder = node.type === FILE_TYPE.FOLDER;
      const isExpanded = node.isExpanded ?? false;
      const newPath = [...path, node.name];

      return (
        <li
          key={node.id}
          className="relative mb-2"
          // TODO: Sometimes doens't work well when moving from one to another
          onMouseEnter={() => setHoveredNodeId(node.id)}
          onMouseLeave={() => setHoveredNodeId(null)}
        >
          <div
            className="flex items-center justify-between p-2 rounded hover:bg-gray-200 cursor-pointer"
            onClick={() => {
              if (isFolder) {
                handleToggle(node.id);
              }
              onSelect(node, newPath);
            }}
          >
            {/* Renaming node */}
            {isRenaming && selectedNode?.id === node.id ? (
              renderRenameInputField(node)
            ) : (
              // Displaying regular node
              <span data-testid={`folder-name-${node.id}`}>
                {isFolder ? (isExpanded ? '📂' : '📁') : '📄'} {node.name}
              </span>
            )}
            {isHovered && (
              <div className="flex items-center gap-2">
                {isFolder && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuNode(node.id);
                    }}
                    className="text-blue-500 hover:underline"
                    data-testid="add-button"
                  >
                    Add
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsRenaming(true);
                  }}
                  className="text-blue-500 hover:underline"
                  data-testid="rename-button"
                >
                  Rename
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(node.id);
                    closeMenus();
                  }}
                  className="text-red-500 hover:underline"
                  data-testid="delete-button"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          {activeParentId === node.id && renderAddInputField(node)}
          {menuNode === node.id && renderMenuItems(node.id)}

          {/* Render subtree */}
          {isFolder && isExpanded && node.children && (
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
    </>
  );
};

export default FileTreeView;
