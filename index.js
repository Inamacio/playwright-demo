require('dotenv').config()

const { firefox } = require('playwright');

const email = process.env.EMAIL_GOOGLE;
const password = process.env.PASSWORD_GOOGLE;

/**
 * Open Browser
 * @returns
 */
async function openBrowser() {
  console.info('Executando a abertura do browser');

  const browser = await firefox.launch({ headless : false});

  const page = await browser.newPage();

  return { page, browser };
}

/**
 * Navigate to page login
 * @param {*} page
 */
async function navigate(page) {
  console.info('Navegando para página de login');

  await page.goto('https://www.udemy.com/?locale=pt_BR');

  console.info('Clicando em Login');

  await page.click('text=Fazer login');
}

/**
 * Login in google
 * @param {*} page
 */
async function login(page) {
  await page.waitForTimeout(5000);

  console.info('Realizando login com conta google');

  const [ frameGoogle ] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('text=Continuar com o Google')
  ]);

  await frameGoogle.waitForSelector('[aria-label="E-mail ou telefone"]');

  await frameGoogle.fill('[aria-label="E-mail ou telefone"]', email);

  await Promise.all([
    frameGoogle.waitForNavigation(),
    frameGoogle.click('button:has-text("Próxima")')
  ]);

  await frameGoogle.fill('#password input', password);

  await frameGoogle.click('button:has-text("Próxima")')

  console.info('Login realizado com sucesso');
}

/**
 * Search in Udemy
 * @param {*} page
 */
async function search(page) {
  console.info('[] Excutado busca por um curso');

  await page.click('[placeholder="Pesquisar por qualquer coisa"]');

  await page.fill('[placeholder="Pesquisar por qualquer coisa"]', 'react native');

  await page.press('[placeholder="Pesquisar por qualquer coisa"]', 'Enter');

  await page.waitForTimeout(5000);

  console.info('Finalizado busca');
}

/**
 * Execute program
 */
async function start() {
  const { page, browser } = await openBrowser();

  await navigate(page)

  await login(page);

  await search(page);

  await page.screenshot({ path: `screenshots/example.png` });

  await browser.close();
}

start();
