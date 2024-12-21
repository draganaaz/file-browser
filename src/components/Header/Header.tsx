import React from 'react';
import { useFileTree } from '../../contexts/FileTreeContext';

const Header: React.FC = () => {
  const { searchTree } = useFileTree();

  return (
    <header className="w-full p-4 bg-blue-500 text-white shadow-md flex flex-col items-center gap-4 md:flex-row md:justify-start md:items-center">
      <h1 className="text-2xl font-bold text-center md:text-left">
        File Browser
      </h1>

      <input
        type="text"
        placeholder="Filter files..."
        className="w-full max-w-xs p-2 rounded text-gray-700 md:w-auto"
        onChange={(e) => searchTree(e.target.value)}
      />
    </header>
  );
};

export default Header;
