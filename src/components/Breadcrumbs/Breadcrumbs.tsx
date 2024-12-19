import React from 'react';

interface BreadcrumbsProps {
  path: string[];
  onClick: (index: number) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ path, onClick }) => {
  return (
    <div className="text-gray-500 mb-4">
      {path.map((segment, index) => (
        <span
          key={index}
          className="cursor-pointer"
          onClick={() => onClick(index)}
        >
          {segment} {index < path.length - 1 && ' / '}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;
