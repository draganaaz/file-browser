import React, { Dispatch, SetStateAction } from 'react';
import { FileNode } from '../../types/FileNode';
import { useFileTree } from '../../contexts/FileTreeContext';

interface BreadcrumbsProps {
  path: string[];
  setPath: Dispatch<SetStateAction<string[]>>;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ path, setPath }) => {
  const { fileTree, setSelectedNode } = useFileTree();

  const handleBreadcrumbClick = (index: number) => {
    const newPath: string[] = ['My Files'];
    let currentNode: FileNode | null = null;
    let currentTree = fileTree;

    // Iterate through the breadcrumb segments up to the clicked index
    for (let i = 1; i <= index; i++) {
      const segment = path[i];
      newPath.push(segment);

      currentNode = currentTree.find((node) => node.name === segment) || null;
      currentTree = currentNode?.children || [];
    }

    setPath(newPath);
    setSelectedNode(currentNode);
  };

  return (
    <div
      role="navigation"
      aria-label="Breadcrumbs"
      className="text-gray-500 mb-4"
    >
      {path.map((segment, index) => (
        <span
          key={index}
          className="cursor-pointer"
          onClick={() => handleBreadcrumbClick(index)}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleBreadcrumbClick(index);
            }
          }}
          aria-label={`Navigate to ${segment}`}
        >
          {segment} {index < path.length - 1 && ' / '}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;
