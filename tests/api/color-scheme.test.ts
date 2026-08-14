import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isDarkFromPreference,
  metaContentForPreference,
  preferenceFromStorage,
} from '../../src/utils/colorScheme.ts';
import { isDialogBackdropClick } from '../../src/utils/dialogLightDismiss.ts';

test('system preference follows the OS color scheme', () => {
  assert.equal(isDarkFromPreference('system', true), true);
  assert.equal(isDarkFromPreference('system', false), false);
});

test('pinned light stays light even when the OS is dark', () => {
  assert.equal(isDarkFromPreference('light', true), false);
});

test('pinned dark stays dark even when the OS is light', () => {
  assert.equal(isDarkFromPreference('dark', false), true);
});

test('meta color-scheme is light dark unless the user pinned a theme', () => {
  assert.equal(metaContentForPreference('system'), 'light dark');
  assert.equal(metaContentForPreference('light'), 'light');
  assert.equal(metaContentForPreference('dark'), 'dark');
});

test('unknown storage values fall back to system', () => {
  assert.equal(preferenceFromStorage(null), 'system');
  assert.equal(preferenceFromStorage('sepia'), 'system');
  assert.equal(preferenceFromStorage('dark'), 'dark');
});

test('dialog light-dismiss: child clicks are ignored', () => {
  const dialog = {};
  const child = {};
  assert.equal(
    isDialogBackdropClick(dialog, { target: child, clientX: 10, clientY: 10 }, { top: 0, left: 0, height: 100, width: 100 }),
    false,
  );
});

test('dialog light-dismiss: click on the dialog box itself is ignored', () => {
  const dialog = {};
  assert.equal(
    isDialogBackdropClick(dialog, { target: dialog, clientX: 50, clientY: 50 }, { top: 0, left: 0, height: 100, width: 100 }),
    false,
  );
});

test('dialog light-dismiss: click outside the dialog box closes it', () => {
  const dialog = {};
  assert.equal(
    isDialogBackdropClick(dialog, { target: dialog, clientX: 400, clientY: 400 }, { top: 0, left: 0, height: 100, width: 100 }),
    true,
  );
});
