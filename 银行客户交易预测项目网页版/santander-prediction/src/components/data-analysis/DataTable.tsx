import React, { useState, useEffect } from 'react';
import { mockDataService } from '../../utils/mockDataService';

interface DataTableProps {
  selectedFeatures: string[];
  loading?: boolean;
}

interface SampleData {
  id: string;
  target: number;
  features: Record<string, number>;
}

const DataTable: React.FC<DataTableProps> = ({ selectedFeatures, loading = false }) => {
  const [data, setData] = useState<SampleData[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTableLoading(true);
        // 模拟从API获取数据
        const results = await mockDataService.getPredictionResults();
        setData(results);
        setTotalPages(Math.ceil(results.length / rowsPerPage));
        setError(null);
      } catch (err) {
        setError('数据加载失败');
        console.error('Data table fetch error:', err);
      } finally {
        setTableLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePreviousPage = () => {
    setPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage(prev => Math.min(prev + 1, totalPages));
  };

  // 获取当前页的数据
  const getCurrentPageData = () => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  };

  if (loading || tableLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3">客户ID</th>
            <th scope="col" className="px-4 py-3">目标变量</th>
            {selectedFeatures.map(feature => (
              <th key={feature} scope="col" className="px-4 py-3">{feature}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {getCurrentPageData().map((item) => (
            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-4 py-2 font-medium">{item.id}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.target === 1 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.target === 1 ? '是' : '否'}
                </span>
              </td>
              {selectedFeatures.map(feature => (
                <td key={feature} className="px-4 py-2">
                  {item.features[feature] !== undefined 
                    ? item.features[feature].toFixed(4) 
                    : 'N/A'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 分页控件 */}
      <div className="flex justify-between items-center mt-4 px-4">
        <div className="text-sm text-gray-700">
          显示 {((page - 1) * rowsPerPage) + 1} 到 {Math.min(page * rowsPerPage, data.length)} 条，共 {data.length} 条
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className={`px-3 py-1 rounded ${
              page === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            上一页
          </button>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded ${
              page === totalPages 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;