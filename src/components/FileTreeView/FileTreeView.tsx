import React, { useState, useRef, SyntheticEvent } from 'react';
import { FILE_TYPE, MENU_ITEMS } from '../../constants/fileTree';
import { FileNode } from '../../types/FileNode';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { useFileTree } from '../../contexts/FileTreeContext';
import { handleDeleteNode } from '../../utils/treeService';

interface FileTreeViewProps {
  onSelect: (node: FileNode, path: string[]) => void;
}

const FileTreeView: React.FC<FileTreeViewProps> = ({ onSelect }) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const {
    fileTree,
    setFileTree,
    handleAdd,
    setFileExtension,
    activeParentId,
    setActiveParentId,
    itemType,
    newItemName,
    setNewItemName,
    setItemType,
    closeMenus,
    errorMessage,
    menuNode,
    setMenuNode,
    handleRename,
    isRenaming,
    setIsRenaming,
    selectedNode,
    handleDelete,
  } = useFileTree();

  const menuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(menuRef, () => closeMenus());

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
    setFileTree((prevData) => toggleNode(nodeId, prevData));
  };

  // Initializes the addition process by setting state
  const startAdd = (parentId: string, type: FILE_TYPE, extension?: string) => {
    setActiveParentId(parentId);
    setItemType(type);
    extension && setFileExtension(extension);

    closeMenus();
  };

  const renderAddInputField = (node: FileNode) => (
    <div className="ml-6 mt-2">
      <label htmlFor={`add-input-${node.id}`} className="sr-only">
        Enter {itemType === FILE_TYPE.FOLDER ? 'folder' : 'file'} name
      </label>
      <input
        id={`add-input-${node.id}`}
        type="text"
        placeholder={`Enter ${itemType === FILE_TYPE.FOLDER ? 'folder' : 'file'} name`}
        value={newItemName}
        onChange={(e) => setNewItemName(e.target.value)}
        onKeyDown={(e) => {
          e.key === 'Enter' && handleAdd(node.id);
        }}
        onBlur={() => {
          handleAdd(node.id);
        }}
        autoFocus
        className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        data-testid="add-input-field"
        aria-invalid={!!errorMessage}
        aria-describedby={`error-message-${node.id}`}
      />
      {errorMessage && (
        <p
          id={`error-message-${node.id}`}
          className="text-red-500 text-sm mt-1"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );

  const renderRenameInputField = (node: FileNode) => (
    <div className="ml-6 mt-2">
      <label htmlFor={`rename-input-${node.id}`} className="sr-only">
        Rename {node.name}
      </label>
      <input
        id={`rename-input-${node.id}`}
        type="text"
        defaultValue={node.name}
        onBlur={(e) => handleRename(node.id, e.target.value)}
        onKeyDown={(e) =>
          e.key === 'Enter' && handleRename(node.id, e.currentTarget.value)
        }
        autoFocus
        className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        data-testid="rename-input-field"
        aria-invalid={!!errorMessage}
        aria-describedby={`error-message-${node.id}`}
      />
      {errorMessage && (
        <p
          id={`error-message-${node.id}`}
          className="text-red-500 text-sm mt-1"
        >
          {errorMessage}
        </p>
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
          onClick={() => startAdd(nodeId, item.type, item.extension)}
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
        <li key={node.id} className="relative mb-2">
          <div
            className="flex items-center justify-between p-2 rounded hover:bg-gray-200 cursor-pointer"
            onMouseEnter={() => setHoveredNodeId(node.id)}
            onMouseLeave={() => setHoveredNodeId(null)}
            onClick={() => {
              onSelect(node, newPath);
            }}
            role="treeitem"
            aria-expanded={isFolder ? isExpanded : undefined}
            aria-label={node.name}
          >
            <div className="flex items-center">
              {isFolder && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(node.id);
                  }}
                  className="mr-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                  data-testid={`toggle-button-${node.id}`}
                  aria-label={isExpanded ? 'Collapse folder' : 'Expand folder'}
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? '⏷' : '⏵'}
                </button>
              )}
              {/* Renaming node */}
              {isRenaming && selectedNode?.id === node.id ? (
                renderRenameInputField(node)
              ) : (
                // Displaying regular node
                <span className="flex-1" data-testid={`folder-name-${node.id}`}>
                  {isFolder ? (isExpanded ? '📂' : '📁') : '📄'} {node.name}
                </span>
              )}
            </div>
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
                    aria-label="Add item"
                  >
                    Add
                  </button>
                )}
                <button
                  onClick={() => setIsRenaming(true)}
                  className="text-blue-500 hover:underline"
                  data-testid="rename-button"
                  aria-label="Rename item"
                >
                  Rename
                </button>
                <button
                  onClick={(e) => {
                    handleDelete(e, node.id);
                  }}
                  className="text-red-500 hover:underline"
                  data-testid="delete-button"
                  aria-label="Delete item"
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
            <ul
              className="ml-4"
              role="group"
              aria-label={`Contents of ${node.name}`}
            >
              {renderTree(node.children, newPath)}
            </ul>
          )}
        </li>
      );
    });

  return (
    <ul className="p-2" role="tree" aria-label="File Tree">
      {fileTree.length > 0 ? renderTree(fileTree) : <p>No files available</p>}
    </ul>
  );
};

export default FileTreeView;
