# 智慧工廠管理系統 (Smart Factory Management System)

一個基於 React + TypeScript + Vite 開發的現代化智慧工廠管理系統，提供生產監控、設備管理、品質追溯等完整功能。

## 📋 功能特色

### 🎯 儀表板 (Dashboard)
- 即時 KPI 監控（總產量、達成率、運轉產線、待處理告警）
- 產量趨勢分析
- 良率趨勢追蹤
- OEE (設備綜合效率) 趨勢
- 產線即時狀態總覽

### 🏭 生產管理 (Production)
- 工單列表與狀態追蹤
- 生產進度監控
- 產線篩選功能
- 工單優先級管理
- 即時產量統計

### 🔧 設備管理 (Equipment)
- 設備狀態監控
- 設備告警管理
- OEE 分析與視覺化
- 保養計畫管理
- 設備參數即時監控（溫度、振動、轉速、電流）

### ✅ 品質管理 (Quality)
- 良率與不良率統計
- 不良類型 Pareto 分析
- CAPA (矯正與預防措施) 案件管理
- 品質趨勢分析
- 不良類型分布圖

### 🔍 追溯管理 (Traceability)
- 批次履歷查詢
- 生產流程時間軸
- 原料使用記錄
- 品質檢驗記錄
- 完整追溯鏈

### ⚠️ 異常管理 (Issues)
- 異常案件管理
- 異常類型統計
- SLA 監控
- 改善專案追蹤
- PDCA 循環管理

## 🛠️ 技術棧

- **前端框架**: React 19.2.6
- **開發語言**: TypeScript 6.0.2
- **建構工具**: Vite 8.0.12
- **UI 框架**: Ant Design 6.4.4
- **狀態管理**: Zustand 5.0.14
- **路由管理**: React Router DOM 7.17.0
- **圖表庫**: ECharts 6.1.0 + echarts-for-react 3.0.6
- **日期處理**: Day.js 1.11.21
- **樣式方案**: Tailwind CSS 4.3.1

## 📦 安裝步驟

### 1. 環境需求

確保您的系統已安裝：
- Node.js 18.0 或更高版本
- npm 或 yarn 套件管理器

### 2. 安裝依賴

```bash
cd smart-factory
npm install
```

或使用 yarn：

```bash
cd smart-factory
yarn install
```

## 🚀 啟動專案

### 開發模式

```bash
npm run dev
```

或使用 yarn：

```bash
yarn dev
```

啟動後，在瀏覽器中開啟：
```
http://localhost:5173
```

### 建構生產版本

```bash
npm run build
```

建構完成後，產出檔案位於 `dist` 目錄。

### 預覽生產版本

```bash
npm run preview
```

## 📁 專案結構

