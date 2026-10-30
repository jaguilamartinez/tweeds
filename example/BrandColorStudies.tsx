import { HighlightOverlay, brandTokens, primitiveTokens } from '@tinker-works/ui';
import { FigureStudy } from './FigureStudy';
import './brand-studies.css';

const colorLabels = { cream: 'Cream', charcoal: 'Charcoal', stone: 'Stone', signalOrange: 'Signal orange', lime: 'Lime' };
const colorUsage = Object.entries(brandTokens.colorUsage) as [keyof typeof colorLabels, string][];

/** The bar and labels read the same brand guidance used by the token reference. */
export function ColorUsageRatio() {
  return <figure className="pb-color-ratio">
    <div className="pb-color-ratio__bar" role="img" aria-label={`Color usage: ${colorUsage.map(([name, ratio]) => `${colorLabels[name]} ${ratio}`).join(', ')}`}>
      {colorUsage.map(([name, ratio]) => <span key={name} style={{ width: ratio, background: primitiveTokens.color[name] }} />)}
    </div>
    <figcaption><dl className="pb-color-ratio__labels">{colorUsage.map(([name, ratio]) => <div key={name}><dt>{colorLabels[name]}</dt><dd>{ratio}</dd></div>)}</dl></figcaption>
  </figure>;
}

/** Graphic patches are separate from the drawing so linework continues below them. */
export function OverlayStudy() {
  return <figure className="pb-overlay-study">
    <div className="pb-overlay-study__drawing">
      <FigureStudy />
      <HighlightOverlay tone="lime" className="pb-overlay-study__patch pb-overlay-study__patch--lime" aria-hidden="true" />
      <HighlightOverlay tone="orange" className="pb-overlay-study__patch pb-overlay-study__patch--orange" aria-hidden="true" />
    </div>
    <figcaption>Lime marks a selected region. Orange follows its connection. The guides and contours remain visible beneath both.</figcaption>
  </figure>;
}
