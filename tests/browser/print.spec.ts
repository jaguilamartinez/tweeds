import { expect, test } from '@playwright/test';

test('prints Ink form errors with the complete Paper semantic palette', async ({ page }) => {
  await page.goto('/#patterns');
  const playbook = page.locator('.playbook');
  await expect(playbook).toHaveAttribute('data-tw-theme', 'ink');
  await page.getByRole('button', { name: 'Switch to paper theme', exact: true }).click();
  await expect(playbook).toHaveAttribute('data-tw-theme', 'paper');

  const roles = ['bg', 'surface', 'text', 'muted', 'border', 'line', 'action', 'action-text', 'accent', 'discovery', 'focus', 'error', 'error-border'];
  const paperPalette = await playbook.evaluate((element, roles) => {
    const style = getComputedStyle(element);
    return Object.fromEntries(roles.map(role => [role, style.getPropertyValue(`--tw-color-${role}`).trim()]));
  }, roles);

  await page.getByRole('button', { name: 'Switch to ink theme', exact: true }).click();
  await expect(playbook).toHaveAttribute('data-tw-theme', 'ink');
  const form = page.getByRole('tabpanel');
  await form.getByRole('button', { name: 'Save details', exact: true }).click();
  const error = form.getByText('Enter your name.', { exact: true });
  await expect(error).toBeVisible();
  await expect(error).toHaveCSS('color', 'rgb(250, 248, 243)');

  await page.emulateMedia({ media: 'print' });
  await expect(error).toBeVisible();
  await expect(error).toHaveCSS('color', 'rgb(19, 21, 26)');
  await expect(playbook).toHaveCSS('background-color', 'rgb(250, 248, 243)');
  await expect(playbook).toHaveCSS('color-scheme', 'light');

  const printPalette = await playbook.evaluate((element, roles) => {
    const style = getComputedStyle(element);
    return Object.fromEntries(roles.map(role => [role, style.getPropertyValue(`--tw-color-${role}`).trim()]));
  }, roles);
  expect(printPalette).toEqual(paperPalette);
});
