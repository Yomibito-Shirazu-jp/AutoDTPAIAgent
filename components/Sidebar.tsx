import React from 'react';
import { 
  LayoutDashboard, 
  GitFork, 
  ListTodo, 
  Settings, 
  LogOut, 
  PlusCircle,
  Zap,
  Cloud,
  Layers,
  Box,
  FileText,
  History,
  Grid,
  Home
} from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isBeginnerMode: boolean;
  onToggleMode: () => void;
  onOpenAdHoc?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isBeginnerMode, onToggleMode, onOpenAdHoc }) => {
  
  // Business Simple Mode (Short Nouns) vs Expert Mode
  const navItems = isBeginnerMode ? [
    { view: ViewState.DASHBOARD, label: 'ホーム', icon: Home }, 
    { view: ViewState.ASSETS, label: 'ファイル', icon: Box }, 
    { view: ViewState.WORKFLOW_BUILDER, label: 'アプリ', icon: Layers }, 
    { view: ViewState.JOBS, label: '履歴', icon: History }, 
    { view: ViewState.SETTINGS, label: '設定', icon: Settings },
  ] : [
    { view: ViewState.DASHBOARD, label: 'ダッシュボード', icon: LayoutDashboard },
    { view: ViewState.ASSETS, label: 'アセット (GCS)', icon: Cloud },
    { view: ViewState.WORKFLOW_BUILDER, label: 'ワークフロー', icon: GitFork },
    { view: ViewState.JOBS, label: 'ジョブキュー', icon: ListTodo },
    { view: ViewState.SETTINGS, label: '設定', icon: Settings },
  ];

  return (
    <div className={`w-64 h-screen flex flex-col border-r transition-colors duration-300 flex-shrink-0 ${
        isBeginnerMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-900 text-slate-300 border-slate-800'
    }`}>
      {/* Header */}
      <div className="p-5 flex items-center gap-3 text-white">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg ${
            isBeginnerMode ? 'bg-yellow-500 text-white' : 'bg-indigo-500 shadow-indigo-500/30'
        }`}>
          {isBeginnerMode ? <Zap className="w-6 h-6" /> : <Zap className="w-5 h-5" />}
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">AutoDTP</h1>
          <p className="text-xs font-medium opacity-70">
            {isBeginnerMode ? 'Standard' : 'Enterprise'}
          </p>
        </div>
      </div>

      <div className="px-4 py-2 flex-1">
        <button 
          onClick={onOpenAdHoc}
          className={`w-full py-3 px-3 rounded-md flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-md mb-6 group ${
            isBeginnerMode 
            ? 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500' 
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/20'
        }`}>
          <PlusCircle className="w-5 h-5" />
          <span>{isBeginnerMode ? 'クイック作成' : '単発ジョブ'}</span>
        </button>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onChangeView(item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                currentView === item.view
                  ? isBeginnerMode 
                    ? 'bg-slate-700 text-white border-l-4 border-yellow-500' 
                    : 'bg-slate-800 text-white shadow-inner'
                  : 'hover:bg-slate-700/50 text-slate-400 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${
                  currentView === item.view 
                  ? (isBeginnerMode ? 'text-yellow-400' : 'text-indigo-400') 
                  : 'text-slate-500'
                }`} 
              />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Mode Toggle */}
      <div className="p-4 mx-4 mb-4 rounded-lg bg-slate-900/50 border border-slate-700">
        <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">
                表示モード切替
            </span>
            <div 
                onClick={onToggleMode}
                className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    isBeginnerMode ? 'bg-yellow-500' : 'bg-slate-600'
                }`}
            >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
                    isBeginnerMode ? 'translate-x-0' : 'translate-x-4'
                }`} />
            </div>
        </div>
        <p className="text-[10px] text-slate-500 leading-tight">
            {isBeginnerMode ? 'シンプル（推奨）' : 'エキスパート'}
        </p>
      </div>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold text-xs">
            User
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">山田 太郎</p>
            <p className="text-xs text-slate-500 truncate">編集部</p>
          </div>
          <LogOut className="w-4 h-4 text-slate-500 hover:text-slate-400" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;