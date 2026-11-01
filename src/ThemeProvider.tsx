import { forwardRef, type HTMLAttributes } from 'react';
import type { Theme } from './tokens.js';
export interface ThemeProviderProps extends HTMLAttributes<HTMLDivElement> {
  theme?: Theme;
  /** `off` renders every animation and transition in the subtree as a still image. */
  motion?: 'auto' | 'off';
}
/** Scope token overrides to a subtree. Explicit themes render identically on the server. */
export const ThemeProvider = forwardRef<HTMLDivElement, ThemeProviderProps>(function ThemeProvider({ theme = 'ink', motion = 'auto', className = '', ...props }, ref) {
  return <div {...props} ref={ref} data-tw-theme={theme} data-tw-motion={motion === 'off' ? 'off' : undefined} className={`tw-theme ${className}`} />;
});
