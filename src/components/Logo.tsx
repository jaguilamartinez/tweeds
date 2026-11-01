import type { HTMLAttributes } from 'react';

export interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'stacked' | 'compact' | 'monogram';
}

export function Logo({ variant = 'stacked', className = '', ...props }: LogoProps) {
  return (
    <div className={`tw-logo tw-logo--${variant} ${className}`} role="img" aria-label="Tinker Works" {...props}>
      <svg className="tw-logo__art" viewBox={variant === 'monogram' ? '0 0 130 86' : '0 0 250 180'}
        aria-hidden="true" focusable="false" fill="currentColor">
        {variant === 'monogram' ? (
          <text x="2" y="84" fontSize="112">TW</text>
        ) : <>
          <text x="2" y="85" fontSize="112">Tinker</text>
          <text x="1" y="177" fontSize="112">Works</text>
        </>}
      </svg>
    </div>
  );
}
