import { test, expect } from '@playwright/test';

const expectReadableLayout = async (root) => {
  const report = await root.evaluate((container) => {
    const width = document.documentElement.clientWidth;
    const visible = [...container.querySelectorAll('*')].filter((element) => {
      const box = element.getBoundingClientRect();
      return box.width > 0 && box.height > 0 && getComputedStyle(element).visibility !== 'hidden' && !element.closest('.sr-only');
    });
    const describe = (element) => `${element.tagName}.${element.getAttribute('class') ?? ''}: ${element.textContent.trim().slice(0, 40)}`;
    const smallText = visible.filter((element) => !element.closest('svg') &&
      [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim()) &&
      parseFloat(getComputedStyle(element).fontSize) < 14).map(describe);
    const overflow = visible.filter((element) => {
      const box = element.getBoundingClientRect();
      return box.left < -1 || box.right > width + 1;
    }).map(describe);
    return { smallText, overflow };
  });
  expect(report.smallText, 'visible text must be at least 14px').toEqual([]);
  expect(report.overflow, 'content must fit the viewport').toEqual([]);
};

const expectValueFits = async (input) => {
  const fits = await input.evaluate((element) => {
    const context = document.createElement('canvas').getContext('2d');
    const style = getComputedStyle(element);
    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    return context.measureText(element.value).width <= element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  });
  expect(fits, `${await input.getAttribute('name')} value must fit`).toBe(true);
};

for (const width of [320, 360, 720, 721, 820, 1024, 1150, 1280, 1440]) {
  test(`readable typography and unclipped values at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expectReadableLayout(page.getByRole('dialog'));
    await page.getByRole('checkbox', { name: /קראתי והבנתי/ }).check();
    await page.getByRole('button', { name: 'אני מסכים/ה — כניסה לסימולטור', exact: true }).click();
    await expectReadableLayout(page.locator('.app-shell'));

    for (const label of await page.locator('.field-heading, .section-heading h3').all()) {
      await expect(label).toHaveCSS('font-size', '18px');
    }
    for (const field of await page.locator('.numeric-field').all()) {
      const input = field.getByRole('textbox');
      await expect(input).toHaveCSS('font-size', '20px');
      const maximum = await field.getByRole('slider').getAttribute('max');
      await input.fill(maximum);
      await input.blur();
      await expectValueFits(input);
    }
    await expectReadableLayout(page.locator('.app-shell'));

    const chart = page.getByTestId('capital-chart');
    const labels = await chart.locator('.svg-label').evaluateAll((elements) => elements.map((element) => {
      const box = element.getBoundingClientRect();
      const svgBox = element.ownerSVGElement.getBoundingClientRect();
      return { height: box.height, inside: box.left >= svgBox.left && box.right <= svgBox.right && box.bottom <= svgBox.bottom };
    }));
    for (const label of labels) {
      expect(label.height, 'rendered chart label height').toBeGreaterThanOrEqual(14);
      expect(label.inside, 'chart labels must not be clipped').toBe(true);
    }

    await page.getByRole('button', { name: 'הצג נוסחת חישוב' }).click();
    await expectReadableLayout(page.getByRole('dialog'));
    await page.getByRole('button', { name: 'סגור הסבר' }).click();
    for (const hash of ['#privacy', '#disclaimer']) {
      await page.goto(`/${hash}`);
      await expectReadableLayout(page.locator('#information'));
    }
  });
}

for (const width of [320, 721, 1440]) {
  test(`enlarged browser fonts preserve complete values at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.getByRole('checkbox', { name: /קראתי והבנתי/ }).check();
    await page.getByRole('button', { name: 'אני מסכים/ה — כניסה לסימולטור', exact: true }).click();
    await page.evaluate(() => { document.documentElement.style.fontSize = '125%'; });
    await expect(page.getByRole('textbox', { name: 'גיל נוכחי', exact: true })).toHaveCSS('font-size', '25px');
    await expect(page.locator('.field-heading').first()).toHaveCSS('font-size', '22.5px');
    for (const [name, value] of [['liquidSavings', '9999999.99'], ['hishtalmut', '10000000'], ['pensionBalance', '100000000']]) {
      const input = page.locator(`input[name="${name}"]`);
      await input.fill(value);
      await input.blur();
      await expect(input).toHaveAttribute('aria-invalid', 'false');
      await expectValueFits(input);
    }
    await expectReadableLayout(page.locator('.app-shell'));
  });
}
