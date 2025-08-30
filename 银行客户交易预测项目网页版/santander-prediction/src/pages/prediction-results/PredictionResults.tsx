import React, { useState, useEffect } from 'react';
import { mockDataService } from '../../utils/mockDataService';
import { formatNumber, formatPercent } from '../../utils/dataUtils';
import StatCard from '../../components/ui/StatCard';
import ChartContainer from '../../components/charts/ChartContainer';
import PredictionDistributionChart from '../../components/prediction-results/PredictionDistributionChart';

const PredictionResults: React.FC = () => {
  const [predictionData, setPredictionData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const predictions = await mockDataService.getPredictionResults();
        setPredictionData(predictions);
        setError(null);
      } catch (err) {
        setError('数据加载失败，请稍后重试');
        console.error('Prediction results fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = {
    totalPredictions: predictionData?.length || 0,
    positivePredictions: predictionData?.filter((p: any) => p.prediction === 1).length || 0,
    avgProbability: predictionData?.reduce((sum: number, p: any) => sum + p.probability, 0) / (predictionData?.length || 1) || 0,
    highConfidence: predictionData?.filter((p: any) => p.probability > 0.8 || p.probability < 0.2).length || 0
  };

  return (
    <div className="prediction-results-container">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">预测结果</h1>
      
      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="总预测数"
          value={formatNumber(stats.totalPredictions)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
        />
        <StatCard
          title="正样本预测"
          value={formatNumber(stats.positivePredictions)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }
        />
        <StatCard
          title="平均概率"
          value={formatPercent(stats.avgProbability)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <StatCard
          title="高置信度预测"
          value={formatNumber(stats.highConfidence)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="预测分布" loading={loading} error={error || undefined}>
          <PredictionDistributionChart data={predictionData} />
        </ChartContainer>
        
        <ChartContainer title="客户搜索" loading={loading} error={error || undefined}>
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">搜索客户ID</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="输入客户ID..."
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
              搜索
            </button>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">请输入客户ID查看预测结果</p>
            </div>
          </div>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ChartContainer title="预测结果表格" loading={loading} error={error || undefined}>
          {predictionData && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3">客户ID</th>
                    <th scope="col" className="px-4 py-3">预测概率</th>
                    <th scope="col" className="px-4 py-3">预测结果</th>
                    <th scope="col" className="px-4 py-3">置信度</th>
                  </tr>
                </thead>
                <tbody>
                  {predictionData.slice(0, 20).map((item: any) => (
                    <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">{item.id}</td>
                      <td className="px-4 py-2">{(item.probability * 100).toFixed(2)}%</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.prediction === 1 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.prediction === 1 ? '交易' : '不交易'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.probability > 0.8 || item.probability < 0.2
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.probability > 0.8 || item.probability < 0.2 ? '高' : '中'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ChartContainer>
      </div>
    </div>
  );
};

export default PredictionResults;