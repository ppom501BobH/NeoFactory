import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';

dayjs.locale('zh-tw');

// 格式化日期時間
export const formatDateTime = (date: string | Date, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  return dayjs(date).format(format);
};

export const formatDate = (date: string | Date): string => {
  return dayjs(date).format('YYYY-MM-DD');
};

export const formatTime = (date: string | Date): string => {
  return dayjs(date).format('HH:mm:ss');
};

// 計算時間差
export const getTimeDiff = (start: string | Date, end: string | Date, unit: 'hour' | 'minute' | 'second' = 'hour'): number => {
  return dayjs(end).diff(dayjs(start), unit);
};

// 格式化數字
export const formatNumber = (num: number, decimals = 0): string => {
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 格式化百分比
export const formatPercent = (num: number, decimals = 1): string => {
  return `${num.toFixed(decimals)}%`;
};

// 生成隨機數
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomFloat = (min: number, max: number, decimals = 2): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
};

// 生成隨機波動數值（用於模擬即時數據）
export const fluctuate = (baseValue: number, range = 0.05): number => {
  const variation = baseValue * range;
  return baseValue + (Math.random() - 0.5) * 2 * variation;
};

// 狀態顏色映射
export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    running: '#52c41a',
    normal: '#52c41a',
    good: '#52c41a',
    pass: '#52c41a',
    completed: '#52c41a',
    
    idle: '#8c8c8c',
    pending: '#8c8c8c',
    
    warning: '#faad14',
    medium: '#faad14',
    
    error: '#ff4d4f',
    high: '#ff4d4f',
    fail: '#ff4d4f',
    overdue: '#ff4d4f',
    
    maintenance: '#1890ff',
    changeover: '#722ed1',
  };
  
  return colorMap[status.toLowerCase()] || '#8c8c8c';
};

// 狀態文字映射
export const getStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    running: '運轉中',
    idle: '閒置',
    error: '異常',
    maintenance: '保養中',
    changeover: '換線中',
    
    pending: '待處理',
    'in-progress': '進行中',
    paused: '暫停',
    completed: '已完成',
    
    new: '新建',
    assigned: '已指派',
    resolved: '已解決',
    closed: '已關閉',
    
    high: '高',
    medium: '中',
    low: '低',
    
    pass: '合格',
    fail: '不合格',
    
    scheduled: '已排程',
    overdue: '逾期',
  };
  
  return textMap[status.toLowerCase()] || status;
};

// 計算達成率狀態
export const getAchievementStatus = (rate: number): 'good' | 'warning' | 'bad' => {
  if (rate >= 95) return 'good';
  if (rate >= 85) return 'warning';
  return 'bad';
};

// 生成唯一 ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// 延遲函數（用於模擬異步操作）
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// 計算陣列總和
export const sum = (arr: number[]): number => {
  return arr.reduce((acc, val) => acc + val, 0);
};

// 計算陣列平均值
export const average = (arr: number[]): number => {
  return arr.length > 0 ? sum(arr) / arr.length : 0;
};

// 排序（Pareto 分析用）
export const sortByValue = <T extends { value: number }>(arr: T[], desc = true): T[] => {
  return [...arr].sort((a, b) => desc ? b.value - a.value : a.value - b.value);
};

// 計算累積百分比（Pareto 分析用）
export const calculateCumulativePercentage = (arr: number[]): number[] => {
  const total = sum(arr);
  let cumulative = 0;
  return arr.map(val => {
    cumulative += val;
    return (cumulative / total) * 100;
  });
};

// Made with Bob
