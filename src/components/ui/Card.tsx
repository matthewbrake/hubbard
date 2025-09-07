import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  titleIcon?: React.ReactNode;
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, titleIcon, children, className = '' }) => {
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 sm:p-6 ${className}`}>
      <div className="flex items-center mb-4">
        {titleIcon && <div className="mr-2 text-gray-400">{titleIcon}</div>}
        <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
};
