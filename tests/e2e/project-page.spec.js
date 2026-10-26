import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

let server;
let pageUrl;
const files = new Map([
  ['/retirator/', ['index.html', 'text/html; charset=utf-8']],
  ['/retirator/assets/simulator-desktop.png', ['assets/simulator-desktop.png', 'image/png']],
  ['/retirator/assets/simulator-mobile.png', ['assets/simulator-mobile.png', 'image/png']],
]);

test.beforeAll(async () => {
  // Serve the actual documentation under the GitHub Pages project prefix, not Vite's app.
  const responses = new Map(await Promise.all([...files].map(async ([path, [file, type]]) =>
    [path, { type, body: await readFile(new URL(`../../docs/${file}`, import.meta.url)) }],
  )));
  server = createServer((request, response) => {
    const file = responses.get(request.url);
    response.writeHead(file ? 200 : 404, { 'Content-Type': file?.type ?? 'text/plain' });
    response.end(file?.body ?? 'Not found');
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  pageUrl = `http://127.0.0.1:${server.address().port}/retirator/`;
});

test.afterAll(async () => {
  if (server?.listening) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
});

test('project page loads local screenshots without runtime requests or storage', async ({ page }) => {
  const requests = [];
  const errors = [];
  page.on('request', request => requests.push(request.url()));
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(pageUrl);
  await expect(page.locator('html')).toHaveAttribute('lang', 'he');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('פחות סימני שאלה');
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    expect(await image.evaluate(img => ({
      width: img.naturalWidth, height: img.naturalHeight,
    }))).toEqual({
      width: Number(await image.getAttribute('width')),
      height: Number(await image.getAttribute('height')),
    });
  }
  expect(requests.sort()).toEqual([
    pageUrl, `${pageUrl}assets/simulator-desktop.png`, `${pageUrl}assets/simulator-mobile.png`,
  ].sort());
  expect(errors).toEqual([]);
  await expect(page.locator('script, iframe, video, form')).toHaveCount(0);
  const policy = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
  expect(policy).toContain("connect-src 'none'");
  expect(policy).toContain("script-src 'none'");
  await expect(page.locator('meta[name="referrer"]')).toHaveAttribute('content', 'no-referrer');
  expect(await page.evaluate(async () => ({
    local: localStorage.length, session: sessionStorage.length,
    cookies: document.cookie, databases: (await indexedDB.databases()).length,
  }))).toEqual({ local: 0, session: 0, cookies: '', databases: 0 });
  for (const link of await page.locator('a[href^="https://"]').all()) {
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(new URL(await link.getAttribute('href')).search).toBe('');
  }
  await expect(page.getByRole('link', { name: 'לפתיחת הסימולטור' }).first())
    .toHaveAttribute('href', 'https://nice-pebble-0150fe203.2.azurestaticapps.net');
});

test('project page supports keyboard navigation, readable mobile layout and reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(pageUrl);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'דילוג לתוכן' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  const question = page.locator('summary').filter({ hasText: 'עד כמה אפשר להסתמך על התוצאות?' });
  await question.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('זהו מודל לימודי מפושט', { exact: false })).toBeVisible();
  expect(await page.locator('.preview').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  expect(await page.locator('.journey ol').evaluate(element => getComputedStyle(element, '::before').animationName)).toBe('none');
  for (const width of [320, 393, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('project page meets accessibility checks', async ({ page }) => {
  await page.goto(pageUrl);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});
