import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface ConfusionMatrixData {
  trueNegative: number;
  falsePositive: number;
  falseNegative: number;
  truePositive: number;
}

interface ImbalanceConfusionMatrixChartProps {
  data: ConfusionMatrixData | null;
  method: string;
}

const ImbalanceConfusionMatrixChart: React.FC<ImbalanceConfusionMatrixChartProps> = ({ data, method }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

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
    if (!chartInstance.current || !data) {
      return;
    }

    // 计算性能指标
    const { trueNegative, falsePositive, falseNegative, truePositive } = data;
    const total = trueNegative + falsePositive + falseNegative + truePositive;
    const accuracy = (trueNegative + truePositive) / total;
    const precision = truePositive / (truePositive + falsePositive);
    const recall = truePositive / (truePositive + falseNegative);
    const f1 = 2 * (precision * recall) / (precision + recall);

    // 准备热力图数据 [行, 列, 值]
    const matrixData = [
      [0, 0, trueNegative],   // 真阴性
      [0, 1, falsePositive],  // 假阳性
      [1, 0, falseNegative],  // 假阴性
      [1, 1, truePositive]    // 真阳性
    ];

    const option = {
      title: {
        text: `${method} 混淆矩阵`,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        position: 'top',
        formatter: function (params: any) {
          const labels = [
            ['真阴性 (TN)', '假阳性 (FP)'],
            ['假阴性 (FN)', '真阳性 (TP)']
          ];
          const row = params.data[0];
          const col = params.data[1];
          const value = params.data[2];
          return `${labels[row][col]}: ${value}`;
        }
      },
      grid: {
        height: '50%',
        top: '15%'
      },
      xAxis: {
        type: 'category',
        data: ['预测: 负', '预测: 正'],
        splitArea: {
          show: true
        },
        axisLabel: {
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      yAxis: {
        type: 'category',
        data: ['实际: 负', '实际: 正'],
        splitArea: {
          show: true
        },
        axisLabel: {
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      visualMap: {
        min: 0,
        max: Math.max(trueNegative, falsePositive, falseNegative, truePositive),
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '45%',
        inRange: {
          color: ['#ffffff', '#3b82f6']
        }
      },
      series: [
        {
          name: '混淆矩阵',
          type: 'heatmap',
          data: matrixData,
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            formatter: function (params: any) {
              return params.data[2];
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ],
      graphic: [
        {
          type: 'group',
          left: 'center',
          bottom: '5%',
          children: [
            {
              type: 'text',
              style: {
                text: `准确率: ${(accuracy * 100).toFixed(2)}%  精确率: ${(precision * 100).toFixed(2)}%  召回率: ${(recall * 100).toFixed(2)}%  F1: ${(f1 * 100).toFixed(2)}%`,
                fontSize: 12,
                fontWeight: 'bold',
                fill: '#374151'
              }
            }
          ]
        }
      ]
    };

    chartInstance.current.setOption(option);
  }, [data, method]);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">暂无数据</div>
      </div>
    );
  }

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default ImbalanceConfusionMatrixChart;