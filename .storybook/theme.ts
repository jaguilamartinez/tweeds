import { create } from 'storybook/theming';
import { primitiveTokens } from '../src/tokens';

const { color, font, radius } = primitiveTokens;
// The manager loads these faces itself; see manager-head.html.
const ui = font.ui.replace(/'/g, '"');
const mono = font.mono.replace(/'/g, '"');
const wordmark = (ink: string) => `<span style="font:400 32px/1 'Instrument Serif', Georgia, serif;letter-spacing:-0.01em;color:${ink}">Tweeds</span>`;

const shared = {
  brandUrl: './',
  brandTarget: '_self',
  fontBase: ui,
  fontCode: mono,
  appBorderRadius: parseInt(radius.sm, 10),
  inputBorderRadius: parseInt(radius.sm, 10),
  colorPrimary: color.signalOrange,
} as const;

/** Paper: a soft white sheet, ink text, orange for the item under discussion. */
export const paperTheme = create({
  ...shared,
  base: 'light',
  brandTitle: wordmark(color.ink),
  colorSecondary: color.ink,
  appBg: color.paper,
  appContentBg: color.paper,
  appPreviewBg: color.paper,
  appBorderColor: color.paperLine,
  appHoverBg: color.paperWhite,
  textColor: color.ink,
  textInverseColor: color.paper,
  textMutedColor: color.paperMuted,
  barBg: color.paperWhite,
  barTextColor: color.paperMuted,
  barHoverColor: color.ink,
  barSelectedColor: color.signalOrange,
  buttonBg: color.paperWhite,
  buttonBorder: color.paperBorder,
  booleanBg: color.paper,
  booleanSelectedBg: color.paperWhite,
  inputBg: color.paperWhite,
  inputBorder: color.paperBorder,
  inputTextColor: color.ink,
});

/** Ink, the default: paper-colored text on blue-black ink, with lime for keyboard focus. */
export const inkTheme = create({
  ...shared,
  base: 'dark',
  brandTitle: wordmark(color.paper),
  colorSecondary: color.lime,
  appBg: color.ink,
  appContentBg: color.ink,
  appPreviewBg: color.ink,
  appBorderColor: color.inkLine,
  appHoverBg: color.inkSurface,
  textColor: color.paper,
  textInverseColor: color.ink,
  textMutedColor: color.inkMuted,
  barBg: color.inkSurface,
  barTextColor: color.inkMuted,
  barHoverColor: color.paper,
  barSelectedColor: color.signalOrange,
  buttonBg: color.inkSurface,
  buttonBorder: color.inkBorder,
  booleanBg: color.ink,
  booleanSelectedBg: color.inkSurface,
  inputBg: color.inkSurface,
  inputBorder: color.inkBorder,
  inputTextColor: color.paper,
});
