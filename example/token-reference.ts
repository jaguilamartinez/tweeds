export interface TokenEntry {
  path: string;
  value: string;
}

/** Flatten the exported JSON for the playbook and Storybook reference tables. */
export function flattenTokenEntries(value: unknown, prefix = ''): TokenEntry[] {
  if (value === undefined) return [];
  if (value === null || typeof value !== 'object') return [{ path: prefix, value: String(value) }];
  return Object.entries(value).flatMap(([key, child]) => flattenTokenEntries(child, prefix ? `${prefix}.${key}` : key));
}

function tokenAtPath(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value === null || typeof value !== 'object' || !Object.hasOwn(value, key)) return undefined;
    return (value as Record<string, unknown>)[key];
  }, source);
}

/** Resolve display values without crashing the reference if an authored link is invalid. */
export function resolveTokenValue(value: string, source: unknown): string {
  const references: string[] = [];
  let resolved = value;
  let reference = resolved.match(/^\{(.+)\}$/)?.[1];
  while (reference) {
    if (references.includes(reference)) return `[Circular token reference: ${[...references, reference].join(' → ')}]`;
    references.push(reference);
    const target = tokenAtPath(source, reference);
    if (target === undefined) return `[Missing token: ${reference}]`;
    if (target === null || typeof target === 'object') return `[Invalid token value: ${reference}]`;
    resolved = String(target);
    reference = resolved.match(/^\{(.+)\}$/)?.[1];
  }
  return resolved;
}
