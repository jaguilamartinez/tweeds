import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(async () => { await document.fonts.ready; });
});

test('ink theme playbook @visual', async ({ page }) => {
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page).toHaveScreenshot('playbook-ink.png', { fullPage: true });
});

test('paper theme playbook @visual', async ({ page }) => {
  await page.getByRole('button', { name: 'Switch to paper theme', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Switch to ink theme', exact: true })).toBeVisible();
  await expect(page).toHaveScreenshot('playbook-paper.png', { fullPage: true });
});

for (const theme of ['ink', 'paper']) {
  test(`${theme} brand foundations @visual`, async ({ page }) => {
    await page.goto('/#foundations');
    if (theme === 'paper') await page.getByRole('button', { name: 'Switch to paper theme', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Logo', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Imagery style', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Iconography', exact: true })).toBeVisible();
    await expect(page).toHaveScreenshot(`foundations-${theme}.png`, { fullPage: true });
  });

  test(`${theme} Button component reference @visual`, async ({ page }) => {
    await page.goto('/#components');
    await page.getByRole('navigation', { name: 'Component list', exact: true }).getByRole('button', { name: 'Button', exact: true }).click();
    if (theme === 'paper') await page.getByRole('button', { name: 'Switch to paper theme', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Button', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'TextLink', exact: true })).not.toBeVisible();
    await expect(page).toHaveScreenshot(`components-button-${theme}.png`, { fullPage: true });
  });

  test(`${theme} Icon component reference @visual`, async ({ page }) => {
    await page.goto('/#components');
    await page.getByRole('navigation', { name: 'Component list', exact: true }).getByRole('button', { name: 'Icon', exact: true }).click();
    if (theme === 'paper') await page.getByRole('button', { name: 'Switch to paper theme', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Icon', exact: true })).toBeVisible();
    await expect(page).toHaveScreenshot(`components-icon-${theme}.png`, { fullPage: true });
  });

  for (const component of ['Tag', 'Tabs', 'MathMark'] as const) {
    test(`${theme} ${component} specimen @visual`, async ({ page }) => {
      await page.goto('/#components');
      await page.getByRole('navigation', { name: 'Component list', exact: true }).getByRole('button', { name: component, exact: true }).click();
      if (theme === 'paper') await page.getByRole('button', { name: 'Switch to paper theme', exact: true }).click();
      const preview = page.getByRole('article', { name: component, exact: true }).locator('.pb-component-preview');
      await expect(preview).toBeVisible();
      if (component === 'Tabs') await expect(preview.getByRole('tab', { name: 'Overview', exact: true })).toHaveAttribute('aria-selected', 'true');
      await expect(preview).toHaveScreenshot(`components-${component.toLowerCase()}-${theme}.png`);
    });
  }

  test(`${theme} Common Thread landing @visual`, async ({ page }) => {
    await page.goto('/#example');
    const example = page.getByRole('region', { name: 'Common Thread example application', exact: true });
    if (theme === 'paper') await page.getByRole('button', { name: 'Switch to paper theme', exact: true }).click();
    await expect(example.getByRole('button', { name: 'Landing', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(example.getByRole('button', { name: 'Explore workspace', exact: true })).toBeVisible();
    await expect(page).toHaveScreenshot(`product-landing-${theme}.png`, { fullPage: true });
  });

  test(`${theme} Common Thread workspace @visual`, async ({ page }) => {
    await page.goto('/#example');
    await page.getByRole('region', { name: 'Common Thread example application', exact: true }).getByRole('button', { name: 'Workspace', exact: true }).click();
    if (theme === 'paper') await page.getByRole('button', { name: 'Switch to paper theme', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Workspace', exact: true })).toBeVisible();
    await expect(page).toHaveScreenshot(`product-workspace-${theme}.png`, { fullPage: true });
  });
}
