import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FileTreeView from './FileTreeView';
import { FILE_TYPE } from '../../constants/enums';
import { FileNode } from '../../types/FileNode';

describe('FileTreeView Component', () => {
  const mockOnAdd = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnSelect = jest.fn();

  const mockInitialData: FileNode[] = [
    { id: '1', name: 'public', type: FILE_TYPE.FOLDER },
    { id: '2', name: 'server', type: FILE_TYPE.FOLDER },
    { id: '3', name: 'src', type: FILE_TYPE.FOLDER },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the file tree correctly', () => {
    render(
      <FileTreeView
        data={mockInitialData}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByTestId('folder-name-1')).toHaveTextContent('public');
    expect(screen.getByTestId('folder-name-2')).toHaveTextContent('server');
    expect(screen.getByTestId('folder-name-3')).toHaveTextContent('src');
  });

  it('opens the actions menu on button click', () => {
    render(
      <FileTreeView
        data={mockInitialData}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    const menuButton = screen.getAllByTestId('menu-button')[0];
    fireEvent.click(menuButton);

    expect(screen.getByTestId('add-button')).toBeInTheDocument();
    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <FileTreeView
        data={mockInitialData}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    const menuButton = screen.getAllByTestId('menu-button')[0];
    fireEvent.click(menuButton);

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('opens submenu for adding a new item', () => {
    render(
      <FileTreeView
        data={mockInitialData}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    const menuButton = screen.getAllByTestId('menu-button')[0];
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
        data={mockInitialData}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    const menuButton = screen.getAllByTestId('menu-button')[0];
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

  it('closes menus when clicking outside', () => {
    render(
      <FileTreeView
        data={mockInitialData}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    const menuButton = screen.getAllByTestId('menu-button')[0];
    fireEvent.click(menuButton);

    expect(screen.getByTestId('add-button')).toBeInTheDocument();

    fireEvent.click(document.body);

    expect(screen.queryByTestId('add-button')).not.toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <FileTreeView
        data={mockInitialData}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
