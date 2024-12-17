import React from 'react';

interface HeaderProps {
  handleFilter: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ handleFilter }) => {
  return (
    <header className="w-full p-4 bg-blue-500 text-white shadow-md flex flex-col items-center gap-4 md:flex-row md:justify-start md:items-center">
      <h1 className="text-2xl font-bold text-center md:text-left">
        File Browser
      </h1>

      <input
        type="text"
        placeholder="Filter files..."
        className="w-full max-w-xs p-2 rounded text-gray-700 md:w-auto"
        onChange={(e) => handleFilter(e.target.value)}
      />
    </header>
  );
};

export default Header;
