import React, { useEffect, useState, useCallback } from 'react';
import ReactQuill from 'react-quill';
import { FileNode } from '../../types/FileNode';
import { FILE_TYPE } from '../../constants/fileTree';
import 'react-quill/dist/quill.snow.css';

interface FileViewerProps {
  selectedNode: FileNode | null;
  onUpdateContent: (id: string, content: string) => void;
}

const FileViewer: React.FC<FileViewerProps> = ({
  selectedNode,
  onUpdateContent,
}) => {
  const [content, setContent] = useState<string>('');

  // Load content when selectedNode changes
  useEffect(() => {
    if (selectedNode?.type === FILE_TYPE.FILE && selectedNode.fileContent) {
      setContent(selectedNode.fileContent);
    }
  }, [selectedNode]);

  // Debounced content change handler
  const handleContentChange = useCallback((value: string) => {
    setContent(value);
  }, []);

  const handleSave = () => {
    if (selectedNode) {
      onUpdateContent(selectedNode.id, content);
    }
  };

  const handleDiscard = () => {
    if (selectedNode?.type === FILE_TYPE.FILE) {
      setContent(selectedNode.fileContent || '');
    }
  };

  const renderFolderContent = (node: FileNode) => (
    <>
      <h2 className="text-lg font-bold mb-2" data-testid="file-name">
        {node.name}
      </h2>
      {node.children && node.children.length > 0 ? (
        <ul className="list-disc ml-6">
          {node.children.map((child) => (
            <li key={child.id} className="mb-1" data-testid="folder-item">
              {child.type === FILE_TYPE.FOLDER ? '📁' : '📄'} {child.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Folder is empty.</p>
      )}
    </>
  );

  const renderFileContent = (node: FileNode) => (
    <>
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
        <>
          <ReactQuill
            value={content}
            onChange={handleContentChange}
            className="mb-6"
            theme="snow"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={handleDiscard}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Discard
            </button>
          </div>
        </>
      )}
    </>
  );

  const renderContent = () => {
    if (!selectedNode) {
      return (
        <p data-testid="no-file-selected">
          Select a file or folder to view its contents.
        </p>
      );
    }
    return selectedNode.type === FILE_TYPE.FOLDER
      ? renderFolderContent(selectedNode)
      : renderFileContent(selectedNode);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">File Viewer</h2>
      {renderContent()}
    </div>
  );
};

export default FileViewer;
