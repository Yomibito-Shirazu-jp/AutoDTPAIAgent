import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  FileCheck, 
  Clock, 
  Zap,
  MoreHorizontal,
  Cloud,
  Cpu,
  Layers,
  Box,
  FileText,
  AlertCircle,
  Megaphone,
  ArrowRight,
  Plus
} from 'lucide-react';
import { StatCardProps, Job, JobStatus, ViewState } from '../types';
import { MOCK_JOBS } from '../constants';

interface DashboardProps {
    isBeginnerMode: boolean;
    onChangeView?: (view: ViewState) => void;
    jobs?: Job[]; // Added support for dynamic jobs
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon: Icon }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
        <Icon className="w-5 h-5 text-slate-600" />
      </div>
      <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
        trend === 'up' ? 'bg-green-50 text-green-700' : trend === 'down' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'
      }`}>
        {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        {change}
      </span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

// Kintone-like App Icon Card
const AppIcon: React.FC<{ 
    icon: React.ElementType, 
    title: string, 
    desc: string, 
    colorClass: string,
    onClick?: () => void 
}> = ({ icon: Icon, title, desc, colorClass, onClick }) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-left group"
    >
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <h3 className="font-bold text-slate-700 group-hover:text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
        </div>
    </button>
);

const Dashboard: React.FC<DashboardProps> = ({ isBeginnerMode, onChangeView, jobs = MOCK_JOBS }) => {

  // --- SIMPLE MODE (PORTAL STYLE) ---
  if (isBeginnerMode) {
    return (
        <div className="p-8 h-full overflow-y-auto bg-slate-100">
            {/* Announcement Bar */}
            <div className="bg-white border-l-4 border-blue-500 p-4 rounded-r-md shadow-sm mb-8 flex items-start gap-3">
                <Megaphone className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                    <h3 className="text-sm font-bold text-slate-800">お知らせ</h3>
                    <p className="text-sm text-slate-600">来週月曜日にシステムメンテナンスを実施します（10/28 12:00〜13:00）</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Apps & Actions */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-slate-500" />
                            利用可能なアプリ（ワークフロー）
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AppIcon 
                                icon={FileText} 
                                title="雑誌レイアウト自動化" 
                                desc="Word原稿をInDesign形式へ変換" 
                                colorClass="bg-blue-500"
                                onClick={() => onChangeView?.(ViewState.WORKFLOW_BUILDER)}
                            />
                            <AppIcon 
                                icon={Box} 
                                title="画像一括リサイズ" 
                                desc="入稿画像をWeb用に最適化" 
                                colorClass="bg-green-500"
                                onClick={() => onChangeView?.(ViewState.WORKFLOW_BUILDER)}
                            />
                            <AppIcon 
                                icon={Activity} 
                                title="テキスト校正AI" 
                                desc="誤字脱字チェックと表記統一" 
                                colorClass="bg-orange-500"
                                onClick={() => onChangeView?.(ViewState.WORKFLOW_BUILDER)}
                            />
                            <button 
                                onClick={() => onChangeView?.(ViewState.WORKFLOW_BUILDER)}
                                className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                <span className="font-bold text-sm">アプリを追加</span>
                            </button>
                        </div>
                    </section>

                    <section>
                         <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-slate-500" />
                                最近の処理履歴
                            </h2>
                            <button onClick={() => onChangeView?.(ViewState.JOBS)} className="text-sm text-blue-600 hover:underline">すべて表示</button>
                         </div>
                         <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">ファイル名</th>
                                        <th className="px-4 py-3 font-medium">状態</th>
                                        <th className="px-4 py-3 font-medium text-right">日時</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {jobs.slice(0, 3).map(job => (
                                        <tr key={job.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 text-slate-700 font-medium">
                                              {job.fileName}
                                              {job.resultText && <span className="ml-2 text-xs bg-green-100 text-green-700 px-1 rounded">AI処理済</span>}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                                                    job.status === JobStatus.COMPLETED ? 'bg-green-100 text-green-700' :
                                                    job.status === JobStatus.PROCESSING ? 'bg-blue-100 text-blue-700' :
                                                    'bg-orange-100 text-orange-700'
                                                }`}>
                                                    {job.status === JobStatus.COMPLETED ? '完了' :
                                                     job.status === JobStatus.PROCESSING ? '処理中' : '確認待ち'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-500">{job.timestamp}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                    </section>
                </div>

                {/* Right Column: Information */}
                <div className="space-y-6">
                    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-3">未処理タスク (To-Do)</h3>
                        <ul className="space-y-3">
                            <li className="flex gap-3 items-start">
                                <div className="mt-1 w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-slate-700 hover:underline cursor-pointer">10月号_特集記事.docx の確認</p>
                                    <p className="text-xs text-slate-500">期限: 本日 17:00</p>
                                </div>
                            </li>
                            <li className="flex gap-3 items-start">
                                <div className="mt-1 w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-slate-700 hover:underline cursor-pointer">エラー詳細の確認 (job-1020)</p>
                                    <p className="text-xs text-slate-500">期限: 明日</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    
                    <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-100">
                        <h3 className="font-bold text-indigo-900 mb-2">ヘルプ＆サポート</h3>
                        <p className="text-sm text-indigo-700 mb-4">
                            操作方法がわからない場合は、マニュアルを確認するか管理者へお問い合わせください。
                        </p>
                        <button className="w-full py-2 bg-white border border-indigo-200 text-indigo-600 rounded text-sm font-bold hover:bg-indigo-50 transition-colors">
                            マニュアルを開く
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  // --- EXPERT MODE VIEW ---
  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50/50">
      <header className="mb-8 flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">ダッシュボード</h2>
            <p className="text-slate-500 mt-1">GCSアセットとDTPプロセスの稼働状況一覧</p>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                レポート出力
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="今月の処理済み" 
          value={`${12450 + jobs.filter(j => j.isAdHoc).length} 頁`} 
          change="+12.5%" 
          trend="up" 
          icon={FileCheck} 
        />
        <StatCard 
          title="GCS アセット容量" 
          value="845 GB" 
          change="+52 GB" 
          trend="up" 
          icon={Cloud} 
        />
        <StatCard 
          title="平均完了時間" 
          value="1.2 分" 
          change="-12秒" 
          trend="up" 
          icon={Clock} 
        />
        <StatCard 
          title="AI トークン消費" 
          value="24.5 M" 
          change="+8.2%" 
          trend="down" 
          icon={Cpu} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">直近のジョブ履歴</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">すべて見る</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">ファイル / ジョブ名</th>
                  <th className="px-6 py-4">タイプ</th>
                  <th className="px-6 py-4">ステータス</th>
                  <th className="px-6 py-4 text-right">進捗 / 完了</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-10 bg-slate-200 rounded overflow-hidden flex-shrink-0 border border-slate-300 relative">
                            <img src={job.thumbnailUrl} alt="doc" className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                <span className="text-[8px] font-bold text-white uppercase">{job.fileName.split('.').pop()}</span>
                            </div>
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">{job.fileName}</p>
                            <p className="text-xs text-slate-500">{job.id}</p>
                            {job.resultText && (
                              <p className="text-xs text-green-600 truncate max-w-[150px] mt-0.5">完了: {job.resultText.substring(0,20)}...</p>
                            )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        {job.isAdHoc ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                単発ジョブ
                            </span>
                        ) : (
                            <span className="text-slate-600 text-xs">{job.workflowName}</span>
                        )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        job.status === JobStatus.COMPLETED ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        job.status === JobStatus.PROCESSING ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        job.status === JobStatus.NEEDS_REVIEW ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        job.status === JobStatus.FAILED ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        {job.status === JobStatus.PROCESSING ? (
                            <div className="flex items-center justify-end gap-2">
                                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 rounded-full animate-pulse" style={{width: `${job.progress}%`}}></div>
                                </div>
                                <span className="text-xs text-slate-500">{job.progress}%</span>
                            </div>
                        ) : (
                             <span className="text-xs text-slate-400">{job.timestamp}</span>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-slate-900">システム健全性</h3>
                    <MoreHorizontal className="w-5 h-5 text-slate-400 cursor-pointer" />
                </div>
                
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                <Zap className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-slate-900">AIエージェント (Gemini 2.5)</h4>
                            <p className="text-xs text-slate-500 mt-1">Status: Online. Gemini Connected.</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <Cloud className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-slate-900">GCS バケット接続</h4>
                            <p className="text-xs text-slate-500 mt-1">Write: 正常 / Read: 正常</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Activity className="w-24 h-24" />
                </div>
                <h3 className="font-semibold text-lg mb-2">今月のAI利用枠</h3>
                <div className="flex items-end gap-2 mb-4">
                    <span className="text-3xl font-bold">78%</span>
                    <span className="text-indigo-200 text-sm mb-1">消費済み</span>
                </div>
                <div className="w-full bg-indigo-800/50 rounded-full h-2 mb-2">
                    <div className="bg-indigo-400 h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
                <p className="text-xs text-indigo-200">大量の原稿処理を行う場合、チャンク処理設定を確認してください。</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;