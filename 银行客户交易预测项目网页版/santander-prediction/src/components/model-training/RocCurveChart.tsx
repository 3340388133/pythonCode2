import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface RocCurveChartProps {
  data: Array<[number, number]> | null;
}

const RocCurveChart: React.FC<RocCurveChartProps> = ({ data }) => {
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

    // 计算AUC (使用梯形法则)
    let auc = 0;
    for (let i = 1; i < data.length; i++) {
      auc += (data[i][1] + data[i-1][1]) * (data[i][0] - data[i-1][0]) / 2;
    }

    const option = {
      title: {
        text: `ROC曲线 (AUC = ${auc.toFixed(3)})`,
        left: 'center',
        top: 20,
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params: any) {
          const point = params[0];
          return `假阳性率: ${(point.data[0] * 100).toFixed(2)}%<br/>真阳性率: ${(point.data[1] * 100).toFixed(2)}%`;
        }
      },
      legend: {
        data: ['ROC曲线', '随机分类器'],
        top: 50
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '假阳性率 (FPR)',
        nameLocation: 'middle',
        nameGap: 30,
        min: 0,
        max: 1,
        axisLabel: {
          formatter: function(value: number) {
            return (value * 100).toFixed(0) + '%';
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '真阳性率 (TPR)',
        nameLocation: 'middle',
        nameGap: 50,
        min: 0,
        max: 1,
        axisLabel: {
          formatter: function(value: number) {
            return (value * 100).toFixed(0) + '%';
          }
        }
      },
      series: [
        {
          name: 'ROC曲线',
          type: 'line',
          data: data,
          smooth: true,
          lineStyle: {
            color: '#3b82f6',
            width: 3
          },
          itemStyle: {
            color: '#3b82f6'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.1)' }
            ])
          }
        },
        {
          name: '随机分类器',
          type: 'line',
          data: [[0, 0], [1, 1]],
          lineStyle: {
            color: '#ef4444',
            width: 2,
            type: 'dashed'
          },
          itemStyle: {
            color: '#ef4444'
          }
        }
      ]
    };

    chartInstance.current.setOption(option);
  }, [data]);

  if (!data) {
    return <div className="text-center py-8 text-gray-500">暂无数据</div>;
  }

  // 计算AUC
  let auc = 0;
  for (let i = 1; i < data.length; i++) {
    auc += (data[i][1] + data[i-1][1]) * (data[i][0] - data[i-1][0]) / 2;
  }

  return (
    <div>
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">AUC值:</span>
            <span className="ml-2 font-semibold text-blue-600">{auc.toFixed(3)}</span>
          </div>
          <div>
            <span className="text-gray-600">模型表现:</span>
            <span className="ml-2 font-semibold">
              {auc >= 0.9 ? '优秀' : auc >= 0.8 ? '良好' : auc >= 0.7 ? '一般' : '较差'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">数据点数:</span>
            <span className="ml-2 font-semibold">{data.length}</span>
          </div>
        </div>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
    </div>
  );
};

export default RocCurveChart;