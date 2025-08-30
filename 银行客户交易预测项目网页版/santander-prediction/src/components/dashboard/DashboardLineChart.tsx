import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface LineChartProps {
  data: {
    dates: string[];
    values: number[];
  };
}

const DashboardLineChart: React.FC<LineChartProps> = ({ data }) => {
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
    if (!chartInstance.current || !data || !data.dates || !data.values) return;

    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c}%',
        axisPointer: {
          type: 'shadow'
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
        data: data.dates,
        axisLine: {
          lineStyle: {
            color: '#8392A5'
          }
        },
        axisLabel: {
          rotate: 30,
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value',
        name: '准确率 (%)',
        nameTextStyle: {
          padding: [0, 0, 0, 30]
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#8392A5'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#E9EDF2'
          }
        },
        min: function(value: { min: number }) {
          return Math.max(80, Math.floor(value.min - 5));
        }
      },
      series: [{
        data: data.values,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: '#0063B2'
        },
        itemStyle: {
          color: '#0063B2'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(0, 99, 178, 0.5)'
            },
            {
              offset: 1,
              color: 'rgba(0, 99, 178, 0.05)'
            }
          ])
        }
      }]
    };

    chartInstance.current.setOption(option);
  }, [data]);

  return <div ref={chartRef} style={{ width: '100%', height: '300px' }} />;
};

export default DashboardLineChart;