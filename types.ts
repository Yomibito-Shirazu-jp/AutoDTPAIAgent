import { LucideIcon } from 'lucide-react';

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  WORKFLOW_BUILDER = 'WORKFLOW_BUILDER',
  JOBS = 'JOBS',
  ASSETS = 'ASSETS',
  SETTINGS = 'SETTINGS'
}

export enum WorkflowStatus {
  ACTIVE = '稼働中',
  PAUSED = '一時停止',
  DRAFT = '下書き'
}

export enum JobStatus {
  PENDING = '待機中',
  PROCESSING = '処理中',
  COMPLETED = '完了',
  FAILED = '失敗',
  NEEDS_REVIEW = '確認待ち'
}

export enum NodeType {
  TRIGGER = 'トリガー',
  GCS_INPUT = 'GCS入出力',
  AI_AGENT = 'AIエージェント',
  PROMPT = 'プロンプト',
  FUNCTION_CALL = 'ファンクション',
  OUTPUT = '出力'
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  title: string;
  description: string;
  icon?: LucideIcon;
  config?: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  nodes: WorkflowNode[];
  lastRun: string;
}

export interface Job {
  id: string;
  workflowName: string;
  fileName: string;
  status: JobStatus;
  progress: number;
  timestamp: string;
  thumbnailUrl: string;
  isAdHoc?: boolean; // 単発ジョブフラグ
  resultText?: string; // AIによる生成結果
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  gcsPath: string;
  status: 'synced' | 'uploading' | 'error';
}

export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
}