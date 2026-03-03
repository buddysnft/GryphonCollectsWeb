const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const baseUrl = 'https://gryphon-collects-web-jswr.vercel.app';
const outputDir = path.join(process.env.HOME, 'Desktop', 'Gryphon-Demo-Screenshots');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const screenshots = [
  { name: '01-homepage', url: '/', wait: 2000 },
  { name: '02-shop', url: '/shop', wait: 2000 },
  { name: '03-breaks', url: '/breaks', wait: 2000 },
];

(async () => {
  console.log('🚀 Starting screenshot capture...');
  
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 1440,
      height: 900,
    },
  });

  const page = await browser.newPage();

  for (const screenshot of screenshots) {
    console.log(`📸 Capturing: ${screenshot.name}`);
    
    await page.goto(`${baseUrl}${screenshot.url}`, {
      waitUntil: 'networkidle2',
    });
    
    // Wait for content to load
    await page.waitForTimeout(screenshot.wait);
    
    // Take full page screenshot
    await page.screenshot({
      path: path.join(outputDir, `${screenshot.name}.png`),
      fullPage: true,
    });
    
    console.log(`✅ Saved: ${screenshot.name}.png`);
  }

  // Now capture admin screens
  console.log('\n🔐 Opening admin panel...');
  
  // Note: This will fail without login - JA needs to capture admin screenshots manually
  console.log('⚠️  Admin screenshots require manual login');
  console.log('   Please visit:');
  console.log('   - https://gryphon-collects-web-jswr.vercel.app/admin');
  console.log('   - https://gryphon-collects-web-jswr.vercel.app/admin/breaks');
  console.log('   - https://gryphon-collects-web-jswr.vercel.app/admin/analytics');
  console.log('   And take screenshots manually');

  await browser.close();
  
  console.log(`\n✅ Screenshots saved to: ${outputDir}`);
  console.log('📱 For mobile screenshots, resize browser window to 375x812 and repeat');
})();
