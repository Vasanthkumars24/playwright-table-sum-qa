const { chromium } = require('playwright');

const seeds = [20,21,22,23,24,25,26,27,28,29];

function extractNumbersFromText(text) {
  const re = /-?\d+(?:\.\d+)?/g;
  const matches = text.match(re);
  return matches ? matches.map(Number) : [];
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let grandTotal = 0;

  for (const seed of seeds) {
    const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;
    console.log(`Visiting ${url}`);
    await page.goto(url, { waitUntil: 'networkidle' });

    const pageText = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('table'))
                  .map(t => t.innerText)
                  .join(' ');
    });

    const nums = extractNumbersFromText(pageText);
    const pageSum = nums.reduce((a, b) => a + b, 0);
    console.log(`  Seed ${seed} sum: ${pageSum}`);
    grandTotal += pageSum;
  }

  console.log('-----------------------------------');
  console.log(`GRAND TOTAL (all seeds): ${grandTotal}`);
  console.log('-----------------------------------');
  await browser.close();
})();
