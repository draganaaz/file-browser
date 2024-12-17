import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';

const mockHandleFilter = jest.fn();

describe('Header Component', () => {
  beforeEach(() => {
    mockHandleFilter.mockClear();
  });

  it('renders the header title', () => {
    render(<Header handleFilter={mockHandleFilter} />);
    const titleElement = screen.getByText('File Browser');
    expect(titleElement).toBeInTheDocument();
  });

  it('calls handleFilter when input changes', () => {
    render(<Header handleFilter={mockHandleFilter} />);

    const inputElement = screen.getByPlaceholderText('Filter files...');
    fireEvent.change(inputElement, { target: { value: 'test' } });

    expect(mockHandleFilter).toHaveBeenCalledTimes(1);
    expect(mockHandleFilter).toHaveBeenCalledWith('test');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<Header handleFilter={mockHandleFilter} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
