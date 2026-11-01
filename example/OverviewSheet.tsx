import { useRef, type CSSProperties } from 'react';
import { Icon, brandTokens, primitiveTokens, useReveal } from '@tinker-works/ui';
import { BrandGeometry } from './BrandGeometry';
import { usePointerField } from './DraftingSheet';
import { TweedsLogo } from './TweedsLogo';
import './overview-sheet.css';

const family = (stack: string) => stack.split(',')[0].replace(/['"]/g, '').trim();
const typefaces = [
  { name: family(primitiveTokens.font.display), className: 'pb-title-block__serif' },
  { name: family(primitiveTokens.font.ui), className: 'pb-title-block__sans' },
  { name: family(primitiveTokens.font.mono), className: 'pb-title-block__mono' },
];
const proportions = Object.entries(brandTokens.colorUsage) as [keyof typeof brandTokens.colorUsage, string][];
const colorNames: Record<keyof typeof brandTokens.colorUsage, string> = { cream: 'cream', charcoal: 'charcoal', stone: 'stone', signalOrange: 'signal orange', lime: 'lime' };
const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
const at = (milliseconds: number) => ({ '--tw-reveal-at': `${milliseconds}ms` }) as CSSProperties;
const typed = (label: string, milliseconds: number) => ({ ...at(milliseconds), '--tw-type-steps': label.length }) as CSSProperties;

/** The sheet's title block: the identity, its typefaces, color proportions, and themes. */
function TitleBlock() {
  const reveal = useReveal<HTMLDivElement>();
  return <div className="pb-title-block" ref={reveal.ref}>
    <span className="pb-title-block__rule tw-measure" style={at(1200)} aria-hidden="true" />
    <div className="pb-title-block__cell pb-title-block__cell--title">
      <span className="pb-title-block__label tw-type" style={typed('Title', 1500)} aria-hidden="true">Title</span>
      <h1 id="overview-title">
        <span className="tw-sr-only">Tweeds — Tinker Works Design System</span>
        <TweedsLogo withDescriptor aria-hidden="true" />
      </h1>
    </div>
    <dl className="pb-title-block__fields">
      <div className="pb-title-block__cell">
        <dt className="pb-title-block__label tw-type" style={typed('Type', 1580)}>Type</dt>
        <dd className="pb-title-block__typefaces">{typefaces.map(({ name, className }) => <span key={name} className={className}>{name}</span>)}</dd>
      </div>
      <div className="pb-title-block__cell">
        <dt className="pb-title-block__label tw-type" style={typed('Color', 1660)}>Color</dt>
        <dd>
          <span className="pb-proportion tw-measure" style={at(1700)} role="img"
            aria-label={proportions.map(([name, share]) => `${colorNames[name]} ${share}`).join(', ')}>
            {proportions.map(([name, share]) => <span key={name} style={{ flexBasis: share, background: primitiveTokens.color[name] }} />)}
          </span>
          <span className="pb-proportion-legend" aria-hidden="true">{proportions.map(([, share]) => parseInt(share, 10)).join(' · ')}</span>
        </dd>
      </div>
      <div className="pb-title-block__cell">
        <dt className="pb-title-block__label tw-type" style={typed('Themes', 1740)}>Themes</dt>
        <dd className="pb-title-block__themes"><span className="pb-theme-chip pb-theme-chip--paper">Paper</span><span className="pb-theme-chip pb-theme-chip--ink">Ink</span></dd>
      </div>
    </dl>
  </div>;
}

export interface OverviewSheetProps {
  /** The next step from the sheet, such as browsing components. */
  action: { label: string; href: string; target?: string };
}

/** The opening sheet: the brand statement beside a drawing that drafts itself, framed as a drawing sheet. */
export function OverviewSheet({ action }: OverviewSheetProps) {
  const stage = useRef<HTMLElement>(null);
  const marks = useReveal<HTMLDivElement>();
  const copy = useReveal<HTMLDivElement>();
  const label = useReveal<HTMLDivElement>();
  usePointerField(stage, { tilt: true });
  return <section className="pb-hero" ref={stage} aria-labelledby="overview-title">
    <div className="pb-hero-field" aria-hidden="true" />
    <div className="pb-hero-guides" aria-hidden="true" />
    <div className="pb-hero-marks" ref={marks.ref} aria-hidden="true">
      {corners.map((corner, index) => <Icon key={corner} name="crosshair" size={20} className={`pb-hero-mark pb-hero-mark--${corner} tw-register`} style={at(200 + index * 90)} />)}
    </div>
    <div className="pb-hero-copy" ref={copy.ref}>
      <p className="pb-hero-statement">
        <span className="pb-hero-line"><span className="tw-assemble" style={at(80)}>From curiosity</span></span>{' '}
        <span className="pb-hero-line pb-hero-line--accent">
          <em className="tw-assemble" style={at(200)}>to real things.</em>
          <svg className="pb-hero-underline" viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path className="tw-draft" style={at(950)} d="M 3 13 C 70 8 170 5 280 8 S 372 14 397 10" />
            <path className="tw-draft pb-hero-underline__second" style={at(1150)} d="M 46 19 C 140 15 250 14 352 17" />
          </svg>
        </span>
      </p>
      <p className="pb-hero-lede tw-assemble" style={at(520)}>Styles, components, and guidance for Tinker Works websites and applications.</p>
      <a className="pb-hero-action tw-assemble" style={at(640)} href={action.href} target={action.target}>{action.label} <Icon name="arrow-right" size={18} /></a>
    </div>
    <div className="pb-hero-art">
      <div className="pb-hero-figure-label" ref={label.ref} aria-hidden="true">
        <span className="tw-type" style={typed('FIG. 00', 300)}>FIG. 00</span>
        <span className="pb-hero-figure-rule tw-measure" style={at(420)} />
        <span className="tw-type" style={typed('The interface, opened up', 700)}>The interface, opened up</span>
      </div>
      <BrandGeometry
        variant="overview"
        className="pb-overview-geometry"
        title="Layout, content, and interaction layers of an interface"
        framing="tight"
        interactive
        field={false}
      />
    </div>
    <TitleBlock />
  </section>;
}
