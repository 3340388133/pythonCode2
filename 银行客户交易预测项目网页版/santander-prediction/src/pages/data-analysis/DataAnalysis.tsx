import React, { useState, useEffect } from 'react';
import { mockDataService } from '../../utils/mockDataService';
import ChartContainer from '../../components/charts/ChartContainer';
import FeatureDistributionChart from '../../components/data-analysis/FeatureDistributionChart';
import FeatureCorrelationChart from '../../components/data-analysis/FeatureCorrelationChart';
import FeatureSelector from '../../components/data-analysis/FeatureSelector';
import DataTable from '../../components/data-analysis/DataTable';
import ContentCard from '../../components/ui/ContentCard';

const DataAnalysis: React.FC = () => {
  const [distributions, setDistributions] = useState<any>(null);
  const [correlations, setCorrelations] = useState<any>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const distributionsData = await mockDataService.getAllFeatureDistributions();
        const correlationsData = await mockDataService.getFeatureCorrelations();
        
        setDistributions(distributionsData);
        setCorrelations(correlationsData);
        
        // 默认选择前两个特征
        if (distributionsData) {
          const features = Object.keys(distributionsData);
          setSelectedFeatures(features.slice(0, 2));
        }
        
        setError(null);
      } catch (err) {
        setError('数据加载失败，请稍后重试');
        console.error('Data analysis data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFeatureSelect = (features: string[]) => {
    setSelectedFeatures(features);
  };

  const renderFeatureDistributions = () => {
    if (!distributions || !selectedFeatures.length) return null;

    return selectedFeatures.map(feature => (
      <div key={feature} className="col-span-1">
        <ChartContainer title={`特征分布: ${feature}`} loading={loading} error={error}>
          <FeatureDistributionChart data={distributions[feature]} featureName={feature} />
        </ChartContainer>
      </div>
    ));
  };

  const getSelectedCorrelations = () => {
    if (!correlations || !selectedFeatures.length) return [];

    return correlations.filter((corr: any) => 
      selectedFeatures.includes(corr.feature1) && selectedFeatures.includes(corr.feature2)
    );
  };

  return (
    <div className="data-analysis-container">
      <h1 className="text-2xl font-bold mb-6 text-primary">数据分析</h1>
      
      {/* 特征选择器 */}
      <ContentCard title="特征选择">
        <div className="p-4">
          <FeatureSelector 
            features={distributions ? Object.keys(distributions) : []}
            selectedFeatures={selectedFeatures}
            onSelectionChange={handleFeatureSelect}
            loading={loading}
          />
        </div>
      </ContentCard>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">特征分布</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderFeatureDistributions()}
        </div>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">特征相关性</h2>
        <ChartContainer title="特征相关性热力图" loading={loading} error={error}>
          <FeatureCorrelationChart correlations={getSelectedCorrelations()} />
        </ChartContainer>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">数据表格</h2>
        <ContentCard title="样本数据">
          <DataTable selectedFeatures={selectedFeatures} loading={loading} />
        </ContentCard>
      </div>
    </div>
  );
};

export default DataAnalysis;