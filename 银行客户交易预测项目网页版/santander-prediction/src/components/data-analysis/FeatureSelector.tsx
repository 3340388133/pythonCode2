import React, { useState } from 'react';

interface FeatureSelectorProps {
  features: string[];
  selectedFeatures: string[];
  onSelectionChange: (features: string[]) => void;
  loading?: boolean;
}

const FeatureSelector: React.FC<FeatureSelectorProps> = ({
  features,
  selectedFeatures,
  onSelectionChange,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleFeatureToggle = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      // 如果已选中，则移除
      onSelectionChange(selectedFeatures.filter(f => f !== feature));
    } else {
      // 如果未选中，则添加（最多选择6个特征）
      if (selectedFeatures.length < 6) {
        onSelectionChange([...selectedFeatures, feature]);
      } else {
        alert('最多只能选择6个特征进行比较');
      }
    }
  };

  const filteredFeatures = features.filter(feature =>
    feature.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="feature-selector">
      <div className="mb-4">
        <label htmlFor="feature-search" className="block text-sm font-medium text-gray-700 mb-1">
          搜索特征
        </label>
        <input
          id="feature-search"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="输入特征名称..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
      </div>
      
      <div className="mb-2">
        <span className="text-sm font-medium text-gray-700">
          已选择 {selectedFeatures.length}/6 个特征
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {loading ? (
          <div className="col-span-full text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <p className="mt-2 text-sm text-gray-500">加载特征中...</p>
          </div>
        ) : filteredFeatures.length === 0 ? (
          <div className="col-span-full text-center py-4">
            <p className="text-gray-500">没有找到匹配的特征</p>
          </div>
        ) : (
          filteredFeatures.map(feature => (
            <div
              key={feature}
              className={`px-3 py-2 rounded-md text-sm cursor-pointer transition-colors ${
                selectedFeatures.includes(feature)
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
              }`}
              onClick={() => handleFeatureToggle(feature)}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(feature)}
                  onChange={() => {}}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="truncate">{feature}</span>
              </div>
            </div>
          ))
        )}
      </div>
      
      {selectedFeatures.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">已选择的特征:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedFeatures.map(feature => (
              <div
                key={feature}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center"
              >
                <span>{feature}</span>
                <button
                  type="button"
                  className="ml-1 text-blue-500 hover:text-blue-700"
                  onClick={() => handleFeatureToggle(feature)}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureSelector;