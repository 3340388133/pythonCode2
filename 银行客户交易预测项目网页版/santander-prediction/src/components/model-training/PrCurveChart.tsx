import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface PrCurveChartProps {
  data: Array<[number, number]> | null;
}

const PrCurveChart: React.FC<PrCurveChartProps> = ({ data }) => {
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

    // 计算AP (Average Precision)
    let ap = 0;
    for (let i = 1; i < data.length; i++) {
      ap += (data[i][1] + data[i-1][1]) * Math.abs(data[i][0] - data[i-1][0]) / 2;
    }

    // 转换数据格式为 [recall, precision]
    const prData = data.map(point => [point[0], point[1]]);

    const option = {
      title: {
        text: `PR曲线 (AP = ${ap.toFixed(3)})`,
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
          return `召回率: ${(point.data[0] * 100).toFixed(2)}%<br/>精确率: ${(point.data[1] * 100).toFixed(2)}%`;
        }
      },
      legend: {
        data: ['PR曲线', '随机分类器基线'],
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
        name: '召回率 (Recall)',
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
        name: '精确率 (Precision)',
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
          name: 'PR曲线',
          type: 'line',
          data: prData,
          smooth: true,
          lineStyle: {
            color: '#10b981',
            width: 3
          },
          itemStyle: {
            color: '#10b981'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.1)' }
            ])
          }
        },
        {
          name: '随机分类器基线',
          type: 'line',
          data: [[0, 0.1], [1, 0.1]], // 假设正样本比例为10%
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

  // 计算AP
  let ap = 0;
  for (let i = 1; i < data.length; i++) {
    ap += (data[i][1] + data[i-1][1]) * Math.abs(data[i][0] - data[i-1][0]) / 2;
  }

  return (
    <div>
      <div className="mb-4 p-4 bg-green-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">AP值:</span>
            <span className="ml-2 font-semibold text-green-600">{ap.toFixed(3)}</span>
          </div>
          <div>
            <span className="text-gray-600">模型表现:</span>
            <span className="ml-2 font-semibold">
              {ap >= 0.8 ? '优秀' : ap >= 0.6 ? '良好' : ap >= 0.4 ? '一般' : '较差'}
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

export default PrCurveChart;