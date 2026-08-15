import express from 'express';

// Strategy: 50kb default (T14), 1mb for AI job payloads that embed many listings.
const LARGE_JSON_PATHS = [
  '/api/jobs/match-batch',
  '/api/jobs/compare',
  '/api/jobs/generate-application',
];

const parsers = {
  '50kb': express.json({ limit: '50kb' }),
  '1mb': express.json({ limit: '1mb' }),
};

export function jsonLimitFor(path) {
  return LARGE_JSON_PATHS.some((p) => path === p || path.startsWith(`${p}/`)) ? '1mb' : '50kb';
}

export function jsonBodyLimit(req, res, next) {
  return parsers[jsonLimitFor(req.path)](req, res, next);
}
