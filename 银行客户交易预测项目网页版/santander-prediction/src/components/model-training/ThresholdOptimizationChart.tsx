import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface ThresholdOptimizationChartProps {
  data: {
    thresholds: number[];
    precision: number[];
    recall: number[];
    f1Score: number[];
    optimalThreshold: number;
    maxF1: number;
  } | null;
}

const ThresholdOptimizationChart: React.FC<ThresholdOptimizationChartProps> = ({ data }) => {
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

    const { thresholds, precision, recall, f1Score, optimalThreshold, maxF1 } = data;
    
    // 找到最优阈值的索引
    const optimalIndex = thresholds.findIndex(t => t === optimalThreshold);
    
    const option = {
      title: {
        text: `阈值优化 (最优阈值 = ${optimalThreshold.toFixed(2)}, F1 = ${maxF1.toFixed(4)})`,
        left: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          const threshold = params[0].axisValue;
          let result = `阈值: ${threshold}<br/>`;
          params.forEach((param: any) => {
            result += `${param.seriesName}: ${param.value.toFixed(4)}<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: ['精确率', '召回率', 'F1分数'],
        top: '10%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: thresholds.map(t => t.toFixed(2)),
        name: '阈值',
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: {
          interval: Math.floor(thresholds.length / 10)
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 1,
        name: '指标值',
        nameLocation: 'middle',
        nameGap: 40
      },
      series: [
        {
          name: '精确率',
          type: 'line',
          data: precision,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2,
            color: '#52c41a'
          }
        },
        {
          name: '召回率',
          type: 'line',
          data: recall,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2,
            color: '#1890ff'
          }
        },
        {
          name: 'F1分数',
          type: 'line',
          data: f1Score,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2,
            color: '#722ed1'
          },
          markPoint: {
            data: [
              {
                name: '最优阈值',
                coord: [thresholds[optimalIndex].toFixed(2), maxF1],
                value: maxF1.toFixed(4),
                itemStyle: {
                  color: '#f5222d'
                }
              }
            ]
          },
          markLine: {
            data: [
              {
                name: '最优阈值',
                xAxis: thresholds[optimalIndex].toFixed(2),
                lineStyle: {
                  color: '#f5222d',
                  type: 'dashed',
                  width: 2
                },
                label: {
                  formatter: `最优阈值: ${optimalThreshold.toFixed(2)}`
                }
              }
            ]
          }
        }
      ]
    };

    chartInstance.current.setOption(option);
  }, [data]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default ThresholdOptimizationChart;