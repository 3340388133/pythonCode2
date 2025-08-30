import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface FeatureDistributionChartProps {
  data: {
    bins: number[];
    frequencies: number[];
    statistics: {
      mean: number;
      median: number;
      std: number;
      min: number;
      max: number;
    };
  } | null;
  featureName: string;
}

const FeatureDistributionChart: React.FC<FeatureDistributionChartProps> = ({ data, featureName }) => {
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
    if (!chartInstance.current || !data) return;

    // 准备数据
    const { bins, frequencies, statistics } = data;
    const labels: string[] = [];
    
    // 创建区间标签
    for (let i = 0; i < bins.length - 1; i++) {
      labels.push(`${bins[i].toFixed(2)} - ${bins[i + 1].toFixed(2)}`);
    }
    
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          const dataIndex = params[0].dataIndex;
          return `${labels[dataIndex]}<br/>频数: ${params[0].value}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: labels,
        axisLabel: {
          interval: 0,
          rotate: 45,
          fontSize: 10
        },
        name: featureName,
        nameLocation: 'middle',
        nameGap: 30
      },
      yAxis: {
        type: 'value',
        name: '频数'
      },
      series: [
        {
          name: '频数',
          type: 'bar',
          data: frequencies,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#0063B2' }
            ])
          }
        },
        {
          name: '均值',
          type: 'line',
          markLine: {
            data: [
              { 
                name: '均值', 
                xAxis: findBinIndex(bins, statistics.mean),
                lineStyle: { color: '#FF4500', width: 2 },
                label: { formatter: `均值: ${statistics.mean.toFixed(2)}` }
              },
              { 
                name: '中位数', 
                xAxis: findBinIndex(bins, statistics.median),
                lineStyle: { color: '#32CD32', width: 2 },
                label: { formatter: `中位数: ${statistics.median.toFixed(2)}` }
              }
            ]
          }
        }
      ]
    };

    chartInstance.current.setOption(option);
  }, [data, featureName]);

  // 辅助函数：找到值所在的区间索引
  const findBinIndex = (bins: number[], value: number): number => {
    for (let i = 0; i < bins.length - 1; i++) {
      if (value >= bins[i] && value <= bins[i + 1]) {
        return i;
      }
    }
    return 0;
  };

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default FeatureDistributionChart;