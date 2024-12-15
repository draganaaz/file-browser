import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full p-4 bg-blue-500 text-white shadow-md flex items-center justify-start gap-4">
      <h1 className="text-2xl font-bold">File Browser</h1>
      <input
        type="text"
        placeholder="Filter files..."
        className="p-2 rounded text-gray-700"
      />
    </header>
  );
};

export default Header;
