# AGENTS.md

本文件為 AI 助理在此專案中工作時提供指引。

## 關鍵非顯而易見資訊

### Tailwind CSS 4.x 配置
- **必須使用 `@tailwindcss/postcss`** 而非 `tailwindcss` 在 postcss.config.js 中
- 標準的 `tailwindcss` 插件會失敗並顯示關於 PostCSS 插件的隱晦錯誤
- postcss.config.js 必須使用：`'@tailwindcss/postcss': {}`

### CSS 限制
- **不支援 CSS 嵌套語法** - Tailwind 4.x 不支援 `&` 選擇器或嵌套規則
- 只能使用扁平的 CSS 與標準選擇器
- 範例：使用 `.counter:hover` 而非 `.counter { &:hover }`

### 狀態管理模式
- Zustand store 在 `src/store/useStore.ts` 使用**基於函數的初始化**
- 設備資料必須先生成，然後傳遞給相依的生成器
- 順序很重要：`generateEquipment()` → `generateEquipmentAlerts(equipment)`

### 模擬資料相依性
- `src/data/mockData.ts` 中的所有模擬資料生成器都有**隱藏的相依性**
- `generateEquipmentAlerts()`、`generateOEEData()`、`generateMaintenancePlans()` 需要設備陣列
- 必須傳遞設備實例，不要在函數內部重新生成

### 組件匯入模式
- StatusBadge 使用 `src/utils/helpers.ts` 的 `getStatusColor()` 和 `getStatusText()`
- 這些函數有**硬編碼的映射** - 不要在未更新 helpers 的情況下建立新的狀態值
- 狀態顏色不是從 Ant Design 主題衍生的

### Ant Design 整合
- tailwind.config.js 中的 `corePlugins: { preflight: false }` 是**必須的**
- 防止 Tailwind 和 Ant Design 之間的樣式衝突
- 移除此設定會破壞 Ant Design 組件樣式

### 開發伺服器
- 如果 5173 埠被佔用，可能會在 5174 埠啟動
- **修改 postcss.config.js 或 tailwind.config.js 後必須重啟伺服器**
- 熱重載不會偵測 PostCSS 插件的變更