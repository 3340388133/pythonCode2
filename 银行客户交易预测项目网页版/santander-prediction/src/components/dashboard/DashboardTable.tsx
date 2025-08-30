import React, { useState, useEffect } from 'react';
import { mockDataService } from '../../utils/mockDataService';

interface PredictionResult {
  id: string;
  customerId: string;
  probability: number;
  prediction: number;
  date: string;
}

const DashboardTable: React.FC = () => {
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await mockDataService.getRecentPredictions();
        setResults(data);
        setError(null);
      } catch (err) {
        setError('数据加载失败');
        console.error('Recent predictions fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
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
        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-4 py-3">客户ID</th>
            <th scope="col" className="px-4 py-3">预测概率</th>
            <th scope="col" className="px-4 py-3">预测结果</th>
            <th scope="col" className="px-4 py-3">预测日期</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
              <td className="px-4 py-2 font-medium">{result.customerId}</td>
              <td className="px-4 py-2">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${result.probability * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-2">{(result.probability * 100).toFixed(1)}%</span>
                </div>
              </td>
              <td className="px-4 py-2">
                {result.prediction === 1 ? (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    将进行交易
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    不会交易
                  </span>
                )}
              </td>
              <td className="px-4 py-2">{result.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;