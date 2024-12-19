import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { FileNode } from '../../types/FileNode';

interface FileViewerProps {
  selectedNode: FileNode | null;
  onUpdateContent: (id: string, content: string) => void; // Dodaj ID u funkciju
}

const FileViewer: React.FC<FileViewerProps> = ({
  selectedNode,
  onUpdateContent,
}) => {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    if (selectedNode?.type === 'file' && selectedNode.fileContent) {
      setContent(selectedNode.fileContent);
    }
  }, [selectedNode]);

  const handleContentChange = (value: string) => {
    setContent(value);
    if (selectedNode) {
      onUpdateContent(selectedNode.id, value);
    }
  };

  const renderFolderContent = (node: FileNode) => (
    <div className="p-4 border-l">
      <h2 className="text-lg font-bold mb-2" data-testid="file-name">
        {node.name}
      </h2>
      {node.children && node.children.length > 0 ? (
        <ul className="list-disc ml-6">
          {node.children.map((child) => (
            <li key={child.id} className="mb-1" data-testid="folder-item">
              {child.type === 'folder' ? '📁' : '📄'} {child.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Folder is empty.</p>
      )}
    </div>
  );

  const renderFileContent = (node: FileNode) => (
    <div className="p-4 border-l">
      <h2 className="text-lg font-bold mb-4" data-testid="file-name">
        {node.name}
      </h2>
      {node.name.endsWith('.png') ? (
        <img
          src={node.fileContent}
          alt={node.name}
          className="max-w-full h-auto border rounded"
          data-testid="image-file"
        />
      ) : (
        <ReactQuill
          value={content}
          onChange={handleContentChange}
          className="h-64 mb-4"
        />
      )}
    </div>
  );

  const renderContent = () => {
    if (!selectedNode) {
      return (
        <p data-testid="no-file-selected">
          Select a file or folder to view its contents.
        </p>
      );
    }
    return selectedNode.type === 'folder'
      ? renderFolderContent(selectedNode)
      : renderFileContent(selectedNode);
  };

  return (
    <div className="p-4 border-l">
      <h2 className="text-lg font-semibold mb-2">File Viewer</h2>
      {renderContent()}
    </div>
  );
};

export default FileViewer;
