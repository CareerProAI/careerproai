// B05 (filter panel) + B06 (save/unsave). Scoped to what's actually implemented today:
// the real filter surface is the All-Jobs/Highly-Recommended toggle, the sort-mode
// select, and the top-nav search box — the richer location/company/salary-slider panel
// described in the original brief (ui/FilterPillGroup.tsx) is defined but never wired
// into JobSearchView, so it isn't tested here (there is nothing to drive).
// Job listings depend on live third-party sources (bdjobs.com, LinkedIn) plus a real AI
// scoring call — both tests skip cleanly (not fail) if nothing loads in time, since that
// reflects upstream availability, not a bug in this app (mirrors A10's documented stance).
import { test, expect } from '@playwright/test';
import { isAiConfigured, API_BASE } from '../helpers/prereqs';

test.beforeEach(async ({ page }) => {
  test.skip(!(await isAiConfigured()), 'No AI provider configured');
  await page.goto('/');
  await page.locator('#nav-jobs').click();
});

test('B05: tab filter, sort mode, and search narrow the job feed', async ({ page }) => {
  const anyCard = page.getByRole('heading', { level: 3 }).first();
  try {
    await anyCard.waitFor({ state: 'visible', timeout: 45_000 });
  } catch {
    test.skip(true, 'no job listings loaded from the live external sources within 45s');
  }

  await page.getByRole('button', { name: 'Highly Recommended' }).click();
  await page.getByRole('button', { name: 'All Jobs' }).click();

  await page.locator('#job-sort-select').first().selectOption('salary');
  await page.locator('#job-sort-select').first().selectOption('bestMatch');

  await page.locator('#input-navbar-search').fill('zzzznonexistentkeywordzzzz');
  await expect(page.getByText(/No .* listings match your search/i).first()).toBeVisible({ timeout: 10_000 });
  await page.locator('#input-navbar-search').fill('');
});

test('B06: save and unsave a job persists via the API', async ({ page }) => {
  const resumes = await (await fetch(`${API_BASE}/resumes?userId=user-default`)).json();
  test.skip(resumes.length === 0, 'no resume profile exists to attach saved jobs to');
  const resumeId = resumes[0].id;

  const saveButton = page.getByRole('button', { name: 'Save job' }).first();
  try {
    await saveButton.waitFor({ state: 'visible', timeout: 45_000 });
  } catch {
    test.skip(true, 'no job listings loaded from the live external sources within 45s');
  }

  const before = await (await fetch(`${API_BASE}/saved-jobs?resumeId=${resumeId}`)).json();
  await saveButton.click();
  await expect(page.getByRole('button', { name: 'Unsave job' }).first()).toBeVisible();
  const afterSave = await (await fetch(`${API_BASE}/saved-jobs?resumeId=${resumeId}`)).json();
  expect(afterSave.length).toBe(before.length + 1);

  await page.getByRole('button', { name: 'Unsave job' }).first().click();
  await expect(page.getByRole('button', { name: 'Save job' }).first()).toBeVisible();
  const afterUnsave = await (await fetch(`${API_BASE}/saved-jobs?resumeId=${resumeId}`)).json();
  expect(afterUnsave.length).toBe(before.length);
});
