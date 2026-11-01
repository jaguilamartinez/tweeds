import { useId, useState, type CSSProperties } from 'react';
import { Icon, useReveal } from '@tinker-works/ui';
import './geometry.css';

export interface BrandGeometryProps {
  variant?: 'overview' | 'specimen';
  className?: string;
  /** Omit when the drawing is decorative. */
  title?: string;
  caption?: string;
  /** Trim unused canvas space beneath a compact drawing. */
  framing?: 'standard' | 'tight';
  /** Offers a manual comparison of the interface layers. */
  interactive?: boolean;
  /** Draws the grid field behind the artwork. Turn off when the page supplies its own. */
  field?: boolean;
}

const layoutRows = [48, 68, 88, 108];
const columnGuides = [58, 112, 168, 232];
const interfaceProjection = 'matrix(1 -.22 .48 .72 66 210)';

function Crosshair({ x, y, small = false }: { x: number; y: number; small?: boolean }) {
  const radius = small ? 4 : 7;
  return <path d={`M ${x - radius} ${y} h ${radius * 2} M ${x} ${y - radius} v ${radius * 2}`} className="pb-geometry-register tw-register" />;
}

function Leader({ d, label, x, y, note = false }: { d: string; label: string; x: number; y: number; note?: boolean }) {
  return <g className="pb-geometry-note"><path d={d} className="pb-geometry-leader" /><text x={x} y={y} className={`${note ? 'pb-geometry-handnote' : 'pb-geometry-label'} tw-type`} style={{ '--tw-type-steps': label.length } as CSSProperties}>{label}</text></g>;
}

/** Local coordinates follow the same canvas so the separated layers can reunite. */
function LayoutLayer() {
  return <g className="pb-geometry-layout tw-draft">
    <path d="M -.7 1.1 127 -1.2 254 .4 253.2 155.8 121 157 -.2 155 Z" className="pb-geometry-sheet" />
    <path d="M -2 3 126 .7 255.7 2 M 255 7 256 154 169 158" className="pb-geometry-second-pass" />
    <path d="M 0 25.5 Q 127 24 254 25 M 45 26 44.6 155 M 45 138 253 138" />
    {columnGuides.map(x => <path key={x} d={`M ${x} 32 v 100`} className="pb-geometry-construction" />)}
    <path d="M 58 42 H 232 M 58 130 H 232" className="pb-geometry-construction" />
    <path d="M 13 13.1 33 12.7 M 198 12 H 216 M 226 12 H 242" className="pb-geometry-ink" />
    {layoutRows.map((y, index) => <path key={y} d={`M 11 ${y} q 11 -1 ${index === 1 ? 18 : 24} .1`} className={index === 1 ? 'pb-geometry-ink' : undefined} />)}
    <path d="M 9 63 Q 23 59 37 62 L 38 73 9 74 Z" className="pb-geometry-selection" />
    <path d="M 62 147 H 80 M 211 147 H 231" />
    <path d="M 4 164 245 163 M 63 35 64 133 M 57 38 69 38 M 58 130 70 130" className="pb-geometry-axis" />
  </g>;
}

function ContentLayer() {
  return <g className="pb-geometry-content tw-draft">
    <path d="M 58 36 Q 142 34.9 232 36.4 L 231.6 138 Q 148 139.3 57.7 137.5 Z" className="pb-geometry-sheet" />
    <path d="M 60 34.2 171 33.4 234 35 M 234 39 233.6 136 171 140" className="pb-geometry-second-pass" />
    <path d="M 55 37 137 33 233 37 235 61 148 59 56 62 Z" className="pb-geometry-marker pb-geometry-marker--lime tw-mark" />
    <path d="M 58 61 Q 141 59.7 232 61" />
    <path d="M 73 47 Q 111 45.8 155 47 M 74 50 130 49.7" className="pb-geometry-highlight-ink" />
    <path d="M 74 77 Q 112 76.3 155 77.1 M 74 82.1 Q 106 81 142 82" className="pb-geometry-ink" />
    <path d="M 74 94 153 93.6 M 74 100 148 100.4 M 74 106 135 105.6 M 74 119 108 118.6" />
    <path d="M 171 73 216 72.6 216.4 121 171 121.5 Z" />
    <path d="M 177 113 C 184 106 180 91 190 97 S 205 104 212 82" className="pb-geometry-ink" />
    <path d="M 178 78 v 37 h 33 M 171 125 215 125" className="pb-geometry-construction" />
    <path d="M 206 84 q 7 -5 12 -3 l -2 7" />
    <path d="M 62 129 71 137 M 69 129 78 137 M 76 129 85 137 M 83 129 92 137" className="pb-geometry-hatch" />
    <Crosshair x={58} y={36} small /><Crosshair x={232} y={138} small />
  </g>;
}

