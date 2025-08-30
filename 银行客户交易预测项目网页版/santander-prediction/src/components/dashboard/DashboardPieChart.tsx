import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface PieChartProps {
  labels: string[];
  values: number[];
}

const DashboardPieChart: React.FC<PieChartProps> = ({ labels, values }) => {
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
    if (!chartInstance.current || !labels || !values || labels.length !== values.length) return;

    const data = labels.map((label, index) => ({
      name: label,
      value: values[index]
    }));

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        data: labels,
        textStyle: {
          fontSize: 10
        }
      },
      series: [
        {
          name: '数据分布',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '12',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data,
          color: [
            '#0063B2', 
            '#9CC3D5', 
            '#0098DB', 
            '#00B2CA', 
            '#7DCFB6'
          ]
        }
      ]
    };

    chartInstance.current.setOption(option);
  }, [labels, values]);

  return <div ref={chartRef} style={{ width: '100%', height: '300px' }} />;
};

export default DashboardPieChart;