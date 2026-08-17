import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mapListingsSafely } from '../../src/utils/mapListingsSafely.ts';
import { buildMatchInput } from '../../src/utils/buildMatchInput.ts';

test('mapListingsSafely keeps good rows when one mapper throws', () => {
  const jobs = mapListingsSafely(['ok', 'bad', 'also-ok'], (id) => {
    if (id === 'bad') throw new TypeError("Cannot read properties of null (reading 'toLowerCase')");
    return { id };
  });
  assert.deepEqual(jobs, [{ id: 'ok' }, { id: 'also-ok' }]);
});

test('mapListingsSafely returns empty when every row throws', () => {
  const jobs = mapListingsSafely([1, 2], () => {
    throw new TypeError("Cannot read properties of null (reading 'toLowerCase')");
  });
  assert.deepEqual(jobs, []);
});

test('buildMatchInput skips null listings and null title fields', () => {
  const input = buildMatchInput([
    null as never,
    {
      Jobid: '9',
      jobTitle: null,
      companyName: null,
      location: null,
      experience: null,
      eduRec: null,
      jobContext: null,
      jobDescription: null,
    } as never,
  ]);
  assert.equal(input.length, 1);
  assert.equal(input[0].id, 'bdjobs-9');
  assert.equal(input[0].title, '');
  assert.equal(input[0].description, '');
});
