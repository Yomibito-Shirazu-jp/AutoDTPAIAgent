import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import WorkflowBuilder from './components/WorkflowBuilder';
import JobQueue from './components/JobQueue';
import AssetLibrary from './components/AssetLibrary';
import AdHocJobModal from './components/AdHocJobModal';
import { ViewState, Job } from './types';
import { MOCK_JOBS } from './constants';
import { Loader2, CheckCircle2, Save, Settings, Bell, Key, Moon } from 'lucide-react';

const SettingsView: React.FC<{ isBeginnerMode: boolean }> = ({ isBeginnerMode }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);
    
    // Persistent State
    const [projectId, setProjectId] = useState(() => localStorage.getItem('autodtp_project_id') || 'autodtp-production-2024');
    const [emailNotify, setEmailNotify] = useState(() => localStorage.getItem('autodtp_notify_email') === 'true');
    const [slackNotify, setSlackNotify] = useState(() => localStorage.getItem('autodtp_notify_slack') === 'false');

    const handleSave = () => {
        setIsSaving(true);
        
        // Actually save to localStorage
        localStorage.setItem('autodtp_project_id', projectId);
        localStorage.setItem('autodtp_notify_email', String(emailNotify));
        localStorage.setItem('autodtp_notify_slack', String(slackNotify));

        setTimeout(() => {
            setIsSaving(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }, 800);
    };

    return (
        <div className={`h-full overflow-y-auto p-8 ${isBeginnerMode ? 'bg-slate-100' : 'bg-slate-50'}`}>
            {showToast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="font-bold text-sm">設定を保存しました</span>
                </div>
            )}

            <div className="max-w-2xl mx-auto">
                <header className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Settings className="w-6 h-6 text-slate-500" />
                        {isBeginnerMode ? '設定' : 'システム設定'}
                    </h2>
                    <p className="text-slate-500 mt-1">アプリケーション全体の基本設定と通知管理</p>
                </header>

                <div className="space-y-6">
                    {/* API Settings */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                            <Key className="w-4 h-4 text-slate-500" />
                            <h3 className="font-bold text-slate-700 text-sm">API連携</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-2">Google Cloud Project ID</label>
                                <input 
                                    type="text" 
                                    value={projectId}
                                    onChange={(e) => setProjectId(e.target.value)}
                                    className="w-full p-2.5 bg-white border border-slate-300 rounded-md text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono placeholder-slate-400" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-2">Gemini API Key (Masked)</label>
                                <input 
                                    type="password" 
                                    defaultValue="AIzaSyXXXXXXXXXXXXXXXXXXXX" 
                                    readOnly
                                    className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-md text-slate-500 outline-none text-sm font-mono cursor-not-allowed" 
                                />
                                <p className="text-xs text-slate-400 mt-1">※APIキーは環境変数で管理されています</p>
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                            <Bell className="w-4 h-4 text-slate-500" />
                            <h3 className="font-bold text-slate-700 text-sm">通知設定</h3>
                        </div>
                        <div className="p-6 space-y-4">
                             <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">処理完了時のメール通知</p>
                                    <p className="text-xs text-slate-500">ジョブが完了したら登録メールアドレスへ通知します</p>
                                </div>
                                <button 
                                    onClick={() => setEmailNotify(!emailNotify)}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${emailNotify ? (isBeginnerMode ? 'bg-blue-500' : 'bg-indigo-500') : 'bg-slate-200'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${emailNotify ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                             </div>
                             <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">エラー発生時のSlack通知</p>
                                    <p className="text-xs text-slate-500">クリティカルなエラーをSlackへ即時通知します</p>
                                </div>
                                <button 
                                    onClick={() => setSlackNotify(!slackNotify)}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${slackNotify ? (isBeginnerMode ? 'bg-blue-500' : 'bg-indigo-500') : 'bg-slate-200'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${slackNotify ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                             </div>
                        </div>
                    </div>

                    {/* UI Settings */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                            <Moon className="w-4 h-4 text-slate-500" />
                            <h3 className="font-bold text-slate-700 text-sm">表示設定</h3>
                        </div>
                        <div className="p-6">
                             <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">ダークモード (Beta)</p>
                                    <p className="text-xs text-slate-500">画面全体を暗い配色に切り替えます</p>
                                </div>
                                <div className="w-12 h-6 bg-slate-200 rounded-full p-1 cursor-not-allowed">
                                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                                </div>
                             </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-6 py-2.5 text-white font-bold text-sm rounded-lg shadow-md transition-all ${
                            isSaving ? 'bg-slate-400 cursor-not-allowed' :
                            isBeginnerMode 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>保存中...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>設定を保存する</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(true);
  const [isAdHocModalOpen, setIsAdHocModalOpen] = useState(false);
  
  // State to hold both mock jobs and any new real jobs created by the user
  const [allJobs, setAllJobs] = useState<Job[]>(MOCK_JOBS);

  const handleJobComplete = (newJob: Job) => {
    setAllJobs(prev => [newJob, ...prev]);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard isBeginnerMode={isSimpleMode} onChangeView={setCurrentView} jobs={allJobs} />;
      case ViewState.WORKFLOW_BUILDER:
        return <WorkflowBuilder isBeginnerMode={isSimpleMode} />;
      case ViewState.JOBS:
        return <JobQueue isBeginnerMode={isSimpleMode} jobs={allJobs} />;
      case ViewState.ASSETS:
        return <AssetLibrary isBeginnerMode={isSimpleMode} />;
      case ViewState.SETTINGS:
        return <SettingsView isBeginnerMode={isSimpleMode} />;
      default:
        return <Dashboard isBeginnerMode={isSimpleMode} onChangeView={setCurrentView} jobs={allJobs} />;
    }
  };

  return (
    <div className="flex h-screen bg-white font-sans text-slate-900">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        isBeginnerMode={isSimpleMode}
        onToggleMode={() => setIsSimpleMode(!isSimpleMode)}
        onOpenAdHoc={() => setIsAdHocModalOpen(true)}
      />
      <main className="flex-1 overflow-hidden relative">
        {renderView()}
      </main>

      <AdHocJobModal 
        isOpen={isAdHocModalOpen}
        onClose={() => setIsAdHocModalOpen(false)}
        onJobComplete={handleJobComplete}
        isBeginnerMode={isSimpleMode}
      />
    </div>
  );
}

export default App;