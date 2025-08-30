@echo off
echo 正在构建银行客户交易预测系统...

REM 安装依赖
echo 检查依赖...
call npm install

REM 构建项目
echo 构建生产版本...
call npm run build

REM 检查构建结果
if exist "dist" (
    echo.
    echo ✅ 构建成功！
    echo.
    echo 部署选项：
    echo 1. Vercel: 访问 https://vercel.com 并导入此项目
    echo 2. Netlify: 访问 https://netlify.com 并拖拽 dist 文件夹
    echo 3. GitHub Pages: 推送代码到 GitHub 仓库
    echo.
    echo dist 文件夹已准备就绪，可用于任何静态网站托管服务。
    echo.
    
    REM 显示构建文件大小
    echo 构建文件信息：
    dir dist /s
) else (
    echo ❌ 构建失败！请检查错误信息。
)

pause