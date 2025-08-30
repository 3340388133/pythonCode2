/**
 * 数据工具函数
 * 用于生成模拟数据和处理数据
 */

// 生成随机ID
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

// 格式化数字
export const formatNumber = (num: number, decimals = 0) => {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

// 格式化百分比
export const formatPercent = (num: number, decimals = 1) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

// 格式化货币
export const formatCurrency = (num: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY'
  }).format(num);
};

// 格式化日期
export const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

// 格式化时间
export const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// 模拟API调用
export const simulateApiCall = <T>(data: T, delay: number = 1000): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// 生成随机数据
export const generateRandomData = (min: number, max: number, count: number): number[] => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push(min + Math.random() * (max - min));
  }
  return data;
};

// 生成随机分类数据
export const generateRandomCategoryData = (
  categories: string[],
  min: number,
  max: number
): { name: string; value: number }[] => {
  return categories.map((category) => ({
    name: category,
    value: min + Math.random() * (max - min)
  }));
};

// 生成随机时间序列数据
export const generateRandomTimeSeriesData = (
  days: number,
  min: number,
  max: number
): { date: string; value: number }[] => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: formatDate(date),
      value: min + Math.random() * (max - min)
    });
  }
  
  return data;
};

// 生成模型性能数据
export const generateModelPerformanceData = () => {
  return {
    accuracy: 0.85 + Math.random() * 0.1,
    precision: 0.8 + Math.random() * 0.15,
    recall: 0.75 + Math.random() * 0.2,
    f1Score: 0.8 + Math.random() * 0.15,
    auc: 0.85 + Math.random() * 0.1,
    trainTime: Math.floor(10 + Math.random() * 50)
  };
};

// 生成特征重要性数据
export const generateFeatureImportanceData = () => {
  const features = [];
  for (let i = 0; i < 15; i++) {
    features.push({
      name: `var_${i}`,
      importance: Math.random()
    });
  }
  
  // 按重要性排序
  features.sort((a, b) => b.importance - a.importance);
  
  // 归一化
  const maxImportance = features[0].importance;
  features.forEach(feature => {
    feature.importance = feature.importance / maxImportance;
  });
  
  return features;
};

// 生成混淆矩阵
export const generateConfusionMatrix = () => {
  // 真阳性、假阴性、假阳性、真阴性
  const tp = Math.floor(1800 + Math.random() * 400);
  const fn = Math.floor(200 + Math.random() * 100);
  const fp = Math.floor(300 + Math.random() * 150);
  const tn = Math.floor(17500 + Math.random() * 500);
  
  return {
    truePositive: tp,
    falseNegative: fn,
    falsePositive: fp,
    trueNegative: tn,
    total: tp + fn + fp + tn
  };
};

// 生成ROC曲线数据
export const generateRocCurveData = () => {
  const points = [];
  points.push({ x: 0, y: 0 }); // 起点
  
  // 生成中间点
  let lastX = 0;
  let lastY = 0;
  
  for (let i = 0; i < 10; i++) {
    // 确保x和y是递增的
    const stepX = Math.random() * 0.1 + 0.01;
    const stepY = Math.random() * 0.15 + 0.05;
    
    const x = Math.min(lastX + stepX, 1);
    const y = Math.min(lastY + stepY, 1);
    
    points.push({ x, y });
    
    lastX = x;
    lastY = y;
    
    if (x >= 1 || y >= 1) break;
  }
  
  points.push({ x: 1, y: 1 }); // 终点
  
  // 计算AUC (使用梯形法则)
  let auc = 0;
  for (let i = 1; i < points.length; i++) {
    auc += (points[i].y + points[i-1].y) * (points[i].x - points[i-1].x) / 2;
  }
  
  return {
    points,
    auc
  };
};

// 生成PR曲线数据
export const generatePrCurveData = () => {
  const points = [];
  
  // 起点通常是(1, 0)
  points.push({ precision: 1, recall: 0 });
  
  let lastPrecision = 1;
  let lastRecall = 0;
  
  for (let i = 0; i < 10; i++) {
    // 确保precision递减，recall递增
    const stepPrecision = Math.random() * 0.1 + 0.01;
    const stepRecall = Math.random() * 0.15 + 0.05;
    
    const precision = Math.max(lastPrecision - stepPrecision, 0);
    const recall = Math.min(lastRecall + stepRecall, 1);
    
    points.push({ precision, recall });
    
    lastPrecision = precision;
    lastRecall = recall;
    
    if (precision <= 0 || recall >= 1) break;
  }
  
  // 终点通常是某个低precision和高recall的点
  if (points[points.length - 1].recall < 1) {
    points.push({ precision: 0.1, recall: 1 });
  }
  
  // 计算AP (使用梯形法则)
  let ap = 0;
  for (let i = 1; i < points.length; i++) {
    ap += (points[i].precision + points[i-1].precision) * (points[i].recall - points[i-1].recall) / 2;
  }
  
  return {
    points,
    ap
  };
};

// 生成客户数据
export const generateCustomerData = (features: string[]) => {
  const data: Record<string, number> = {};
  
  features.forEach(feature => {
    data[feature] = Math.random() * 2 - 1; // -1到1之间的值
  });
  
  return data;
};

