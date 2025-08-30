import React from 'react';

interface MethodPerformance {
  method: string;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    auc: number;
  };
  sampleRatio: {
    negative: number;
    positive: number;
  };
}

interface ImbalanceMethodsTableProps {
  data: MethodPerformance[] | null;
}

const ImbalanceMethodsTable: React.FC<ImbalanceMethodsTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">暂无数据</div>
      </div>
    );
  }

  const getRatioLabel = (negative: number, positive: number) => {
    const ratio = negative / positive;
    return `${ratio.toFixed(1)}:1`;
  };

  const getRatioColor = (negative: number, positive: number) => {
    const ratio = negative / positive;
    if (ratio >= 8) return 'text-red-600 bg-red-100';
    if (ratio >= 4) return 'text-orange-600 bg-orange-100';
    if (ratio >= 2) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getPerformanceColor = (value: number, metric: string) => {
    // 根据不同指标设置不同的颜色阈值
    let threshold: number;
    switch (metric) {
      case 'accuracy':
        threshold = 0.85;
        break;
      case 'precision':
        threshold = 0.8;
        break;
      case 'recall':
        threshold = 0.75;
        break;
      case 'f1':
        threshold = 0.8;
        break;
      case 'auc':
        threshold = 0.85;
        break;
      default:
        threshold = 0.8;
    }

    if (value >= threshold) return 'text-green-600 font-semibold';
    if (value >= threshold - 0.05) return 'text-blue-600 font-semibold';
    if (value >= threshold - 0.1) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  // 按F1分数排序
  const sortedData = [...data].sort((a, b) => b.metrics.f1 - a.metrics.f1);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-3 py-3 font-semibold">排名</th>
            <th scope="col" className="px-3 py-3 font-semibold">处理方法</th>
            <th scope="col" className="px-3 py-3 font-semibold text-center">样本比例</th>
            <th scope="col" className="px-3 py-3 font-semibold text-center">准确率</th>
            <th scope="col" className="px-3 py-3 font-semibold text-center">精确率</th>
            <th scope="col" className="px-3 py-3 font-semibold text-center">召回率</th>
            <th scope="col" className="px-3 py-3 font-semibold text-center">F1分数</th>
            <th scope="col" className="px-3 py-3 font-semibold text-center">AUC</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((method, index) => (
            <tr key={method.method} className="bg-white border-b hover:bg-gray-50">
              <td className="px-3 py-3 text-center">
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                  index === 0 ? 'bg-yellow-100 text-yellow-800' :
                  index === 1 ? 'bg-gray-100 text-gray-800' :
                  index === 2 ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {index + 1}
                </span>
              </td>
              <td className="px-3 py-3 font-medium text-gray-900">
                {method.method}
              </td>
              <td className="px-3 py-3 text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRatioColor(method.sampleRatio.negative, method.sampleRatio.positive)}`}>
                  {getRatioLabel(method.sampleRatio.negative, method.sampleRatio.positive)}
                </span>
              </td>
              <td className="px-3 py-3 text-center">
                <span className={getPerformanceColor(method.metrics.accuracy, 'accuracy')}>
                  {(method.metrics.accuracy * 100).toFixed(2)}%
                </span>
              </td>
              <td className="px-3 py-3 text-center">
                <span className={getPerformanceColor(method.metrics.precision, 'precision')}>
                  {(method.metrics.precision * 100).toFixed(2)}%
                </span>
              </td>
              <td className="px-3 py-3 text-center">
                <span className={getPerformanceColor(method.metrics.recall, 'recall')}>
                  {(method.metrics.recall * 100).toFixed(2)}%
                </span>
              </td>
              <td className="px-3 py-3 text-center">
                <span className={getPerformanceColor(method.metrics.f1, 'f1')}>
                  {(method.metrics.f1 * 100).toFixed(2)}%
                </span>
              </td>
              <td className="px-3 py-3 text-center">
                <span className={getPerformanceColor(method.metrics.auc, 'auc')}>
                  {(method.metrics.auc * 100).toFixed(2)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* 说明文字 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">处理方法说明：</h4>
        <div className="text-xs text-blue-700 space-y-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <p><span className="font-semibold">SMOTE：</span>合成少数类过采样技术</p>
              <p><span className="font-semibold">ADASYN：</span>自适应合成采样</p>
              <p><span className="font-semibold">随机过采样：</span>随机复制少数类样本</p>
              <p><span className="font-semibold">随机欠采样：</span>随机删除多数类样本</p>
              <p><span className="font-semibold">NearMiss：</span>基于距离的欠采样</p>
            </div>
            <div>
              <p><span className="font-semibold">TomekLinks：</span>删除边界上的多数类样本</p>
              <p><span className="font-semibold">SMOTEENN：</span>SMOTE + 编辑最近邻</p>
              <p><span className="font-semibold">SMOTETomek：</span>SMOTE + Tomek链</p>
              <p><span className="font-semibold">代价敏感学习：</span>调整类别权重</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImbalanceMethodsTable;