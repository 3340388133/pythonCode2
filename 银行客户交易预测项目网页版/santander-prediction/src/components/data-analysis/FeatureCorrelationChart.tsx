import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface Correlation {
  feature1: string;
  feature2: string;
  correlation: number;
}

interface FeatureCorrelationChartProps {
  correlations: Correlation[];
}

const FeatureCorrelationChart: React.FC<FeatureCorrelationChartProps> = ({ correlations }) => {
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
    if (!chartInstance.current || !correlations || correlations.length === 0) {
      return;
    }

    // 提取所有唯一的特征名称
    const features = Array.from(
      new Set(
        correlations.flatMap(corr => [corr.feature1, corr.feature2])
      )
    ).sort();

    // 创建相关性矩阵
    const matrix: number[][] = Array(features.length)
      .fill(0)
      .map(() => Array(features.length).fill(1)); // 对角线为1（自相关）

    // 填充相关性矩阵
    correlations.forEach(corr => {
      const i = features.indexOf(corr.feature1);
      const j = features.indexOf(corr.feature2);
      if (i !== -1 && j !== -1) {
        matrix[i][j] = corr.correlation;
        matrix[j][i] = corr.correlation; // 矩阵是对称的
      }
    });

    // 准备热力图数据
    const data: [number, number, number][] = [];
    for (let i = 0; i < features.length; i++) {
      for (let j = 0; j < features.length; j++) {
        data.push([i, j, matrix[i][j]]);
      }
    }

    const option = {
      tooltip: {
        position: 'top',
        formatter: function (params: any) {
          const i = params.data[0];
          const j = params.data[1];
          const value = params.data[2];
          return `${features[i]} 与 ${features[j]} 的相关性: ${value.toFixed(2)}`;
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
        data: features,
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
        data: features,
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
        bottom: '0%',
        inRange: {
          color: ['#2c7bb6', '#ffffbf', '#d7191c']
        }
      },
      series: [
        {
          name: '相关性',
          type: 'heatmap',
          data: data,
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
  }, [correlations]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default FeatureCorrelationChart;