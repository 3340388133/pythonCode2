# 银行客户交易预测系统 - 部署指南

## 项目简介
这是一个基于 Vite + React + TypeScript + Tailwind CSS 构建的银行客户交易预测系统，包含数据分析、特征工程、模型训练、预测结果、不平衡处理和模型融合等功能模块。

## 快速部署

### 1. Vercel 部署（推荐）

**优势**: 免费、自动HTTPS、全球CDN、零配置

1. 访问 [Vercel](https://vercel.com)
2. 用GitHub账号登录
3. 点击 "New Project"
4. 导入此仓库
5. 部署设置：
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. 点击 "Deploy"

访问地址：`https://your-project-name.vercel.app`

### 2. Netlify 部署

**优势**: 免费、简单易用、表单处理

1. 访问 [Netlify](https://netlify.com)
2. 拖拽 `dist` 文件夹到部署区域
   或者：
3. 连接GitHub仓库自动部署
   - Build command: `npm run build`
   - Publish directory: `dist`

访问地址：`https://your-project-name.netlify.app`

### 3. GitHub Pages 部署

**优势**: 免费、GitHub集成

1. 推送代码到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择 `gh-pages` 分支作为源
4. GitHub Actions会自动构建和部署

访问地址：`https://username.github.io/repository-name`

### 4. 云服务器部署

适用于：阿里云、腾讯云、AWS等

```bash
# 1. 上传dist文件夹到服务器
scp -r dist/* user@your-server:/var/www/html/

# 2. 配置Nginx (示例)
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# 3. 重启Nginx
sudo systemctl restart nginx
```

## 构建命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 环境要求

- Node.js >= 16
- npm >= 7

## 功能特性

- 📊 **数据分析**: 特征分布、相关性分析、数据统计
- 🔧 **特征工程**: 特征重要性、特征选择、相关性热力图
- 🤖 **模型训练**: 混淆矩阵、ROC曲线、PR曲线、训练历史
- 📈 **预测结果**: 预测分布、客户预测、模型解释
- ⚖️ **不平衡处理**: 采样方法对比、性能评估
- 🔗 **模型融合**: 集成方法、特征重要性对比

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **类型支持**: TypeScript
- **样式框架**: Tailwind CSS
- **图表库**: ECharts + Recharts
- **路由**: React Router DOM

## 部署注意事项

1. **单页应用路由**: 所有部署平台都已配置SPA路由重定向
2. **静态资源**: 构建后的静态资源已优化，包含代码分割
3. **浏览器兼容**: 支持现代浏览器 (ES2015+)
4. **响应式设计**: 适配桌面端和移动端

## 故障排除

### 部署后页面空白
- 检查控制台错误信息
- 确认构建过程无错误
- 检查部署平台的构建日志

### 路由404错误
- 确认部署平台已配置SPA重定向
- 检查 `vercel.json` 或 `netlify.toml` 配置

### 性能优化
- 已启用代码分割和gzip压缩
- 图表库已分离打包，减少主包大小
- 启用了sourcemap方便调试

## 更新部署

推送新代码到仓库后，Vercel和Netlify会自动重新部署。GitHub Pages需要等待Actions完成。