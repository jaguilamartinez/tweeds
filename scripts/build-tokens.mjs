import { readFile, writeFile, mkdir } from 'node:fs/promises';
const tokens = JSON.parse(await readFile(new URL('../src/tokens.json', import.meta.url), 'utf8'));
function resolve(value, seen = new Set()) {
  if (typeof value !== 'string') throw new Error('Token leaves must be strings');
  const match = value.match(/^\{(.+)\}$/);
  if (!match) return value;
  if (seen.has(match[1])) throw new Error(`Circular token: ${match[1]}`);
  const target = match[1].split('.').reduce((obj, key) => obj?.[key], tokens);
  if (target === undefined) throw new Error(`Unknown token: ${match[1]}`);
  return resolve(target, new Set([...seen, match[1]]));
}
const kebab = value => value.replace(/[A-Z]/g, char => `-${char.toLowerCase()}`);
function flatten(object, path = []) {
  return Object.entries(object).flatMap(([key, value]) => typeof value === 'object' ? flatten(value, [...path, key]) : [[...path, key].map(kebab).join('-') + ': ' + resolve(value)]);
}
const block = (selector, data) => `${selector} {\n${flatten(data).map(value => `  --tw-${value};`).join('\n')}\n}`;
const css = `/* Generated from src/tokens.json. Run pnpm tokens:build. */\n${block(':root, [data-tw-theme]', tokens.primitive)}\n${block(':root, [data-tw-theme="paper"]', tokens.semantic.paper)}\n${block('[data-tw-theme="ink"]', tokens.semantic.ink)}\n${block(':root, [data-tw-theme]', tokens.component)}\n${block(':root, [data-tw-theme]', { brand: tokens.brand })}\n[data-tw-theme="paper"] { color-scheme: light; }\n[data-tw-theme="ink"] { color-scheme: dark; }\n`;
await mkdir(new URL('../src/styles/', import.meta.url), { recursive: true });
await writeFile(new URL('../src/styles/tokens.css', import.meta.url), css);
console.log('Generated design tokens.');
