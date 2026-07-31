// B01 (PDF), B02 (DOCX), B03 (TXT) — the drag-and-drop path itself isn't exercised here
// (Playwright's setInputFiles is the standard, reliable way to drive file inputs; real
// drag-and-drop is a browser-native OS interaction Playwright deliberately doesn't
// simulate pixel-for-pixel), but it drives the exact same input[type=file] the dropzone's
// "Browse Files" control uses, so the upload -> AI parse -> report pipeline is covered
// end-to-end. Every created profile is deleted afterward so repeat runs don't accumulate
// test resumes in the user's real talentai.db.
import path from 'path';
import { fileURLToPath } from 'url';
import { test, expect } from '@playwright/test';
import { isAiConfigured, deleteResume, listResumeIds } from '../helpers/prereqs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtures = path.join(__dirname, '../fixtures');

const formats = [
  { label: 'B01: PDF', file: 'sample-resume.pdf' },
  { label: 'B02: DOCX', file: 'sample-resume.docx' },
  { label: 'B03: TXT', file: 'sample-resume.txt' },
];

for (const { label, file } of formats) {
  test(`${label} resume upload happy path`, async ({ page }) => {
    test.skip(!(await isAiConfigured()), 'No AI provider configured');

    const before = await listResumeIds();
    let createdId: string | undefined;

    try {
      await page.goto('/');
      await page.locator('#nav-resume').click();
      const uploadTab = page.getByRole('button', { name: 'Upload Resume' });
      if (await uploadTab.isVisible()) await uploadTab.click();

      await page.locator('#dropzone input[type="file"]').setInputFiles(path.join(fixtures, file));
      // exact: true disambiguates from the always-present sidebar CTA (#cta-analyze-resume,
      // "psychology Analyze Resume" once its icon ligature's text content is included) —
      // both loosely match "Analyze Resume" without it.
      await page.getByRole('button', { name: 'Analyze Resume', exact: true }).click();

      // AI parsing can genuinely take up to ~30-60s on a live provider.
      await expect(page.getByRole('heading', { name: /Jordan Ellis Resume/i })).toBeVisible({ timeout: 90_000 });
      await expect(page.getByText(/High ATS Compatibility|Good ATS Compatibility|Low ATS Compatibility/)).toBeVisible();

      const after = await listResumeIds();
      createdId = after.find((id) => !before.includes(id));
      expect(createdId, 'a new resume row must have been created').toBeTruthy();
    } finally {
      if (createdId) await deleteResume(createdId);
    }
  });
}
