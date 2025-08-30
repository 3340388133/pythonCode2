import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface ConfusionMatrixChartProps {
  data: {
    trueNegative: number;
    falsePositive: number;
    falseNegative: number;
    truePositive: number;
  } | null;
}

const ConfusionMatrixChart: React.FC<ConfusionMatrixChartProps> = ({ data }) => {
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

    const { trueNegative, falsePositive, falseNegative, truePositive } = data;
    
    // 准备热力图数据
    const matrixData = [
      [0, 0, trueNegative, '真阴性 (TN)'],
      [1, 0, falsePositive, '假阳性 (FP)'],
      [0, 1, falseNegative, '假阴性 (FN)'],
      [1, 1, truePositive, '真阳性 (TP)']
    ];

    const option = {
      title: {
        text: '混淆矩阵',
        left: 'center',
        top: 20,
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        position: 'top',
        formatter: function (params: any) {
          const [x, y, value, label] = params.data;
          const total = trueNegative + falsePositive + falseNegative + truePositive;
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}<br/>数量: ${value}<br/>占比: ${percentage}%`;
        }
      },
      grid: {
        left: '15%',
        right: '15%',
        top: '25%',
        bottom: '25%'
      },
      xAxis: {
        type: 'category',
        data: ['预测: 负类', '预测: 正类'],
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
        data: ['实际: 负类', '实际: 正类'],
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
        bottom: '10%',
        inRange: {
          color: ['#ffffff', '#ff6b6b', '#ee5a24', '#c23616']
        },
        text: ['高', '低']
      },
      series: [
        {
          name: '混淆矩阵',
          type: 'heatmap',
          data: matrixData.map(item => [item[0], item[1], item[2]]),
          label: {
            show: true,
            formatter: function (params: any) {
              return params.data[2];
            },
            fontSize: 14,
            fontWeight: 'bold',
            color: '#000'
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
  }, [data]);

  if (!data) {
    return <div className="text-center py-8 text-gray-500">暂无数据</div>;
  }

  const { trueNegative, falsePositive, falseNegative, truePositive } = data;
  const total = trueNegative + falsePositive + falseNegative + truePositive;
  const accuracy = (trueNegative + truePositive) / total;
  const precision = truePositive / (truePositive + falsePositive);
  const recall = truePositive / (truePositive + falseNegative);
  const f1 = 2 * (precision * recall) / (precision + recall);

  return (
    <div>
      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-gray-600">准确率</div>
          <div className="text-lg font-semibold text-blue-600">{(accuracy * 100).toFixed(2)}%</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-gray-600">精确率</div>
          <div className="text-lg font-semibold text-green-600">{(precision * 100).toFixed(2)}%</div>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="text-gray-600">召回率</div>
          <div className="text-lg font-semibold text-yellow-600">{(recall * 100).toFixed(2)}%</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-gray-600">F1分数</div>
          <div className="text-lg font-semibold text-purple-600">{(f1 * 100).toFixed(2)}%</div>
        </div>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
    </div>
  );
};

export default ConfusionMatrixChart;