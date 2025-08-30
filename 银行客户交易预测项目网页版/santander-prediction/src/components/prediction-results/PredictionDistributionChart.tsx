import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface PredictionDistributionChartProps {
  data: Array<{
    id: string;
    probability: number;
    prediction: number;
    target?: number;
  }> | null;
}

const PredictionDistributionChart: React.FC<PredictionDistributionChartProps> = ({ data }) => {
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

    // 创建概率分布直方图
    const bins = 20;
    const binSize = 1 / bins;
    const histogram = Array(bins).fill(0);
    
    data.forEach(item => {
      const binIndex = Math.min(Math.floor(item.probability / binSize), bins - 1);
      histogram[binIndex]++;
    });

    const binLabels = Array.from({ length: bins }, (_, i) => 
      `${(i * binSize).toFixed(2)}-${((i + 1) * binSize).toFixed(2)}`
    );

    const option = {
      title: {
        text: '预测概率分布',
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
          type: 'shadow'
        },
        formatter: function(params: any) {
          const dataIndex = params[0].dataIndex;
          const count = params[0].value;
          const percentage = ((count / data.length) * 100).toFixed(1);
          return `概率区间: ${binLabels[dataIndex]}<br/>样本数: ${count}<br/>占比: ${percentage}%`;
        }
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
        data: binLabels,
        name: '预测概率',
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: {
          rotate: 45,
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value',
        name: '样本数量'
      },
      series: [
        {
          name: '样本数',
          type: 'bar',
          data: histogram,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#0063B2' }
            ])
          },
          markLine: {
            data: [
              { 
                name: '阈值 0.5', 
                xAxis: 10, // 对应0.5的bin
                lineStyle: { color: '#ef4444', width: 2 },
                label: { formatter: '阈值: 0.5' }
              }
            ]
          }
        }
      ]
    };

    chartInstance.current.setOption(option);
  }, [data]);

  if (!data) {
    return <div className="text-center py-8 text-gray-500">暂无数据</div>;
  }

  const totalSamples = data.length;
  const positivePredictions = data.filter(item => item.probability > 0.5).length;
  const avgProbability = data.reduce((sum, item) => sum + item.probability, 0) / totalSamples;
  const highConfidence = data.filter(item => item.probability > 0.8 || item.probability < 0.2).length;

  return (
    <div>
      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-gray-600">总样本数</div>
          <div className="text-lg font-semibold text-blue-600">{totalSamples}</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-gray-600">正样本预测</div>
          <div className="text-lg font-semibold text-green-600">{positivePredictions}</div>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="text-gray-600">平均概率</div>
          <div className="text-lg font-semibold text-yellow-600">{(avgProbability * 100).toFixed(1)}%</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-gray-600">高置信度</div>
          <div className="text-lg font-semibold text-purple-600">{highConfidence}</div>
        </div>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
    </div>
  );
};

export default PredictionDistributionChart;