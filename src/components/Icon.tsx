import type { SVGProps } from 'react';
import { iconDrawings, type IconName } from './iconography.js';
import { componentTokens } from '../tokens.js';

export { iconCatalog, iconNames } from './iconography.js';
export type { IconMetadata, IconName } from './iconography.js';

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, ...props }: IconProps) {
  const drawing = iconDrawings[name];
  // Keep a one-CSS-pixel pen line as the 24-unit drawing board scales.
  const strokeWidth = Number(componentTokens.icon.stroke) * 24 / Math.max(size, 1);

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="butt" strokeLinejoin="miter"
      aria-hidden="true" focusable="false" data-tw-icon={name} {...props}>
      {drawing.outline}
      {size >= 28 && drawing.construction && (
        <g className="tw-icon__construction" opacity=".55" strokeWidth={strokeWidth * Number(componentTokens.icon.constructionRatio)}>{drawing.construction}</g>
      )}
    </svg>
  );
}
