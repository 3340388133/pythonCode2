import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface EnsembleMethodsChartProps {
  data: Array<{
    method: string;
    metrics: {
      accuracy: number;
      precision: number;
      recall: number;
      f1: number;
      auc: number;
    };
    complexity: number;
    trainTime: number;
  }> | null;
}

const EnsembleMethodsChart: React.FC<EnsembleMethodsChartProps> = ({ data }) => {
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

    const methods = data.map(item => item.method);
    const accuracy = data.map(item => item.metrics.accuracy);
    const auc = data.map(item => item.metrics.auc);
    const f1 = data.map(item => item.metrics.f1);

    const option = {
      title: {
        text: '集成方法性能对比',
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
          type: 'cross'
        },
        formatter: function (params: any) {
          const method = params[0].axisValue;
          let result = `${method}<br/>`;
          params.forEach((param: any) => {
            result += `${param.seriesName}: ${(param.value * 100).toFixed(2)}%<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: ['准确率', 'AUC', 'F1分数'],
        top: 50
      },
      grid: {
        left: '8%',
        right: '8%',
        bottom: '20%',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: methods,
        axisLabel: {
          rotate: 30,
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value',
        name: '性能指标',
        min: 0.7,
        max: 1,
        axisLabel: {
          formatter: function(value: number) {
            return (value * 100).toFixed(0) + '%';
          }
        }
      },
      series: [
        {
          name: '准确率',
          type: 'bar',
          data: accuracy,
          itemStyle: {
            color: '#3b82f6'
          }
        },
        {
          name: 'AUC',
          type: 'bar',
          data: auc,
          itemStyle: {
            color: '#10b981'
          }
        },
        {
          name: 'F1分数',
          type: 'bar',
          data: f1,
          itemStyle: {
            color: '#f59e0b'
          }
        }
      ]
    };

    chartInstance.current.setOption(option);
  }, [data]);

  if (!data) {
    return <div className="text-center py-8 text-gray-500">暂无数据</div>;
  }

  // 找到最佳方法
  const bestMethod = data.reduce((best, current) => 
    current.metrics.auc > best.metrics.auc ? current : best
  );

  return (
    <div>
      <div className="mb-4 p-4 bg-green-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">最佳方法:</span>
            <span className="ml-2 font-semibold text-green-600">{bestMethod.method}</span>
          </div>
          <div>
            <span className="text-gray-600">最高AUC:</span>
            <span className="ml-2 font-semibold text-blue-600">{(bestMethod.metrics.auc * 100).toFixed(2)}%</span>
          </div>
          <div>
            <span className="text-gray-600">复杂度:</span>
            <span className="ml-2 font-semibold">{bestMethod.complexity}/5</span>
          </div>
        </div>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
    </div>
  );
};

export default EnsembleMethodsChart;