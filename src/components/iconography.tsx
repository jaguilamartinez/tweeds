import type { ReactNode } from 'react';

type IconCategory = 'navigation' | 'actions' | 'geometry' | 'appearance';
interface IconDrawing {
  label: string;
  category: IconCategory;
  outline: ReactNode;
  construction?: ReactNode;
}

// A 24-unit drawing board. Outlines carry the meaning at control sizes;
// optional construction lines add context when the glyph is shown larger.
const drawings = {
  'arrow-up-right': {
    label: 'Arrow up right', category: 'navigation',
    outline: <path d="m5 19 14-14M8 5h11v11" />,
  },
  'arrow-right': {
    label: 'Arrow right', category: 'navigation',
    outline: <path d="M3 12h17m-6-6 6 6-6 6" />,
  },
  'arrow-left': {
    label: 'Arrow left', category: 'navigation',
    outline: <path d="M21 12H4m6-6-6 6 6 6" />,
  },
  'arrow-down-right': {
    label: 'Arrow down right', category: 'navigation',
    outline: <path d="m5 5 14 14M8 19h11V8" />,
  },
  plus: {
    label: 'Add', category: 'actions',
    outline: <path d="M12 3v18M3 12h18" />,
  },
  minus: {
    label: 'Remove', category: 'actions',
    outline: <path d="M3 12h18" />,
  },
  close: {
    label: 'Close', category: 'actions',
    outline: <path d="m5 5 14 14M19 5 5 19" />,
  },
  menu: {
    label: 'Menu', category: 'navigation',
    outline: <path d="M3 5h18M3 12h18M3 19h18" />,
  },
  search: {
    label: 'Search', category: 'actions',
    outline: <><circle cx="10" cy="10" r="6.5" /><path d="m14.6 14.6 6 6" /></>,
  },
  check: {
    label: 'Check', category: 'actions',
    outline: <path d="m4 12 5 5L20 6" />,
  },
  sun: {
    label: 'Sun', category: 'appearance',
    outline: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
  },
  moon: {
    label: 'Moon', category: 'appearance',
    outline: <path d="M20.5 15A8.75 8.75 0 0 1 9 3.5 8.75 8.75 0 1 0 20.5 15Z" />,
  },
  layers: {
    label: 'Layers', category: 'geometry',
    outline: <path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5" />,
    construction: <path d="M12 1v2m0 18v2" />,
  },
  crosshair: {
    label: 'Crosshair', category: 'geometry',
    outline: <><circle cx="12" cy="12" r="7" /><path d="M12 1.5v21M1.5 12h21" /></>,
    construction: <circle cx="12" cy="12" r="9.5" strokeDasharray="1 2.8" />,
  },
  cube: {
    label: 'Cube', category: 'geometry',
    outline: <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 9 8-4.5M12 12 4 7.5m8 4.5v9" />,
    construction: <path d="m4 16.5 8-4.5 8 4.5M12 3v9" strokeDasharray="1.8 2" />,
  },
  cylinder: {
    label: 'Cylinder', category: 'geometry',
    outline: <><ellipse cx="12" cy="5.5" rx="7.5" ry="3" /><path d="M4.5 5.5v13c0 1.65 3.35 3 7.5 3s7.5-1.35 7.5-3v-13" /></>,
    construction: <><path d="M4.5 18.5c0-1.65 3.35-3 7.5-3s7.5 1.35 7.5 3M12 1v22" strokeDasharray="1.8 2" /></>,
  },
  nodes: {
    label: 'Connected nodes', category: 'geometry',
    outline: <><path d="M12 5.5v4m-2 4-4.5 4.5m8.5-4.5 4.5 4.5" /><circle cx="12" cy="3.5" r="2" /><circle cx="12" cy="12" r="2.5" /><circle cx="4" cy="20" r="2" /><circle cx="20" cy="20" r="2" /></>,
  },
  grid: {
    label: 'Grid', category: 'geometry',
    outline: <g fill="currentColor" stroke="none">{[5, 12, 19].flatMap(x => [5, 12, 19].map(y => <circle key={`${x}-${y}`} cx={x} cy={y} r=".9" />))}</g>,
    construction: <path d="M2 7V2h5m10 0h5v5M2 17v5h5m10 0h5v-5" />,
  },
  dimension: {
    label: 'Measure', category: 'geometry',
    outline: <path d="M3 5v14M21 5v14M3 12h18M7 8l-4 4 4 4m10-8 4 4-4 4" />,
    construction: <path d="M3 2v2m0 16v2M21 2v2m0 16v2" />,
  },
  frame: {
    label: 'Frame', category: 'geometry',
    outline: <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />,
    construction: <path d="M12 8v8m-4-4h8" />,
  },
} satisfies Record<string, IconDrawing>;

export type IconName = keyof typeof drawings;
export interface IconMetadata {
  readonly name: IconName;
  readonly label: string;
  readonly category: IconCategory;
}

export const iconDrawings: Readonly<Record<IconName, IconDrawing>> = drawings;
export const iconCatalog: readonly IconMetadata[] = Object.freeze(
  (Object.keys(drawings) as IconName[]).map(name => Object.freeze({
    name, label: drawings[name].label, category: drawings[name].category,
  })),
);
export const iconNames: readonly IconName[] = Object.freeze(iconCatalog.map(icon => icon.name));
