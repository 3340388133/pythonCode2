// 模拟数据服务，提供各种数据接口
const simulateApiCall = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// 生成仪表盘统计数据
const generateDashboardStats = () => {
  return {
    totalCustomers: 200000,
    predictedTransactions: 20345,
    transactionRate: 0.102,
    featureCount: 200,
    modelCount: 4,
    accuracy: 0.923,
    lastUpdated: '2025-08-30 08:30:45'
  };
};

// 生成特征分布数据
const generateDistributionData = () => {
  const bins = Array.from({ length: 11 }, (_, i) => i * 0.1);
  const frequencies = Array.from({ length: 10 }, () => Math.floor(Math.random() * 1000) + 100);
  
  return {
    bins,
    frequencies,
    statistics: {
      mean: Math.random() * 0.5 + 0.2,
      median: Math.random() * 0.5 + 0.2,
      std: Math.random() * 0.2,
      min: 0,
      max: 1
    }
  };
};

// 生成特征相关性数据
const generateCorrelationData = () => {
  const features = Array.from({ length: 20 }, (_, i) => `var_${i}`);
  const correlations = [];
  
  for (let i = 0; i < features.length; i++) {
    for (let j = i + 1; j < features.length; j++) {
      correlations.push({
        feature1: features[i],
        feature2: features[j],
        correlation: (Math.random() * 2 - 1) * 0.8 // -0.8 到 0.8 之间
      });
    }
  }
  
  return correlations;
};

// 生成模型性能数据
const generateModelPerformanceData = () => {
  return {
    accuracy: Math.random() * 0.1 + 0.85,
    precision: Math.random() * 0.15 + 0.8,
    recall: Math.random() * 0.2 + 0.75,
    f1: Math.random() * 0.15 + 0.8,
    auc: Math.random() * 0.1 + 0.85,
    trainTime: Math.random() * 50 + 10
  };
};

// 生成特征分布数据（多个特征）
const generateFeatureDistributions = () => {
  const features = ['var_0', 'var_1', 'var_2', 'var_3', 'var_4', 'var_5'];
  const distributions: Record<string, any> = {};
  
  features.forEach(feature => {
    distributions[feature] = generateDistributionData();
  });
  
  return distributions;
};

// 生成模型性能数据（多个模型）
const generateModelPerformances = () => {
  const models = ['XGBoost', 'LightGBM', 'RandomForest', '融合模型'];
  const performance: Record<string, any> = {};
  
  models.forEach(model => {
    performance[model] = generateModelPerformanceData();
  });
  
  return performance;
};

// 生成混淆矩阵数据
const generateConfusionMatrix = () => {
  const total = 10000;
  const trueNegative = Math.floor(Math.random() * 3000 + 6000);
  const truePositive = Math.floor(Math.random() * 500 + 500);
  const falsePositive = Math.floor((total - trueNegative - truePositive) * Math.random());
  const falseNegative = total - trueNegative - truePositive - falsePositive;
  
  return {
    trueNegative,
    falsePositive,
    falseNegative,
    truePositive
  };
};

// 生成ROC曲线数据
const generateRocCurveData = () => {
  const points = [];
  let x = 0;
  let y = 0;
  
  for (let i = 0; i <= 100; i++) {
    x = i / 100;
    // 生成一个比随机稍好的ROC曲线
    y = Math.pow(x, 0.5) * (1 - Math.pow(Math.random() * 0.1, 2));
    if (y > 1) y = 1;
    points.push([x, y]);
  }
  
  // 确保起点和终点正确
  points[0] = [0, 0];
  points[points.length - 1] = [1, 1];
  
  return points;
};

// 生成特征重要性数据
const generateFeatureImportanceData = () => {
  const features = Array.from({ length: 30 }, (_, i) => `var_${i}`);
  const importances = features.map(() => Math.random());
  
  // 归一化
  const sum = importances.reduce((a, b) => a + b, 0);
  const normalizedImportances = importances.map(v => v / sum);
  
  // 创建结果并排序
  const result = features.map((name, i) => ({
    name,
    importance: normalizedImportances[i]
  }));
  
  return result.sort((a, b) => b.importance - a.importance);
};

