import { useId, type CSSProperties, type ReactNode } from 'react';
import { useReveal } from '@tinker-works/ui';
import './visual-elements.css';

function Crosshair({ x, y, radius = 8 }: { x: number; y: number; radius?: number }) {
  return <path d={`M${x - radius} ${y}h${radius * 2}M${x} ${y - radius}v${radius * 2}`} />;
}

const studies: { name: string; description: string; drawing: ReactNode }[] = [
  {
    name: 'Axes',
    description: 'Give a drawing an origin and show its direction.',
    drawing: <>
      <path d="M30 111H210M69 133V25" className="pb-visual-elements__guide" />
      <path d="M69 111H198M69 111V37M192 105l6 6-6 6M63 43l6-6 6 6" />
      <path d="M101 107v8m32-8v8m32-8v8M65 79h8m-8-32h8" />
      <circle cx="69" cy="111" r="3" className="pb-visual-elements__point" />
    </>,
  },
  {
    name: 'Crosshairs',
    description: 'Locate a center or mark a point to inspect.',
    drawing: <>
      <circle cx="120" cy="76" r="40" />
      <path d="M120 15V137M59 76H181" className="pb-visual-elements__axis" />
      <Crosshair x={120} y={76} />
      <circle cx="120" cy="76" r="2" fill="currentColor" />
      <path d="M90 34h8m-4-4v8M164 103h8m-4-4v8" className="pb-visual-elements__guide" />
    </>,
  },
  {
    name: 'Leaders',
    description: 'Connect a note to the detail it describes.',
    drawing: <>
      <path d="m49 72 45-24 45 25v47l-45 24-45-24ZM49 72l45 25 45-24M94 97v47" />
      <path d="M94 97V48m-45 72 45-23 45 23" className="pb-visual-elements__guide" />
      <circle cx="109" cy="104" r="3" fill="currentColor" />
      <path d="m109 104 49-54h46" />
      <text x="160" y="38">detail</text>
    </>,
  },
  {
    name: 'Grid fields',
    description: 'Show alignment between related parts.',
    drawing: <>
      <g className="pb-visual-elements__guide">
        {[40, 72, 104, 136, 168, 200].map(x => <path key={`x-${x}`} d={`M${x} 22V130`} />)}
        {[28, 60, 92, 124].map(y => <path key={`y-${y}`} d={`M32 ${y}H208`} />)}
      </g>
      <path d="M72 60h96v64H72Z" />
      <Crosshair x={72} y={60} radius={5} />
      <Crosshair x={168} y={124} radius={5} />
      <path d="M81 116h78" className="pb-visual-elements__guide" />
    </>,
  },
  {
    name: 'Curves and paths',
    description: 'Trace a connection or show how a value changes.',
    drawing: <>
      <path d="M35 122H208M45 132V23" className="pb-visual-elements__axis" />
      <path d="M45 114C76 115 75 40 116 55s40 58 80-20" />
      <path d="M45 114 84 55h32l80-20M116 55v67M196 35v87" className="pb-visual-elements__guide" />
      <circle cx="45" cy="114" r="3" fill="currentColor" />
      <circle cx="196" cy="35" r="4" className="pb-visual-elements__point" />
      <Crosshair x={116} y={55} radius={5} />
    </>,
  },
  {
    name: 'Transparent highlights',
    description: 'Mark an area while keeping its drawing visible.',
    drawing: <>
      <path d="M52 34h117v89H52ZM72 49h117v89H72Z" className="pb-visual-elements__guide" />
      <path d="m47 52 78-2 2 45-78 1Z" className="pb-visual-elements__wash pb-visual-elements__wash--lime tw-mark" style={{ '--tw-reveal-at': '500ms' } as CSSProperties} />
      <path d="m130 83 64-1 1 39-65 2Z" className="pb-visual-elements__wash pb-visual-elements__wash--orange tw-mark" style={{ '--tw-reveal-at': '800ms' } as CSSProperties} />
      <path d="M52 34h117v89H52ZM52 57h117M64 46h39M64 73h76M64 86h51M64 109h38M154 73h35v65h-35" />
      <Crosshair x={52} y={34} radius={5} />
    </>,
  },
];

function Drawing({ name, children }: { name: string; children: ReactNode }) {
  const titleId = useId();
  const reveal = useReveal<SVGSVGElement>({ threshold: 0.6 });
  return (
    <svg ref={reveal.ref} viewBox="0 0 240 152" role="img" aria-labelledby={titleId} focusable="false">
      <title id={titleId}>{name}</title>
      <g className="tw-draft" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter">{children}</g>
    </svg>
  );
}

/** Small drawing studies shared by the playbook and foundation stories. */
export function VisualElementsStudy() {
  return (
    <div className="pb-visual-elements">
      {studies.map(({ name, description, drawing }) => (
        <figure key={name}>
          <Drawing name={name}>{drawing}</Drawing>
          <figcaption><h3>{name}</h3><p>{description}</p></figcaption>
        </figure>
      ))}
    </div>
  );
}
