// 狀態類型
export type Status = 'running' | 'idle' | 'error' | 'maintenance' | 'changeover';

// 產線狀態
export interface ProductionLine {
  id: string;
  name: string;
  status: Status;
  currentProduct: string;
  shift: string;
  operator: string;
  actualOutput: number;
  targetOutput: number;
  achievementRate: number;
  taktTime: number;
  cycleTime: number;
  stations?: Station[];
}

// 站點
export interface Station {
  id: string;
  name: string;
  status: Status;
}

// 工單
export interface WorkOrder {
  id: string;
  orderNumber: string;
  productName: string;
  plannedQuantity: number;
  completedQuantity: number;
  startTime: string;
  endTime: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'paused' | 'completed';
  lineId: string;
}

// 設備
export interface Equipment {
  id: string;
  name: string;
  lineId: string;
  status: Status;
  runningHours: number;
  temperature?: number;
  vibration?: number;
  speed?: number;
  current?: number;
}

// 設備告警
export interface EquipmentAlert {
  id: string;
  equipmentId: string;
  equipmentName: string;
  content: string;
  timestamp: string;
  status: 'pending' | 'acknowledged' | 'resolved';
  severity: 'high' | 'medium' | 'low';
}

// OEE 數據
export interface OEEData {
  equipmentId: string;
  equipmentName: string;
  availability: number;
  performance: number;
  quality: number;
  oee: number;
  date: string;
}

// 保養計畫
export interface MaintenancePlan {
  id: string;
  equipmentId: string;
  equipmentName: string;
  cycle: string;
  lastDate: string;
  nextDate: string;
  responsible: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  checklistItems?: string[];
}

// 批次
export interface Batch {
  id: string;
  batchNumber: string;
  productName: string;
  productionDate: string;
  lineId: string;
  quantity: number;
  status: 'in-progress' | 'completed' | 'shipped' | 'archived';
}

// 生產履歷
export interface ProductionHistory {
  batchId: string;
  batchNumber: string;
  productName: string;
  timeline: HistoryEvent[];
  materials: MaterialUsage[];
  qualityRecords: QualityRecord[];
}

export interface HistoryEvent {
  timestamp: string;
  station: string;
  operator: string;
  action: string;
  duration?: number;
}

export interface MaterialUsage {
  materialName: string;
  batchNumber: string;
  quantity: number;
  unit: string;
}

export interface QualityRecord {
  timestamp: string;
  inspector: string;
  result: 'pass' | 'fail';
  defectType?: string;
  quantity: number;
}

// 不良分析
export interface DefectData {
  type: string;
  count: number;
  percentage: number;
}

// CAPA 案件
export interface CAPACase {
  id: string;
  caseNumber: string;
  source: string;
  severity: 'high' | 'medium' | 'low';
  responsible: string;
  status: 'open' | 'investigating' | 'reviewing' | 'closed';
  dueDate: string;
  description: string;
  rootCause?: string;
  containment?: string;
  correctiveAction?: string;
  preventiveAction?: string;
}

// 異常案件
export interface IssueCase {
  id: string;
  caseNumber: string;
  type: 'equipment' | 'quality' | 'material' | 'safety' | 'other';
  severity: 'high' | 'medium' | 'low';
  relatedLine?: string;
  relatedEquipment?: string;
  reporter: string;
  status: 'new' | 'assigned' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  assignedTo?: string;
  description: string;
  slaRemaining?: number;
}

// 改善專案
export interface ImprovementProject {
  id: string;
  name: string;
  phase: 'plan' | 'do' | 'check' | 'act';
  progress: number;
  responsible: string;
  startDate: string;
  targetDate: string;
  beforeMetrics?: Metrics;
  afterMetrics?: Metrics;
}

export interface Metrics {
  defectRate?: number;
  downtime?: number;
  oee?: number;
  [key: string]: number | undefined;
}

// KPI 卡片數據
export interface KPICard {
  title: string;
  value: number | string;
  unit?: string;
  trend?: number;
  status?: 'good' | 'warning' | 'bad';
  target?: number;
}

// 圖表數據點
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

// Made with Bob
