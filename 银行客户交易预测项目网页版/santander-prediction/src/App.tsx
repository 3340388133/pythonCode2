import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import './index.css'

// 页面导入
import Dashboard from './pages/dashboard/Dashboard'
import FeatureEngineering from './pages/feature-engineering/FeatureEngineering'
import ModelTraining from './pages/model-training/ModelTraining'
import DataAnalysis from './pages/data-analysis/DataAnalysis'
import PredictionResults from './pages/prediction-results/PredictionResults'
import ImbalanceHandling from './pages/imbalance-handling/ImbalanceHandling'
import ModelEnsemble from './pages/model-ensemble/ModelEnsemble'

// 导航链接组件
const NavLink = ({ to, children }: { to: string, children: React.ReactNode }) => {
  const location = useLocation()
  const isActive = location.pathname === to
  
  return (
    <Link 
      to={to} 
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive 
          ? "text-blue-800 font-semibold" 
          : "text-gray-500 hover:text-blue-600"
      }`}
    >
      {children}
    </Link>
  )
}

// 布局组件
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-800 hover:text-blue-700">
            桑坦德银行客户交易预测系统
          </Link>
          <nav className="flex space-x-1 md:space-x-4 overflow-x-auto pb-2 md:pb-0">
            <NavLink to="/">仪表盘</NavLink>
            <NavLink to="/data-analysis">数据分析</NavLink>
            <NavLink to="/feature-engineering">特征工程</NavLink>
            <NavLink to="/model-training">模型训练</NavLink>
            <NavLink to="/prediction-results">预测结果</NavLink>
            <NavLink to="/imbalance-handling">不平衡处理</NavLink>
            <NavLink to="/model-ensemble">模型融合</NavLink>
          </nav>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      
      <footer className="bg-white shadow mt-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          © 2025 桑坦德银行客户交易预测系统
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <header className="bg-white shadow sticky top-0 z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-blue-800 hover:text-blue-700">
              桑坦德银行客户交易预测系统
            </Link>
            <nav className="flex space-x-1 md:space-x-4 overflow-x-auto pb-2 md:pb-0">
              <NavLink to="/">仪表盘</NavLink>
              <NavLink to="/data-analysis">数据分析</NavLink>
              <NavLink to="/feature-engineering">特征工程</NavLink>
              <NavLink to="/model-training">模型训练</NavLink>
              <NavLink to="/prediction-results">预测结果</NavLink>
              <NavLink to="/imbalance-handling">不平衡处理</NavLink>
              <NavLink to="/model-ensemble">模型融合</NavLink>
            </nav>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/data-analysis" element={<DataAnalysis />} />
            <Route path="/feature-engineering" element={<FeatureEngineering />} />
            <Route path="/model-training" element={<ModelTraining />} />
            <Route path="/prediction-results" element={<PredictionResults />} />
            <Route path="/imbalance-handling" element={<ImbalanceHandling />} />
            <Route path="/model-ensemble" element={<ModelEnsemble />} />
          </Routes>
        </main>
        
        <footer className="bg-white shadow mt-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
            © 2025 桑坦德银行客户交易预测系统
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App