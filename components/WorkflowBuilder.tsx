import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Settings2,
  Bot,
  Code2,
  MessageSquare,
  ArrowRight,
  FileInput,
  HardDrive,
  CheckCircle2,
  Wand2,
  FileSearch,
  PenTool,
  Save,
  Layers,
  FileText,
  Loader2
} from 'lucide-react';
import { Workflow, WorkflowNode, NodeType } from '../types';
import { MOCK_WORKFLOWS } from '../constants';

interface WorkflowBuilderProps {
    isBeginnerMode: boolean;
}

// Step Card Component
const StepCard: React.FC<{ 
    node: WorkflowNode; 
    stepNumber: number;
    isSelected: boolean;
    onClick: () => void;
    label: string;
    isBeginnerMode: boolean;
}> = ({ node, stepNumber, isSelected, onClick, label, isBeginnerMode }) => {
    const Icon = node.icon!;
    const borderColor = isSelected ? (isBeginnerMode ? 'border-blue-500' : 'border-indigo-500') : 'border-slate-200';
    const bgColor = isSelected ? (isBeginnerMode ? 'bg-blue-50' : 'bg-white') : 'bg-white';
    
    return (
        <div 
            onClick={onClick}
            className={`relative flex-1 rounded-lg border-2 transition-all cursor-pointer group overflow-hidden min-h-[240px] flex flex-col ${borderColor} ${bgColor} ${
                isSelected 
                ? 'shadow-md z-10' 
                : 'hover:border-slate-300 hover:shadow-sm'
            }`}
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
                {isSelected && <div className={`h-full ${isBeginnerMode ? 'bg-blue-500' : 'bg-indigo-500'}`} />}
            </div>

            <div className="p-4">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide mb-4 ${
                    isSelected 
                    ? (isBeginnerMode ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700') 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                    Step {stepNumber}: {label}
                </span>

                <div className="flex flex-col items-center justify-center text-center mt-2">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 ${
                        isSelected 
                        ? (isBeginnerMode ? 'bg-white border border-blue-100 text-blue-600' : 'bg-indigo-50 text-indigo-600') 
                        : 'bg-slate-50 text-slate-400'
                    }`}>
                        <Icon className="w-7 h-7" />
                    </div>
                    
                    <h3 className={`text-base font-bold mb-1 ${isSelected ? 'text-slate-800' : 'text-slate-600'}`}>
                        {node.title}
                    </h3>
                    <p className="text-xs text-slate-500 px-2 leading-relaxed">
                        {node.description}
                    </p>
                </div>
            </div>

            {isSelected && (
                <div className="absolute top-3 right-3">
                    <CheckCircle2 className={`w-5 h-5 ${isBeginnerMode ? 'text-blue-500' : 'text-indigo-500'}`} />
                </div>
            )}
        </div>
    );
};

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ isBeginnerMode }) => {
    const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow>(MOCK_WORKFLOWS[0]);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(selectedWorkflow.nodes[1].id);
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const selectedNode = selectedWorkflow.nodes.find(n => n.id === selectedNodeId);

    // Simulated Save Handler
    const handleSave = () => {
        setIsSaving(true);
        // Simulate network delay
        setTimeout(() => {
            setIsSaving(false);
            setShowToast(true);
            // Hide toast after 3 seconds
            setTimeout(() => setShowToast(false), 3000);
        }, 1000);
    };

    // Business-Friendly Labels for Simple Mode
    const getBeginnerTitle = (originalTitle: string, type: NodeType) => {
        if (type === NodeType.GCS_INPUT) return '入力元フォルダ';
        if (type === NodeType.AI_AGENT) return 'AI編集（エージェント）';
        if (type === NodeType.PROMPT) return 'テキスト変換';
        if (type === NodeType.FUNCTION_CALL) return 'データ処理';
        if (type === NodeType.OUTPUT) return '保存先';
        return originalTitle;
    };

    const getBeginnerDesc = (originalDesc: string, type: NodeType) => {
         if (type === NodeType.GCS_INPUT) return '処理対象のファイルが格納されている場所';
         if (type === NodeType.AI_AGENT) return '高度なAI判断で編集・校正を行います';
         if (type === NodeType.PROMPT) return '定型ルールに従ってテキストを修正します';
         if (type === NodeType.FUNCTION_CALL) return '画像変換やフォーマット変更を行います';
         if (type === NodeType.OUTPUT) return '処理完了後のファイルを保存する場所';
         return originalDesc;
    };

    const updateProcessType = (newType: NodeType) => {
        if (!selectedNode || selectedNodeId !== selectedWorkflow.nodes[1].id) return;
        const updatedNodes = [...selectedWorkflow.nodes];
        const processNode = updatedNodes[1];
        processNode.type = newType;
        
        // Update meta based on type
        if (newType === NodeType.AI_AGENT) {
            processNode.title = isBeginnerMode ? "AI編集" : "AI エージェント";
            processNode.description = isBeginnerMode ? "文脈を理解して編集・要約" : "LLMによる推論・加工";
            processNode.icon = isBeginnerMode ? Wand2 : Bot;
        } else if (newType === NodeType.PROMPT) {
            processNode.title = isBeginnerMode ? "テキスト変換" : "プロンプト処理";
            processNode.description = isBeginnerMode ? "誤字チェック・ルール適用" : "テキスト指示による変換";
            processNode.icon = isBeginnerMode ? PenTool : MessageSquare;
        } else if (newType === NodeType.FUNCTION_CALL) {
            processNode.title = isBeginnerMode ? "自動処理" : "ファンクション";
            processNode.description = isBeginnerMode ? "画像変換・形式変換" : "外部API/スクリプト実行";
            processNode.icon = isBeginnerMode ? FileSearch : Code2;
        }
        setSelectedWorkflow({ ...selectedWorkflow, nodes: updatedNodes });
    };

    // Prepare nodes for display
    const displayNodes = selectedWorkflow.nodes.map(n => ({
        ...n,
        title: isBeginnerMode ? getBeginnerTitle(n.title, n.type) : n.title,
        description: isBeginnerMode ? getBeginnerDesc(n.description, n.type) : n.description,
        icon: isBeginnerMode && n.type === NodeType.GCS_INPUT ? FileInput : 
              isBeginnerMode && n.type === NodeType.OUTPUT ? HardDrive : 
              isBeginnerMode && n.type === NodeType.AI_AGENT ? Wand2 : n.icon
    }));

    return (
        <div className={`flex h-full ${isBeginnerMode ? 'bg-slate-100' : 'bg-slate-50'}`}>
            {/* Sidebar List */}
            <div className="w-72 border-r border-slate-200 bg-white flex flex-col flex-shrink-0">
                <div className="p-5 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-slate-500" />
                        {isBeginnerMode ? 'アプリ一覧' : 'ワークフロー選択'}
                    </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {MOCK_WORKFLOWS.map(wf => (
                        <div 
                            key={wf.id}
                            onClick={() => {
                                setSelectedWorkflow(wf);
                                setSelectedNodeId(wf.nodes[1].id);
                            }}
                            className={`p-3 rounded-lg cursor-pointer transition-all border ${
                                selectedWorkflow.id === wf.id 
                                ? (isBeginnerMode ? 'bg-blue-50 border-blue-300' : 'bg-indigo-50 border-indigo-200 shadow-sm')
                                : 'bg-white hover:bg-slate-50 border-slate-100'
                            }`}
                        >
                            <h4 className={`text-sm font-bold mb-1 ${
                                selectedWorkflow.id === wf.id 
                                ? (isBeginnerMode ? 'text-blue-900' : 'text-indigo-900') 
                                : 'text-slate-800'
                            }`}>
                                {wf.name}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-1">{wf.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                
                {/* TOAST NOTIFICATION */}
                {showToast && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <span className="font-bold text-sm">設定を保存しました</span>
                    </div>
                )}

                {/* Header */}
                <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm z-20">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isBeginnerMode ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    {selectedWorkflow.name}
                                </h2>
                                <p className="text-xs text-slate-500">最終更新: {selectedWorkflow.lastRun}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-6 py-2 text-sm font-bold text-white rounded-md shadow-sm transition-all hover:opacity-90 min-w-[140px] justify-center ${
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
                                    <span>{isBeginnerMode ? 'アプリを保存' : 'ワークフロー保存'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* 3-Step Canvas */}
                <div className="flex-1 p-8 overflow-auto">
                    <div className="max-w-5xl mx-auto h-full flex flex-col">
                        {/* Steps Indicator */}
                        <div className="grid grid-cols-3 gap-8 relative mb-8">
                            {/* Arrows */}
                            <div className="absolute top-1/2 left-[32%] -translate-y-1/2 text-slate-300">
                                <ArrowRight className="w-6 h-6" />
                            </div>
                            <div className="absolute top-1/2 left-[65%] -translate-y-1/2 text-slate-300">
                                <ArrowRight className="w-6 h-6" />
                            </div>

                            <StepCard 
                                node={displayNodes[0]} 
                                stepNumber={1} 
                                label={isBeginnerMode ? "入力" : "Input"}
                                isSelected={selectedNodeId === selectedWorkflow.nodes[0].id}
                                onClick={() => setSelectedNodeId(selectedWorkflow.nodes[0].id)}
                                isBeginnerMode={isBeginnerMode}
                            />
                            <StepCard 
                                node={displayNodes[1]} 
                                stepNumber={2} 
                                label={isBeginnerMode ? "処理" : "Process"}
                                isSelected={selectedNodeId === selectedWorkflow.nodes[1].id}
                                onClick={() => setSelectedNodeId(selectedWorkflow.nodes[1].id)}
                                isBeginnerMode={isBeginnerMode}
                            />
                            <StepCard 
                                node={displayNodes[2]} 
                                stepNumber={3} 
                                label={isBeginnerMode ? "出力" : "Output"}
                                isSelected={selectedNodeId === selectedWorkflow.nodes[2].id}
                                onClick={() => setSelectedNodeId(selectedWorkflow.nodes[2].id)}
                                isBeginnerMode={isBeginnerMode}
                            />
                        </div>

                        {/* Configuration Panel */}
                        <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                                <Settings2 className="w-5 h-5 text-slate-500" />
                                <h3 className="font-bold text-slate-800">
                                    {selectedNodeId === selectedWorkflow.nodes[0].id ? '入力設定' :
                                     selectedNodeId === selectedWorkflow.nodes[1].id ? '処理設定' : '出力設定'}
                                </h3>
                            </div>

                            {/* SIMPLE MODE CONFIGURATION (Business Like) */}
                            {isBeginnerMode && (
                                <div className="max-w-3xl">
                                    {selectedNodeId === selectedWorkflow.nodes[0].id && (
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-900 mb-2">対象フォルダ</label>
                                                <select className="w-full p-2.5 border border-slate-300 rounded-md text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                                                    <option>受信ボックス (Incoming)</option>
                                                    <option>共有ドライブ/DTP素材</option>
                                                    <option>マイフォルダ</option>
                                                </select>
                                                <p className="text-xs text-slate-500 mt-1">※ここにファイルが入ると自動で処理が始まります</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-900 mb-2">ファイルの種類</label>
                                                <div className="flex gap-4">
                                                    <label className="flex items-center gap-2 text-slate-700"><input type="checkbox" defaultChecked className="rounded text-blue-600" /> <span className="text-sm">Word (.docx)</span></label>
                                                    <label className="flex items-center gap-2 text-slate-700"><input type="checkbox" defaultChecked className="rounded text-blue-600" /> <span className="text-sm">PDF (.pdf)</span></label>
                                                    <label className="flex items-center gap-2 text-slate-700"><input type="checkbox" className="rounded text-blue-600" /> <span className="text-sm">画像 (.jpg, .png)</span></label>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedNodeId === selectedWorkflow.nodes[1].id && (
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-900 mb-2">処理内容の選択</label>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <button 
                                                        onClick={() => updateProcessType(NodeType.AI_AGENT)}
                                                        className={`p-3 rounded-md border text-left text-sm font-medium transition-all ${
                                                            selectedNode?.type === NodeType.AI_AGENT ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        AI編集・校正
                                                    </button>
                                                    <button 
                                                        onClick={() => updateProcessType(NodeType.PROMPT)}
                                                        className={`p-3 rounded-md border text-left text-sm font-medium transition-all ${
                                                            selectedNode?.type === NodeType.PROMPT ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        定型テキスト変換
                                                    </button>
                                                    <button 
                                                        onClick={() => updateProcessType(NodeType.FUNCTION_CALL)}
                                                        className={`p-3 rounded-md border text-left text-sm font-medium transition-all ${
                                                            selectedNode?.type === NodeType.FUNCTION_CALL ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        データ自動加工
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="p-4 bg-slate-50 rounded-md border border-slate-200">
                                                <label className="block text-sm font-bold text-slate-900 mb-2">詳細指示</label>
                                                <textarea 
                                                    className="w-full h-32 p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white text-slate-900" 
                                                    placeholder="例：誤字脱字を修正し、敬語を「です・ます」調に統一してください。"
                                                    defaultValue="あなたはプロの編集者です。この文章をDTP用に正しい日本語に直してください。" 
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {selectedNodeId === selectedWorkflow.nodes[2].id && (
                                        <div className="space-y-6">
                                             <div>
                                                <label className="block text-sm font-bold text-slate-900 mb-2">保存先</label>
                                                <select className="w-full p-2.5 border border-slate-300 rounded-md text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                                                    <option>処理済みフォルダ (Processed)</option>
                                                    <option>レビュー待ち (Review)</option>
                                                </select>
                                             </div>
                                             <div>
                                                <label className="block text-sm font-bold text-slate-900 mb-2">完了時の通知</label>
                                                <label className="flex items-center gap-2 mb-2 text-slate-700">
                                                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                                                    <span className="text-sm">メールで通知する</span>
                                                </label>
                                             </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* EXPERT MODE CONFIGURATION */}
                            {!isBeginnerMode && (
                                <>
                                    {selectedNodeId === selectedWorkflow.nodes[0].id && (
                                        <div className="grid grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-900 mb-2">監視対象 GCS バケット</label>
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-slate-100 p-2.5 rounded-l-lg border border-r-0 border-slate-300 text-slate-500 text-sm font-mono">gs://</div>
                                                    <input type="text" className="flex-1 bg-white border border-slate-300 rounded-r-lg p-2.5 text-sm font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" defaultValue="autodtp-assets/incoming/" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {/* Omitted for brevity, assuming similar structure for Expert mode */}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkflowBuilder;