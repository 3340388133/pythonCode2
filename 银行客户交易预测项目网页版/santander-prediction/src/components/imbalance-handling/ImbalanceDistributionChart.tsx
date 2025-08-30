import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface ImbalanceDistributionChartProps {
  data: {
    original: {
      negative: number;
      positive: number;
    };
    balanced: {
      negative: number;
      positive: number;
    };
  } | null;
}

const ImbalanceDistributionChart: React.FC<ImbalanceDistributionChartProps> = ({ data }) => {
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

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          const dataType = params[0].name;
          const negative = params[0].value;
          const positive = params[1].value;
          const total = negative + positive;
          const negativePercent = ((negative / total) * 100).toFixed(2);
          const positivePercent = ((positive / total) * 100).toFixed(2);
          
          return `
            <div>
              <p><strong>${dataType}</strong></p>
              <p>负样本: ${negative} (${negativePercent}%)</p>
              <p>正样本: ${positive} (${positivePercent}%)</p>
              <p>总样本: ${total}</p>
              <p>正负比例: 1:${(negative / positive).toFixed(2)}</p>
            </div>
          `;
        }
      },
      legend: {
        data: ['负样本 (无交易)', '正样本 (有交易)'],
        top: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['原始数据', '平衡后数据']
      },
      yAxis: {
        type: 'value',
        name: '样本数量'
      },
      series: [
        {
          name: '负样本 (无交易)',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data: [data.original.negative, data.balanced.negative],
          itemStyle: {
            color: '#5470c6'
          }
        },
        {
          name: '正样本 (有交易)',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data: [data.original.positive, data.balanced.positive],
          itemStyle: {
            color: '#91cc75'
          }
        }
      ]
    };

    chartInstance.current.setOption(option);
  }, [data]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default ImbalanceDistributionChart;