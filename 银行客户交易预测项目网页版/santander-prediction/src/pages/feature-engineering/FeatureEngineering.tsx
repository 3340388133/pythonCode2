import React, { useState, useEffect } from 'react';
import { mockDataService } from '../../utils/mockDataService';
import ChartContainer from '../../components/charts/ChartContainer';
import FeatureImportanceChart from '../../components/feature-engineering/FeatureImportanceChart';
import FeatureSelectionChart from '../../components/feature-engineering/FeatureSelectionChart';
import FeatureCorrelationHeatmap from '../../components/feature-engineering/FeatureCorrelationHeatmap';
import FeatureEngineeringTable from '../../components/feature-engineering/FeatureEngineeringTable';
import ModelSelector from '../../components/model-training/ModelSelector';
import ContentCard from '../../components/ui/ContentCard';

const FeatureEngineering: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('融合模型');
  const [featureImportance, setFeatureImportance] = useState<any>(null);
  const [featureSelection, setFeatureSelection] = useState<any>(null);
  const [correlationData, setCorrelationData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const models = ['XGBoost', 'LightGBM', 'RandomForest', '融合模型'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 获取特征重要性数据
        const importanceData = await mockDataService.getFeatureImportance(selectedModel);
        setFeatureImportance(importanceData);
        
        // 获取特征选择数据
        const selectionData = await mockDataService.getFeatureSelection();
        setFeatureSelection(selectionData);
        
        // 获取特征相关性数据
        const correlations = await mockDataService.getFeatureCorrelations();
        setCorrelationData(correlations);
        
        setError(null);
      } catch (err) {
        setError('数据加载失败，请稍后重试');
        console.error('Feature engineering data fetch error:', err);
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
    <div className="feature-engineering-container">
      <h1 className="text-2xl font-bold mb-6 text-primary">特征工程</h1>
      
      {/* 模型选择器 */}
      <ContentCard title="选择模型">
        <div className="p-4">
          <ModelSelector 
            models={models}
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
            loading={loading}
          />
        </div>
      </ContentCard>
      
      {/* 特征重要性 */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">特征重要性</h2>
        <ChartContainer title={`${selectedModel} 特征重要性`} loading={loading} error={error}>
          <FeatureImportanceChart data={featureImportance} />
        </ChartContainer>
      </div>
      
      {/* 特征选择 */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">特征选择方法比较</h2>
        <ChartContainer title="不同特征选择方法的性能比较" loading={loading} error={error}>
          <FeatureSelectionChart data={featureSelection} />
        </ChartContainer>
      </div>
      
      {/* 特征相关性热力图 */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">特征相关性</h2>
        <ChartContainer title="重要特征相关性热力图" loading={loading} error={error}>
          <FeatureCorrelationHeatmap data={correlationData} featureImportance={featureImportance} />
        </ChartContainer>
      </div>
      
      {/* 特征工程表格 */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">特征工程方法</h2>
        <ContentCard>
          <FeatureEngineeringTable />
        </ContentCard>
      </div>
    </div>
  );
};

export default FeatureEngineering;