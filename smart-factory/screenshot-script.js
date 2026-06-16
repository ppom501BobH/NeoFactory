import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function takeScreenshots() {
  console.log('🚀 啟動自動截圖程序...');
  
  const browser = await chromium.launch({
    headless: true
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  const baseUrl = 'http://localhost:5174';
  const screenshotsDir = path.join(__dirname, 'screenshots');
  
  const pages = [
    { name: 'dashboard', path: '/', title: '儀表板' },
    { name: 'production', path: '/production', title: '生產管理' },
    { name: 'equipment', path: '/equipment', title: '設備管理' },
    { name: 'quality', path: '/quality', title: '品質管理' },
    { name: 'traceability', path: '/traceability', title: '追溯管理' },
    { name: 'issues', path: '/issues', title: '異常管理' }
  ];
  
  for (const pageInfo of pages) {
    try {
      console.log(`📸 正在截取：${pageInfo.title}...`);
      
      await page.goto(`${baseUrl}${pageInfo.path}`, {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      // 等待頁面完全載入
      await page.waitForTimeout(2000);
      
      // 截圖
      await page.screenshot({
        path: path.join(screenshotsDir, `${pageInfo.name}.png`),
        fullPage: false
      });
      
      console.log(`✅ ${pageInfo.title} 截圖完成`);
    } catch (error) {
      console.error(`❌ ${pageInfo.title} 截圖失敗:`, error.message);
    }
  }
  
  await browser.close();
  console.log('🎉 所有截圖完成！');
}

takeScreenshots().catch(console.error);

// Made with Bob
