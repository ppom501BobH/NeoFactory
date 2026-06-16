import { create } from 'zustand';
import {
  generateProductionLines,
  generateWorkOrders,
  generateEquipment,
  generateEquipmentAlerts,
  generateOEEData,
  generateMaintenancePlans,
  generateBatches,
  generateDefectData,
  generateCAPACases,
  generateIssueCases,
  generateImprovementProjects,
} from '../data/mockData';
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
} from '../types';

interface StoreState {
  // 全域設定
  sidebarCollapsed: boolean;
  selectedFactory: string;
  selectedLine: string;
  dateRange: [string, string];
  
  // 資料
  productionLines: ProductionLine[];
  workOrders: WorkOrder[];
  equipment: Equipment[];
  equipmentAlerts: EquipmentAlert[];
  oeeData: OEEData[];
  maintenancePlans: MaintenancePlan[];
  batches: Batch[];
  defectData: DefectData[];
  capaCases: CAPACase[];
  issueCases: IssueCase[];
  improvementProjects: ImprovementProject[];
  
  // Actions
  toggleSidebar: () => void;
  setSelectedFactory: (factory: string) => void;
  setSelectedLine: (line: string) => void;
  setDateRange: (range: [string, string]) => void;
  refreshProductionLines: () => void;
  refreshEquipment: () => void;
  refreshAll: () => void;
}

export const useStore = create<StoreState>((set, get) => {
  // 初始化資料
  const equipment = generateEquipment();
  
  return {
    // 初始狀態
    sidebarCollapsed: false,
    selectedFactory: '台北廠',
    selectedLine: 'all',
    dateRange: ['', ''],
    
    // 初始資料
    productionLines: generateProductionLines(),
    workOrders: generateWorkOrders(),
    equipment,
    equipmentAlerts: generateEquipmentAlerts(equipment),
    oeeData: generateOEEData(equipment),
    maintenancePlans: generateMaintenancePlans(equipment),
    batches: generateBatches(),
    defectData: generateDefectData(),
    capaCases: generateCAPACases(),
    issueCases: generateIssueCases(),
    improvementProjects: generateImprovementProjects(),
    
    // Actions
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    
    setSelectedFactory: (factory) => set({ selectedFactory: factory }),
    
    setSelectedLine: (line) => set({ selectedLine: line }),
    
    setDateRange: (range) => set({ dateRange: range }),
    
    refreshProductionLines: () => set({ productionLines: generateProductionLines() }),
    
    refreshEquipment: () => {
      const newEquipment = generateEquipment();
      set({
        equipment: newEquipment,
        equipmentAlerts: generateEquipmentAlerts(newEquipment),
        oeeData: generateOEEData(newEquipment),
      });
    },
    
    refreshAll: () => {
      const newEquipment = generateEquipment();
      set({
        productionLines: generateProductionLines(),
        workOrders: generateWorkOrders(),
        equipment: newEquipment,
        equipmentAlerts: generateEquipmentAlerts(newEquipment),
        oeeData: generateOEEData(newEquipment),
        maintenancePlans: generateMaintenancePlans(newEquipment),
        batches: generateBatches(),
        defectData: generateDefectData(),
        capaCases: generateCAPACases(),
        issueCases: generateIssueCases(),
        improvementProjects: generateImprovementProjects(),
      });
    },
  };
});

// Made with Bob
