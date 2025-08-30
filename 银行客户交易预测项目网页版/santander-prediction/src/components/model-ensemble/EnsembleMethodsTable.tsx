import React from 'react';

interface EnsembleMethod {
  method: string;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    auc: number;
  };
  complexity: number;
  trainTime: number;
}

interface EnsembleMethodsTableProps {
  data: EnsembleMethod[] | null;
}

const EnsembleMethodsTable: React.FC<EnsembleMethodsTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">暂无数据</div>
      </div>
    );
  }

  const getComplexityLabel = (complexity: number) => {
    const labels = ['很低', '低', '中等', '高', '很高'];
    return labels[Math.min(complexity - 1, 4)] || '未知';
  };

  const getComplexityColor = (complexity: number) => {
    const colors = [
      'text-green-600 bg-green-100',
      'text-blue-600 bg-blue-100', 
      'text-yellow-600 bg-yellow-100',
      'text-orange-600 bg-orange-100',
      'text-red-600 bg-red-100'
    ];
    return colors[Math.min(complexity - 1, 4)] || 'text-gray-600 bg-gray-100';
  };

  const formatTime = (time: number) => {
    if (time < 60) {
      return `${time.toFixed(1)}s`;
    } else {
      return `${(time / 60).toFixed(1)}min`;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">集成方法</th>
            <th scope="col" className="px-4 py-3 font-semibold text-center">准确率</th>
            <th scope="col" className="px-4 py-3 font-semibold text-center">精确率</th>
            <th scope="col" className="px-4 py-3 font-semibold text-center">召回率</th>
            <th scope="col" className="px-4 py-3 font-semibold text-center">F1分数</th>
            <th scope="col" className="px-4 py-3 font-semibold text-center">AUC</th>
            <th scope="col" className="px-4 py-3 font-semibold text-center">复杂度</th>
            <th scope="col" className="px-4 py-3 font-semibold text-center">训练时间</th>
          </tr>
        </thead>
        <tbody>
          {data.map((method, index) => (
            <tr key={method.method} className="bg-white border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">
                {method.method}
              </td>
              <td className="px-4 py-3 text-center">
                <span className="font-semibold text-blue-600">
                  {(method.metrics.accuracy * 100).toFixed(2)}%
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="font-semibold text-green-600">
                  {(method.metrics.precision * 100).toFixed(2)}%
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="font-semibold text-purple-600">
                  {(method.metrics.recall * 100).toFixed(2)}%
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="font-semibold text-orange-600">
                  {(method.metrics.f1 * 100).toFixed(2)}%
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="font-semibold text-red-600">
                  {(method.metrics.auc * 100).toFixed(2)}%
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(method.complexity)}`}>
                  {getComplexityLabel(method.complexity)}
                </span>
              </td>
              <td className="px-4 py-3 text-center font-medium text-gray-700">
                {formatTime(method.trainTime)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* 说明文字 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">集成方法说明：</h4>
        <div className="text-xs text-blue-700 space-y-1">
          <p><span className="font-semibold">投票法：</span>多个分类器投票决定最终预测结果</p>
          <p><span className="font-semibold">堆叠法：</span>使用元学习器组合多个基学习器的预测</p>
          <p><span className="font-semibold">加权平均：</span>根据模型性能分配权重进行加权平均</p>
          <p><span className="font-semibold">Bagging：</span>通过自助采样训练多个模型并平均预测</p>
          <p><span className="font-semibold">Boosting：</span>顺序训练弱学习器，后续模型关注前面模型的错误</p>
        </div>
      </div>
    </div>
  );
};

export default EnsembleMethodsTable;