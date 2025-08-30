import React from 'react';

interface PredictionThresholdSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const PredictionThresholdSlider: React.FC<PredictionThresholdSliderProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  return (
    <div className="prediction-threshold-slider">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor="threshold-slider" className="text-sm font-medium text-gray-700">
          预测阈值
        </label>
        <span className="text-sm font-semibold text-blue-600">
          {value.toFixed(2)}
        </span>
      </div>
      
      <input
        id="threshold-slider"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>0.00</span>
        <span>0.25</span>
        <span>0.50</span>
        <span>0.75</span>
        <span>1.00</span>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>高召回率</span>
        <span className="ml-auto">高精确率</span>
      </div>
    </div>
  );
};

export default PredictionThresholdSlider;