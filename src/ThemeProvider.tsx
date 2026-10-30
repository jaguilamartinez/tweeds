import { forwardRef, type HTMLAttributes } from 'react';
import type { Theme } from './tokens.js';
export interface ThemeProviderProps extends HTMLAttributes<HTMLDivElement> { theme?: Theme }
/** Scope token overrides to a subtree. Explicit themes render identically on the server. */
export const ThemeProvider = forwardRef<HTMLDivElement, ThemeProviderProps>(function ThemeProvider({ theme = 'paper', className = '', ...props }, ref) {
  return <div {...props} ref={ref} data-tw-theme={theme} className={`tw-theme ${className}`} />;
});
