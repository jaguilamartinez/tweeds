import { useId, type CSSProperties, type ReactNode } from 'react';
import { Button, primitiveTokens, useReveal } from '@tinker-works/ui';
import './motion-study.css';

const at = (milliseconds: number) => ({ '--tw-reveal-at': `${milliseconds}ms` }) as CSSProperties;
const typed = (label: string, milliseconds: number) => ({ ...at(milliseconds), '--tw-type-steps': label.length }) as CSSProperties;

function Crosshair({ x, y, radius = 6, delay }: { x: number; y: number; radius?: number; delay: number }) {
  return <path className="tw-register" style={at(delay)} d={`M${x - radius} ${y}h${radius * 2}M${x} ${y - radius}v${radius * 2}`} />;
}

const verbs: { name: string; title: string; description: string; drawing: ReactNode }[] = [
  {
    name: 'tw-draft', title: 'Draft',
    description: 'Lines travel their paths, guides first. Dashed and filled shapes fade in.',
    drawing: <g className="tw-draft">
      <path className="pb-motion-study__axis" d="M24 112H216M40 124V18" />
      <path className="pb-motion-study__guide" d="M52 32H204M52 72H204" />
      <path d="M56 28h64v44H56Z" />
      <path d="M66 42h36M66 52h24" />
      <path className="pb-motion-study__accent" d="M52 100C82 100 88 52 122 58S170 98 204 40" />
    </g>,
  },
  {
    name: 'tw-mark', title: 'Mark',
    description: 'A highlighter sweeps over the part under discussion, with the lines still visible.',
    drawing: <>
      <path className="tw-mark pb-motion-study__wash pb-motion-study__wash--lime" style={at(120)} d="M40 49 196 47 197 70 41 72Z" />
      <path className="tw-mark pb-motion-study__wash pb-motion-study__wash--orange" style={at(520)} d="M40 87 128 86 129 106 41 107Z" />
      <path d="M48 36H180M48 59H186M48 96H112M48 120H160" />
    </>,
  },
  {
    name: 'tw-register', title: 'Register',
    description: 'A mark turns and snaps onto its point with a small overshoot.',
    drawing: <>
      <circle className="pb-motion-study__guide" cx="120" cy="66" r="38" />
      <path className="pb-motion-study__axis" d="M120 16V116M66 66H174" />
      <Crosshair x={120} y={66} radius={10} delay={80} />
      <Crosshair x={78} y={34} delay={260} />
      <Crosshair x={162} y={98} delay={380} />
      <circle className="tw-register pb-motion-study__point" style={at(200)} cx="120" cy="66" r="3" />
    </>,
  },
  {
    name: 'tw-measure', title: 'Measure',
    description: 'A rule extends from its starting edge, and its value is noted.',
    drawing: <>
      <path className="pb-motion-study__guide" d="M40 30V112M200 30V112" />
      <path d="M40 44h160v32H40Z" />
      <g className="tw-measure" style={at(120)}><path d="M40 96H200M40 90v12M200 90v12" /></g>
      <text className="tw-type" style={typed('160 PX', 620)} x="120" y="122" textAnchor="middle">160 PX</text>
    </>,
  },
  {
    name: 'tw-type', title: 'Type',
    description: 'An annotation appears a character at a time, after its leader.',
    drawing: <>
      <path d="m52 92 30-30 30 30-30 30Z" />
      <circle className="pb-motion-study__point" cx="82" cy="92" r="3" />
      <g className="tw-draft"><path d="M82 92 136 44h64" /></g>
      <text className="tw-type" style={typed('FIG. 01', 520)} x="138" y="36">FIG. 01</text>
      <text className="tw-type pb-motion-study__note" style={typed('WIDTH 1440', 760)} x="138" y="62">WIDTH 1440</text>
    </>,
  },
  {
    name: 'tw-assemble', title: 'Assemble',
    description: 'Parts travel from the assembled stack to where they rest.',
    drawing: <>
      <path className="pb-motion-study__guide" d="M60 108V44M180 108V44" />
      {[0, 1, 2].map(layer => <g key={layer} className={`tw-assemble pb-motion-study__plate pb-motion-study__plate--${layer}`} style={at(120 + layer * 90)}>
        <path d="M60 96 120 80 180 96 120 112Z" />
        {layer === 1 && <path className="pb-motion-study__plate-mark" d="M92 96 120 89 148 96 120 103Z" />}
      </g>)}
    </>,
  },
];

function VerbSpecimen({ name, title, description, drawing }: (typeof verbs)[number]) {
  const reveal = useReveal<SVGSVGElement>({ threshold: 0.6 });
  const titleId = useId();
  return <figure>
    <svg ref={reveal.ref} viewBox="0 0 240 132" role="img" aria-labelledby={titleId} focusable="false">
      <title id={titleId}>{`${title}: ${description}`}</title>
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter">{drawing}</g>
    </svg>
    <figcaption>
      <h3>{title} <code>{name}</code></h3>
      <p>{description}</p>
      <Button className="pb-motion-replay" variant="tertiary" size="sm" onClick={reveal.replay} aria-label={`Replay ${title.toLowerCase()}`}>Replay</Button>
    </figcaption>
  </figure>;
}

