import React from 'react';
import { Card } from '../ui/Card';

interface ModelPerformanceMetricsProps {
  performance: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    auc: number;
    trainTime: number;
  } | null;
  loading?: boolean;
  error?: string | null;
}

const ModelPerformanceMetrics: React.FC<ModelPerformanceMetricsProps> = ({
  performance,
  loading = false,
  error = null
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index}>
            <div className="p-4 flex flex-col items-center justify-center h-24 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          </Card>
        ))}
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

  if (!performance) {
    return (
      <div className="text-center text-gray-500 py-4">
        <p>没有可用的性能指标数据</p>
      </div>
    );
  }

  const metrics = [
    { name: '准确率', value: performance.accuracy, format: (v: number) => (v * 100).toFixed(2) + '%' },
    { name: '精确率', value: performance.precision, format: (v: number) => (v * 100).toFixed(2) + '%' },
    { name: '召回率', value: performance.recall, format: (v: number) => (v * 100).toFixed(2) + '%' },
    { name: 'F1分数', value: performance.f1Score, format: (v: number) => v.toFixed(4) },
    { name: 'AUC', value: performance.auc, format: (v: number) => v.toFixed(4) },
    { name: '训练时间', value: performance.trainTime, format: (v: number) => v.toFixed(1) + '秒' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.name}>
          <div className="p-4 flex flex-col items-center justify-center h-24">
            <div className="text-sm text-gray-500 mb-1">{metric.name}</div>
            <div className="text-2xl font-bold text-primary">{metric.format(metric.value)}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ModelPerformanceMetrics;