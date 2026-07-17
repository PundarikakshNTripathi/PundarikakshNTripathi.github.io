import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  await page.goto('http://localhost:5173/admin');
  // Wait for login
  await page.type('input[type="password"]', 'admin123'); // wait, the hash is from env.
  // Actually, too complex to test via puppeteer without env vars.
  await browser.close();
})();
