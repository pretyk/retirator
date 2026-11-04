import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const field = (page, name) => page.getByRole('textbox', { name, exact: true });
const commit = (page) => page.getByRole('button', { name: 'חשב סימולציה', exact: true });
const advanced = (page) => page.getByRole('button', { name: 'מצב מתקדם — פירוט החיסכון', exact: true });
const simple = (page) => page.getByRole('button', { name: 'חזרה לסכום אחד', exact: true });
const guide = (page) => page.getByRole('button', { name: 'דוגמה פשוטה — איך מתחילים?', exact: true });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('checkbox', { name: /אני מסכים\/ה לתנאי השימוש/ }).check();
  await page.getByRole('button', { name: 'אני מסכים/ה — כניסה לסימולטור', exact: true }).click();
});

test('starts with one total and converts between modes without losing or double-counting capital', async ({ page }) => {
  const before = await page.getByTestId('bridge-net').textContent();
  const gross = await page.getByTestId('bridge-gross').textContent();
  const chart = await page.getByTestId('capital-chart').innerHTML();
  await expect(field(page, 'חיסכון נזיל')).toHaveValue('3,000,000');
  await expect(field(page, 'קרן השתלמות')).toHaveCount(0);
  await expect(advanced(page)).toHaveAttribute('aria-expanded', 'false');
  await advanced(page).click();
  await expect(simple(page)).toHaveAttribute('aria-expanded', 'true');
  await expect(field(page, 'חיסכון נזיל')).toHaveCount(0);
  await expect(field(page, 'תיק השקעות')).toHaveValue('3,000,000');
  await expect(field(page, 'קרן השתלמות')).toHaveValue('0');
  await expect(field(page, 'חיסכון אחר')).toHaveValue('0');
  await field(page, 'תיק השקעות').fill('1,000,000');
  await field(page, 'קרן השתלמות').fill('1,200,000');
  await field(page, 'חיסכון אחר').fill('800,000');
  await expect(page.getByTestId('savings-total')).toHaveText('₪3,000,000');
  await expect(page.getByTestId('bridge-net')).toHaveText(before);
  expect(await page.getByTestId('capital-chart').innerHTML()).toBe(chart);
  await commit(page).click();
  await expect(page.getByTestId('bridge-gross')).toHaveText(gross);
  await expect(page.getByTestId('bridge-net')).not.toHaveText(before);
  await expect(page.getByTestId('bridge-card')).toContainText('9%');
  await page.getByRole('button', { name: 'הצג נוסחת חישוב' }).click();
  await expect(page.getByRole('dialog')).toContainText('9%');
  await page.keyboard.press('Escape');
  await simple(page).click();
  await expect(field(page, 'חיסכון נזיל')).toHaveValue('3,000,000');
  await commit(page).click();
  await expect(page.getByTestId('bridge-net')).toHaveText(before);
  await expect(page.getByTestId('bridge-card')).toContainText('15%');
  await advanced(page).click();
  await expect(field(page, 'תיק השקעות')).toHaveValue('3,000,000');
  await expect(field(page, 'קרן השתלמות')).toHaveValue('0');
  await expect(field(page, 'חיסכון אחר')).toHaveValue('0');
});

test('does not hide invalid savings by switching modes and preserves fractional sums', async ({ page }) => {
  await field(page, 'חיסכון נזיל').fill('1,2,3');
  await expect(advanced(page)).toBeDisabled();
  await expect(commit(page)).toBeDisabled();
  await field(page, 'חיסכון נזיל').fill('3,000,000');
  await advanced(page).click();
  await field(page, 'קרן השתלמות').fill('1,200,000.13');
  await field(page, 'תיק השקעות').fill('1,800,000.01');
  await field(page, 'חיסכון אחר').fill('0.07');
  await expect(page.getByTestId('savings-total')).toHaveText('₪3,000,000.21');
  await expect(page.getByRole('slider', { name: 'יעד הון להשאיר בגיל פנסיה - מחוון', exact: true })).toHaveAttribute('max', '3000000.21');
  await field(page, 'חיסכון אחר').fill('bad');
  await expect(simple(page)).toBeDisabled();
  await expect(commit(page)).toBeDisabled();
  await expect(page.getByTestId('savings-total')).toHaveText('—');
  await field(page, 'חיסכון אחר').fill('0.07');
  await simple(page).click();
  await expect(field(page, 'חיסכון נזיל')).toHaveValue('3,000,000.21');
  await expect(commit(page)).toBeEnabled();
  await advanced(page).click();
  await expect(field(page, 'תיק השקעות')).toHaveValue('3,000,000.21');
  await expect(commit(page)).toBeEnabled();
});

test('enforces the aggregate ceiling and permits the full total in either mode', async ({ page }) => {
  await field(page, 'חיסכון נזיל').fill('20,000,000');
  await advanced(page).click();
  await expect(field(page, 'תיק השקעות')).toHaveValue('20,000,000');
  await expect(commit(page)).toBeEnabled();
  await field(page, 'חיסכון אחר').fill('0.01');
  await expect(commit(page)).toBeDisabled();
  await expect(simple(page)).toBeDisabled();
  await expect(page.getByRole('alert')).toContainText('סך החיסכון הנזיל לא יכול להיות גבוה מ־20,000,000 ₪.');
  await field(page, 'תיק השקעות').fill('19,999,999.99');
  await expect(page.getByTestId('savings-total')).toHaveText('₪20,000,000');
  await simple(page).click();
  await expect(field(page, 'חיסכון נזיל')).toHaveValue('20,000,000');
  await expect(commit(page)).toBeEnabled();
});

test('breakdown and simple guide are accessible and fit a narrow screen', async ({ page, isMobile }) => {
  if (isMobile) await page.setViewportSize({ width: 320, height: 740 });
  await advanced(page).click();
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await guide(page).click();
  const dialog = page.getByRole('dialog', { name: 'איך זה עובד? דוגמה פשוטה' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { name: 'איך זה עובד? דוגמה פשוטה' })).toBeFocused();
  await expect(dialog).toContainText('₪1,200,000 ÷ 120 = ₪10,000');
  await expect(dialog).toContainText('₪8,500');
  await expect(dialog).toContainText('אינה משנה את הנתונים שלך');
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  const box = await dialog.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize().width);
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'סגור דוגמה' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'חזרה לתרחיש שלי' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'סגור דוגמה' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(guide(page)).toBeFocused();
});

test('guide dismissal leaves draft, results, chart, validation and mode untouched', async ({ page }) => {
  await advanced(page).click();
  await field(page, 'חיסכון אחר').fill('123,456');
  await field(page, 'קרן השתלמות').fill('invalid');
  const before = await page.getByTestId('bridge-net').textContent();
  const chart = await page.getByTestId('capital-chart').innerHTML();
  for (const close of ['סגור דוגמה', 'חזרה לתרחיש שלי', 'backdrop']) {
    await guide(page).click();
    if (close === 'backdrop') await page.mouse.click(2, 2);
    else await page.getByRole('dialog').getByRole('button', { name: close, exact: true }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(guide(page)).toBeFocused();
    await expect(field(page, 'חיסכון אחר')).toHaveValue('123,456');
    await expect(field(page, 'קרן השתלמות')).toHaveValue('invalid');
    await expect(commit(page)).toBeDisabled();
    await expect(simple(page)).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByTestId('bridge-net')).toHaveText(before);
    expect(await page.getByTestId('capital-chart').innerHTML()).toBe(chart);
  }
});
