import React from 'react';
import { render, screen } from '@testing-library/react';
import Breadcrumbs from './Breadcrumbs';
import { useFileTree } from '../../contexts/FileTreeContext';
import { initialData } from '../../constants/mocks';

jest.mock('../../contexts/FileTreeContext', () => ({
  useFileTree: jest.fn(),
}));

const path = ['My Files', 'public', 'images'];
const mockSetPath = jest.fn();
const mockSetSelectedNode = jest.fn();
const mockFileTree = initialData;

describe('Breadcrumbs Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useFileTree as jest.Mock).mockReturnValue({
      fileTree: mockFileTree,
      setSelectedNode: mockSetSelectedNode,
    });
  });

  it('renders the breadcrumb segments', () => {
    render(<Breadcrumbs path={path} setPath={mockSetPath} />);

    // Use regular expression to match the text segments
    path.forEach((segment) => {
      expect(screen.getByText(new RegExp(segment, 'i'))).toBeInTheDocument();
    });
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <Breadcrumbs path={path} setPath={mockSetPath} />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
