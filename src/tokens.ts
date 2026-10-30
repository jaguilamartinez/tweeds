import tokenSource from './tokens.json';
export const tokens = tokenSource;
export const primitiveTokens = tokens.primitive;
export const semanticTokens = tokens.semantic;
export const componentTokens = tokens.component;
export const brandTokens = tokens.brand;
export type Theme = keyof typeof semanticTokens;
