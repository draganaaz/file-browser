import React from 'react';
import { render, screen } from '@testing-library/react';
import FileViewer from './FileViewer';
import { FileNode } from '../../types/FileNode';
import { FILE_TYPE } from '../../constants/enums';

describe('FileViewer Component', () => {
  const mockOnUpdateContent = jest.fn();

  const folderNode: FileNode = {
    id: '1',
    name: 'folder',
    type: FILE_TYPE.FOLDER,
    children: [
      { id: '2', name: 'file.txt', type: FILE_TYPE.FILE, fileContent: '' },
    ],
  };

  const imageFileNode: FileNode = {
    id: '3',
    name: 'image.png',
    type: FILE_TYPE.FILE,
  };

  it('renders placeholder when no file is selected', () => {
    render(
      <FileViewer selectedNode={null} onUpdateContent={mockOnUpdateContent} />
    );
    expect(screen.getByTestId('no-file-selected')).toHaveTextContent(
      'Select a file or folder to view its contents.'
    );
  });

  it('renders folder content correctly', () => {
    render(
      <FileViewer
        selectedNode={folderNode}
        onUpdateContent={mockOnUpdateContent}
      />
    );
    expect(screen.getByTestId('file-name')).toHaveTextContent('folder');
    expect(screen.getAllByTestId('folder-item')).toHaveLength(1);
  });

  it('renders image file content correctly', () => {
    render(
      <FileViewer
        selectedNode={imageFileNode}
        onUpdateContent={mockOnUpdateContent}
      />
    );
    const image = screen.getByTestId('image-file');

    expect(image).toHaveAttribute('alt', 'image.png');
  });
});
