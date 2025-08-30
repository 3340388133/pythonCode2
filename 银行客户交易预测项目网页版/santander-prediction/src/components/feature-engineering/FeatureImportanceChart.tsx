import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface FeatureImportanceChartProps {
  data: Array<{
    name: string;
    importance: number;
  }> | null;
}

const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ data }) => {
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

    // 取前15个最重要的特征
    const topFeatures = data.slice(0, 15);
    
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          return `${params[0].name}<br/>重要性: ${(params[0].value * 100).toFixed(2)}%`;
        }
      },
      grid: {
        left: '15%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '重要性',
        axisLabel: {
          formatter: function(value: number) {
            return (value * 100).toFixed(0) + '%';
          }
        }
      },
      yAxis: {
        type: 'category',
        data: topFeatures.map(item => item.name),
        axisLabel: {
          fontSize: 10
        }
      },
      series: [
        {
          name: '特征重要性',
          type: 'bar',
          data: topFeatures.map(item => item.importance),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#0063B2' }
            ])
          },
          label: {
            show: true,
            position: 'right',
            formatter: function(params: any) {
              return (params.value * 100).toFixed(1) + '%';
            },
            fontSize: 10
          }
        }
      ]
    };

    chartInstance.current.setOption(option);
  }, [data]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default FeatureImportanceChart;