```
smart-factory/
├── public/                 # 靜態資源
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/            # 圖片資源
│   ├── components/        # 共用組件
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── KPICard.tsx
│   │   └── StatusBadge.tsx
│   ├── data/              # 模擬資料
│   │   └── mockData.ts
│   ├── layouts/           # 版面配置
│   │   └── MainLayout.tsx
│   ├── pages/             # 頁面組件
│   │   ├── Dashboard/     # 儀表板
│   │   ├── Production/    # 生產管理
│   │   ├── Equipment/     # 設備管理
│   │   ├── Quality/       # 品質管理
│   │   ├── Traceability/  # 追溯管理
│   │   └── Issues/        # 異常管理
│   ├── store/             # 狀態管理
│   │   └── useStore.ts
│   ├── types/             # TypeScript 類型定義
│   │   └── index.ts
│   ├── utils/             # 工具函數
│   │   └── helpers.ts
│   ├── App.tsx            # 主應用組件
│   ├── main.tsx           # 應用入口
│   └── index.css          # 全域樣式
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 主要功能說明

### 狀態管理

使用 Zustand 進行全域狀態管理，包括：
- 側邊欄展開/收合狀態
- 工廠與產線選擇
- 日期範圍篩選
- 各模組資料（產線、工單、設備、批次等）

### 模擬資料

系統內建完整的模擬資料生成器，包括：
- 6 條產線的即時狀態
- 20+ 筆工單資料
- 20+ 台設備監控資料
- 設備告警與 OEE 數據
- 批次追溯資料
- CAPA 案件與改善專案

### 響應式設計

- 支援桌面、平板、手機等多種裝置
- 使用 Ant Design 的 Grid 系統
- 表格支援橫向滾動

## 🔧 開發指南

### 新增頁面

1. 在 `src/pages/` 建立新資料夾
2. 建立 `index.tsx` 組件
3. 在 `src/App.tsx` 新增路由
4. 在 `src/components/Sidebar.tsx` 新增選單項目

### 新增資料類型

1. 在 `src/types/index.ts` 定義 TypeScript 介面
2. 在 `src/data/mockData.ts` 建立資料生成函數
3. 在 `src/store/useStore.ts` 加入狀態管理

### 自訂主題

在 `src/App.tsx` 的 ConfigProvider 中修改主題設定：

```typescript
<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#1890ff',  // 主色調
      borderRadius: 6,           // 圓角大小
    },
  }}
>
```

## 📊 資料說明

### 產線狀態
- `running`: 運轉中
- `idle`: 閒置
- `error`: 異常
- `maintenance`: 保養中
- `changeover`: 換線中

### 工單狀態
- `pending`: 待處理
- `in-progress`: 進行中
- `paused`: 暫停
- `completed`: 已完成

### 設備告警嚴重程度
- `high`: 高
- `medium`: 中
- `low`: 低

## 🐛 常見問題

### Q: 啟動時出現 port 被佔用？
A: 修改 `vite.config.ts` 中的 port 設定，或關閉佔用該 port 的程式。

### Q: 圖表無法顯示？
A: 確認 echarts 和 echarts-for-react 已正確安裝。

### Q: TypeScript 編譯錯誤？
A: 執行 `npm install` 確保所有依賴都已安裝，並檢查 TypeScript 版本。

## 📝 授權

本專案僅供學習與展示使用。

## 👨‍💻 開發者

Made with ❤️ by Bob

---

## 🚀 快速開始指令總結

```bash
# 1. 進入專案目錄
cd smart-factory

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器
npm run dev

# 4. 在瀏覽器開啟
# http://localhost:5173
```

系統預設會顯示模擬資料，您可以直接瀏覽各個功能模組。

## 📸 系統截圖

系統提供自動截圖功能，可快速生成各模組的畫面截圖：

```bash
# 確保開發伺服器正在運行
npm run dev

# 在另一個終端執行截圖腳本
node screenshot-script.js
```

截圖將保存在 `screenshots/` 目錄：
- `dashboard.png` - 儀表板
- `production.png` - 生產管理
- `equipment.png` - 設備管理
- `quality.png` - 品質管理
- `traceability.png` - 追溯管理
- `issues.png` - 異常管理

## 📊 專案簡報

專案包含完整的 HTML 簡報檔案：`智慧工廠管理系統簡報.html`

### 開啟簡報

直接在瀏覽器中開啟 `智慧工廠管理系統簡報.html` 即可觀看。

### 簡報操作

- **鍵盤導航**：
  - `→` 或 `空白鍵`：下一頁
  - `←`：上一頁
  - `Home`：第一頁
  - `End`：最後一頁

- **觸控導航**：
  - 左右滑動切換投影片

- **按鈕導航**：
  - 使用畫面下方的控制按鈕

### 簡報內容

簡報共 15 頁，包含：
1. 封面
2. 專案概述
3. 技術架構
4. 六大核心模組
5-10. 各功能模組詳細介紹（含系統截圖）
11. 系統特色
12. 部署與啟動
13. 未來展望
14. 專案成果
15. Q&A

祝您使用愉快！ 🎉
