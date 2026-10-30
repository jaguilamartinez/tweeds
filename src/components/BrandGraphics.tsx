import type { HTMLAttributes, Ref } from 'react';

export interface HighlightOverlayProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'orange' | 'lime';
  ref?: Ref<HTMLSpanElement>;
}

/** A translucent graphic layer. Put essential reading text outside the overlay. */
export function HighlightOverlay({ tone = 'orange', className = '', children, ...props }: HighlightOverlayProps) {
  return <span className={`tw-highlight-overlay tw-highlight-overlay--${tone} ${className}`} {...props}>{children}</span>;
}
