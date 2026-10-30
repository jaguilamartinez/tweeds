import type { HTMLAttributes } from 'react';

export interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'stacked' | 'compact' | 'monogram';
}

export function Logo({ variant = 'stacked', className = '', ...props }: LogoProps) {
  return (
    <div className={`tw-logo tw-logo--${variant} ${className}`} role="img" aria-label="Tinker Works" {...props}>
      <svg className="tw-logo__art" viewBox={variant === 'monogram' ? '0 0 178 84' : '0 0 332 174'}
        aria-hidden="true" focusable="false" fill="currentColor">
        {variant === 'monogram' ? (
          <text x="2" y="78" fontSize="112">TW</text>
        ) : <>
          <text x="2" y="81" fontSize="112">Tinker</text>
          <text x="3" y="167" fontSize="112">Works</text>
        </>}
      </svg>
    </div>
  );
}
