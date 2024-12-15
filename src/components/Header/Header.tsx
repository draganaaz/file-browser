import React from 'react';

interface HeaderProps {
  handleFilter: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ handleFilter }) => {
  return (
    <header className="w-full p-4 bg-blue-500 text-white shadow-md flex items-center justify-start gap-4">
      <h1 className="text-2xl font-bold">File Browser</h1>
      <input
        type="text"
        placeholder="Filter files..."
        className="p-2 rounded text-gray-700"
        onChange={(e) => handleFilter(e.target.value)}
      />
    </header>
  );
};

export default Header;
