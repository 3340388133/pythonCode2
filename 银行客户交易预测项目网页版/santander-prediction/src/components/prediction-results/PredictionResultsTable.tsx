import React, { useState } from 'react';

interface PredictionResultsTableProps {
  results: any[];
  loading?: boolean;
  threshold: number;
  onCustomerSelect: (customerId: string) => void;
  selectedCustomerId?: string;
}

const PredictionResultsTable: React.FC<PredictionResultsTableProps> = ({
  results,
  loading = false,
  threshold,
  onCustomerSelect,
  selectedCustomerId
}) => {
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const rowsPerPage = 10;

  const handlePreviousPage = () => {
    setPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage(prev => Math.min(prev + 1, totalPages));
  };

  // 过滤结果
  const filteredResults = results.filter(result => 
    result.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 计算总页数
  const totalPages = Math.ceil(filteredResults.length / rowsPerPage);

  // 获取当前页的数据
  const getCurrentPageData = () => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredResults.slice(startIndex, endIndex);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="prediction-results-table">
      {/* 搜索框 */}
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索客户ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* 表格 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3">客户ID</th>
              <th scope="col" className="px-4 py-3">预测概率</th>
              <th scope="col" className="px-4 py-3">预测结果</th>
              <th scope="col" className="px-4 py-3">实际结果</th>
              <th scope="col" className="px-4 py-3">预测状态</th>
              <th scope="col" className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {getCurrentPageData().map((result) => {
              const predictedClass = result.features.probability >= threshold ? 1 : 0;
              const isPredictionCorrect = predictedClass === result.target;
              
              return (
                <tr 
                  key={result.id} 
                  className={`bg-white border-b hover:bg-gray-50 ${
                    selectedCustomerId === result.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-4 py-2 font-medium">{result.id}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${result.features.probability * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2">{(result.features.probability * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      predictedClass === 1 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {predictedClass === 1 ? '是' : '否'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      result.target === 1 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {result.target === 1 ? '是' : '否'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isPredictionCorrect
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {isPredictionCorrect ? '正确' : '错误'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => onCustomerSelect(result.id)}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      查看详情
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* 分页控件 */}
      <div className="flex justify-between items-center mt-4 px-4 py-3 border-t">
        <div className="text-sm text-gray-700">
          显示 {((page - 1) * rowsPerPage) + 1} 到 {Math.min(page * rowsPerPage, filteredResults.length)} 条，共 {filteredResults.length} 条
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

export default PredictionResultsTable;