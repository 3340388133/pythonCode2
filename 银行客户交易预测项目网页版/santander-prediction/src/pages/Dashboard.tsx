import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">仪表盘</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">客户总数</h3>
          <p className="text-2xl font-bold mt-1">200,000</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">预测交易数</h3>
          <p className="text-2xl font-bold mt-1">20,345</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">交易率</h3>
          <p className="text-2xl font-bold mt-1">10.2%</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">模型准确率</h3>
          <p className="text-2xl font-bold mt-1">92.3%</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">最近更新</h2>
        <p className="text-gray-600">最后更新时间: 2025-08-30 08:30:45</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">特征重要性 Top 5</h2>
          <div className="space-y-4">
            {['var_81', 'var_139', 'var_12', 'var_26', 'var_174'].map((feature, index) => (
              <div key={feature} className="flex items-center">
                <span className="w-24 text-gray-600">{feature}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${95 - index * 15}%` }}
                  ></div>
                </div>
                <span className="w-12 text-right text-gray-600">{(0.95 - index * 0.15).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">模型性能比较</h2>
          <div className="space-y-4">
            {['XGBoost', 'LightGBM', 'RandomForest', '融合模型'].map((model, index) => (
              <div key={model} className="flex items-center">
                <span className="w-28 text-gray-600">{model}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${index === 3 ? 'bg-green-600' : 'bg-blue-600'}`}
                    style={{ width: `${85 + index * 2}%` }}
                  ></div>
                </div>
                <span className="w-12 text-right text-gray-600">{(0.85 + index * 0.02).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;