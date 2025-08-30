import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface ModelComparisonChartProps {
  data: {
    model: string;
    metrics: {
      accuracy: number;
      precision: number;
      recall: number;
      f1: number;
      auc: number;
      trainTime: number;
    };
  }[] | null;
}

const ModelComparisonChart: React.FC<ModelComparisonChartProps> = ({ data }) => {
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
    const models = data.map(d => d.model);
    const accuracy = data.map(d => d.metrics.accuracy);
    const precision = data.map(d => d.metrics.precision);
    const recall = data.map(d => d.metrics.recall);
    const f1 = data.map(d => d.metrics.f1);
    const auc = data.map(d => d.metrics.auc);
    const trainTime = data.map(d => d.metrics.trainTime);
    
    // 计算最大训练时间，用于归一化
    const maxTrainTime = Math.max(...trainTime);
    const normalizedTrainTimes = trainTime.map(time => time / maxTrainTime * 0.8); // 缩放到0.8以内，避免柱状图太高
    
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          const modelIndex = params[0].dataIndex;
          const model = models[modelIndex];
          const modelData = data[modelIndex];
          
          return `
            <div>
              <p><strong>${model}</strong></p>
              <p>准确率: ${(modelData.metrics.accuracy * 100).toFixed(2)}%</p>
              <p>精确率: ${(modelData.metrics.precision * 100).toFixed(2)}%</p>
              <p>召回率: ${(modelData.metrics.recall * 100).toFixed(2)}%</p>
              <p>F1分数: ${(modelData.metrics.f1 * 100).toFixed(2)}%</p>
              <p>AUC: ${(modelData.metrics.auc * 100).toFixed(2)}%</p>
              <p>训练时间: ${modelData.metrics.trainTime.toFixed(2)}秒</p>
            </div>
          `;
        }
      },
      legend: {
        data: ['准确率', '精确率', '召回率', 'F1分数', 'AUC', '训练时间'],
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
        data: models,
        axisLabel: {
          interval: 0,
          rotate: 45,
          fontSize: 10
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '性能指标',
          min: 0,
          max: 1,
          position: 'left',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#5470c6'
            }
          },
          axisLabel: {
            formatter: '{value}'
          }
        },
        {
          type: 'value',
          name: '训练时间',
          min: 0,
          max: 1,
          position: 'right',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#91cc75'
            }
          },
          axisLabel: {
            formatter: '{value}'
          },
          show: false // 隐藏第二个y轴，只用于数据映射
        }
      ],
      series: [
        {
          name: '准确率',
          type: 'bar',
          data: accuracy,
          itemStyle: {
            color: '#5470c6'
          }
        },
        {
          name: '精确率',
          type: 'bar',
          data: precision,
          itemStyle: {
            color: '#91cc75'
          }
        },
        {
          name: '召回率',
          type: 'bar',
          data: recall,
          itemStyle: {
            color: '#fac858'
          }
        },
        {
          name: 'F1分数',
          type: 'bar',
          data: f1,
          itemStyle: {
            color: '#ee6666'
          }
        },
        {
          name: 'AUC',
          type: 'bar',
          data: auc,
          itemStyle: {
            color: '#73c0de'
          }
        },
        {
          name: '训练时间',
          type: 'line',
          yAxisIndex: 1,
          data: normalizedTrainTimes,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            width: 2,
            color: '#3ba272'
          },
          itemStyle: {
            color: '#3ba272'
          }
        }
      ]
    };

    chartInstance.current.setOption(option);
  }, [data]);

  return <div ref={chartRef} style={{ width: '100%', height: '500px' }} />;
};

export default ModelComparisonChart;