import dayjs from 'dayjs';
import { randomInt, randomFloat, generateId } from '../utils/helpers';
import type {
  ProductionLine,
  WorkOrder,
  Equipment,
  EquipmentAlert,
  OEEData,
  MaintenancePlan,
  Batch,
  DefectData,
  CAPACase,
  IssueCase,
  ImprovementProject,
  Status,
} from '../types';

// 產品列表
const PRODUCTS = [
  '智慧手機主機板',
  '筆記型電腦外殼',
  '平板電腦螢幕',
  '伺服器機箱',
  '網路交換器',
  '工業控制器',
  '車用電子模組',
  '醫療設備零件',
  '航太零組件',
  '精密機械零件',
  '光學鏡頭組',
  '電源供應器',
];

// 產線名稱
const LINE_NAMES = ['A線', 'B線', 'C線', 'D線', 'E線', 'F線'];

// 班次
const SHIFTS = ['早班', '中班', '夜班'];

// 操作員
const OPERATORS = ['張明華', '李淑芬', '王建國', '陳美玲', '林志偉', '黃雅婷', '吳俊傑', '劉佳慧'];

// 不良類型
const DEFECT_TYPES = [
  '尺寸不符',
  '外觀刮傷',
  '焊接不良',
  '組裝錯誤',
  '功能異常',
  '材料缺陷',
  '標示錯誤',
  '包裝破損',
];

// 異常類型描述
const ISSUE_DESCRIPTIONS: Record<string, string[]> = {
  equipment: ['設備異常停機', '感測器故障', '馬達過熱', '油壓不足', '傳動帶鬆脫'],
  quality: ['批次不良率超標', '尺寸偏移', '外觀瑕疵增加', '功能測試失敗'],
  material: ['原料短缺', '來料品質異常', '供應商延遲交貨', '庫存不足'],
  safety: ['作業區域異常', '防護設備故障', '化學品洩漏風險', '消防設備檢查'],
  other: ['人員調度問題', '系統當機', '環境溫濕度異常', '其他待確認事項'],
};

// 生成狀態（符合製造業實際分布）
const generateStatus = (): Status => {
  const rand = Math.random();
  if (rand < 0.70) return 'running';  // 70% 運轉中
  if (rand < 0.85) return 'idle';     // 15% 閒置
  if (rand < 0.92) return 'changeover'; // 7% 換線中
  if (rand < 0.97) return 'maintenance'; // 5% 保養中
  return 'error';                      // 3% 異常
};

// 生成產線數據
export const generateProductionLines = (): ProductionLine[] => {
  return LINE_NAMES.map((name, index) => {
    const status = generateStatus();
    const targetOutput = randomInt(800, 1200);
    const actualOutput = status === 'running' 
      ? randomInt(Math.floor(targetOutput * 0.85), Math.floor(targetOutput * 1.05))
      : status === 'idle' ? 0
      : randomInt(0, Math.floor(targetOutput * 0.3));
    
    return {
      id: `line-${index + 1}`,
      name,
      status,
      currentProduct: PRODUCTS[randomInt(0, PRODUCTS.length - 1)],
      shift: SHIFTS[randomInt(0, SHIFTS.length - 1)],
      operator: OPERATORS[randomInt(0, OPERATORS.length - 1)],
      actualOutput,
      targetOutput,
      achievementRate: targetOutput > 0 ? (actualOutput / targetOutput) * 100 : 0,
      taktTime: randomFloat(45, 65, 1),
      cycleTime: randomFloat(40, 70, 1),
      stations: [
        { id: `${name}-S1`, name: '上料站', status: status === 'running' ? 'running' : 'idle' },
        { id: `${name}-S2`, name: '加工站', status: status === 'running' ? 'running' : 'idle' },
        { id: `${name}-S3`, name: '組裝站', status: status === 'running' ? 'running' : 'idle' },
        { id: `${name}-S4`, name: '檢測站', status: status === 'running' ? 'running' : 'idle' },
        { id: `${name}-S5`, name: '包裝站', status: status === 'running' ? 'running' : 'idle' },
      ],
    };
  });
};

