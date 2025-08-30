import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface FeatureSelectionChartProps {
  data: Array<{
    name: string;
    selected: boolean;
    importance: number;
    correlation: number;
  }> | null;
}

const FeatureSelectionChart: React.FC<FeatureSelectionChartProps> = ({ data }) => {
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

    // 分离选中和未选中的特征
    const selectedFeatures = data.filter(item => item.selected);
    const unselectedFeatures = data.filter(item => !item.selected);
    
    const option = {
      tooltip: {
        formatter: function(params: any) {
          const item = params.data;
          return `${item.name}<br/>重要性: ${(item.importance * 100).toFixed(2)}%<br/>相关性: ${item.correlation.toFixed(3)}<br/>状态: ${item.selected ? '已选中' : '未选中'}`;
        }
      },
      legend: {
        data: ['已选中', '未选中'],
        top: 'top'
      },
      grid: {
        left: '3%',
        right: '7%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '重要性',
        scale: true,
        axisLabel: {
          formatter: function(value: number) {
            return (value * 100).toFixed(0) + '%';
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '相关性',
        scale: true,
        axisLabel: {
          formatter: function(value: number) {
            return value.toFixed(2);
          }
        }
      },
      series: [
        {
          name: '已选中',
          type: 'scatter',
          data: selectedFeatures.map(item => ({
            name: item.name,
            value: [item.importance, item.correlation],
            importance: item.importance,
            correlation: item.correlation,
            selected: item.selected
          })),
          symbolSize: 8,
          itemStyle: {
            color: '#5470c6'
          }
        },
        {
          name: '未选中',
          type: 'scatter',
          data: unselectedFeatures.map(item => ({
            name: item.name,
            value: [item.importance, item.correlation],
            importance: item.importance,
            correlation: item.correlation,
            selected: item.selected
          })),
          symbolSize: 6,
          itemStyle: {
            color: '#91cc75'
          }
        }
      ]
    };

    chartInstance.current.setOption(option);
  }, [data]);

  if (!data) {
    return <div className="text-center py-8 text-gray-500">暂无数据</div>;
  }

  const selectedCount = data.filter(item => item.selected).length;
  const totalCount = data.length;

  return (
    <div>
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">总特征数:</span>
            <span className="ml-2 font-semibold">{totalCount}</span>
          </div>
          <div>
            <span className="text-gray-600">已选特征:</span>
            <span className="ml-2 font-semibold text-blue-600">{selectedCount}</span>
          </div>
          <div>
            <span className="text-gray-600">选择率:</span>
            <span className="ml-2 font-semibold">{((selectedCount / totalCount) * 100).toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-gray-600">特征维度:</span>
            <span className="ml-2 font-semibold text-green-600">减少 {((1 - selectedCount / totalCount) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
    </div>
  );
};

export default FeatureSelectionChart;