function InteractionLayer() {
  return <g className="pb-geometry-interaction tw-draft">
    <path d="M 75 108 Q 112 105.7 155 107 L 156.5 129 116 132 73 130 Z" className="pb-geometry-marker pb-geometry-marker--orange tw-mark" />
    <path d="M 74 109 155 108.4 155.5 129.6 74 130 Z" className="pb-geometry-ink" />
    <path d="M 86 119 125 118.7 M 137 115 143 119 137 123 M 130 119 h 13" className="pb-geometry-button-ink" />
    <path d="M 61 104 Q 110 98 165 103 M 165 104 168 131 M 163 137 Q 113 143 66 137 M 65 134 61 108" className="pb-geometry-exploration" />
    <path d="M 173 98 174 72 193 90 183 90 178 101 Z" className="pb-geometry-cursor" />
    <path d="M 178 56 v -9 M 190 60 l 7 -6 M 199 72 h 9" className="pb-geometry-ink" />
  </g>;
}

function InterfaceStudy() {
  return <g className="pb-geometry-lines tw-draft">
    <path d="M 45 345 Q 238 346 435 344 M 322 54 322 358" className="pb-geometry-axis" />
    <path d="M 64 211 320 154 396 266 141 324 Z M 67 206 325 151" className="pb-geometry-construction" />
    <path d="M 66 210 v -115 M 320 154 V 39 M 395 266 v -115 M 141 322 v -115" className="pb-geometry-projection" />
    <g className="pb-geometry-base"><g transform={interfaceProjection}><LayoutLayer /></g></g>
    <g className="pb-geometry-layer pb-geometry-layer--content tw-assemble"><g transform={interfaceProjection}><ContentLayer /></g></g>
    <g className="pb-geometry-layer pb-geometry-layer--interaction tw-assemble"><g transform={interfaceProjection}><InteractionLayer /></g></g>
    <g className="pb-geometry-separated-notes tw-draft">
      <path d="M 116 220 v -46 M 343 213 v -46" className="pb-geometry-projection" />
      <Leader d="M 107 281 72 299 39 299" x={16} y={322} label="layout" />
      <Leader d="M 338 183 402 138 456 138" x={403} y={127} label="content" />
      <Leader d="M 214 127 150 91 70 91" x={24} y={75} label="interaction" />
    </g>
    <path d="M 141 340 395 284 M 139 335 l 4 10 M 393 279 l 4 10" className="pb-geometry-dimension" />
    <Crosshair x={66} y={210} /><Crosshair x={395} y={266} /><Crosshair x={322} y={54} small />
  </g>;
}

