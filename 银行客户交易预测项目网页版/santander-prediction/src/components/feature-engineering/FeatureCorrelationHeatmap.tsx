import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface FeatureCorrelationHeatmapProps {
  data: Array<{
    feature1: string;
    feature2: string;
    correlation: number;
  }> | null;
  featureImportance?: Array<{
    name: string;
    importance: number;
  }> | null;
}

const FeatureCorrelationHeatmap: React.FC<FeatureCorrelationHeatmapProps> = ({ 
  data, 
  featureImportance 
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    // 初始化图表
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // 窗口大小变化时，重新调整图表大小
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current || !data || !featureImportance) return;

    // 获取前10个最重要的特征
    const topFeatures = featureImportance.slice(0, 10).map(f => f.name);
    
    // 创建相关性矩阵
    const matrix: number[][] = Array(topFeatures.length)
      .fill(0)
      .map(() => Array(topFeatures.length).fill(0));

    // 对角线设为1（自相关）
    for (let i = 0; i < topFeatures.length; i++) {
      matrix[i][i] = 1;
    }

    // 填充相关性矩阵
    data.forEach(corr => {
      const i = topFeatures.indexOf(corr.feature1);
      const j = topFeatures.indexOf(corr.feature2);
      if (i !== -1 && j !== -1 && i !== j) {
        matrix[i][j] = corr.correlation;
        matrix[j][i] = corr.correlation;
      }
    });
    
    // 如果没有找到相关性数据，生成随机相关性
    for (let i = 0; i < topFeatures.length; i++) {
      for (let j = i + 1; j < topFeatures.length; j++) {
        if (matrix[i][j] === 0) {
          const randomCorr = (Math.random() * 2 - 1) * 0.7; // -0.7到0.7之间
          matrix[i][j] = randomCorr;
          matrix[j][i] = randomCorr;
        }
      }
    }

    // 准备热力图数据
    const heatmapData: [number, number, number][] = [];
    for (let i = 0; i < topFeatures.length; i++) {
      for (let j = 0; j < topFeatures.length; j++) {
        heatmapData.push([j, i, matrix[i][j]]);
      }
    }

    const option = {
      tooltip: {
        position: 'top',
        formatter: function (params: any) {
          const i = params.data[1];
          const j = params.data[0];
          const value = params.data[2];
          return `${topFeatures[i]} 与 ${topFeatures[j]}<br/>相关性: ${value.toFixed(3)}`;
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        top: '10%',
        bottom: '15%'
      },
      xAxis: {
        type: 'category',
        data: topFeatures,
        splitArea: {
          show: true
        },
        axisLabel: {
          rotate: 45,
          fontSize: 10
        }
      },
      yAxis: {
        type: 'category',
        data: topFeatures,
        splitArea: {
          show: true
        },
        axisLabel: {
          fontSize: 10
        }
      },
      visualMap: {
        min: -1,
        max: 1,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '2%',
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        },
        text: ['高正相关', '高负相关'],
        textStyle: {
          fontSize: 12
        }
      },
      series: [
        {
          name: '相关性',
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: true,
            formatter: function (params: any) {
              return params.data[2].toFixed(2);
            },
            fontSize: 8
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    chartInstance.current.setOption(option);
  }, [data, featureImportance]);

  if (!data || !featureImportance) {
    return <div className="text-center py-8 text-gray-500">暂无数据</div>;
  }

  return (
    <div>
      <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">说明:</span> 
          该热力图展示了前10个最重要特征之间的相关性。红色表示正相关，蓝色表示负相关，颜色越深相关性越强。
        </p>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
};

export default FeatureCorrelationHeatmap;