/** The six drafting verbs, each on its own small sheet with a replay control. */
export function MotionVerbs() {
  return <div className="pb-motion-study">{verbs.map(verb => <VerbSpecimen key={verb.name} {...verb} />)}</div>;
}

type Point = [number, number];

/** Evaluates a CSS cubic-bezier() or linear() timing function at progress x. */
export function easingAt(easing: string, x: number): number {
  const bezier = easing.match(/^cubic-bezier\(([^)]+)\)$/);
  if (bezier) {
    const [x1, y1, x2, y2] = bezier[1].split(',').map(Number);
    const curve = (t: number, a: number, b: number) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;
    let low = 0;
    let high = 1;
    for (let step = 0; step < 32; step += 1) {
      const middle = (low + high) / 2;
      if (curve(middle, x1, x2) < x) low = middle; else high = middle;
    }
    return curve((low + high) / 2, y1, y2);
  }
  const stops = easing.match(/^linear\(([^)]+)\)$/)?.[1].split(',').map(stop => stop.trim().split(/\s+/));
  if (!stops) return x;
  const points: (number | undefined)[][] = stops.map(([value, position]) => [Number(value), position === undefined ? undefined : parseFloat(position) / 100]);
  points[0][1] ??= 0;
  points[points.length - 1][1] ??= 1;
  // Unpositioned stops are spread evenly between their positioned neighbours.
  for (let index = 1; index < points.length - 1; index += 1) {
    if (points[index][1] !== undefined) continue;
    const next = points.findIndex((point, later) => later > index && point[1] !== undefined);
    const start = points[index - 1][1]!;
    points[index][1] = start + (points[next][1]! - start) / (next - index + 1);
  }
  const resolved = points as Point[];
  const after = resolved.findIndex(([, position]) => position >= x);
  if (after <= 0) return resolved[Math.max(after, 0)][0];
  const [startValue, startPosition] = resolved[after - 1];
  const [endValue, endPosition] = resolved[after];
  return startValue + (endValue - startValue) * ((x - startPosition) / (endPosition - startPosition || 1));
}

const curves = [
  { token: 'ease', role: 'Settles a state change', duration: 'base' },
  { token: 'easePen', role: 'Draws a line', duration: 'draw' },
  { token: 'easeMark', role: 'Sweeps a highlight', duration: 'mark' },
  { token: 'easeMechanism', role: 'Springs into place', duration: 'mechanism' },
] as const;
const kebab = (value: string) => value.replace(/[A-Z]/g, char => `-${char.toLowerCase()}`);
const plotX = (x: number) => 32 + x * 180;
const plotY = (y: number) => 136 - y * 100;

function Curve({ token, role, duration }: (typeof curves)[number]) {
  const titleId = useId();
  const easing = primitiveTokens.motion[token];
  const path = Array.from({ length: 73 }, (_, index) => {
    const x = index / 72;
    return `${index ? 'L' : 'M'}${plotX(x).toFixed(1)} ${plotY(easingAt(easing, x)).toFixed(1)}`;
  }).join('');
  return <figure style={{ '--pb-plot-easing': `var(--tw-motion-${kebab(token)})` } as CSSProperties}>
    <svg viewBox="0 0 240 160" role="img" aria-labelledby={titleId} focusable="false">
      <title id={titleId}>{`The ${token} curve: progress over time.`}</title>
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path className="pb-motion-study__axis" d="M24 136H220M32 146V20" />
        <path className="pb-motion-study__guide" d="M32 36H212M212 36V136" />
        <path className="pb-motion-study__curve" d={path} />
        <g className="pb-plot-y"><path className="pb-motion-study__value" d="M216 136h12" /></g>
        <g className="pb-plot-x"><g className="pb-plot-y"><circle className="pb-motion-study__point" cx="32" cy="136" r="4" /></g></g>
      </g>
      <text x="20" y="40" textAnchor="end">1</text>
      <text x="212" y="152" textAnchor="end">t</text>
    </svg>
    <figcaption><h3><code>motion.{token}</code></h3><p>{role}. Paired with <code>motion.{duration}</code> ({primitiveTokens.motion[duration]}).</p></figcaption>
  </figure>;
}

/** Plots each easing token from the token source; a point traces the curve at the same easing. */
export function EasingCurves() {
  const reveal = useReveal<HTMLDivElement>({ threshold: 0.4 });
  return <div className="pb-easing-study">
    <div className="pb-easing-study__curves" ref={reveal.ref}>{curves.map(curve => <Curve key={curve.token} {...curve} />)}</div>
    <Button className="pb-motion-replay" variant="secondary" size="sm" onClick={reveal.replay}>Replay curves</Button>
  </div>;
}
