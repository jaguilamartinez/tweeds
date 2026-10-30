import { describe, expect, it } from 'vitest';
import { flattenTokenEntries, resolveTokenValue } from '../../example/token-reference';

describe('documentation token references', () => {
  it('preserves paths, source values, and optional layer prefixes', () => {
    const source = { color: { text: '{primitive.charcoal}' }, gap: '8px' };
    expect(flattenTokenEntries(source, 'semantic.paper')).toEqual([
      { path: 'semantic.paper.color.text', value: '{primitive.charcoal}' },
      { path: 'semantic.paper.gap', value: '8px' },
    ]);
  });

  it('resolves chained references while preserving literal and composite values', () => {
    const source = { primitive: { charcoal: '#1F1F1F' }, semantic: { text: '{primitive.charcoal}' } };
    expect(resolveTokenValue('{semantic.text}', source)).toBe('#1F1F1F');
    expect(resolveTokenValue('8px', source)).toBe('8px');
    expect(resolveTokenValue('1px solid {semantic.text}', source)).toBe('1px solid {semantic.text}');
  });

  it('identifies missing references and does not resolve inherited properties', () => {
    const source = Object.assign(Object.create({ inherited: '#fff' }), { color: '#1F1F1F' });
    expect(resolveTokenValue('{unknown.color}', source)).toContain('Missing token: unknown.color');
    expect(resolveTokenValue('{inherited}', source)).toContain('Missing token: inherited');
  });

  it('reports direct and indirect cycles without recursing indefinitely', () => {
    expect(resolveTokenValue('{a}', { a: '{a}' })).toContain('Circular token reference: a → a');
    expect(resolveTokenValue('{a}', { a: '{b}', b: '{a}' })).toContain('Circular token reference: a → b → a');
  });

  it('distinguishes a group from a usable token value', () => {
    expect(resolveTokenValue('{color}', { color: { cream: '#F7F3EA' } })).toContain('Invalid token value: color');
  });
});
