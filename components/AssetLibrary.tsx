import React from 'react';
import { 
  UploadCloud, 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  MoreVertical, 
  Search, 
  Filter, 
  Cloud,
  FileBox,
  Trash2,
  Download,
  CheckCircle2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { MOCK_ASSETS } from '../constants';

interface AssetLibraryProps {
    isBeginnerMode: boolean;
}

const AssetLibrary: React.FC<AssetLibraryProps> = ({ isBeginnerMode }) => {
    return (
        <div className={`flex flex-col h-full ${isBeginnerMode ? 'bg-slate-100' : 'bg-slate-50'}`}>
            {/* Header */}
            <div className={`px-8 py-6 bg-white border-b ${isBeginnerMode ? 'border-slate-200' : 'border-slate-200'}`}>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            {isBeginnerMode ? <Folder className="w-6 h-6 text-yellow-500" /> : <Cloud className="w-6 h-6 text-indigo-600" />}
                            {isBeginnerMode ? 'ファイル管理' : 'アセット管理 (GCS)'}
                        </h2>
                        <p className="text-slate-500 mt-1">
                            {isBeginnerMode ? 'アップロードしたファイルの確認・管理' : 'ワークフローで使用する原稿や素材を一元管理します。'}
                        </p>
                    </div>
                    <button className={`flex items-center gap-2 px-4 py-2 text-white rounded-md shadow-sm transition-colors font-bold text-sm ${
                        isBeginnerMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}>
                        <UploadCloud className="w-4 h-4" />
                        {isBeginnerMode ? '新規アップロード' : 'ファイルをアップロード'}
                    </button>
                </div>
                
                <div className="flex gap-4">
                     <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="ファイル名で検索..." 
                            className="pl-9 pr-4 py-2 w-full bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-slate-400"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                {isBeginnerMode ? (
                    // List View for Simple Mode (like Windows Explorer / Google Drive List)
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 w-10"><input type="checkbox" className="rounded accent-blue-600"/></th>
                                    <th className="px-6 py-3">名前</th>
                                    <th className="px-6 py-3">サイズ</th>
                                    <th className="px-6 py-3">更新日時</th>
                                    <th className="px-6 py-3 text-right">メニュー</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {MOCK_ASSETS.map(asset => (
                                    <tr key={asset.id} className="hover:bg-slate-50 group">
                                        <td className="px-6 py-3"><input type="checkbox" className="rounded accent-blue-600"/></td>
                                        <td className="px-6 py-3 flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded flex items-center justify-center ${
                                                asset.type === 'PDF' ? 'bg-red-100 text-red-600' : 
                                                asset.type === 'DOCX' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <span className="text-slate-700 font-medium">{asset.name}</span>
                                        </td>
                                        <td className="px-6 py-3 text-slate-500">{asset.size}</td>
                                        <td className="px-6 py-3 text-slate-500">{asset.uploadedAt}</td>
                                        <td className="px-6 py-3 text-right">
                                            <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    // Grid View for Expert Mode
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group min-h-[200px] bg-white">
                            <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 mb-2" />
                            <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600">ファイルアップロード</span>
                        </div>
                        {MOCK_ASSETS.map((asset) => (
                            <div key={asset.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col min-h-[200px]">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs ${
                                        asset.type === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                        {asset.type}
                                    </div>
                                    <MoreVertical className="w-4 h-4 text-slate-400 cursor-pointer" />
                                </div>
                                <h4 className="font-bold text-slate-900 text-sm line-clamp-2 mb-2">{asset.name}</h4>
                                <div className="mt-auto pt-2 text-xs text-slate-500 font-mono break-all">
                                    {asset.gcsPath}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssetLibrary;