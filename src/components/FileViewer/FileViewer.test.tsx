import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FileViewer from './FileViewer'; // Adjust the import path if necessary
import { FILE_TYPE } from '../../constants/fileTree';
import { FileNode } from '../../types/FileNode';

const mockSetFileTree = jest.fn();
let mockSelectedNode: FileNode | null;

jest.mock('../../contexts/FileTreeContext', () => ({
  useFileTree: () => ({
    selectedNode: mockSelectedNode,
    setFileTree: mockSetFileTree,
  }),
}));

jest.mock('react-quill', () => {
  return function MockReactQuill({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) {
    return (
      <textarea
        data-testid="quill-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };
});

describe('FileViewer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSelectedNode = null;
  });

  it('renders no file selected message', () => {
    render(<FileViewer />);

    expect(screen.getByTestId('no-file-selected')).toBeInTheDocument();
  });

  it('renders folder contents', () => {
    mockSelectedNode = {
      id: '1',
      name: 'public',
      type: FILE_TYPE.FOLDER,
      children: [
        {
          id: '1-1',
          name: 'exus-logo.png',
          type: FILE_TYPE.FILE,
          fileContent: '/exus.png',
        },
      ],
    };
    render(<FileViewer />);

    expect(screen.getByText(mockSelectedNode.name)).toBeInTheDocument();
    expect(screen.getByTestId('folder-item')).toBeInTheDocument();
  });

  it('renders file contents', () => {
    mockSelectedNode = {
      id: '2-2',
      name: 'notes.txt',
      type: FILE_TYPE.FILE,
      fileContent: 'This is a sample text file.',
    };
    render(<FileViewer />);

    expect(screen.getByTestId('file-name')).toHaveTextContent(
      mockSelectedNode.name
    );
    expect(screen.getByTestId('quill-editor')).toHaveValue(
      mockSelectedNode.fileContent
    );
  });

  it('updates file content on save', () => {
    mockSelectedNode = {
      id: '2-2',
      name: 'notes.txt',
      type: FILE_TYPE.FILE,
      fileContent: 'This is a sample text file.',
    };
    render(<FileViewer />);

    const newContent = 'Updated content';
    const quillEditor = screen.getByTestId('quill-editor');
    fireEvent.change(quillEditor, { target: { value: newContent } });

    fireEvent.click(screen.getByText('Save'));
    expect(mockSetFileTree).toHaveBeenCalledWith(expect.any(Function));
  });

  it('reverts file content on discard', () => {
    mockSelectedNode = {
      id: '2-2',
      name: 'notes.txt',
      type: FILE_TYPE.FILE,
      fileContent: 'This is a sample text file.',
    };
    render(<FileViewer />);

    const quillEditor = screen.getByTestId('quill-editor');
    fireEvent.change(quillEditor, { target: { value: 'Temporary change' } });

    fireEvent.click(screen.getByText('Discard'));
    expect(quillEditor).toHaveValue(mockSelectedNode.fileContent);
  });

  it('renders image file', () => {
    mockSelectedNode = {
      id: '1-1',
      name: 'exus-logo.png',
      type: FILE_TYPE.FILE,
      fileContent: '/exus.png',
    };
    render(<FileViewer />);

    const image = screen.getByTestId('image-file');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockSelectedNode.fileContent);
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<FileViewer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