// 生成工單數據
export const generateWorkOrders = (): WorkOrder[] => {
  const orders: WorkOrder[] = [];
  const statuses: WorkOrder['status'][] = ['pending', 'in-progress', 'paused', 'completed'];
  const priorities: WorkOrder['priority'][] = ['high', 'medium', 'low'];
  
  for (let i = 0; i < 20; i++) {
    const status = statuses[randomInt(0, statuses.length - 1)];
    const plannedQuantity = randomInt(500, 2000);
    const completedQuantity = status === 'completed' 
      ? plannedQuantity
      : status === 'in-progress'
      ? randomInt(Math.floor(plannedQuantity * 0.3), Math.floor(plannedQuantity * 0.8))
      : status === 'paused'
      ? randomInt(0, Math.floor(plannedQuantity * 0.5))
      : 0;
    
    orders.push({
      id: `wo-${i + 1}`,
      orderNumber: `WO${dayjs().format('YYYYMMDD')}-${String(i + 1).padStart(4, '0')}`,
      productName: PRODUCTS[randomInt(0, PRODUCTS.length - 1)],
      plannedQuantity,
      completedQuantity,
      startTime: dayjs().subtract(randomInt(1, 10), 'day').format('YYYY-MM-DD HH:mm'),
      endTime: dayjs().add(randomInt(1, 5), 'day').format('YYYY-MM-DD HH:mm'),
      priority: priorities[randomInt(0, priorities.length - 1)],
      status,
      lineId: `line-${randomInt(1, LINE_NAMES.length)}`,
    });
  }
  
  return orders.sort((a, b) => dayjs(b.startTime).valueOf() - dayjs(a.startTime).valueOf());
};

// 生成設備數據
export const generateEquipment = (): Equipment[] => {
  const equipment: Equipment[] = [];
  
  LINE_NAMES.forEach((lineName, lineIndex) => {
    const lineId = `line-${lineIndex + 1}`;
    const equipmentCount = randomInt(3, 5);
    
    for (let i = 0; i < equipmentCount; i++) {
      const status = generateStatus();
      equipment.push({
        id: `eq-${lineIndex + 1}-${i + 1}`,
        name: `${lineName}-設備${i + 1}`,
        lineId,
        status,
        runningHours: randomInt(1000, 8000),
        temperature: status === 'running' ? randomFloat(45, 75, 1) : randomFloat(20, 30, 1),
        vibration: status === 'running' ? randomFloat(0.5, 2.5, 2) : randomFloat(0, 0.3, 2),
        speed: status === 'running' ? randomInt(1200, 1800) : 0,
        current: status === 'running' ? randomFloat(15, 35, 1) : 0,
      });
    }
  });
  
  return equipment;
};

