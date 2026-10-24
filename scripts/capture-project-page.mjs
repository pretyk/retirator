import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium, expect } from '@playwright/test';

// Run against a local production preview. Fresh contexts contain only illustrative defaults.
const browser = await chromium.launch();
try {
  await mkdir(new URL('../docs/assets/', import.meta.url), { recursive: true });
  for (const [name, viewport] of [
    ['desktop', { width: 1440, height: 1120 }],
    ['mobile', { width: 393, height: 852 }],
  ]) {
    const context = await browser.newContext({
      viewport, deviceScaleFactor: 1, reducedMotion: 'reduce',
      isMobile: name === 'mobile', hasTouch: name === 'mobile',
    });
    const page = await context.newPage();
    await page.addInitScript(() => { Math.random = () => 0; });
    await page.goto('http://127.0.0.1:4173/');
    await page.getByRole('checkbox', { name: /קראתי והבנתי/ }).check();
    await page.getByRole('button', { name: 'אני מסכים/ה — כניסה לסימולטור', exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'חיסכון נזיל / תיק השקעות', exact: true })).toHaveValue('1,800,000');
    await expect(page.getByTestId('capital-chart')).toBeAttached();
    if (name === 'mobile') {
      await page.getByRole('button', { name: 'חשב סימולציה', exact: true }).click();
      await expect(page.getByTestId('bridge-card')).toBeInViewport();
    }
    await page.mouse.move(0, 0);
    const capture = name === 'desktop' ? page.locator('.workspace') : page;
    await capture.screenshot({
      path: fileURLToPath(new URL(`../docs/assets/simulator-${name}.png`, import.meta.url)),
      animations: 'disabled',
    });
    await context.close();
  }
} finally {
  await browser.close();
}
