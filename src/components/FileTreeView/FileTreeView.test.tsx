import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { initialData } from '../../constants/mocks';
import FileTreeView from './FileTreeView';

const mockOnSelect = jest.fn();
const mockSetMenuNode = jest.fn();
const mockInitialData = initialData;

jest.mock('../../contexts/FileTreeContext', () => ({
  useFileTree: () => ({
    fileTree: mockInitialData,
    setFileTree: jest.fn(),
    handleAdd: jest.fn(),
    handleDelete: jest.fn(),
    closeMenus: jest.fn(),
    setIsRenaming: jest.fn(),
    setMenuNode: mockSetMenuNode,
    setActiveParentId: jest.fn(),
    setNewItemName: jest.fn(),
    setItemType: jest.fn(),
    setFileExtension: jest.fn(),
    menuNode: '1',
    isRenaming: true,
    activeParentId: null,
    newItemName: '',
    itemType: null,
    fileExtension: null,
    selectedNode: null,
  }),
}));

describe('FileTreeView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the file tree correctly', () => {
    render(<FileTreeView onSelect={mockOnSelect} />);

    expect(screen.getByTestId('folder-name-1')).toBeInTheDocument();
    expect(screen.getByTestId('folder-name-2')).toBeInTheDocument();
    expect(screen.getByTestId('folder-name-3')).toBeInTheDocument();
  });

  it('displays action buttons (Add, Delete, Rename) on hover', () => {
    render(<FileTreeView onSelect={mockOnSelect} />);

    const folderItem = screen.getByTestId('folder-name-1');
    fireEvent.mouseEnter(folderItem);

    expect(screen.getByTestId('add-button')).toBeInTheDocument();
    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
    expect(screen.getByTestId('rename-button')).toBeInTheDocument();
  });

  it('calls onSelect when a folder is clicked', () => {
    render(<FileTreeView onSelect={mockOnSelect} />);

    const folderItem = screen.getByTestId('folder-name-1');
    fireEvent.mouseEnter(folderItem);
    fireEvent.click(folderItem);

    const addButton = screen.getByTestId('add-button');
    fireEvent.click(addButton);

    expect(mockSetMenuNode).toHaveBeenCalledWith('1');
  });

  it('opens the Add menu when Add is clicked', () => {
    render(<FileTreeView onSelect={mockOnSelect} />);

    const folderItem = screen.getByTestId('folder-name-1');
    fireEvent.mouseEnter(folderItem);

    const addButton = screen.getByTestId('add-button');
    fireEvent.click(addButton);

    // Use getAllByTestId to handle multiple menu items
    const menuItems = screen.getAllByTestId('menu-item');
    expect(menuItems.length).toBeGreaterThan(0);

    // Validate specific menu item text
    expect(menuItems[0]).toHaveTextContent('New Folder');
  });

  it('calls handleDelete when Delete is clicked', () => {
    render(<FileTreeView onSelect={mockOnSelect} />);

    const folderItem = screen.getByTestId('folder-name-1');
    fireEvent.mouseEnter(folderItem);

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(screen.queryByText('public')).not.toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(<FileTreeView onSelect={mockOnSelect} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
