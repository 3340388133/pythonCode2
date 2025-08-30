import React, { useState, useEffect } from 'react';
import { mockDataService } from '../../utils/mockDataService';
import { formatPercent } from '../../utils/dataUtils';
import StatCard from '../../components/ui/StatCard';
import ChartContainer from '../../components/charts/ChartContainer';
import ModelSelector from '../../components/model-training/ModelSelector';
import ConfusionMatrixChart from '../../components/model-training/ConfusionMatrixChart';
import RocCurveChart from '../../components/model-training/RocCurveChart';
import PrCurveChart from '../../components/model-training/PrCurveChart';
import TrainingHistoryChart from '../../components/model-training/TrainingHistoryChart';

const ModelTraining: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('融合模型');
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [confusionMatrix, setConfusionMatrix] = useState<any>(null);
  const [rocData, setRocData] = useState<any>(null);
  const [prData, setPrData] = useState<any>(null);
  const [trainingHistory, setTrainingHistory] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const models = ['XGBoost', 'LightGBM', 'RandomForest', '融合模型'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [performance, matrix, roc, pr, history] = await Promise.all([
          mockDataService.getModelPerformance(selectedModel),
          mockDataService.getConfusionMatrix(selectedModel),
          mockDataService.getRocCurve(selectedModel),
          mockDataService.getPrCurveData(selectedModel),
          mockDataService.getTrainingHistory(selectedModel)
        ]);
        
        setPerformanceData(performance);
        setConfusionMatrix(matrix);
        setRocData(roc);
        setPrData(pr);
        setTrainingHistory(history);
        setError(null);
      } catch (err) {
        setError('数据加载失败，请稍后重试');
        console.error('Model training fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedModel]);

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  return (
    <div className="model-training-container">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">模型训练</h1>
      
      {/* 模型选择器 */}
      <div className="mb-6">
        <ModelSelector 
          models={models}
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
          loading={loading}
        />
      </div>

      {/* 性能指标概览 */}
      {performanceData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard
            title="准确率"
            value={formatPercent(performanceData.accuracy)}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="精确率"
            value={formatPercent(performanceData.precision)}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            }
          />
          <StatCard
            title="召回率"
            value={formatPercent(performanceData.recall)}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            }
          />
          <StatCard
            title="F1分数"
            value={formatPercent(performanceData.f1)}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
          <StatCard
            title="AUC"
            value={formatPercent(performanceData.auc)}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer title={`${selectedModel} - 混淆矩阵`} loading={loading} error={error || undefined}>
          <ConfusionMatrixChart data={confusionMatrix} />
        </ChartContainer>
        
        <ChartContainer title={`${selectedModel} - ROC曲线`} loading={loading} error={error || undefined}>
          <RocCurveChart data={rocData} />
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title={`${selectedModel} - PR曲线`} loading={loading} error={error || undefined}>
          <PrCurveChart data={prData} />
        </ChartContainer>
        
        <ChartContainer title={`${selectedModel} - 训练历史`} loading={loading} error={error || undefined}>
          <TrainingHistoryChart data={trainingHistory} />
        </ChartContainer>
      </div>
    </div>
  );
};

export default ModelTraining;