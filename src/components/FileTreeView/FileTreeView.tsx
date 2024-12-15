import React from 'react';
import { FILE_TYPE } from '../../constants/enums';
import { FileNode } from '../../types/FileNode';

interface FileTreeViewProps {
  data: FileNode[];
  onAdd: (parentId: string) => void;
  onDelete: (nodeId: string) => void;
}

const FileTreeView: React.FC<FileTreeViewProps> = ({
  data,
  onAdd,
  onDelete,
}) => {
  return (
    <ul>
      {data.map((node) => (
        <li key={node.id} className="group mb-2 pl-2">
          <div className="flex items-center">
            <span className="flex-1">
              {node.type === FILE_TYPE.FOLDER ? '📁' : '📄'} {node.name}
            </span>
            <button
              onClick={() => onAdd(node.id)}
              className="text-green-500 hover:text-green-700 opacity-0 group-hover:opacity-100"
            >
              +
            </button>
            <button
              onClick={() => onDelete(node.id)}
              className="text-red-500 hover:text-red-700 ml-2 opacity-0 group-hover:opacity-100"
            >
              x
            </button>
          </div>
          {node.children && (
            <FileTreeView
              data={node.children}
              onAdd={onAdd}
              onDelete={onDelete}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default FileTreeView;
