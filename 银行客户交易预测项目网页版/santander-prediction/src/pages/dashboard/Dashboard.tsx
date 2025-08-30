import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">仪表盘</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">客户总数</h3>
          <p className="text-3xl font-bold text-blue-600">200,000</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">预测交易客户</h3>
          <p className="text-3xl font-bold text-green-600">20,345</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">交易率</h3>
          <p className="text-3xl font-bold text-yellow-600">10.2%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">模型准确率</h3>
          <p className="text-3xl font-bold text-purple-600">92.3%</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">系统状态</h2>
        <p className="text-gray-600">系统正在正常运行，所有功能可正常使用。</p>
      </div>
    </div>
  );
};

export default Dashboard;