
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleIcon?: JSX.Element;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', titleIcon }) => {
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden ${className}`}>
      <div className="bg-gray-900 px-4 py-3 border-b border-gray-700 flex items-center">
        {titleIcon && <div className="mr-2 text-gray-400">{titleIcon}</div>}
        <h3 className="text-md font-semibold text-gray-200">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};
