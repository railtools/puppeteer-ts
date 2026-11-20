import http from 'node:http';
import puppeteer from 'puppeteer';
import type { Browser } from 'puppeteer';

async function scrapeWebsite(): Promise<void> {
   let browser: Browser | undefined;

   try {
      console.log('Starting browser...');

      // Launch browser
      browser = await puppeteer.launch({
         headless: true,
         args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
         ]
      });

      // Create new page
      const page = await browser.newPage();

      // Set viewport size
      await page.setViewport({ width: 1280, height: 720 });

      // Navigate to website
      console.log('Navigating to website...');
      await page.goto('https://railway.com', {
         waitUntil: 'networkidle2'
      });

      // Get page title
      const title = await page.title();
      console.log('Page title:', title);

      // Try to get text content from h1 if exists
      try {
         const heading = await page.$eval('h1', el => (el as HTMLElement).textContent);
         console.log('Main heading:', heading);
      } catch (headingError) {
         console.log('Could not find h1 element');
      }

      // TODO: Add your scraping logic here

      console.log('Scraping completed successfully!');

   } catch (error) {
      console.error('Error occurred:', error);
   } finally {
      // Always close the browser
      if (browser) {
         await browser.close();
         console.log('Browser closed');
      }
   }
}

// Keep the service running with a small health endpoint, so Railway sees a
// healthy deployment instead of a process that exited.
const PORT = Number(process.env.PORT) || 3000;
const server = http.createServer((req, res) => {
   res.writeHead(200, { 'Content-Type': 'text/plain' });
   res.end('OK');
});
server.listen(PORT, () => console.log(`Health endpoint listening on port ${PORT}`));

process.on('SIGTERM', () => {
   console.log('Shutting down');
   server.close();
   process.exit(0);
});

// Run the scraping function once, and again every SCRAPE_INTERVAL_MINUTES if set.
const intervalMinutes = Number(process.env.SCRAPE_INTERVAL_MINUTES);
await scrapeWebsite();
if (intervalMinutes > 0) {
   console.log(`Scraping again every ${intervalMinutes} minute(s)`);
   setInterval(scrapeWebsite, intervalMinutes * 60 * 1000);
}