// 生成预测分布数据
const generatePredictionDistribution = () => {
  const bins = Array.from({ length: 21 }, (_, i) => i * 0.05);
  const frequencies = Array.from({ length: 20 }, (_, i) => {
    // 创建一个偏向两端的分布
    const x = i / 20;
    return Math.floor((Math.pow(x - 0.5, 2) * 4 + 0.1) * 1000);
  });
  
  return { bins, frequencies };
};

// 生成客户预测数据
const generateCustomerPredictions = () => {
  return Array.from({ length: 100 }, (_, i) => ({
    id: 1000000 + i,
    probability: Math.random(),
    prediction: Math.random() > 0.5 ? 1 : 0,
    actual: Math.random() > 0.8 ? 1 : 0
  }));
};

// 生成预测解释数据
const generatePredictionExplanation = () => {
  const features = ['var_81', 'var_139', 'var_12', 'var_26', 'var_174', 'var_6', 'var_110', 'var_53', 'var_99', 'var_146'];
  
  return features.map(name => ({
    feature: name,
    importance: Math.random() * 0.3,
    value: Math.random(),
    contribution: (Math.random() * 2 - 1) * 0.2
  })).sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
};

// 生成平衡策略数据
const generateBalancingStrategies = () => {
  return [
    { name: '原始数据', ratio: '1:9', accuracy: 0.91, recall: 0.62, f1: 0.72 },
    { name: 'SMOTE', ratio: '1:2', accuracy: 0.87, recall: 0.78, f1: 0.81 },
    { name: 'ADASYN', ratio: '1:1.5', accuracy: 0.86, recall: 0.79, f1: 0.82 },
    { name: '随机过采样', ratio: '1:1', accuracy: 0.85, recall: 0.81, f1: 0.80 },
    { name: '随机欠采样', ratio: '1:1', accuracy: 0.83, recall: 0.82, f1: 0.79 },
    { name: 'NearMiss', ratio: '1:1', accuracy: 0.81, recall: 0.83, f1: 0.78 },
    { name: 'TomekLinks', ratio: '1:7', accuracy: 0.89, recall: 0.68, f1: 0.75 },
    { name: 'SMOTEENN', ratio: '1:1.2', accuracy: 0.86, recall: 0.80, f1: 0.82 },
    { name: 'SMOTETomek', ratio: '1:1.1', accuracy: 0.87, recall: 0.79, f1: 0.82 },
    { name: '代价敏感学习', ratio: '1:9', accuracy: 0.88, recall: 0.75, f1: 0.80 }
  ];
};

// 生成训练历史数据
const generateTrainingHistory = () => {
  const epochs = Array.from({ length: 50 }, (_, i) => i + 1);
  const trainLoss = epochs.map(e => 0.7 * Math.exp(-e / 15) + 0.1 + Math.random() * 0.05);
  const valLoss = epochs.map(e => 0.7 * Math.exp(-e / 12) + 0.15 + Math.random() * 0.07);
  const trainAcc = epochs.map(e => 1 - 0.5 * Math.exp(-e / 10) - Math.random() * 0.03);
  const valAcc = epochs.map(e => 1 - 0.5 * Math.exp(-e / 8) - 0.05 - Math.random() * 0.05);
  
  return { epochs, trainLoss, valLoss, trainAcc, valAcc };
};

