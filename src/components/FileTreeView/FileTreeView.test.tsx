import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FileTreeView from './FileTreeView';
import { initialData } from '../../constants/mocks';

const mockOnAdd = jest.fn();
const mockOnDelete = jest.fn();
const mockOnSelect = jest.fn();
const mockOnRename = jest.fn();
const mockSetFileTree = jest.fn();
const mockSetMenuNode = jest.fn();
const mockCloseMenus = jest.fn();
const mockSetIsRenaming = jest.fn();
const mockSetActiveParentId = jest.fn();
const mockSetNewItemName = jest.fn();
const mockSetItemType = jest.fn();
const mockSetFileExtension = jest.fn();

const mockInitialData = initialData;

jest.mock('../../contexts/FileTreeContext', () => ({
  useFileTree: () => ({
    fileTree: mockInitialData,
    setFileTree: mockSetFileTree,
    handleAdd: mockOnAdd,
    handleRename: mockOnRename,
    closeMenus: mockCloseMenus,
    setIsRenaming: mockSetIsRenaming,
    setMenuNode: mockSetMenuNode,
    setActiveParentId: mockSetActiveParentId,
    setNewItemName: mockSetNewItemName,
    setItemType: mockSetItemType,
    setFileExtension: mockSetFileExtension,
    menuNode: '1',
    isRenaming: true, // For renaming test
    activeParentId: '1', // For adding test
    newItemName: '', // For adding test
    itemType: 'folder',
    fileExtension: null,
    selectedNode: mockInitialData[0], // Node being renamed
  }),
}));

describe('FileTreeView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the file tree correctly', () => {
    render(
      <FileTreeView
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
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
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
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
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
        selectedNode={null}
      />
    );

    const folderItem = screen.getByTestId('folder-name-1');
    fireEvent.mouseEnter(folderItem);

    const addButton = screen.getByTestId('add-button');
    fireEvent.click(addButton);

    expect(mockSetMenuNode).toHaveBeenCalledWith('1');
    expect(screen.getAllByTestId('menu-item').length).toBeGreaterThan(0);
  });

  it('calls handleAdd when a new folder is added', () => {
    render(
      <FileTreeView
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
        selectedNode={null}
      />
    );

    const folderItem = screen.getByTestId('folder-name-1');
    fireEvent.mouseEnter(folderItem);

    const addButton = screen.getByTestId('add-button');
    fireEvent.click(addButton);

    // Simulate selecting a menu item for adding a folder
    const folderOption = screen.getAllByTestId('menu-item')[0];
    fireEvent.click(folderOption);

    expect(mockSetActiveParentId).toHaveBeenCalledWith('1');

    // Check if input field is rendered
    const inputField = screen.getByTestId('add-input-field');
    fireEvent.change(inputField, { target: { value: 'newFolder' } });
    fireEvent.keyDown(inputField, { key: 'Enter', code: 'Enter' });

    expect(mockOnAdd).toHaveBeenCalledWith('1');
  });

  it('calls onDelete when Delete is clicked', () => {
    render(
      <FileTreeView
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
        selectedNode={null}
      />
    );

    const folderItem = screen.getByTestId('folder-name-1');
    fireEvent.mouseEnter(folderItem);

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('calls handleRename when renaming a folder', () => {
    render(
      <FileTreeView
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
        selectedNode={mockInitialData[0]}
      />
    );

    // Check if the rename input field is rendered
    const inputField = screen.getByTestId('rename-input-field');
    expect(inputField).toBeInTheDocument();

    // Simulate changing the name and submitting
    fireEvent.change(inputField, { target: { value: 'newPublic' } });
    fireEvent.keyDown(inputField, { key: 'Enter', code: 'Enter' });

    // Validate the rename handler is called with the correct arguments
    expect(mockOnRename).toHaveBeenCalledWith(
      mockInitialData[0].id,
      'newPublic'
    );
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <FileTreeView
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
        selectedNode={mockInitialData[0]}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