// 生成分布数据
export const generateDistributionData = () => {
  // 生成正态分布数据
  const mean = Math.random() * 2 - 1; // -1到1之间的均值
  const std = 0.2 + Math.random() * 0.3; // 0.2到0.5之间的标准差
  
  // 生成直方图数据
  const binCount = 20;
  const min = mean - 3 * std;
  const max = mean + 3 * std;
  const binWidth = (max - min) / binCount;
  
  const binEdges = [];
  for (let i = 0; i <= binCount; i++) {
    binEdges.push(min + i * binWidth);
  }
  
  // 生成直方图频数
  const histogram = [];
  for (let i = 0; i < binCount; i++) {
    // 使用正态分布公式计算每个bin的频数
    const binCenter = min + (i + 0.5) * binWidth;
    const height = Math.exp(-0.5 * Math.pow((binCenter - mean) / std, 2)) / (std * Math.sqrt(2 * Math.PI));
    // 缩放并添加一些随机性
    histogram.push(Math.floor(height * 1000 + Math.random() * 50));
  }
  
  return {
    histogram,
    binEdges,
    mean,
    std,
    min,
    max
  };
};

// 生成平衡策略数据
export const generateBalancingStrategiesData = () => {
  const strategies = [
    '原始数据',
    '随机过采样',
    '随机欠采样',
    'SMOTE',
    'ADASYN',
    'Tomek Links',
    'NearMiss',
    'SMOTEENN'
  ];
  
  const results = strategies.map(strategy => {
    const baseAccuracy = 0.8 + Math.random() * 0.15;
    const basePrecision = 0.75 + Math.random() * 0.2;
    const baseRecall = 0.7 + Math.random() * 0.25;
    const baseF1 = 0.75 + Math.random() * 0.2;
    const baseAuc = 0.8 + Math.random() * 0.15;
    
    // 原始数据性能较低
    const multiplier = strategy === '原始数据' ? 0.9 : 1;
    
    return {
      strategy,
      metrics: {
        accuracy: baseAccuracy * multiplier,
        precision: basePrecision * multiplier,
        recall: baseRecall * multiplier,
        f1Score: baseF1 * multiplier,
        auc: baseAuc * multiplier
      },
      classDistribution: {
        before: [18000, 2000],
        after: strategy === '原始数据' ? [18000, 2000] : [10000, 10000]
      }
    };
  });
  
  return results;
};

// 生成特征选择数据
export const generateFeatureSelectionData = () => {
  const methods = [
    '全部特征',
    '方差阈值',
    '互信息',
    '卡方检验',
    'RFE',
    'L1正则化',
    'Tree-based'
  ];
  
  const results = methods.map(method => {
    const featureCount = method === '全部特征' ? 200 : Math.floor(50 + Math.random() * 100);
    const baseAccuracy = 0.8 + Math.random() * 0.15;
    const baseTrainTime = 10 + Math.random() * 50;
    
    // 全部特征训练时间较长，性能可能较低
    const accuracyMultiplier = method === '全部特征' ? 0.95 : 1;
    const timeMultiplier = method === '全部特征' ? 2 : 1;
    
    return {
      method,
      featureCount,
      performance: {
        accuracy: baseAccuracy * accuracyMultiplier,
        trainTime: baseTrainTime * timeMultiplier
      }
    };
  });
  
  return results;
};

// 生成训练历史数据
export const generateTrainingHistoryData = () => {
  const epochs = 50;
  const trainLoss = [];
  const valLoss = [];
  const trainAccuracy = [];
  const valAccuracy = [];
  
  let currentTrainLoss = 0.8;
  let currentValLoss = 0.9;
  let currentTrainAcc = 0.6;
  let currentValAcc = 0.55;
  
  for (let i = 0; i < epochs; i++) {
    // 训练损失和验证损失随着训练逐渐下降
    currentTrainLoss = Math.max(0.1, currentTrainLoss - 0.01 - Math.random() * 0.01);
    currentValLoss = Math.max(0.15, currentValLoss - 0.01 - Math.random() * 0.005);
    
    // 训练准确率和验证准确率随着训练逐渐上升
    currentTrainAcc = Math.min(0.95, currentTrainAcc + 0.005 + Math.random() * 0.005);
    currentValAcc = Math.min(0.9, currentValAcc + 0.005 + Math.random() * 0.003);
    
    trainLoss.push(currentTrainLoss);
    valLoss.push(currentValLoss);
    trainAccuracy.push(currentTrainAcc);
    valAccuracy.push(currentValAcc);
  }
  
  return {
    epochs: Array.from({ length: epochs }, (_, i) => i + 1),
    trainLoss,
    valLoss,
    trainAccuracy,
    valAccuracy
  };
};

// 生成阈值优化数据
export const generateThresholdOptimizationData = () => {
  const thresholds = [];
  const precision = [];
  const recall = [];
  const f1Score = [];
  
  for (let t = 0; t <= 100; t += 5) {
    const threshold = t / 100;
    thresholds.push(threshold);
    
    // 随着阈值增加，precision上升，recall下降
    const currentPrecision = Math.min(0.95, 0.5 + threshold * 0.45 + Math.random() * 0.05);
    const currentRecall = Math.max(0.05, 0.95 - threshold * 0.85 + Math.random() * 0.05);
    
    // F1分数是precision和recall的调和平均数
    const currentF1 = 2 * currentPrecision * currentRecall / (currentPrecision + currentRecall);
    
    precision.push(currentPrecision);
    recall.push(currentRecall);
    f1Score.push(currentF1);
  }
  
  // 找到F1分数最高的阈值
  let maxF1 = 0;
  let optimalThreshold = 0.5;
  
  for (let i = 0; i < f1Score.length; i++) {
    if (f1Score[i] > maxF1) {
      maxF1 = f1Score[i];
      optimalThreshold = thresholds[i];
    }
  }
  
  return {
    thresholds,
    precision,
    recall,
    f1Score,
    optimalThreshold,
    maxF1
  };
};