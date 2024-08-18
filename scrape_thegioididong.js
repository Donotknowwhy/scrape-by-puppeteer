import puppeteer from 'puppeteer';
import fs from 'fs-extra';

(async () => {
  // Launch the browser in headless mode and open a new blank page
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Function to extract data from the current page
  const extractProducts = async () => {
    // Wait for the products to load
    await page.waitForSelector('ul.listproduct');

    // Extract data from the products
    return await page.evaluate(() => {
      const products = Array.from(document.querySelectorAll('ul.listproduct > li'));

      return products.map(product => {
        const name = product.querySelector('h3')?.textContent?.trim() || '';
        const originalPrice = product.querySelector('p.price-old.black')?.textContent?.trim() || '';
        const salePrice = product.querySelector('strong.price')?.textContent?.trim() || '';
        const discountRate = product.querySelector('span.percent')?.textContent?.trim() || '';

        return { name, originalPrice, salePrice, discountRate };
      });
    });
  };

  // Navigate to the product list page
  await page.goto('https://www.thegioididong.com/dtdd');

  let allProducts = [];
  let hasMoreProducts = true;

  while (hasMoreProducts) {
    // Extract products from the current page
    const products = await extractProducts();
    allProducts = allProducts.concat(products);

    // Check if there is a "Xem thêm" button and it is visible
    const isViewMoreVisible = await page.evaluate(() => {
      const viewMoreDiv = document.querySelector('div.view-more');
      return window.getComputedStyle(viewMoreDiv).display !== 'none';
    });

    console.log('View more button visible:', isViewMoreVisible);

    if (isViewMoreVisible) {
      const loadMoreButton = await page.$('div.view-more a');
      if (loadMoreButton) {
        await loadMoreButton.click();
        // Wait for a few seconds to allow the page to load more products
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        hasMoreProducts = false;
      }
    } else {
      hasMoreProducts = false;
    }
  }

  // Print the JSON data
  console.log(JSON.stringify(allProducts, null, 2));

  // Save the data to thegioididong.json
  await fs.writeJson('thegioididong.json', allProducts, { spaces: 2 })
    .then(() => console.log('Successfully wrote to thegioididong.json'))
    .catch(err => console.error('Error writing file', err));

  await browser.close();
})();