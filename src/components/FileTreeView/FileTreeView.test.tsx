import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FileTreeView from './FileTreeView';
import { FILE_TYPE } from '../../constants/fileTree';
import { initialData } from '../../constants/mocks';

describe('FileTreeView Component', () => {
  const mockOnAdd = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnSelect = jest.fn();
  const mockOnRename = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the file tree correctly', () => {
    render(
      <FileTreeView
        data={initialData}
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

  it('opens the actions menu for a specific node on button click', () => {
    render(
      <FileTreeView
        data={initialData}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
        onRename={mockOnRename}
        selectedNode={null}
      />
    );

    const menuButton = screen.getByTestId('menu-button-1');
    fireEvent.click(menuButton);

    expect(screen.getByTestId('add-button')).toBeInTheDocument();
    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
    expect(screen.getByTestId('rename-button')).toBeInTheDocument();
  });

  it('calls onDelete for the specific node when delete button is clicked', () => {
    render(
      <FileTreeView
        data={initialData}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
        onRename={mockOnRename}
        selectedNode={null}
      />
    );

    const menuButton = screen.getByTestId('menu-button-1');
    fireEvent.click(menuButton);

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('opens submenu for adding a new item for a specific node', () => {
    render(
      <FileTreeView
        data={initialData}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
        onRename={mockOnRename}
        selectedNode={null}
      />
    );

    const menuButton = screen.getByTestId('menu-button-1');
    fireEvent.click(menuButton);

    const addButton = screen.getByTestId('add-button');
    fireEvent.click(addButton);

    expect(screen.getByText('New Folder')).toBeInTheDocument();
    expect(screen.getByText('New Text Document')).toBeInTheDocument();
    expect(screen.getByText('New JSON Document')).toBeInTheDocument();
    expect(screen.getByText('New Image')).toBeInTheDocument();
  });

  it('calls onAdd when adding a new folder', () => {
    render(
      <FileTreeView
        data={initialData}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
        onRename={mockOnRename}
        selectedNode={null}
      />
    );

    const menuButton = screen.getByTestId('menu-button-1');
    fireEvent.click(menuButton);

    const addButton = screen.getByTestId('add-button');
    fireEvent.click(addButton);

    const newFolderButton = screen.getByText('New Folder');
    fireEvent.click(newFolderButton);

    const inputField = screen.getByPlaceholderText('Enter folder name');
    fireEvent.change(inputField, { target: { value: 'newFolder' } });
    fireEvent.keyDown(inputField, { key: 'Enter', code: 'Enter' });

    expect(mockOnAdd).toHaveBeenCalledWith('1', 'newFolder', FILE_TYPE.FOLDER);
  });

  it('calls onRename for a specific node when renaming a folder', () => {
    render(
      <FileTreeView
        data={initialData}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
        onRename={mockOnRename}
        selectedNode={initialData[0]}
      />
    );

    const menuButton = screen.getByTestId('menu-button-1');
    fireEvent.click(menuButton);

    const renameButton = screen.getByTestId('rename-button');
    fireEvent.click(renameButton);

    const inputField = screen.getByDisplayValue('public');
    fireEvent.change(inputField, { target: { value: 'newPublic' } });
    fireEvent.keyDown(inputField, { key: 'Enter', code: 'Enter' });

    expect(mockOnRename).toHaveBeenCalledWith('1', 'newPublic');
  });

  it('opens details modal when Details button is clicked', () => {
    render(
      <FileTreeView
        data={initialData}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
        onRename={mockOnRename}
        selectedNode={initialData[0]}
      />
    );

    const menuButton = screen.getByTestId('menu-button-1');
    fireEvent.click(menuButton);

    const detailsButton = screen.getByTestId('details-button');
    fireEvent.click(detailsButton);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <FileTreeView
        data={initialData}
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
