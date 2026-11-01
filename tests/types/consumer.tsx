import { createRef } from 'react';
import {
  Button, Card, Icon, MathMark, TextField, ThemeProvider, useReveal,
  tokens as rootTokens,
  type ButtonProps, type IconName, type MathMarkSymbol, type Reveal, type Theme,
} from '@tinker-works/ui';
import {
  tokens, primitiveTokens, semanticTokens, componentTokens, brandTokens,
} from '@tinker-works/ui/tokens';

// Resolve public package exports without source aliases, JSON support, or Vite ambient types.
const theme: Theme = 'paper';
const icon: IconName = 'arrow-right';
const symbol: MathMarkSymbol = 'asterisk';
const buttonRef = createRef<HTMLButtonElement>();
const markRef = createRef<SVGSVGElement>();
const buttonProps: ButtonProps = { type: 'submit', variant: 'primary', size: 'sm' };

export const publicComposition = (
  <ThemeProvider theme={theme} motion="off" aria-label="Profile settings">
    <Card>
      <TextField label="Display name" name="displayName" required />
      <Button {...buttonProps} ref={buttonRef} icon={<Icon name={icon} />}>Save changes</Button>
      <MathMark symbol={symbol} ref={markRef} aria-describedby="mark-caption" />
    </Card>
  </ThemeProvider>
);

export function DraftedDrawing() {
  const reveal: Reveal<SVGSVGElement> = useReveal<SVGSVGElement>({ threshold: 0.5 });
  return <svg ref={reveal.ref} onClick={reveal.replay}><path className="tw-draft" d="M0 0h10" /></svg>;
}

export const tokenValues: string[] = [
  rootTokens.primitive.color.ink,
  tokens.primitive.font.logo,
  primitiveTokens.space.md,
  semanticTokens[theme].color.focus,
  componentTokens.button.heightMd,
  brandTokens.colorUsage.lime,
  primitiveTokens.motion.easeMechanism,
];

// Public literal choices must remain narrow in emitted declarations.
// @ts-expect-error Only Paper and Ink are public themes.
const unsupportedTheme: Theme = 'sepia';
// @ts-expect-error Button variants are not arbitrary strings.
const unsupportedVariant: ButtonProps = { variant: 'rainbow' };
// @ts-expect-error Motion is either automatic or off.
const unsupportedMotion = <ThemeProvider motion="slow" />;
void unsupportedMotion;
void unsupportedTheme;
void unsupportedVariant;
