import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface FeatureImportanceData {
  [model: string]: {
    feature: string;
    importance: number;
  }[];
}

interface FeatureImportanceComparisonChartProps {
  data: FeatureImportanceData | null;
}

const FeatureImportanceComparisonChart: React.FC<FeatureImportanceComparisonChartProps> = ({ data }) => {
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

    // 获取所有模型名称
    const models = Object.keys(data);
    if (models.length === 0) return;

    // 获取前10个最重要的特征（基于第一个模型）
    const firstModelFeatures = data[models[0]] || [];
    const topFeatures = firstModelFeatures.slice(0, 10).map(item => item.feature);

    // 为每个模型准备数据
    const series = models.map((model, index) => {
      const modelData = data[model] || [];
      const importanceValues = topFeatures.map(feature => {
        const found = modelData.find(item => item.feature === feature);
        return found ? found.importance : 0;
      });

      const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'];
      
      return {
        name: model,
        type: 'bar',
        data: importanceValues,
        itemStyle: {
          color: colors[index % colors.length]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      };
    });

    const option = {
      title: {
        text: '不同模型特征重要性对比',
        left: 'center',
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
        formatter: function (params: any[]) {
          let result = `特征: ${params[0].name}<br/>`;
          params.forEach(param => {
            result += `${param.seriesName}: ${(param.value * 100).toFixed(2)}%<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: models,
        top: '8%',
        itemWidth: 14,
        itemHeight: 14
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: topFeatures,
        axisLabel: {
          rotate: 45,
          fontSize: 10,
          interval: 0
        }
      },
      yAxis: {
        type: 'value',
        name: '重要性',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: series
    };

    chartInstance.current.setOption(option);
  }, [data]);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">暂无数据</div>
      </div>
    );
  }

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default FeatureImportanceComparisonChart;