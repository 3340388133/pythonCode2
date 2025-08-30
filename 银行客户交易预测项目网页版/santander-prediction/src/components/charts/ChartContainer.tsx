import React from 'react';

export interface ChartContainerProps {
  title: string;
  children?: React.ReactNode;
  loading?: boolean;
  error?: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ title, children, loading = false, error }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {!loading && !error && children}
    </div>
  );
};

export default ChartContainer;