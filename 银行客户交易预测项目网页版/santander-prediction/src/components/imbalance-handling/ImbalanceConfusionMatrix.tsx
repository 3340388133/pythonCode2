import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface ImbalanceConfusionMatrixProps {
  data: {
    trueNegative: number;
    falsePositive: number;
    falseNegative: number;
    truePositive: number;
  } | null;
}

const ImbalanceConfusionMatrix: React.FC<ImbalanceConfusionMatrixProps> = ({ data }) => {
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

    // 计算总样本数
    const total = data.trueNegative + data.falsePositive + data.falseNegative + data.truePositive;
    
    // 计算各项指标
    const accuracy = (data.trueNegative + data.truePositive) / total;
    const precision = data.truePositive / (data.truePositive + data.falsePositive);
    const recall = data.truePositive / (data.truePositive + data.falseNegative);
    const f1 = 2 * precision * recall / (precision + recall);
    const specificity = data.trueNegative / (data.trueNegative + data.falsePositive);
    
    const option = {
      tooltip: {
        position: 'top',
        formatter: function (params: any) {
          const value = params.data[2];
          const percent = ((value / total) * 100).toFixed(2);
          
          let description = '';
          if (params.data[0] === 0 && params.data[1] === 0) {
            description = '真负例 (TN)：正确预测为无交易的客户';
          } else if (params.data[0] === 0 && params.data[1] === 1) {
            description = '假正例 (FP)：错误预测为有交易的客户';
          } else if (params.data[0] === 1 && params.data[1] === 0) {
            description = '假负例 (FN)：错误预测为无交易的客户';
          } else {
            description = '真正例 (TP)：正确预测为有交易的客户';
          }
          
          return `
            <div>
              <p><strong>${description}</strong></p>
              <p>数量: ${value}</p>
              <p>占比: ${percent}%</p>
            </div>
          `;
        }
      },
      grid: {
        left: '15%',
        right: '15%',
        top: '15%',
        bottom: '20%'
      },
      xAxis: {
        type: 'category',
        data: ['预测: 无交易', '预测: 有交易'],
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: ['实际: 无交易', '实际: 有交易'],
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: 0,
        max: Math.max(data.trueNegative, data.falsePositive, data.falseNegative, data.truePositive),
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '0%',
        inRange: {
          color: ['#e0f5ff', '#0063B2']
        }
      },
      series: [
        {
          name: '混淆矩阵',
          type: 'heatmap',
          data: [
            [0, 0, data.trueNegative],
            [0, 1, data.falsePositive],
            [1, 0, data.falseNegative],
            [1, 1, data.truePositive]
          ],
          label: {
            show: true,
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
      ]
    };

    chartInstance.current.setOption(option);
    
    // 添加性能指标文本
    const textStyle = {
      fontSize: 14,
      fontWeight: 'bold',
      fill: '#333'
    };
    
    chartInstance.current.setOption({
      graphic: [
        {
          type: 'text',
          left: '5%',
          top: '85%',
          style: {
            ...textStyle,
            text: `准确率: ${(accuracy * 100).toFixed(2)}%`
          }
        },
        {
          type: 'text',
          left: '25%',
          top: '85%',
          style: {
            ...textStyle,
            text: `精确率: ${(precision * 100).toFixed(2)}%`
          }
        },
        {
          type: 'text',
          left: '45%',
          top: '85%',
          style: {
            ...textStyle,
            text: `召回率: ${(recall * 100).toFixed(2)}%`
          }
        },
        {
          type: 'text',
          left: '65%',
          top: '85%',
          style: {
            ...textStyle,
            text: `F1分数: ${(f1 * 100).toFixed(2)}%`
          }
        },
        {
          type: 'text',
          left: '85%',
          top: '85%',
          style: {
            ...textStyle,
            text: `特异度: ${(specificity * 100).toFixed(2)}%`
          }
        }
      ]
    });
  }, [data]);

  return <div ref={chartRef} style={{ width: '100%', height: '500px' }} />;
};

export default ImbalanceConfusionMatrix;