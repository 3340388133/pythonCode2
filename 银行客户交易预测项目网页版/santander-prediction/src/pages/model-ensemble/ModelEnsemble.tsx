import React, { useState, useEffect } from 'react';
import { mockDataService } from '../../utils/mockDataService';
import { formatNumber, formatPercent } from '../../utils/dataUtils';
import StatCard from '../../components/ui/StatCard';
import ChartContainer from '../../components/charts/ChartContainer';
import EnsembleMethodsChart from '../../components/model-ensemble/EnsembleMethodsChart';
import FeatureImportanceComparisonChart from '../../components/model-ensemble/FeatureImportanceComparisonChart';
import EnsembleMethodsTable from '../../components/model-ensemble/EnsembleMethodsTable';

const ModelEnsemble: React.FC = () => {
  const [ensembleData, setEnsembleData] = useState<any>(null);
  const [modelComparison, setModelComparison] = useState<any>(null);
  const [featureImportanceComparison, setFeatureImportanceComparison] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ensemble, comparison, featureComparison] = await Promise.all([
          mockDataService.getEnsembleMethods(),
          mockDataService.getModelComparison(),
          mockDataService.getFeatureImportanceComparison()
        ]);
        setEnsembleData(ensemble);
        setModelComparison(comparison);
        setFeatureImportanceComparison(featureComparison);
        setError(null);
      } catch (err) {
        setError('数据加载失败，请稍后重试');
        console.error('Model ensemble fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = {
    totalMethods: ensembleData?.length || 0,
    bestEnsemble: ensembleData?.reduce((best: any, current: any) => 
      (current.metrics.auc > best.metrics.auc) ? current : best, 
      ensembleData?.[0] || {}
    ),
    avgAccuracy: ensembleData?.reduce((sum: number, m: any) => sum + m.metrics.accuracy, 0) / (ensembleData?.length || 1) || 0,
    totalModels: modelComparison?.length || 0
  };

  return (
    <div className="model-ensemble-container">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">模型融合</h1>
      
      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="集成方法数"
          value={formatNumber(stats.totalMethods)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />
        <StatCard
          title="最佳集成方法"
          value={stats.bestEnsemble?.method || 'N/A'}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
        />
        <StatCard
          title="平均准确率"
          value={formatPercent(stats.avgAccuracy)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="基础模型数"
          value={formatNumber(stats.totalModels)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="集成方法性能对比" loading={loading} error={error || undefined}>
          <EnsembleMethodsChart data={ensembleData} />
        </ChartContainer>
        
        <ChartContainer title="基础模型对比" loading={loading} error={error || undefined}>
          {modelComparison && (
            <div className="p-4">
              <div className="space-y-4">
                {modelComparison.slice(0, 4).map((model: any, index: number) => (
                  <div key={model.model} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-800">{model.model}</h4>
                      <p className="text-sm text-gray-600">AUC: {(model.metrics.auc * 100).toFixed(2)}%</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">准确率</div>
                      <div className="font-semibold text-blue-600">{(model.metrics.accuracy * 100).toFixed(2)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="特征重要性对比" loading={loading} error={error || undefined}>
          <FeatureImportanceComparisonChart data={featureImportanceComparison} />
        </ChartContainer>
        
        <ChartContainer title="集成方法详细信息" loading={loading} error={error || undefined}>
          <EnsembleMethodsTable data={ensembleData} />
        </ChartContainer>
      </div>
    </div>
  );
};

export default ModelEnsemble;