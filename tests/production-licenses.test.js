import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { assertReviewedBundle, checkDistribution, distributionNotices, reviewedPackages } from '../scripts/production-licenses.mjs';

const temporaryDirectories = [];
afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true });
});

function artifactDirectory() {
  const directory = mkdtempSync(join(tmpdir(), 'retirator-licenses-'));
  temporaryDirectories.push(directory);
  for (const [file, text] of Object.entries(distributionNotices())) writeFileSync(join(directory, file), text);
  return directory;
}

function bundle(extraModules = {}) {
  const version = JSON.parse(readFileSync(new URL('../node_modules/tailwindcss/package.json', import.meta.url))).version;
  return {
    'index.js': {
      type: 'chunk',
      modules: Object.fromEntries(['react', 'react-dom', 'scheduler', 'lucide-react'].map((name) => [`C:\\repo\\node_modules\\${name}\\index.js`, {}]).concat(Object.entries(extraModules))),
    },
    'index.css': { type: 'asset', fileName: 'assets/index.css', source: `/*! tailwindcss v${version} | MIT License */` },
  };
}

describe('production license distribution', () => {
  it('retains the complete project and exact packaged notices, including transitive code and CSS', () => {
    const files = distributionNotices();
    expect(files['LICENSE.txt']).toBe(readFileSync(new URL('../LICENSE', import.meta.url), 'utf8'));
    for (const name of Object.keys(reviewedPackages)) {
      const license = readFileSync(new URL(`../node_modules/${name}/${name === 'vite' ? 'LICENSE.md' : 'LICENSE'}`, import.meta.url), 'utf8');
      const { version } = JSON.parse(readFileSync(new URL(`../node_modules/${name}/package.json`, import.meta.url)));
      expect(files['THIRD_PARTY_NOTICES.txt']).toContain(`${name}@${version}`);
      expect(files['THIRD_PARTY_NOTICES.txt']).toContain(license);
    }
    expect(files['THIRD_PARTY_NOTICES.txt']).toContain('Cole Bemis 2013-2022 as part of Feather (MIT)');
    expect(files['THIRD_PARTY_NOTICES.txt']).toContain(readFileSync(new URL('../scripts/licenses/feather-LICENSE.txt', import.meta.url), 'utf8'));
    expect(() => checkDistribution(artifactDirectory())).not.toThrow();
  });

  it.each(['LICENSE.txt', 'THIRD_PARTY_NOTICES.txt'])('rejects a missing %s', (file) => {
    const directory = artifactDirectory();
    rmSync(join(directory, file));
    expect(() => checkDistribution(directory)).toThrow();
  });

  it.each(['', 'MIT', '<!doctype html><html>SPA fallback</html>'])('rejects incomplete or fallback notice content: %s', (text) => {
    const directory = artifactDirectory();
    writeFileSync(join(directory, 'THIRD_PARTY_NOTICES.txt'), text);
    expect(() => checkDistribution(directory)).toThrow(/altered/);
  });

  it('recognizes bundled production packages on Windows and POSIX', () => {
    expect(() => assertReviewedBundle(bundle({ '/repo/node_modules/react/jsx-runtime.js': {} }))).not.toThrow();
  });

  it('covers Vite modulepreload and CommonJS helpers, but rejects new virtual runtime modules', () => {
    expect(() => assertReviewedBundle(bundle({ '\0vite/modulepreload-polyfill.js': {}, '\0commonjsHelpers.js': {}, '\0/repo/node_modules/react/index.js?commonjs-module': {} }))).not.toThrow();
    expect(() => assertReviewedBundle(bundle({ '\0new-runtime-helper.js': {} }))).toThrow(/Unreviewed virtual runtime module/);
    expect(() => assertReviewedBundle(bundle({ '\0/repo/node_modules/react/index.js?new-helper': {} }))).toThrow(/Unreviewed virtual runtime module/);
    expect(distributionNotices()['THIRD_PARTY_NOTICES.txt']).toContain('VoidZero Inc. and Vite contributors');
    expect(distributionNotices()['THIRD_PARTY_NOTICES.txt']).toContain('RollupJS Plugin Contributors');
  });

  it.each(['/repo/node_modules/new-dependency/index.js', '/repo/node_modules/@scope/new-dependency/index.js'])('fails closed on unreviewed bundled code: %s', (id) => {
    expect(() => assertReviewedBundle(bundle({ [id]: {} }))).toThrow(/Unreviewed bundled package/);
  });

  it('requires the known transitive Scheduler and generated Tailwind stylesheet', () => {
    const missingScheduler = bundle();
    delete missingScheduler['index.js'].modules['C:\\repo\\node_modules\\scheduler\\index.js'];
    expect(() => assertReviewedBundle(missingScheduler)).toThrow(/scheduler/);
    const missingCSS = bundle();
    delete missingCSS['index.css'];
    expect(() => assertReviewedBundle(missingCSS)).toThrow(/stylesheet/);
  });

  it('rejects nested copies instead of assuming their versions and licenses match the root package', () => {
    expect(() => assertReviewedBundle(bundle({ '/repo/node_modules/other/node_modules/react/index.js': {} }))).toThrow(/Unreviewed bundled package location/);
  });
});
