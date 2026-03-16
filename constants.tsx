import { 
  FileText, 
  Wand2, 
  Mail, 
  HardDrive, 
  Printer, 
  CheckCircle2, 
  AlertCircle,
  LayoutTemplate,
  Type,
  Image as ImageIcon,
  Bot,
  Code2,
  MessageSquare,
  Cloud,
  PlayCircle,
  ArrowRight
} from 'lucide-react';
import { Job, JobStatus, Workflow, WorkflowStatus, NodeType, Asset } from './types';

export const MOCK_ASSETS: Asset[] = [
  {
    id: 'ast-001',
    name: '2024年10月号_特集記事_原稿.docx',
    type: 'DOCX',
    size: '2.4 MB',
    uploadedAt: '2024-10-01 10:23',
    gcsPath: 'gs://autodtp-assets/raw/2024/10/feature_main.docx',
    status: 'synced'
  },
  {
    id: 'ast-002',
    name: '製品カタログ_Q4_画像セット.zip',
    type: 'ZIP',
    size: '156 MB',
    uploadedAt: '2024-10-02 09:15',
    gcsPath: 'gs://autodtp-assets/raw/2024/Q4/images.zip',
    status: 'synced'
  },
  {
    id: 'ast-003',
    name: '利用規約_改訂版_v3.pdf',
    type: 'PDF',
    size: '450 KB',
    uploadedAt: '2024-10-03 14:00',
    gcsPath: 'gs://autodtp-assets/legal/terms_v3.pdf',
    status: 'synced'
  },
  {
    id: 'ast-004',
    name: 'キャンペーン_バナー案.psd',
    type: 'PSD',
    size: '45 MB',
    uploadedAt: '2024-10-03 15:30',
    gcsPath: 'gs://autodtp-assets/design/banner_draft.psd',
    status: 'uploading'
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1023',
    workflowName: '雑誌レイアウト自動化',
    fileName: '10月号_特集記事_Main.docx',
    status: JobStatus.PROCESSING,
    progress: 45,
    timestamp: '2分前',
    thumbnailUrl: 'https://picsum.photos/200/300?random=1'
  },
  {
    id: 'job-1022',
    workflowName: '単発: 画像リサイズ',
    fileName: '新商品写真.jpg',
    status: JobStatus.COMPLETED,
    progress: 100,
    timestamp: '1時間前',
    thumbnailUrl: 'https://picsum.photos/200/300?random=2',
    isAdHoc: true
  },
  {
    id: 'job-1021',
    workflowName: 'チラシ校正AI',
    fileName: '販促チラシ_初校_v2.pdf',
    status: JobStatus.NEEDS_REVIEW,
    progress: 100,
    timestamp: '3時間前',
    thumbnailUrl: 'https://picsum.photos/200/300?random=3'
  },
  {
    id: 'job-1020',
    workflowName: '契約書フォーマット',
    fileName: '業務委託契約書_2024.docx',
    status: JobStatus.FAILED,
    progress: 12,
    timestamp: '5時間前',
    thumbnailUrl: 'https://picsum.photos/200/300?random=4'
  }
];

// 3ステップ構成（Input -> Process -> Output）
export const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-001',
    name: '雑誌記事 自動レイアウト',
    description: 'Word原稿をGCSから取得し、AIエージェントが構造化タグを付与してInDesignへ渡します。',
    status: WorkflowStatus.ACTIVE,
    lastRun: '2分前',
    nodes: [
      { 
        id: '1', 
        type: NodeType.GCS_INPUT, 
        title: 'STEP 1: 素材収集', 
        description: 'gs://staging/incoming/*.docx', 
        icon: Cloud,
        config: { path: 'gs://staging/incoming/' }
      },
      { 
        id: '2', 
        type: NodeType.AI_AGENT, 
        title: 'STEP 2: 加工 (AI Agent)', 
        description: '校正・構造化タグ付与', 
        icon: Bot,
        config: { role: 'Editor', model: 'gemini-1.5-pro' }
      },
      { 
        id: '3', 
        type: NodeType.OUTPUT, 
        title: 'STEP 3: 納品', 
        description: 'InDesign Server Hot Folder', 
        icon: HardDrive,
        config: { destination: '/mnt/indesign/watch' }
      }
    ]
  },
  {
    id: 'wf-002',
    name: '画像アセット一括変換',
    description: 'GCS上の画像をFunction Callでリサイズ・CMYK変換し、本番バケットへ格納します。',
    status: WorkflowStatus.PAUSED,
    lastRun: '2日前',
    nodes: [
      { 
        id: '1', 
        type: NodeType.GCS_INPUT, 
        title: 'STEP 1: 素材収集', 
        description: 'gs://assets/raw/*.jpg', 
        icon: Cloud,
        config: { path: 'gs://assets/raw/' }
      },
      { 
        id: '2', 
        type: NodeType.FUNCTION_CALL, 
        title: 'STEP 2: 加工 (Function)', 
        description: 'Resize & CMYK Convert', 
        icon: Code2,
        config: { functionUrl: 'https://api.dtp/convert' }
      },
      { 
        id: '3', 
        type: NodeType.OUTPUT, 
        title: 'STEP 3: 納品', 
        description: 'gs://assets/production/', 
        icon: Cloud,
        config: { destination: 'gs://assets/production/' }
      }
    ]
  },
  {
    id: 'wf-003',
    name: '単純テキスト校正',
    description: 'テキストファイルをプロンプトベースで校正し、Slackへ通知します。',
    status: WorkflowStatus.DRAFT,
    lastRun: '-',
    nodes: [
      { 
        id: '1', 
        type: NodeType.GCS_INPUT, 
        title: 'STEP 1: 素材収集', 
        description: 'gs://drafts/*.txt', 
        icon: FileText,
        config: { path: 'gs://drafts/' }
      },
      { 
        id: '2', 
        type: NodeType.PROMPT, 
        title: 'STEP 2: 加工 (Prompt)', 
        description: '誤字脱字チェック', 
        icon: MessageSquare,
        config: { prompt: 'Fix typos' }
      },
      { 
        id: '3', 
        type: NodeType.OUTPUT, 
        title: 'STEP 3: 納品', 
        description: 'Slack Notification', 
        icon: Mail,
        config: { channel: '#proofreading' }
      }
    ]
  }
];