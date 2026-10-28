import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const hash = (text) => createHash('sha256').update(text.replaceAll('\r\n', '\n')).digest('hex');
const reactLicense = 'da6d3703ed11cbe42bd212c725957c98da23cbff1998c05fa4b3d976d1a58e93';

// Fingerprints require an explicit review when upstream license wording changes.
export const reviewedPackages = {
  'react': reactLicense,
  'react-dom': reactLicense,
  'scheduler': reactLicense,
  'lucide-react': '1e7290b35280a048667bbf0ebabac1c7fd52a75300e8b2946ac165715997f2bc',
  'tailwindcss': '60e0b68c0f35c078eef3a5d29419d0b03ff84ec1df9c3f9d6e39a519a5ae7985',
  'vite': 'a77a1c089806b39ad339535bdf3677f636c91d96693e8ad7b11fe733f650ea64',
};

const licenseFile = (name) => name === 'vite' ? 'LICENSE.md' : 'LICENSE';
const virtualRuntime = new Set(['\0vite/modulepreload-polyfill.js', '\0commonjsHelpers.js']);

export function distributionNotices() {
  const lock = JSON.parse(read('package-lock.json'));
  const sections = Object.entries(reviewedPackages).map(([name, fingerprint]) => {
    const path = `node_modules/${name}`;
    const installed = JSON.parse(read(`${path}/package.json`));
    const locked = lock.packages[path];
    if (!locked || installed.version !== locked.version || installed.license !== locked.license) {
      throw new Error(`License inventory differs from lockfile: ${name}`);
    }
    const license = read(`${path}/${licenseFile(name)}`);
    if (hash(license) !== fingerprint) throw new Error(`Unreviewed license text: ${name}`);
    return `${name}@${installed.version} (${installed.license})\n${'='.repeat(72)}\n${license}`;
  });
  const projectLicense = read('LICENSE');
  const featherLicense = read('scripts/licenses/feather-LICENSE.txt');
  if (hash(featherLicense) !== '308028e93fcf84972523cdf6e616f73168546b4953895f516d01287f16fe7bee') {
    throw new Error('Unreviewed supplementary Feather license text');
  }
  return {
    'LICENSE.txt': projectLicense,
    'THIRD_PARTY_NOTICES.txt': [
      'רישיונות והודעות זכויות יוצרים',
      'רישיון הפרויקט והנוסחים המקוריים של רישיונות הרכיבים מובאים להלן.',
      `Retirator (MIT)\n${'='.repeat(72)}\n${projectLicense}`,
      ...sections,
      'Feather-origin portions of Lucide: supplementary upstream MIT notice',
      'Source: https://github.com/feathericons/feather/blob/v4.29.2/LICENSE',
      'Lucide’s packaged ISC notice above retains its own Feather attribution.',
      featherLicense,
    ].join('\n\n'),
  };
}

export function assertReviewedBundle(bundle) {
  const bundled = new Set();
  for (const output of Object.values(bundle)) {
    if (output.type !== 'chunk') continue;
    for (const id of Object.keys(output.modules)) {
      if (virtualRuntime.has(id)) continue;
      const path = id.replaceAll('\\', '/').replace(/^\0/, '').split('?')[0];
      const matches = [...path.matchAll(/(?:^|\/)node_modules\/((?:@[^/]+\/)?[^/]+)/g)];
      const name = matches.at(-1)?.[1];
      if (id.startsWith('\0') && (!name || !/\?commonjs-(?:module|exports|es-import)$/.test(id))) {
        throw new Error(`Unreviewed virtual runtime module: ${JSON.stringify(id)}`);
      }
      if (!name) continue;
      if (!Object.hasOwn(reviewedPackages, name)) throw new Error(`Unreviewed bundled package: ${name}`);
      if (matches.length !== 1) throw new Error(`Unreviewed bundled package location: ${path}`);
      bundled.add(name);
    }
  }
  for (const name of ['react', 'react-dom', 'scheduler', 'lucide-react']) {
    if (!bundled.has(name)) throw new Error(`Expected production package missing from bundle: ${name}`);
  }
  // Tailwind contributes CSS, whose upstream banner can be removed by minification.
  const css = Object.values(bundle).filter((output) => output.type === 'asset' && output.fileName.endsWith('.css'));
  if (!css.some((output) => String(output.source).trim())) {
    throw new Error('Expected production stylesheet missing from bundle');
  }
}

export function productionLicenses() {
  return {
    name: 'production-licenses',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      assertReviewedBundle(bundle);
      for (const [fileName, source] of Object.entries(distributionNotices())) {
        this.emitFile({ type: 'asset', fileName, source });
      }
    },
  };
}

export function checkDistribution(directory = resolve(root, 'dist')) {
  for (const [fileName, expected] of Object.entries(distributionNotices())) {
    const actual = readFileSync(resolve(directory, fileName), 'utf8');
    if (actual !== expected) throw new Error(`Production license artifact is missing or altered: ${fileName}`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  checkDistribution();
  console.log('Production license artifacts match the reviewed installed-package notices.');
}
