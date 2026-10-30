import type { SVGProps } from 'react';

export type MathMarkSymbol = 'plus' | 'minus' | 'asterisk';

export interface MathMarkProps extends SVGProps<SVGSVGElement> {
  symbol: MathMarkSymbol;
  tone?: 'orange' | 'lime';
  size?: number;
  label?: string;
}

/** A large graphic accent built from equal filled bars, separate from utility icons. */
export function MathMark({
  symbol,
  tone = 'orange',
  size = 96,
  label,
  className = '',
  role,
  'aria-hidden': ariaHidden,
  'aria-label': ariaLabel,
  focusable,
  ...props
}: MathMarkProps) {
  const bar = <rect x="12" y="40" width="72" height="16" />;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="currentColor"
      stroke="none"
      {...props}
      className={`tw-math-mark tw-math-mark--${tone} ${className}`}
      role={label ? 'img' : role}
      aria-label={label ?? ariaLabel}
      aria-hidden={label ? undefined : (ariaHidden ?? true)}
      focusable={focusable ?? false}
    >
      {bar}
      {symbol === 'plus' && <g transform="rotate(90 48 48)">{bar}</g>}
      {symbol === 'asterisk' && <>
        <g transform="rotate(60 48 48)">{bar}</g>
        <g transform="rotate(120 48 48)">{bar}</g>
      </>}
    </svg>
  );
}
