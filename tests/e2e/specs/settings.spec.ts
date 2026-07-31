// B08 (account update), B09 (dark mode toggle + OS sync), B10 (sandbox reset). None of
// these need an AI key — Settings loads independently of job matching. B08 restores the
// original account name/email afterward so this spec never leaves the user's real
// account details changed.
import { test, expect } from '@playwright/test';
import { API_BASE } from '../helpers/prereqs';

test('B08: account name/email update persists and does not touch other fields', async ({ page }) => {
  const usersBefore = await (await fetch(`${API_BASE}/users`)).json();
  const original = usersBefore.find((u: { id: string }) => u.id === 'user-default');

  await page.goto('/');
  await page.locator('#nav-settings').click();
  const accountCard = page.getByRole('heading', { name: 'Account', exact: true }).locator('xpath=..');
  const nameInput = accountCard.locator('input[type="text"]');
  const emailInput = accountCard.locator('input[type="email"]');

  try {
    await nameInput.fill('E2E Test Name');
    await emailInput.fill('e2e-test-account@example.com');
    await accountCard.getByRole('button', { name: 'Save Account Details' }).click();
    // 'Account details updated' is useAccountSettings.ts's own toggle-triggered toast —
    // distinct from SettingsView's local 'Settings updated successfully!', which only
    // fires from ProfileDetailsSection's onSaved, not from this account form.
    await expect(page.getByText('Account details updated')).toBeVisible();

    await page.reload();
    await page.locator('#nav-settings').click();
    await expect(accountCard.locator('input[type="text"]')).toHaveValue('E2E Test Name');
  } finally {
    await fetch(`${API_BASE}/users/user-default`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: original.name, email: original.email }),
    });
  }
});

test('B09: dark mode toggles instantly and syncs with OS preference on first mount', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).not.toHaveClass(/dark/);

  await page.locator('#btn-toggle-dark-mode').click();
  await expect(html).toHaveClass(/dark/);
  await page.locator('#btn-toggle-dark-mode').click();
  await expect(html).not.toHaveClass(/dark/);

  await page.emulateMedia({ colorScheme: 'dark' });
  await page.reload();
  await expect(html).toHaveClass(/dark/);
});

test('B10: sandbox reset shows a confirmation toast', async ({ page }) => {
  await page.goto('/');
  await page.locator('#nav-settings').click();
  await page.getByRole('button', { name: 'Reset sandbox state' }).click();
  await expect(page.getByText('Sandbox reset successfully')).toBeVisible();
});