// 生成設備告警
export const generateEquipmentAlerts = (equipment: Equipment[]): EquipmentAlert[] => {
  const alerts: EquipmentAlert[] = [];
  const alertContents = [
    '溫度超過上限',
    '振動異常',
    '轉速不穩定',
    '電流過載',
    '油壓不足',
    '感測器異常',
  ];
  
  equipment.forEach(eq => {
    if (Math.random() < 0.15) { // 15% 機率產生告警
      alerts.push({
        id: generateId(),
        equipmentId: eq.id,
        equipmentName: eq.name,
        content: alertContents[randomInt(0, alertContents.length - 1)],
        timestamp: dayjs().subtract(randomInt(0, 120), 'minute').format('YYYY-MM-DD HH:mm:ss'),
        status: ['pending', 'acknowledged', 'resolved'][randomInt(0, 2)] as any,
        severity: ['high', 'medium', 'low'][randomInt(0, 2)] as any,
      });
    }
  });
  
  return alerts.sort((a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf());
};

// 生成 OEE 數據
export const generateOEEData = (equipment: Equipment[]): OEEData[] => {
  return equipment.map(eq => {
    const availability = randomFloat(70, 95, 1);
    const performance = randomFloat(75, 98, 1);
    const quality = randomFloat(92, 99.5, 1);
    const oee = (availability * performance * quality) / 10000;
    
    return {
      equipmentId: eq.id,
      equipmentName: eq.name,
      availability,
      performance,
      quality,
      oee: parseFloat(oee.toFixed(1)),
      date: dayjs().format('YYYY-MM-DD'),
    };
  });
};

// 生成保養計畫
export const generateMaintenancePlans = (equipment: Equipment[]): MaintenancePlan[] => {
  return equipment.map(eq => {
    const lastDate = dayjs().subtract(randomInt(5, 25), 'day');
    const cycle = ['每週', '每月', '每季'][randomInt(0, 2)];
    const daysToAdd = cycle === '每週' ? 7 : cycle === '每月' ? 30 : 90;
    const nextDate = lastDate.add(daysToAdd, 'day');
    const isOverdue = nextDate.isBefore(dayjs());
    
    return {
      id: generateId(),
      equipmentId: eq.id,
      equipmentName: eq.name,
      cycle,
      lastDate: lastDate.format('YYYY-MM-DD'),
      nextDate: nextDate.format('YYYY-MM-DD'),
      responsible: OPERATORS[randomInt(0, OPERATORS.length - 1)],
      status: isOverdue ? 'overdue' : ['scheduled', 'in-progress', 'completed'][randomInt(0, 2)] as any,
      checklistItems: [
        '檢查潤滑油位',
        '清潔過濾器',
        '檢查皮帶張力',
        '測試安全裝置',
        '校正感測器',
      ],
    };
  });
};

// 生成批次數據
export const generateBatches = (): Batch[] => {
  const batches: Batch[] = [];
  
  for (let i = 0; i < 30; i++) {
    const date = dayjs().subtract(randomInt(0, 30), 'day');
    batches.push({
      id: `batch-${i + 1}`,
      batchNumber: `B${date.format('YYYYMMDD')}-${String(randomInt(1, 999)).padStart(3, '0')}`,
      productName: PRODUCTS[randomInt(0, PRODUCTS.length - 1)],
      productionDate: date.format('YYYY-MM-DD'),
      lineId: `line-${randomInt(1, LINE_NAMES.length)}`,
      quantity: randomInt(500, 2000),
      status: ['in-progress', 'completed', 'shipped', 'archived'][randomInt(0, 3)] as any,
    });
  }
  
  return batches.sort((a, b) => dayjs(b.productionDate).valueOf() - dayjs(a.productionDate).valueOf());
};

// 生成不良數據
export const generateDefectData = (): DefectData[] => {
  const total = randomInt(80, 150);
  const data = DEFECT_TYPES.map(type => ({
    type,
    count: randomInt(5, 40),
  }));
  
  // 排序並計算百分比
  data.sort((a, b) => b.count - a.count);
  const actualTotal = data.reduce((sum, item) => sum + item.count, 0);
  
  return data.map(item => ({
    ...item,
    percentage: parseFloat(((item.count / actualTotal) * 100).toFixed(1)),
  }));
};

// 生成 CAPA 案件
export const generateCAPACases = (): CAPACase[] => {
  const cases: CAPACase[] = [];
  
  for (let i = 0; i < 15; i++) {
    const status: CAPACase['status'] = ['open', 'investigating', 'reviewing', 'closed'][randomInt(0, 3)] as any;
    cases.push({
      id: `capa-${i + 1}`,
      caseNumber: `CAPA-${dayjs().format('YYYY')}-${String(i + 1).padStart(4, '0')}`,
      source: `不良事件 #${randomInt(1000, 9999)}`,
      severity: ['high', 'medium', 'low'][randomInt(0, 2)] as any,
      responsible: OPERATORS[randomInt(0, OPERATORS.length - 1)],
      status,
      dueDate: dayjs().add(randomInt(7, 30), 'day').format('YYYY-MM-DD'),
      description: `${DEFECT_TYPES[randomInt(0, DEFECT_TYPES.length - 1)]}問題需要進行根因分析與改善`,
      rootCause: status !== 'open' ? '製程參數設定不當' : undefined,
      containment: status !== 'open' ? '加強檢驗頻率，暫時調整參數' : undefined,
      correctiveAction: status === 'reviewing' || status === 'closed' ? '重新校正設備，更新作業標準' : undefined,
      preventiveAction: status === 'closed' ? '建立定期校正機制，加強人員訓練' : undefined,
    });
  }
  
  return cases;
};

// 生成異常案件
export const generateIssueCases = (): IssueCase[] => {
  const cases: IssueCase[] = [];
  const types: IssueCase['type'][] = ['equipment', 'quality', 'material', 'safety', 'other'];
  
  for (let i = 0; i < 25; i++) {
    const type = types[randomInt(0, types.length - 1)];
    const createdAt = dayjs().subtract(randomInt(0, 72), 'hour');
    const slaHours = 24;
    const slaRemaining = slaHours - createdAt.diff(dayjs(), 'hour');
    
    cases.push({
      id: `issue-${i + 1}`,
      caseNumber: `ISS-${dayjs().format('YYYYMMDD')}-${String(i + 1).padStart(4, '0')}`,
      type,
      severity: ['high', 'medium', 'low'][randomInt(0, 2)] as any,
      relatedLine: Math.random() < 0.7 ? `line-${randomInt(1, LINE_NAMES.length)}` : undefined,
      relatedEquipment: Math.random() < 0.5 ? `eq-${randomInt(1, 6)}-${randomInt(1, 5)}` : undefined,
      reporter: OPERATORS[randomInt(0, OPERATORS.length - 1)],
      status: ['new', 'assigned', 'in-progress', 'resolved', 'closed'][randomInt(0, 4)] as any,
      createdAt: createdAt.format('YYYY-MM-DD HH:mm:ss'),
      assignedTo: Math.random() < 0.7 ? OPERATORS[randomInt(0, OPERATORS.length - 1)] : undefined,
      description: ISSUE_DESCRIPTIONS[type][randomInt(0, ISSUE_DESCRIPTIONS[type].length - 1)],
      slaRemaining: slaRemaining > 0 ? slaRemaining : 0,
    });
  }
  
  return cases.sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf());
};

