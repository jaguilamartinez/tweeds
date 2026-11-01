import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
await mkdir(new URL('dist/assets/', root), { recursive: true });
await copyFile(new URL('src/tokens.json', root), new URL('dist/tokens.json', root));
const files = [
  ['instrument-serif', 'instrument-serif-latin-400-normal.woff2'],
  ['instrument-serif', 'instrument-serif-latin-400-italic.woff2'],
  ['instrument-sans', 'instrument-sans-latin-400-normal.woff2'],
  ['instrument-sans', 'instrument-sans-latin-500-normal.woff2'],
  ['instrument-sans', 'instrument-sans-latin-600-normal.woff2'],
  ['ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff2'],
];
for (const [family, file] of files) await copyFile(new URL(`node_modules/@fontsource/${family}/files/${file}`, root), new URL(`dist/assets/${file}`, root));
for (const family of new Set(files.map(([name]) => name))) await copyFile(new URL(`node_modules/@fontsource/${family}/LICENSE`, root), new URL(`dist/assets/${family}-LICENSE.txt`, root));
let css = await readFile(new URL('src/styles/fonts.css', root), 'utf8');
css = css.replaceAll(/\.\.\/\.\.\/node_modules\/@fontsource\/[^/]+\/files\//g, './assets/');
await writeFile(new URL('dist/fonts.css', root), css);
console.log('Copied local fonts, licenses and token source.');
