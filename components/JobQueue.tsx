import React from 'react';
import { MOCK_JOBS } from '../constants';
import { JobStatus, Job } from '../types';
import { Search, Filter, RefreshCw, Eye, Download, AlertTriangle, List, CheckCircle2 } from 'lucide-react';

interface JobQueueProps {
    isBeginnerMode: boolean;
    jobs: Job[];
}

const JobQueue: React.FC<JobQueueProps> = ({ isBeginnerMode, jobs }) => {
    return (
        <div className={`p-8 h-full overflow-y-auto ${isBeginnerMode ? 'bg-slate-100' : 'bg-slate-50/50'}`}>
             <header className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className={`text-2xl font-bold ${isBeginnerMode ? 'text-slate-800' : 'text-slate-900'}`}>
                        {isBeginnerMode ? '処理履歴' : 'ジョブキュー'}
                    </h2>
                    <p className="text-slate-500 mt-1">
                        {isBeginnerMode ? '実行されたタスクの結果一覧' : 'すべての処理タスクのステータス監視'}
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder={isBeginnerMode ? "ファイル名で検索" : "ジョブID または ファイル名"} 
                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-64 shadow-sm placeholder-slate-400"
                        />
                    </div>
                    {!isBeginnerMode && (
                        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                            <Filter className="w-4 h-4" />
                            フィルター
                        </button>
                    )}
                </div>
            </header>

            <div className={`bg-white border rounded-lg shadow-sm overflow-hidden ${isBeginnerMode ? 'border-slate-200' : 'border-slate-200'}`}>
                <table className="w-full text-left text-sm">
                    <thead className={`text-slate-500 font-medium border-b ${isBeginnerMode ? 'bg-slate-50' : 'bg-slate-50'}`}>
                        <tr>
                            {!isBeginnerMode && <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded accent-indigo-600" /></th>}
                            <th className="px-6 py-4">ファイル名</th>
                            {!isBeginnerMode && <th className="px-6 py-4">適用ワークフロー</th>}
                            <th className="px-6 py-4">ステータス</th>
                            {!isBeginnerMode && <th className="px-6 py-4">タイムライン</th>}
                            <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {jobs.map((job) => (
                            <tr key={job.id} className="hover:bg-slate-50/50 group">
                                {!isBeginnerMode && (
                                    <td className="px-6 py-4">
                                        <input type="checkbox" className="rounded border-slate-300 accent-indigo-600" />
                                    </td>
                                )}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs border ${
                                            isBeginnerMode ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                        }`}>
                                            {job.fileName.split('.').pop()?.toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">{job.fileName}</div>
                                            {!isBeginnerMode && <div className="text-xs text-slate-500 font-mono mt-0.5">{job.id}</div>}
                                            {job.resultText && isBeginnerMode && (
                                              <p className="text-[10px] text-green-700 mt-1 truncate max-w-[200px] bg-green-50 px-1 py-0.5 rounded inline-block border border-green-100">
                                                {job.resultText}
                                              </p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                {!isBeginnerMode && (
                                    <td className="px-6 py-4">
                                        <span className="text-slate-600 text-xs">{job.workflowName}</span>
                                    </td>
                                )}
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold gap-1.5 ${
                                        job.status === JobStatus.COMPLETED ? 'bg-green-100 text-green-700' :
                                        job.status === JobStatus.PROCESSING ? 'bg-blue-100 text-blue-700' :
                                        job.status === JobStatus.NEEDS_REVIEW ? 'bg-orange-100 text-orange-700' :
                                        'bg-slate-100 text-slate-700'
                                    }`}>
                                        {job.status === JobStatus.COMPLETED && <CheckCircle2 className="w-3 h-3" />}
                                        {job.status === JobStatus.COMPLETED ? '完了' :
                                         job.status === JobStatus.PROCESSING ? '処理中' :
                                         job.status === JobStatus.FAILED ? '失敗' : job.status}
                                    </span>
                                </td>
                                {!isBeginnerMode && (
                                    <td className="px-6 py-4 text-slate-500 text-xs">
                                        開始: {job.timestamp}
                                    </td>
                                )}
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                        <List className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JobQueue;