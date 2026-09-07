/**
 * Sathaye UCM: Clean Project Exporter
 * Generates a production-ready ZIP archive of the codebase
 * Excludes: node_modules, .git, dist, .env, and sensitive files.
 */

import fs from 'fs';
import path from 'path';
import { ZipArchive } from 'archiver';

const rootDir = process.cwd();
const outputZipPath = path.join(rootDir, 'sathaye-ucm-complete.zip');

const output = fs.createWriteStream(outputZipPath);
const archive = new ZipArchive({ zlib: { level: 9 } });

output.on('close', () => {
  console.log(`[ZIP EXPORT] Successfully created ${outputZipPath} (${(archive.pointer() / 1024 / 1024).toFixed(2)} MB)`);
});

archive.on('error', (err) => {
  console.error('[ZIP EXPORT] Error generating archive:', err);
  process.exit(1);
});

archive.pipe(output);

// Exclude sensitive and build-heavy patterns
const ignoredPatterns = [
  'node_modules/**',
  '.git/**',
  'dist/**',
  '.env',
  'sathaye-ucm-complete.zip',
  '.DS_Store'
];

archive.glob('**/*', {
  cwd: rootDir,
  ignore: ignoredPatterns,
  dot: true
});

archive.finalize();
