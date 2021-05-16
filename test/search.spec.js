const { firefox } = require('playwright');
const expect = require('chai').expect;

let browser;
let page;

before(async () => {
  browser = await firefox.launch({ headless : false});
});

after(async () => {
  await browser.close();
});

beforeEach(async () => {
  page = await browser.newPage();
});

afterEach(async () => {
  await page.screenshot({ path: `screenshots/search.png` });
  await page.close();
});

describe('test search Udemy', function () {
  it('search - check the search result', async () => {
    try {
      await page.goto('https://www.udemy.com/?locale=pt_BR');

      await page.waitForTimeout(2000);

      await page.click('[placeholder="Pesquisar por qualquer coisa"]');

      await page.fill('[placeholder="Pesquisar por qualquer coisa"]', 'react native');

      await page.press('[placeholder="Pesquisar por qualquer coisa"]', 'Enter');

      await page.waitForTimeout(2000);

      const result = await page.$eval('#br > div.main-content-wrapper > div.main-content > div > div > header > h1', e => e.textContent);

      await page.waitForTimeout(2000);

      expect(result).to.have.string('react native');
    } catch (error) {
      console.log(error.message);

      expect(false).to.be.true;
    }
  });
});
