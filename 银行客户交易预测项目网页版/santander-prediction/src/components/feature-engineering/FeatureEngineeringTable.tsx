import React from 'react';

const FeatureEngineeringTable: React.FC = () => {
  const featureEngineeringMethods = [
    {
      method: '标准化 (Standardization)',
      description: '将特征转换为均值为0，标准差为1的分布',
      pros: '消除量纲影响，适用于正态分布',
      cons: '对异常值敏感',
      usage: '线性模型、神经网络'
    },
    {
      method: '归一化 (Normalization)',
      description: '将特征缩放到[0,1]区间',
      pros: '保持数据分布，计算简单',
      cons: '对异常值敏感',
      usage: '神经网络、KNN、SVM'
    },
    {
      method: '鲁棒缩放 (Robust Scaling)',
      description: '使用中位数和四分位距进行缩放',
      pros: '对异常值不敏感',
      cons: '可能不能完全消除异常值影响',
      usage: '包含异常值的数据集'
    },
    {
      method: '对数变换 (Log Transform)',
      description: '对特征取对数，压缩数据范围',
      pros: '降低偏度，处理长尾分布',
      cons: '只适用于正值，可能产生负无穷',
      usage: '收入、价格等右偏数据'
    },
    {
      method: 'Box-Cox变换',
      description: '通过幂变换使数据更接近正态分布',
      pros: '自动找到最佳变换参数',
      cons: '只适用于正值，计算复杂',
      usage: '需要正态化的连续变量'
    },
    {
      method: '分箱 (Binning)',
      description: '将连续变量转换为离散变量',
      pros: '处理非线性关系，减少异常值影响',
      cons: '可能丢失信息，增加特征数量',
      usage: '决策树、线性模型'
    },
    {
      method: '多项式特征',
      description: '生成特征的多项式组合',
      pros: '捕捉非线性关系',
      cons: '特征数量爆炸，容易过拟合',
      usage: '线性模型处理非线性问题'
    },
    {
      method: '交互特征',
      description: '创建特征之间的交互项',
      pros: '捕捉特征间的相互作用',
      cons: '增加模型复杂度',
      usage: '线性模型、决策树'
    }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 w-1/6">方法</th>
            <th scope="col" className="px-4 py-3 w-1/4">描述</th>
            <th scope="col" className="px-4 py-3 w-1/4">优点</th>
            <th scope="col" className="px-4 py-3 w-1/4">缺点</th>
            <th scope="col" className="px-4 py-3 w-1/6">适用场景</th>
          </tr>
        </thead>
        <tbody>
          {featureEngineeringMethods.map((method, index) => (
            <tr key={index} className="bg-white border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">
                {method.method}
              </td>
              <td className="px-4 py-3 text-gray-700">
                {method.description}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {method.pros}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {method.cons}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {method.usage}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">特征工程最佳实践</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 在训练集上拟合变换器，然后应用到验证集和测试集</li>
          <li>• 先处理缺失值，再进行特征缩放</li>
          <li>• 对于树模型，特征缩放通常不是必需的</li>
          <li>• 监控特征工程对模型性能的影响</li>
          <li>• 保持特征工程流水线的可重现性</li>
        </ul>
      </div>
    </div>
  );
};

export default FeatureEngineeringTable;