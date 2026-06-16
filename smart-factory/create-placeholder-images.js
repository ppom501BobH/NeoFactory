import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 建立 SVG 佔位符圖片
function createPlaceholderSVG(title, width = 1920, height = 1080) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f0f2f5"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" fill="#8c8c8c" text-anchor="middle" dominant-baseline="middle">
    ${title}
  </text>
  <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="24" fill="#bfbfbf" text-anchor="middle" dominant-baseline="middle">
    請執行 node screenshot-script.js 生成實際截圖
  </text>
</svg>`;
}

const screenshotsDir = path.join(__dirname, 'screenshots');

// 確保目錄存在
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const pages = [
  { name: 'dashboard', title: '儀表板截圖' },
  { name: 'production', title: '生產管理截圖' },
  { name: 'equipment', title: '設備管理截圖' },
  { name: 'quality', title: '品質管理截圖' },
  { name: 'traceability', title: '追溯管理截圖' },
  { name: 'issues', title: '異常管理截圖' }
];

console.log('🎨 建立佔位符圖片...');

pages.forEach(page => {
  const svgContent = createPlaceholderSVG(page.title);
  const filePath = path.join(screenshotsDir, `${page.name}.svg`);
  fs.writeFileSync(filePath, svgContent);
  console.log(`✅ 已建立: ${page.name}.svg`);
});

console.log('🎉 所有佔位符圖片建立完成！');
console.log('💡 提示：執行 node screenshot-script.js 可生成實際系統截圖');

// Made with Bob
