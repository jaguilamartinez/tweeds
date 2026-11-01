import { create } from 'storybook/theming';
import { primitiveTokens } from '../src/tokens';

const { color, font, radius } = primitiveTokens;
// The manager loads these faces itself; see manager-head.html.
const ui = font.ui.replace(/'/g, '"');
const mono = font.mono.replace(/'/g, '"');
const wordmark = (ink: string) => `<span style="font:400 32px/1 'DM Serif Display', Georgia, serif;letter-spacing:-0.018em;color:${ink}">Tweeds</span>`;

const shared = {
  brandUrl: './',
  brandTarget: '_self',
  fontBase: ui,
  fontCode: mono,
  appBorderRadius: parseInt(radius.sm, 10),
  inputBorderRadius: parseInt(radius.sm, 10),
  colorPrimary: color.signalOrange,
} as const;

/** Paper: cream sheets, charcoal ink, orange for the item under discussion. */
export const paperTheme = create({
  ...shared,
  base: 'light',
  brandTitle: wordmark(color.charcoal),
  colorSecondary: color.charcoal,
  appBg: color.cream,
  appContentBg: color.cream,
  appPreviewBg: color.cream,
  appBorderColor: color.paperLine,
  appHoverBg: color.paperWhite,
  textColor: color.charcoal,
  textInverseColor: color.cream,
  textMutedColor: color.paperMuted,
  barBg: color.paperWhite,
  barTextColor: color.paperMuted,
  barHoverColor: color.charcoal,
  barSelectedColor: color.signalOrange,
  buttonBg: color.paperWhite,
  buttonBorder: color.paperBorder,
  booleanBg: color.cream,
  booleanSelectedBg: color.paperWhite,
  inputBg: color.paperWhite,
  inputBorder: color.paperBorder,
  inputTextColor: color.charcoal,
});

/** Ink: the same structure on charcoal, with lime for keyboard focus. */
export const inkTheme = create({
  ...shared,
  base: 'dark',
  brandTitle: wordmark(color.cream),
  colorSecondary: color.lime,
  appBg: color.charcoal,
  appContentBg: color.charcoal,
  appPreviewBg: color.charcoal,
  appBorderColor: color.inkLine,
  appHoverBg: color.inkSurface,
  textColor: color.cream,
  textInverseColor: color.charcoal,
  textMutedColor: color.inkMuted,
  barBg: color.inkSurface,
  barTextColor: color.inkMuted,
  barHoverColor: color.cream,
  barSelectedColor: color.signalOrange,
  buttonBg: color.inkSurface,
  buttonBorder: color.inkBorder,
  booleanBg: color.charcoal,
  booleanSelectedBg: color.inkSurface,
  inputBg: color.inkSurface,
  inputBorder: color.inkBorder,
  inputTextColor: color.cream,
});
