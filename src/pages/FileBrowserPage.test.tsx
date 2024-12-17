import React from 'react';
import { render } from '@testing-library/react';
import FileBrowserPage from './FileBrowserPage';

describe('File Browser Page Component', () => {
  it('renders correctly and matches snapshot', () => {
    const { asFragment } = render(<FileBrowserPage />);
    expect(asFragment).toMatchSnapshot();
  });
});