// 模拟数据服务
export const mockDataService = {
  // 特征选择数据
  getFeatureSelection: async () => {
    const features = Array.from({ length: 30 }, (_, i) => `var_${i}`);
    return simulateApiCall(features.map(feature => ({
      name: feature,
      selected: Math.random() > 0.3,
      importance: Math.random(),
      correlation: Math.random() * 2 - 1
    })), 800);
  },
  
  // ROC曲线数据
  getRocCurveData: async (model = '融合模型') => {
    return simulateApiCall(generateRocCurveData(), 800);
  },
  
  // PR曲线数据
  getPrCurveData: async (model = '融合模型') => {
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const recall = i / 100;
      // 生成一个比随机稍好的PR曲线
      const precision = Math.max(0.1, 0.9 - recall * 0.7 + Math.random() * 0.1);
      points.push([recall, precision]);
    }
    return simulateApiCall(points, 800);
  },
  
  // 阈值优化数据
  getThresholdOptimization: async () => {
    const thresholds = Array.from({ length: 21 }, (_, i) => i * 0.05);
    const metrics = thresholds.map(threshold => ({
      threshold,
      precision: 0.3 + threshold * 0.6 + Math.random() * 0.1,
      recall: 0.9 - threshold * 0.8 + Math.random() * 0.1,
      f1: 0.5 + Math.sin((threshold - 0.5) * Math.PI) * 0.3 + Math.random() * 0.05
    }));
    
    return simulateApiCall(metrics, 800);
  },
  
  // 仪表盘数据
  getDashboardStats: async () => {
    return simulateApiCall(generateDashboardStats(), 800);
  },
  
  // 特征分布数据
  getFeatureDistribution: async (feature: string) => {
    return simulateApiCall(generateDistributionData(), 1000);
  },
  
  // 获取所有特征分布
  getAllFeatureDistributions: async () => {
    return simulateApiCall(generateFeatureDistributions(), 1500);
  },
  
  // 特征相关性数据
  getFeatureCorrelations: async () => {
    return simulateApiCall(generateCorrelationData(), 1200);
  },
  
  // 模型性能数据
  getModelPerformance: async (model = '融合模型') => {
    return simulateApiCall(generateModelPerformanceData(), 800);
  },
  
  // 获取所有模型性能
  getAllModelPerformances: async () => {
    return simulateApiCall(generateModelPerformances(), 1000);
  },
  
  // 混淆矩阵数据
  getConfusionMatrix: async (model = '融合模型') => {
    return simulateApiCall(generateConfusionMatrix(), 800);
  },
  
  // ROC曲线数据
  getRocCurve: async (model = '融合模型') => {
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const x = i / 100; // 假阳性率
      // 生成一个比随机稍好的ROC曲线
      const y = Math.min(1, Math.pow(x, 0.3) + Math.random() * 0.1); // 真阳性率
      points.push([x, y]);
    }
    // 确保起点和终点正确
    points[0] = [0, 0];
    points[points.length - 1] = [1, 1];
    return simulateApiCall(points, 800);
  },
  
  // 特征重要性数据
  getFeatureImportance: async (model = '融合模型') => {
    return simulateApiCall(generateFeatureImportanceData(), 1000);
  },
  
  // 预测分布数据
  getPredictionDistribution: async () => {
    return simulateApiCall(generatePredictionDistribution(), 800);
  },
  
  // 客户预测数据
  getCustomerPredictions: async () => {
    return simulateApiCall(generateCustomerPredictions(), 1000);
  },
  
  // 预测解释数据
  getPredictionExplanation: async (customerId: number) => {
    return simulateApiCall(generatePredictionExplanation(), 800);
  },
  
  // 平衡策略数据
  getBalancingStrategies: async () => {
    return simulateApiCall(generateBalancingStrategies(), 800);
  },
  
  // 训练历史数据
  getTrainingHistory: async (model = '融合模型') => {
    return simulateApiCall(generateTrainingHistory(), 1000);
  },
  
  // 不平衡处理相关方法
  getImbalanceDistribution: async (method = 'SMOTE') => {
    // 根据不同方法返回不同的分布
    const original = { negative: 9000, positive: 1000 };
    let balanced;
    
    switch (method) {
      case '原始数据':
        balanced = { ...original };
        break;
      case 'SMOTE':
        balanced = { negative: 9000, positive: 4500 };
        break;
      case 'ADASYN':
        balanced = { negative: 9000, positive: 6000 };
        break;
      case '随机过采样':
        balanced = { negative: 9000, positive: 9000 };
        break;
      case '随机欠采样':
        balanced = { negative: 1000, positive: 1000 };
        break;
      case 'NearMiss':
        balanced = { negative: 1200, positive: 1000 };
        break;
      case 'TomekLinks':
        balanced = { negative: 8500, positive: 1000 };
        break;
      case 'SMOTEENN':
        balanced = { negative: 7000, positive: 5800 };
        break;
      case 'SMOTETomek':
        balanced = { negative: 8000, positive: 7000 };
        break;
      case '代价敏感学习':
        balanced = { ...original }; // 不改变数据分布
        break;
      default:
        balanced = { negative: 5000, positive: 5000 };
    }
    
    return simulateApiCall({ original, balanced }, 800);
  },
  
  getImbalanceMethodsComparison: async () => {
    const methods = [
      '原始数据', 'SMOTE', 'ADASYN', '随机过采样', '随机欠采样', 
      'NearMiss', 'TomekLinks', 'SMOTEENN', 'SMOTETomek', '代价敏感学习'
    ];
    
    return simulateApiCall(methods.map(method => {
      // 为每种方法生成性能指标
      const metrics = {
        accuracy: Math.random() * 0.15 + 0.8,
        precision: Math.random() * 0.2 + 0.75,
        recall: Math.random() * 0.25 + 0.7,
        f1: Math.random() * 0.2 + 0.75,
        auc: Math.random() * 0.15 + 0.8
      };
      
      // 生成样本比例
      let negative, positive;
      switch (method) {
        case '原始数据':
          negative = 9000; positive = 1000;
          break;
        case 'SMOTE':
          negative = 9000; positive = 4500;
          break;
        case 'ADASYN':
          negative = 9000; positive = 6000;
          break;
        case '随机过采样':
          negative = 9000; positive = 9000;
          break;
        case '随机欠采样':
          negative = 1000; positive = 1000;
          break;
        case 'NearMiss':
          negative = 1200; positive = 1000;
          break;
        case 'TomekLinks':
          negative = 8500; positive = 1000;
          break;
        case 'SMOTEENN':
          negative = 7000; positive = 5800;
          break;
        case 'SMOTETomek':
          negative = 8000; positive = 7000;
          break;
        case '代价敏感学习':
          negative = 9000; positive = 1000;
          break;
        default:
          negative = 5000; positive = 5000;
      }
      
      return {
        method,
        metrics,
        sampleRatio: { negative, positive }
      };
    }), 1000);
  },
  
  getImbalanceConfusionMatrix: async (method = 'SMOTE') => {
    // 根据不同方法返回不同的混淆矩阵
    let trueNegative, falsePositive, falseNegative, truePositive;
    
    switch (method) {
      case '原始数据':
        trueNegative = 8500; falsePositive = 500;
        falseNegative = 400; truePositive = 600;
        break;
      case 'SMOTE':
        trueNegative = 8000; falsePositive = 1000;
        falseNegative = 200; truePositive = 800;
        break;
      case 'ADASYN':
        trueNegative = 7800; falsePositive = 1200;
        falseNegative = 180; truePositive = 820;
        break;
      case '随机过采样':
        trueNegative = 7500; falsePositive = 1500;
        falseNegative = 150; truePositive = 850;
        break;
      case '随机欠采样':
        trueNegative = 700; falsePositive = 300;
        falseNegative = 150; truePositive = 850;
        break;
      default:
        trueNegative = 8000; falsePositive = 1000;
        falseNegative = 300; truePositive = 700;
    }
    
    return simulateApiCall({
      trueNegative,
      falsePositive,
      falseNegative,
      truePositive
    }, 800);
  },
  
  getModelComparison: async () => {
    const models = ['XGBoost', 'LightGBM', 'RandomForest', 'LogisticRegression', '融合模型'];
    
    return simulateApiCall(models.map(model => {
      const isEnsemble = model === '融合模型';
      
      return {
        model,
        metrics: {
          accuracy: Math.random() * 0.1 + (isEnsemble ? 0.88 : 0.83),
          precision: Math.random() * 0.15 + (isEnsemble ? 0.85 : 0.78),
          recall: Math.random() * 0.2 + (isEnsemble ? 0.8 : 0.7),
          f1: Math.random() * 0.15 + (isEnsemble ? 0.85 : 0.75),
          auc: Math.random() * 0.1 + (isEnsemble ? 0.9 : 0.82)
        },
        trainTime: Math.random() * 50 + (isEnsemble ? 100 : 20)
      };
    }), 1000);
  },
  
  getEnsembleMethods: async () => {
    const methods = ['投票法', '堆叠法', '加权平均', 'Bagging', 'Boosting'];
    
    return simulateApiCall(methods.map(method => {
      return {
        method,
        metrics: {
          accuracy: Math.random() * 0.1 + 0.85,
          precision: Math.random() * 0.15 + 0.8,
          recall: Math.random() * 0.2 + 0.75,
          f1: Math.random() * 0.15 + 0.8,
          auc: Math.random() * 0.1 + 0.85
        },
        complexity: Math.floor(Math.random() * 5) + 1,
        trainTime: Math.random() * 100 + 50
      };
    }), 1000);
  },
  
  getFeatureImportanceComparison: async () => {
    const models = ['XGBoost', 'LightGBM', 'RandomForest', '融合模型'];
    const features = ['var_81', 'var_139', 'var_12', 'var_26', 'var_174', 'var_6', 'var_110', 'var_53', 'var_99', 'var_146'];
    
    const result: Record<string, any> = {};
    
    models.forEach(model => {
      result[model] = features.map(feature => ({
        feature,
        importance: Math.random() * 0.3
      })).sort((a, b) => b.importance - a.importance);
    });
    
    return simulateApiCall(result, 1200);
  },
  
  // 获取数据表格数据
  getDataTableData: async () => {
    return simulateApiCall(Array.from({ length: 100 }, (_, i) => {
      const features: Record<string, number> = {};
      Array.from({ length: 20 }, (_, j) => {
        features[`var_${j}`] = Math.random() * 2 - 1;
      });
      
      return {
        id: `${100000 + i}`,
        target: Math.random() > 0.9 ? 1 : 0,
        features
      };
    }), 1000);
  },
  
  // 获取预测结果数据
  getPredictionResults: async () => {
    return simulateApiCall(Array.from({ length: 100 }, (_, i) => {
      const features: Record<string, number> = {};
      Array.from({ length: 20 }, (_, j) => {
        features[`var_${j}`] = Math.random() * 2 - 1;
      });
      
      return {
        id: `${100000 + i}`,
        target: Math.random() > 0.9 ? 1 : 0,
        probability: Math.random(),
        prediction: Math.random() > 0.5 ? 1 : 0,
        features
      };
    }), 1000);
  },
  
  // 获取仪表盘图表数据
  getDashboardChartData: async () => {
    return simulateApiCall({
      timeSeriesData: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        accuracy: 0.8 + Math.random() * 0.15,
        precision: 0.75 + Math.random() * 0.2,
        recall: 0.7 + Math.random() * 0.25
      })),
      categoryData: [
        { name: 'XGBoost', value: 0.85 + Math.random() * 0.1 },
        { name: 'LightGBM', value: 0.83 + Math.random() * 0.1 },
        { name: 'RandomForest', value: 0.8 + Math.random() * 0.1 },
        { name: '融合模型', value: 0.9 + Math.random() * 0.05 }
      ],
      distributionData: {
        labels: ['负样本', '正样本'],
        values: [90, 10]
      }
    }, 800);
  }
};