import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';

const mockSearchTree = jest.fn();

jest.mock('../../contexts/FileTreeContext', () => ({
  useFileTree: () => ({
    fileTree: [],
    setFileTree: jest.fn(),
    searchTree: mockSearchTree,
  }),
}));

describe('Header Component', () => {
  beforeEach(() => {
    mockSearchTree.mockClear();
  });

  it('renders the header title', () => {
    render(<Header />);
    const titleElement = screen.getByText('File Browser');
    expect(titleElement).toBeInTheDocument();
  });

  it('calls searchTree when input changes', () => {
    render(<Header />);

    const inputElement = screen.getByPlaceholderText('Filter files...');
    fireEvent.change(inputElement, { target: { value: 'notes' } });

    expect(mockSearchTree).toHaveBeenCalledTimes(1);
    expect(mockSearchTree).toHaveBeenCalledWith('notes');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
});