// 生成改善專案
export const generateImprovementProjects = (): ImprovementProject[] => {
  const projects: ImprovementProject[] = [];
  const phases: ImprovementProject['phase'][] = ['plan', 'do', 'check', 'act'];
  
  for (let i = 0; i < 8; i++) {
    const phase = phases[randomInt(0, phases.length - 1)];
    const progress = phase === 'plan' ? randomInt(0, 30)
      : phase === 'do' ? randomInt(30, 60)
      : phase === 'check' ? randomInt(60, 85)
      : randomInt(85, 100);
    
    projects.push({
      id: `proj-${i + 1}`,
      name: `${['降低不良率', '提升OEE', '縮短換線時間', '減少停機時間'][randomInt(0, 3)]}專案`,
      phase,
      progress,
      responsible: OPERATORS[randomInt(0, OPERATORS.length - 1)],
      startDate: dayjs().subtract(randomInt(30, 90), 'day').format('YYYY-MM-DD'),
      targetDate: dayjs().add(randomInt(30, 60), 'day').format('YYYY-MM-DD'),
      beforeMetrics: {
        defectRate: randomFloat(3, 8, 2),
        oee: randomFloat(65, 75, 1),
      },
      afterMetrics: phase === 'act' ? {
        defectRate: randomFloat(1, 3, 2),
        oee: randomFloat(78, 88, 1),
      } : undefined,
    });
  }
  
  return projects;
};

// 生成產量趨勢數據（近30天）
export const generateProductionTrend = () => {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day');
    const target = randomInt(4500, 5500);
    const actual = randomInt(Math.floor(target * 0.85), Math.floor(target * 1.05));
    data.push({
      date: date.format('MM/DD'),
      actual,
      target,
      achievementRate: parseFloat(((actual / target) * 100).toFixed(1)),
    });
  }
  return data;
};

// 生成良率趨勢數據
export const generateYieldTrend = () => {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day');
    data.push({
      date: date.format('MM/DD'),
      yield: randomFloat(94, 99, 1),
      target: 97,
    });
  }
  return data;
};

// 生成 OEE 趨勢數據
export const generateOEETrend = () => {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day');
    data.push({
      date: date.format('MM/DD'),
      oee: randomFloat(68, 85, 1),
      target: 80,
    });
  }
  return data;
};

// Made with Bob
