import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

test('production license URLs serve exact text instead of the SPA fallback', async ({ request }) => {
  for (const file of ['LICENSE.txt', 'THIRD_PARTY_NOTICES.txt']) {
    const response = await request.get(`/${file}`);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toMatch(/^text\/plain\b/);
    expect(await response.text()).toBe(readFileSync(new URL(`../../dist/${file}`, import.meta.url), 'utf8'));
    expect(await response.text()).not.toContain('<!doctype html>');
  }
});

test('Hebrew footer link opens the distributed notices on desktop and mobile', async ({ page }, testInfo) => {
  await page.goto('/#privacy');
  const link = page.getByRole('link', { name: 'רישיונות וזכויות יוצרים', exact: true });
  await expect(link).toHaveAttribute('href', '/THIRD_PARTY_NOTICES.txt');
  await link.scrollIntoViewIfNeeded();
  await expect(link).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('.site-footer').screenshot({ path: testInfo.outputPath('license-footer.png') });
  await link.click();
  await expect(page).toHaveURL(/\/THIRD_PARTY_NOTICES\.txt$/);
  await expect(page.locator('body')).toContainText('רישיונות והודעות זכויות יוצרים');
  await expect(page.locator('body')).toContainText('Copyright (c) Meta Platforms, Inc. and affiliates.');
  await expect(page.locator('body')).toContainText('Lucide Contributors 2022');
  await expect(page.locator('body')).toContainText('Copyright (c) Tailwind Labs, Inc.');
});
