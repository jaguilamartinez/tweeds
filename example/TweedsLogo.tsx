import type { HTMLAttributes } from 'react';
import './tweeds-logo.css';

export interface TweedsLogoProps extends HTMLAttributes<HTMLSpanElement> {
  withDescriptor?: boolean;
}

/** The playbook's identity, separate from the Tinker Works application logo. */
export function TweedsLogo({ withDescriptor = false, className = '', ...props }: TweedsLogoProps) {
  return <span className={`pb-tweeds-logo ${className}`} role="img"
    aria-label={withDescriptor ? 'Tweeds — Tinker Works Design System' : 'Tweeds'} {...props}>
    <svg viewBox={withDescriptor ? '0 0 372 126' : '0 0 372 90'} aria-hidden="true" focusable="false" fill="currentColor">
      <text className="pb-tweeds-logo__wordmark" x="3" y="81" fontSize="112">Tweeds</text>
      {withDescriptor && <text className="pb-tweeds-logo__descriptor" x="4" y="117" fontSize="24"
        textLength="364.05" lengthAdjust="spacing">Tinker Works Design System</text>}
    </svg>
  </span>;
}
