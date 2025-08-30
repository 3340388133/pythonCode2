import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface PredictionExplanationChartProps {
  data: {
    name: string;
    importance: number;
  }[] | null;
  customer: any;
}

const PredictionExplanationChart: React.FC<PredictionExplanationChartProps> = ({ data, customer }) => {
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
    if (!chartInstance.current || !data || !customer) return;

    // 获取前10个最重要的特征
    const topFeatures = [...data].slice(0, 10);
    
    // 准备数据
    const featureNames = topFeatures.map(f => f.name);
    const importanceValues = topFeatures.map(f => f.importance);
    
    // 获取客户的特征值
    const featureValues = featureNames.map(name => {
      return customer.features[name] !== undefined ? customer.features[name] : 0;
    });
    
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          const featureName = params[0].name;
          const importance = params[0].value;
          const featureValue = params[1].value;
          
          return `
            <div>
              <p><strong>${featureName}</strong></p>
              <p>重要性: ${importance.toFixed(4)}</p>
              <p>特征值: ${featureValue.toFixed(4)}</p>
            </div>
          `;
        }
      },
      legend: {
        data: ['特征重要性', '特征值'],
        top: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '重要性',
        nameLocation: 'middle',
        nameGap: 30
      },
      yAxis: {
        type: 'category',
        data: featureNames,
        axisLabel: {
          formatter: function(value: string) {
            // 如果特征名称太长，截断它
            return value.length > 10 ? value.substring(0, 10) + '...' : value;
          }
        }
      },
      series: [
        {
          name: '特征重要性',
          type: 'bar',
          data: importanceValues,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#0063B2' }
            ])
          }
        },
        {
          name: '特征值',
          type: 'scatter',
          symbolSize: 12,
          data: featureValues.map((value, index) => {
            // 将特征值映射到图表的x轴上
            // 使用一个缩放因子来确保散点在条形图上可见
            const scaleFactor = Math.max(...importanceValues) / Math.max(...featureValues.map(Math.abs));
            return [value * scaleFactor * 0.5, index];
          }),
          itemStyle: {
            color: '#ff7a45'
          }
        }
      ]
    };

    chartInstance.current.setOption(option);
  }, [data, customer]);

  if (!customer) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-500">请选择一个客户查看预测解释</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 p-4 bg-blue-50 rounded-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">客户ID</p>
            <p className="font-semibold">{customer.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">预测概率</p>
            <p className="font-semibold">{(customer.features.probability * 100).toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">实际结果</p>
            <p className="font-semibold">{customer.target === 1 ? '有交易' : '无交易'}</p>
          </div>
        </div>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
    </div>
  );
};

export default PredictionExplanationChart;