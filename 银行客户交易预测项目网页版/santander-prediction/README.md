# 桑坦德银行客户交易预测系统

这是一个基于React和TypeScript开发的桑坦德银行客户交易预测系统前端展示网站，采用现代化的UI设计和数据可视化技术，为用户提供直观、交互式的数据分析和预测结果展示。

## 功能模块

- **仪表盘**：提供系统整体概览，包括客户总数、预测交易数、交易率、特征数量、模型数量、准确率等关键指标。
- **数据分析**：展示数据分布、特征相关性等数据分析结果，帮助用户理解数据特征和模式。
- **特征工程**：展示特征重要性、特征选择方法比较、特征相关性热力图等，帮助用户了解特征工程过程和结果。
- **模型训练与评估**：展示模型训练过程、评估指标、混淆矩阵、ROC曲线、PR曲线等，帮助用户了解模型性能。
- **预测结果**：展示预测分布、客户预测列表、预测解释等，帮助用户理解预测结果和解释性。
- **数据不平衡处理**：展示不同数据不平衡处理方法的效果比较，包括类别分布、性能比较、混淆矩阵等。
- **模型融合**：展示不同模型融合方法的效果比较，包括性能比较、特征重要性比较等。

## 技术栈

- **前端框架**：React 18
- **开发语言**：TypeScript
- **UI组件库**：Shadcn UI
- **数据可视化**：ECharts、Recharts
- **构建工具**：Vite
- **CSS框架**：Tailwind CSS
- **路由管理**：React Router

## 项目启动

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建项目

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 使用Python HTTP服务器预览

如果Node.js环境配置有问题，可以使用Python HTTP服务器预览项目：

```bash
# 进入项目目录
cd 银行客户交易预测项目网页版/santander-prediction

# 启动Python HTTP服务器
python -m http.server 8080
```

然后在浏览器中访问 http://localhost:8080 即可查看项目。

## 项目结构

```
santander-prediction/
├── src/
│   ├── components/         # 组件目录
│   │   ├── charts/         # 图表组件
│   │   ├── dashboard/      # 仪表盘组件
│   │   ├── data-analysis/  # 数据分析组件
│   │   ├── feature-engineering/ # 特征工程组件
│   │   ├── model-training/ # 模型训练组件
│   │   ├── prediction-results/ # 预测结果组件
│   │   ├── imbalance-handling/ # 数据不平衡处理组件
│   │   ├── model-ensemble/ # 模型融合组件
│   │   └── ui/            # UI组件
│   ├── pages/             # 页面组件
│   ├── utils/             # 工具函数
│   ├── lib/               # 库函数
│   ├── App.tsx           # 应用入口
│   └── main.tsx          # 主入口
├── public/               # 静态资源
├── index.html           # HTML模板
├── vite.config.ts       # Vite配置
├── tsconfig.json        # TypeScript配置
├── tailwind.config.js   # Tailwind配置
└── package.json         # 项目依赖
```

## 注意事项

当前项目存在TypeScript编译错误，主要包括：

1. 缺少React和其他依赖库的类型声明
2. 组件中存在类型错误
3. 部分API方法未实现

需要修复这些错误才能成功构建和部署项目。