import React from 'react';

interface ModelSelectorProps {
  models: string[];
  selectedModel: string;
  onModelChange: (model: string) => void;
  loading?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onModelChange,
  loading = false
}) => {
  return (
    <div className="model-selector">
      <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 mb-2">
        选择模型
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {models.map(model => (
          <button
            key={model}
            type="button"
            disabled={loading}
            onClick={() => onModelChange(model)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedModel === model
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {model}
          </button>
        ))}
      </div>
      
      {selectedModel && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <span className="font-semibold">当前选择:</span> {selectedModel}
          </p>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;