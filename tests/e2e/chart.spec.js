import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { DEFAULT_STATE, calculate, trajectory } from '../../src/App.jsx';

const number = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 2 });
const money = (value) => `₪${new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 }).format(value)}`;
const valueText = (point) => `גיל ${number.format(point.age)}, הון זמין ${money(point.capital)}, חיסכון פנסיוני ${money(point.pension)}`;
const pointsFor = (state) => trajectory(state, calculate(state));
const sliderFor = (page) => page.getByRole('slider', { name: 'בחירת גיל בגרף', exact: true });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('checkbox', { name: /קראתי והבנתי/ }).check();
  await page.getByRole('button', { name: 'אני מסכים/ה — כניסה לסימולטור', exact: true }).click();
});

test('keyboard inspection exposes every monthly point and both series', async ({ page }) => {
  const slider = sliderFor(page);
  const state = { ...DEFAULT_STATE, currentAge: 66, bridgeStartAge: 66 };
  await page.getByRole('textbox', { name: 'גיל נוכחי', exact: true }).fill('66');
  await page.getByRole('textbox', { name: 'גיל הפסקת עבודה - תחילת גישור', exact: true }).fill('66');
  await page.getByRole('button', { name: 'חשב סימולציה', exact: true }).click();
  const points = pointsFor(state);
  await slider.scrollIntoViewIfNeeded();
  // Reach the control through sequential keyboard navigation, not programmatic focus.
  await page.getByRole('button', { name: 'הצג נוסחת חישוב' }).focus();
  await page.keyboard.press('Tab');
  await expect(slider).toBeFocused();
  await expect(slider).toHaveAttribute('aria-valuetext', valueText(points.at(-1)));
  await slider.press('Home');
  for (let index = 0; index < points.length; index += 1) {
    if (index) await slider.press('ArrowRight');
    await expect(slider).toHaveValue(String(index));
    await expect(slider).toHaveAttribute('aria-valuetext', valueText(points[index]));
  }
  await slider.press('ArrowUp');
  await expect(slider).toHaveValue(String(points.length - 1));
  await slider.press('ArrowLeft');
  await expect(slider).toHaveAttribute('aria-valuetext', valueText(points.at(-2)));
  await slider.press('Home');
  await slider.press('ArrowDown');
  await expect(slider).toHaveValue('0');
  await slider.press('End');
  await expect(page.getByTestId('chart-readout')).toContainText(money(points.at(-1).capital));
});

test('accessible table contains the exact plotted data and remains locked with the slider', async ({ page }, testInfo) => {
  const slider = sliderFor(page);
  await slider.focus();
  await slider.press('Home');
  await slider.press('ArrowRight');
  await page.getByText('טבלת נתוני הגרף', { exact: true }).click();
  const table = page.getByRole('table', { name: 'תחזית חודשית — סכומים משוערים בערכי היום' });
  const rows = table.locator('tbody tr');
  const points = pointsFor(DEFAULT_STATE);
  expect(await rows.allTextContents()).toEqual(points.map((point) => `${number.format(point.age)}${money(point.capital)}${money(point.pension)}`));
  await expect(table.getByRole('columnheader')).toHaveText(['גיל', 'הון זמין לגישור', 'חיסכון פנסיוני']);
  await page.getByRole('textbox', { name: 'צבירה נוכחית בקרן הפנסיה', exact: true }).fill('1000000');
  await expect(slider).toHaveAttribute('aria-valuetext', valueText(points[1]));
  expect(await rows.allTextContents()).toEqual(points.map((point) => `${number.format(point.age)}${money(point.capital)}${money(point.pension)}`));
  await page.getByRole('button', { name: 'חשב סימולציה', exact: true }).click();
  const committed = pointsFor({ ...DEFAULT_STATE, pensionBalance: 1000000 });
  await expect(slider).toHaveAttribute('aria-valuetext', valueText(committed[1]));
  expect(await rows.allTextContents()).toEqual(committed.map((point) => `${number.format(point.age)}${money(point.capital)}${money(point.pension)}`));
  const chartPanel = page.getByRole('region', { name: 'הכסף שלך, לאורך הדרך' });
  await chartPanel.scrollIntoViewIfNeeded();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  await chartPanel.screenshot({ path: testInfo.outputPath('chart-accessible.png'), animations: 'disabled', style: '.skip-link,.confetti{visibility:hidden!important}' });
  expect((await new AxeBuilder({ page }).include('.chart-panel').analyze()).violations).toEqual([]);
});

test('pointer or touch inspection stays synchronized with keyboard inspection', async ({ page, isMobile }) => {
  const chart = page.getByTestId('capital-chart');
  const slider = sliderFor(page);
  await chart.scrollIntoViewIfNeeded();
  const box = await chart.boundingBox();
  const x = box.x + box.width * 0.4;
  const y = box.y + box.height / 2;
  if (isMobile) await page.touchscreen.tap(x, y);
  else await page.mouse.move(x, y);
  const index = Number(await slider.inputValue());
  expect(index).toBeGreaterThan(0);
  expect(index).toBeLessThan(pointsFor(DEFAULT_STATE).length - 1);
  await expect(slider).toHaveAttribute('aria-valuetext', valueText(pointsFor(DEFAULT_STATE)[index]));
  await slider.focus();
  await slider.press('Home');
  await page.mouse.move(0, 0);
  await expect(slider).toHaveValue('0');
  await expect(page.getByTestId('chart-readout')).toContainText(money(DEFAULT_STATE.pensionBalance));
});

test('shortened and single-point timelines expose only committed valid points', async ({ page }) => {
  const slider = sliderFor(page);
  await slider.focus();
  await slider.press('End');
  await page.getByRole('textbox', { name: 'גיל נוכחי', exact: true }).fill('67');
  await page.getByRole('textbox', { name: 'גיל הפסקת עבודה - תחילת גישור', exact: true }).fill('67');
  await expect(slider).toHaveAttribute('max', '204');
  await page.getByRole('button', { name: 'חשב סימולציה', exact: true }).click();
  await expect(slider).toBeDisabled();
  await expect(slider).toHaveValue('0');
  await expect(slider).toHaveAttribute('aria-valuetext', valueText(pointsFor({ ...DEFAULT_STATE, currentAge: 67, bridgeStartAge: 67 })[0]));
  await page.getByText('טבלת נתוני הגרף', { exact: true }).click();
  await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(1);
});