function ContentDetail() {
  return <g className="pb-geometry-lines pb-geometry-detail tw-draft" transform="translate(648 115)">
    <text x="-4" y="-30" className="pb-geometry-label tw-type" style={{ '--tw-type-steps': 14 } as CSSProperties}>CONTENT DETAIL</text>
    <path d="M 1 1 191 -.5 192 182 0 181 Z" className="pb-geometry-sheet" />
    <path d="M -3 -1 143 -2 194 0 M 194 4 194 184 121 185" className="pb-geometry-second-pass" />
    <path d="M -3 1 191 -2 193 32 74 34 -2 32 Z" className="pb-geometry-marker pb-geometry-marker--lime tw-mark" />
    <path d="M 0 32 H 192 M 16 17 H 99" className="pb-geometry-highlight-ink" />
    <path d="M 16 57 Q 69 55.7 118 56 M 16 66 92 65.3" className="pb-geometry-ink" />
    <path d="M 16 84 103 83.6 M 16 92 108 92.3 M 16 100 89 99.8" />
    <path d="M 130 53 174 52.7 175 113 130 114 Z M 136 107 C 139 92 151 106 155 83 S 169 94 170 67" />
    <path d="M 14 133 98 131.5 100 155 15 157 Z" className="pb-geometry-marker pb-geometry-marker--orange tw-mark" />
    <path d="M 16 133 H 98 V 156 H 16 Z M 27 144 H 67 M 79 140 l 5 4 -5 4" className="pb-geometry-ink" />
    <path d="M 16 -12 V 197 M 175 -12 V 197" className="pb-geometry-axis" />
    <path d="M 0 204 H 192 M 0 199 V 209 M 192 199 V 209" className="pb-geometry-dimension" />
    <text x="96" y="227" textAnchor="middle" className="pb-geometry-label tw-type" style={{ '--tw-type-steps': 16 } as CSSProperties}>keep the margins</text>
    <path d="M 58 170 Q 83 167 103 171 M 61 174 Q 80 171 99 174" className="pb-geometry-pen-note" />
    <Crosshair x={0} y={0} /><Crosshair x={192} y={182} />
  </g>;
}

function Drawing({ id, wide, title, compactHeight = 398, field }: { id: string; wide: boolean; title?: string; compactHeight?: number; field: boolean }) {
  const gridId = `${id}-grid`;
  const titleId = `${id}-title`;
  const reveal = useReveal<SVGSVGElement>();
  return <svg
    ref={reveal.ref}
    id={id}
    className={`pb-geometry-drawing pb-geometry-drawing--${wide ? 'wide' : 'compact'}`}
    viewBox={wide ? '0 0 900 480' : `0 0 520 ${compactHeight}`}
    role={title ? 'img' : undefined}
    aria-hidden={title ? undefined : true}
    aria-labelledby={title ? titleId : undefined}
    focusable="false"
  >
    {title && <title id={titleId}>{title}</title>}
    <defs>
      <pattern id={gridId} width="22" height="22" patternUnits="userSpaceOnUse"><path d="M 22 0 H 0 V 22" className="pb-geometry-grid-line" /></pattern>
    </defs>
    {field && <rect x="20" y="26" width={wide ? 860 : 480} height={wide ? 382 : 325} fill={`url(#${gridId})`} className="tw-draft" />}
    {wide && <g className="pb-geometry-lines tw-draft"><text x="34" y="37" className="pb-geometry-label tw-type" style={{ '--tw-type-steps': 23 } as CSSProperties}>INTERFACE / LAYER STUDY</text><path d="M 34 50 H 864 M 607 77 V 383" className="pb-geometry-divider" /></g>}
    <g transform={wide ? 'translate(7 52) scale(1.12)' : undefined}><InterfaceStudy /></g>
    {wide && <ContentDetail />}
  </svg>;
}

/** Authored playbook artwork. It is not a public component or application model. */
export function BrandGeometry({ variant = 'overview', className, title, caption, framing = 'standard', interactive = variant === 'specimen', field = true }: BrandGeometryProps) {
  const id = useId().replace(/:/g, '');
  const [separated, setSeparated] = useState(true);
  return <figure className={['pb-geometry', `pb-geometry--${variant}`, className].filter(Boolean).join(' ')} data-layer-view={separated ? 'separated' : 'assembled'}>
    {variant === 'specimen' && <Drawing id={`${id}-wide`} wide title={title} field={field} />}
    <Drawing id={`${id}-compact`} wide={false} title={title} compactHeight={framing === 'tight' ? 370 : 398} field={field} />
    {(caption || interactive) && <figcaption>
      {caption && <span>{caption}</span>}
      {interactive && <button type="button" className="pb-geometry-toggle" aria-controls={variant === 'specimen' ? `${id}-wide ${id}-compact` : `${id}-compact`} onClick={() => setSeparated(value => !value)}>{separated ? 'Assemble layers' : 'Separate layers'}<Icon name="layers" size={18} /></button>}
      {interactive && <span className="pb-geometry-status" role="status">{separated ? 'Layout, content, and interaction are shown apart.' : 'Interface layers are shown together.'}</span>}
    </figcaption>}
  </figure>;
}
