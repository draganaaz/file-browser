import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FileTreeView from './FileTreeView';
import { FILE_TYPE } from '../../constants/fileTree';
import { initialData } from '../../constants/mocks';

const mockOnAdd = jest.fn();
const mockOnDelete = jest.fn();
const mockOnSelect = jest.fn();
const mockOnRename = jest.fn();
const mockSetFileTree = jest.fn();

const mockInitialData = initialData;

jest.mock('../../contexts/FileTreeContext', () => ({
  useFileTree: () => ({
    fileTree: mockInitialData,
    setFileTree: mockSetFileTree,
    onAdd: mockOnAdd,
    onDelete: mockOnDelete,
    onSelect: mockOnSelect,
    onRename: mockOnRename,
  }),
}));

describe('FileTreeView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the file tree correctly', () => {
    render(
      <FileTreeView
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
        onRename={mockOnRename}
        selectedNode={null}
      />
    );

    expect(screen.getByTestId('folder-name-1')).toHaveTextContent('public');
    expect(screen.getByTestId('folder-name-2')).toHaveTextContent('server');
    expect(screen.getByTestId('folder-name-3')).toHaveTextContent('src');
  });

  it('displays action buttons (Add, Delete, Rename) on hover', () => {
    render(
      <FileTreeView
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
        onRename={mockOnRename}
        selectedNode={null}
      />
    );

    const folderItem = screen.getByTestId('folder-name-1');
    fireEvent.mouseEnter(folderItem);

    expect(screen.getByTestId('add-button')).toBeInTheDocument();
    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
    expect(screen.getByTestId('rename-button')).toBeInTheDocument();
  });

  it('opens the add submenu when Add is clicked', () => {
    render(
      <FileTreeView
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
        onRename={mockOnRename}
        selectedNode={null}
      />
    );

    const folderItem = screen.getByTestId('folder-name-1');
    fireEvent.mouseEnter(folderItem);

    const addButton = screen.getByTestId('add-button');
    fireEvent.click(addButton);

    expect(screen.getByText('New Folder')).toBeInTheDocument();
    expect(screen.getByText('New Text Document')).toBeInTheDocument();
    expect(screen.getByText('New JSON Document')).toBeInTheDocument();
    expect(screen.getByText('New Image')).toBeInTheDocument();
  });

  it('calls onAdd when a new folder is added', () => {
    render(
      <FileTreeView
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
        onRename={mockOnRename}
        selectedNode={null}
      />
    );

    const folderItem = screen.getByTestId('folder-name-1');
    fireEvent.mouseEnter(folderItem);

    const addButton = screen.getByTestId('add-button');
    fireEvent.click(addButton);

    const folderOption = screen.getByText('New Folder');
    fireEvent.click(folderOption);

    const inputField = screen.getByPlaceholderText('Enter folder name');
    fireEvent.change(inputField, { target: { value: 'newFolder' } });
    fireEvent.keyDown(inputField, { key: 'Enter', code: 'Enter' });

    expect(mockOnAdd).toHaveBeenCalledWith('1', 'newFolder', FILE_TYPE.FOLDER);
  });

  it('calls onDelete when Delete is clicked', () => {
    render(
      <FileTreeView
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
        onRename={mockOnRename}
        selectedNode={null}
      />
    );

    const folderItem = screen.getByTestId('folder-name-1');
    fireEvent.mouseEnter(folderItem);

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('calls onRename when renaming a folder', () => {
    render(
      <FileTreeView
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
        onRename={mockOnRename}
        selectedNode={initialData[0]}
      />
    );

    const folderItem = screen.getByTestId('folder-name-1');
    fireEvent.mouseEnter(folderItem);

    const renameButton = screen.getByTestId('rename-button');
    fireEvent.click(renameButton);

    const inputField = screen.getByDisplayValue('public');
    fireEvent.change(inputField, { target: { value: 'newPublic' } });
    fireEvent.keyDown(inputField, { key: 'Enter', code: 'Enter' });

    expect(mockOnRename).toHaveBeenCalledWith('1', 'newPublic');
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <FileTreeView
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
        onRename={mockOnRename}
        selectedNode={initialData[0]}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
