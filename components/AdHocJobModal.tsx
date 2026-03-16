import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { X, Wand2, ArrowRight, Loader2, FileText, CheckCircle2, Copy } from 'lucide-react';
import { Job, JobStatus } from '../types';

interface AdHocJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobComplete: (job: Job) => void;
  isBeginnerMode: boolean;
}

const AdHocJobModal: React.FC<AdHocJobModalProps> = ({ isOpen, onClose, onJobComplete, isBeginnerMode }) => {
  const [inputText, setInputText] = useState('');
  const [taskType, setTaskType] = useState<'proofread' | 'summarize' | 'translate'>('proofread');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunAI = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setResult(null);

    try {
      // Initialize Gemini Client
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let prompt = "";
      let model = "gemini-2.5-flash"; // Default for fast text tasks

      switch (taskType) {
        case 'proofread':
          prompt = `あなたはプロのDTP編集者・校正者です。以下のテキストの誤字脱字、表記揺れ、不自然な日本語を修正し、修正後のテキストのみを出力してください。\n\n---\n${inputText}`;
          break;
        case 'summarize':
          prompt = `以下のテキストを、要点を押さえて3行以内の簡潔な日本語で要約してください。\n\n---\n${inputText}`;
          break;
        case 'translate':
          prompt = `Translate the following text into professional English suitable for business documentation.\n\n---\n${inputText}`;
          break;
      }

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });

      const generatedText = response.text || "エラー: 結果を取得できませんでした。";
      setResult(generatedText);

      // Create a completed job record
      const newJob: Job = {
        id: `job-${Date.now()}`,
        workflowName: isBeginnerMode ? '手動AI処理' : 'Ad-hoc AI Task',
        fileName: 'text_input.txt',
        status: JobStatus.COMPLETED,
        progress: 100,
        timestamp: 'たった今',
        thumbnailUrl: 'https://placehold.co/200x300/e2e8f0/94a3b8?text=TXT',
        isAdHoc: true,
        resultText: generatedText
      };

      onJobComplete(newJob);

    } catch (error) {
      console.error(error);
      setResult("エラーが発生しました。APIキーまたはネットワーク接続を確認してください。");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      alert('コピーしました');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${isBeginnerMode ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                    <Wand2 className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">{isBeginnerMode ? 'AIテキスト処理' : 'Ad-hoc AI Job'}</h3>
                    <p className="text-xs text-slate-500">Gemini 2.5 Flash</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-white">
            
            {/* Input Section */}
            <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-900">
                    1. 処理内容を選択
                </label>
                <div className="grid grid-cols-3 gap-3">
                    <button 
                        onClick={() => setTaskType('proofread')}
                        className={`px-4 py-3 rounded-lg border text-sm font-bold transition-all ${
                            taskType === 'proofread' 
                            ? (isBeginnerMode ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-indigo-50 border-indigo-500 text-indigo-700')
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                        校正・修正
                    </button>
                    <button 
                        onClick={() => setTaskType('summarize')}
                        className={`px-4 py-3 rounded-lg border text-sm font-bold transition-all ${
                            taskType === 'summarize' 
                            ? (isBeginnerMode ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-indigo-50 border-indigo-500 text-indigo-700')
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                        要約
                    </button>
                    <button 
                        onClick={() => setTaskType('translate')}
                        className={`px-4 py-3 rounded-lg border text-sm font-bold transition-all ${
                            taskType === 'translate' 
                            ? (isBeginnerMode ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-indigo-50 border-indigo-500 text-indigo-700')
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                        英語変換
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-900">
                    2. テキストを入力
                </label>
                <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="ここに処理したい文章を入力してください..."
                    className="w-full h-40 p-4 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 text-base leading-relaxed resize-none placeholder-slate-400"
                />
            </div>

            {/* Result Section */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                    <Loader2 className={`w-8 h-8 animate-spin mb-3 ${isBeginnerMode ? 'text-blue-600' : 'text-indigo-600'}`} />
                    <p className="text-sm font-bold text-slate-600">AIが思考中...</p>
                    <p className="text-xs text-slate-500 mt-1">数秒お待ちください</p>
                </div>
            )}

            {result && !isLoading && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between">
                         <label className="block text-sm font-bold text-slate-900 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            実行結果
                        </label>
                        <button onClick={copyToClipboard} className="text-xs font-bold flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded">
                            <Copy className="w-3 h-3" /> コピー
                        </button>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm leading-relaxed whitespace-pre-wrap shadow-inner font-medium">
                        {result}
                    </div>
                </div>
            )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-5 py-2.5 text-slate-700 font-bold text-sm hover:bg-slate-200 rounded-lg transition-colors border border-transparent"
            >
                キャンセル
            </button>
            <button 
                onClick={handleRunAI}
                disabled={isLoading || !inputText.trim()}
                className={`px-6 py-2.5 text-white font-bold text-sm rounded-lg shadow-sm flex items-center gap-2 transition-all ${
                    isLoading || !inputText.trim() 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : (isBeginnerMode ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-md' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md')
                }`}
            >
                {isLoading ? '処理中...' : '実行する'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdHocJobModal;