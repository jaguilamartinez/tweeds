import type { CSSProperties } from 'react';
import { HighlightOverlay, brandTokens, primitiveTokens, useReveal } from '@tinker-works/ui';
import { FigureStudy } from './FigureStudy';
import './brand-studies.css';

const colorLabels = { cream: 'Cream', charcoal: 'Charcoal', stone: 'Stone', signalOrange: 'Signal orange', lime: 'Lime' };
const colorUsage = Object.entries(brandTokens.colorUsage) as [keyof typeof colorLabels, string][];

const at = (milliseconds: number) => ({ '--tw-reveal-at': `${milliseconds}ms` }) as CSSProperties;

/** The bar and labels read the same brand guidance used by the token reference. Each share is measured in, largest first. */
export function ColorUsageRatio() {
  const reveal = useReveal<HTMLDivElement>({ threshold: 0.6 });
  return <figure className="pb-color-ratio">
    <div className="pb-color-ratio__bar" ref={reveal.ref} role="img" aria-label={`Color usage: ${colorUsage.map(([name, ratio]) => `${colorLabels[name]} ${ratio}`).join(', ')}`}>
      {colorUsage.map(([name, ratio], index) => <span key={name} className="tw-measure" style={{ width: ratio, background: primitiveTokens.color[name], ...at(index * 160) }} />)}
    </div>
    <figcaption><dl className="pb-color-ratio__labels">{colorUsage.map(([name, ratio]) => <div key={name}><dt>{colorLabels[name]}</dt><dd>{ratio}</dd></div>)}</dl></figcaption>
  </figure>;
}

/** Graphic patches are separate from the drawing so linework continues below them. They sweep in once the drawing is drafted. */
export function OverlayStudy() {
  const reveal = useReveal<HTMLDivElement>({ threshold: 0.4 });
  return <figure className="pb-overlay-study">
    <div className="pb-overlay-study__drawing" ref={reveal.ref}>
      <FigureStudy drafted={false} />
      <HighlightOverlay tone="lime" className="pb-overlay-study__patch pb-overlay-study__patch--lime tw-mark" style={at(1100)} aria-hidden="true" />
      <HighlightOverlay tone="orange" className="pb-overlay-study__patch pb-overlay-study__patch--orange tw-mark" style={at(1350)} aria-hidden="true" />
    </div>
    <figcaption>Lime marks a selected region. Orange follows its connection. The guides and contours remain visible beneath both.</figcaption>
  </figure>;
}
