// B04: switching the active profile in the top-nav dropdown must update the Dashboard
// (and, by extension, everything else keyed off currentProfile). Both profiles are
// seeded directly through the real API (not two full UI upload flows — that path is
// already covered by resume-upload.spec.ts) so this spec tests only what B04 is about.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { test, expect } from '@playwright/test';
import { isAiConfigured, seedResume, deleteResume } from '../helpers/prereqs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtures = path.join(__dirname, '../fixtures');

test('B04: multi-profile switching updates the active dashboard', async ({ page }) => {
  test.skip(!(await isAiConfigured()), 'No AI provider configured');

  const idA = await seedResume(fs.readFileSync(path.join(fixtures, 'sample-resume.txt')), 'sample-resume.txt', 'text/plain');
  const idB = await seedResume(fs.readFileSync(path.join(fixtures, 'sample-resume-2.txt')), 'sample-resume-2.txt', 'text/plain');

  try {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Welcome back,/ })).toBeVisible();

    await page.locator('#btn-profile-avatar').click();
    await page.locator(`#btn-switch-to-${idB}`).click();
    await expect(page.getByRole('heading', { name: 'Welcome back, Priya.' })).toBeVisible();

    await page.locator('#btn-profile-avatar').click();
    await page.locator(`#btn-switch-to-${idA}`).click();
    await expect(page.getByRole('heading', { name: 'Welcome back, Jordan.' })).toBeVisible();
  } finally {
    await deleteResume(idA);
    await deleteResume(idB);
  }
});
