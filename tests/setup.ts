import '@testing-library/jest-dom/vitest';
import '../src/styles/index.css';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(cleanup);

// Axe probes canvas to recognize icon fonts. jsdom has no drawing context;
// rendered color contrast and typography are checked in the browser suite.
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', { value: () => null });

// Browsers supply this API; jsdom does not. Keep the preference controllable in
// browser tests, where reduced-motion and actual rendering are covered.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
