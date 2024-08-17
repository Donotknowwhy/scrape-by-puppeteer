import puppeteer from 'puppeteer';

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to the product list page
  await page.goto('https://www.thegioididong.com/dtdd');

  // Wait for the products to load
  await page.waitForSelector('ul.listproduct');

  // Extract data from the products
  const productsData = await page.evaluate(() => {
    const products = Array.from(document.querySelectorAll('ul.listproduct > li'));

    const data = products.map(product => {
      const name = product.querySelector('h3')?.textContent?.trim() || '';
      const originalPrice = product.querySelector('p.price-old.black')?.textContent?.trim() || '';
      const salePrice = product.querySelector('strong.price')?.textContent?.trim() || '';
      const discountRate = product.querySelector('span.percent')?.textContent?.trim() || '';

      return { name, originalPrice, salePrice, discountRate };
    });

    return data;
  });

  // Print the JSON data
  console.log(JSON.stringify(productsData, null, 2));

  await browser.close();
})();