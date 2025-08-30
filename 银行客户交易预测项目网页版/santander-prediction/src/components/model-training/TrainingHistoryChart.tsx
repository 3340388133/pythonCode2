import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface TrainingHistoryChartProps {
  data: {
    epochs: number[];
    trainLoss: number[];
    valLoss: number[];
    trainAcc: number[];
    valAcc: number[];
  } | null;
}

const TrainingHistoryChart: React.FC<TrainingHistoryChartProps> = ({ data }) => {
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

    const { epochs, trainLoss, valLoss, trainAcc, valAcc } = data;

    const option = {
      title: {
        text: '训练历史',
        left: 'center',
        top: 20,
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        formatter: function (params: any) {
          const epoch = params[0].axisValue;
          let result = `Epoch ${epoch}<br/>`;
          params.forEach((param: any) => {
            const value = param.seriesName.includes('损失') 
              ? param.value.toFixed(4) 
              : (param.value * 100).toFixed(2) + '%';
            result += `${param.seriesName}: ${value}<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: ['训练损失', '验证损失', '训练准确率', '验证准确率'],
        top: 50
      },
      grid: {
        left: '8%',
        right: '8%',
        bottom: '15%',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: epochs,
        name: 'Epoch',
        nameLocation: 'middle',
        nameGap: 30
      },
      yAxis: [
        {
          type: 'value',
          name: '损失值',
          position: 'left',
          axisLabel: {
            formatter: '{value}'
          }
        },
        {
          type: 'value',
          name: '准确率',
          position: 'right',
          axisLabel: {
            formatter: function(value: number) {
              return (value * 100).toFixed(0) + '%';
            }
          }
        }
      ],
      series: [
        {
          name: '训练损失',
          type: 'line',
          yAxisIndex: 0,
          data: trainLoss,
          smooth: true,
          lineStyle: {
            color: '#ef4444',
            width: 2
          },
          itemStyle: {
            color: '#ef4444'
          }
        },
        {
          name: '验证损失',
          type: 'line',
          yAxisIndex: 0,
          data: valLoss,
          smooth: true,
          lineStyle: {
            color: '#f97316',
            width: 2,
            type: 'dashed'
          },
          itemStyle: {
            color: '#f97316'
          }
        },
        {
          name: '训练准确率',
          type: 'line',
          yAxisIndex: 1,
          data: trainAcc,
          smooth: true,
          lineStyle: {
            color: '#3b82f6',
            width: 2
          },
          itemStyle: {
            color: '#3b82f6'
          }
        },
        {
          name: '验证准确率',
          type: 'line',
          yAxisIndex: 1,
          data: valAcc,
          smooth: true,
          lineStyle: {
            color: '#10b981',
            width: 2,
            type: 'dashed'
          },
          itemStyle: {
            color: '#10b981'
          }
        }
      ]
    };

    chartInstance.current.setOption(option);
  }, [data]);

  if (!data) {
    return <div className="text-center py-8 text-gray-500">暂无数据</div>;
  }

  const { trainLoss, valLoss, trainAcc, valAcc } = data;
  const finalTrainLoss = trainLoss[trainLoss.length - 1];
  const finalValLoss = valLoss[valLoss.length - 1];
  const finalTrainAcc = trainAcc[trainAcc.length - 1];
  const finalValAcc = valAcc[valAcc.length - 1];

  return (
    <div>
      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-red-50 p-3 rounded-lg">
          <div className="text-gray-600">最终训练损失</div>
          <div className="text-lg font-semibold text-red-600">{finalTrainLoss.toFixed(4)}</div>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg">
          <div className="text-gray-600">最终验证损失</div>
          <div className="text-lg font-semibold text-orange-600">{finalValLoss.toFixed(4)}</div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-gray-600">训练准确率</div>
          <div className="text-lg font-semibold text-blue-600">{(finalTrainAcc * 100).toFixed(2)}%</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-gray-600">验证准确率</div>
          <div className="text-lg font-semibold text-green-600">{(finalValAcc * 100).toFixed(2)}%</div>
        </div>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
    </div>
  );
};

export default TrainingHistoryChart;