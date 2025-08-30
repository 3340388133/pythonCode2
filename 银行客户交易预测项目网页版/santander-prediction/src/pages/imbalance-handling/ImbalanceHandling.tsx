import React, { useState, useEffect } from 'react';
import { mockDataService } from '../../utils/mockDataService';
import { formatNumber, formatPercent } from '../../utils/dataUtils';
import StatCard from '../../components/ui/StatCard';
import ChartContainer from '../../components/charts/ChartContainer';
import ImbalanceMethodsComparisonChart from '../../components/imbalance-handling/ImbalanceMethodsComparisonChart';
import ImbalanceConfusionMatrixChart from '../../components/imbalance-handling/ImbalanceConfusionMatrixChart';
import ImbalanceMethodsTable from '../../components/imbalance-handling/ImbalanceMethodsTable';

const ImbalanceHandling: React.FC = () => {
  const [methodsData, setMethodsData] = useState<any>(null);
  const [confusionMatrixData, setConfusionMatrixData] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('SMOTE');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const methods = ['原始数据', 'SMOTE', 'ADASYN', '随机过采样', '随机欠采样', 'NearMiss', 'TomekLinks', 'SMOTEENN', 'SMOTETomek', '代价敏感学习'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [methods, confusionMatrix] = await Promise.all([
          mockDataService.getImbalanceMethodsComparison(),
          mockDataService.getImbalanceConfusionMatrix(selectedMethod)
        ]);
        setMethodsData(methods);
        setConfusionMatrixData(confusionMatrix);
        setError(null);
      } catch (err) {
        setError('数据加载失败，请稍后重试');
        console.error('Imbalance handling fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMethod]);

  const stats = {
    totalMethods: methods.length,
    bestMethod: methodsData?.reduce((best: any, current: any) => 
      (current.metrics.f1 > best.metrics.f1) ? current : best, 
      methodsData?.[0] || {}
    ),
    avgF1: methodsData?.reduce((sum: number, m: any) => sum + m.metrics.f1, 0) / (methodsData?.length || 1) || 0,
    balancedMethods: methodsData?.filter((m: any) => Math.abs(m.sampleRatio.negative - m.sampleRatio.positive) < 2000).length || 0
  };

  return (
    <div className="imbalance-handling-container">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">不平衡处理</h1>
      
      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="处理方法数"
          value={formatNumber(stats.totalMethods)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />
        <StatCard
          title="最佳方法"
          value={stats.bestMethod?.method || 'N/A'}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
        />
        <StatCard
          title="平均F1分数"
          value={formatPercent(stats.avgF1)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <StatCard
          title="平衡方法数"
          value={formatNumber(stats.balancedMethods)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12z" />
            </svg>
          }
        />
      </div>

      {/* 方法选择器 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">选择处理方法</label>
        <select 
          value={selectedMethod} 
          onChange={(e) => setSelectedMethod(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {methods.map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="采样方法对比" loading={loading} error={error || undefined}>
          <ImbalanceMethodsComparisonChart data={methodsData} />
        </ChartContainer>
        
        <ChartContainer title={`${selectedMethod} - 数据分布`} loading={loading} error={error || undefined}>
          <div className="p-4">
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">原始数据分布</h4>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                  <span className="text-sm">负样本: 9,000</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  <span className="text-sm">正样本: 1,000</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">处理后分布</h4>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-300 rounded mr-2"></div>
                  <span className="text-sm">负样本: 7,500</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-300 rounded mr-2"></div>
                  <span className="text-sm">正样本: 6,000</span>
                </div>
              </div>
            </div>
          </div>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title={`${selectedMethod} - 混淆矩阵`} loading={loading} error={error || undefined}>
          <ImbalanceConfusionMatrixChart data={confusionMatrixData} method={selectedMethod} />
        </ChartContainer>
        
        <ChartContainer title="方法性能对比表格" loading={loading} error={error || undefined}>
          <ImbalanceMethodsTable data={methodsData} />
        </ChartContainer>
      </div>
    </div>
  );
};

export default ImbalanceHandling;