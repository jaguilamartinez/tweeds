import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider, useReveal } from '../../src';

let observers: { callback: IntersectionObserverCallback; disconnect: ReturnType<typeof vi.fn> }[] = [];

class TestIntersectionObserver {
  readonly disconnect = vi.fn();
  constructor(readonly callback: IntersectionObserverCallback) { observers.push(this); }
  observe() {}
  unobserve() {}
  takeRecords() { return []; }
}

function enterView() {
  act(() => { for (const observer of observers) observer.callback([{ isIntersecting: true } as IntersectionObserverEntry], observer as unknown as IntersectionObserver); });
}

function Drawing({ onReplay }: { onReplay?: (replay: () => void) => void }) {
  const reveal = useReveal<SVGSVGElement>();
  onReplay?.(reveal.replay);
  return <svg ref={reveal.ref} role="img" aria-label="Study">
    <g className="tw-draft"><path d="M0 0h10" /><path d="M0 4h10" /><path className="tw-mark" d="M0 8h10" /></g>
  </svg>;
}

describe('drafting motion', () => {
  beforeEach(() => {
    observers = [];
    vi.stubGlobal('IntersectionObserver', TestIntersectionObserver);
    Object.defineProperty(Element.prototype, 'getAnimations', { configurable: true, value: () => [] });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    delete (Element.prototype as Partial<Element>).getAnimations;
  });

  it('holds a drawing on its first frame, plays once in view, and then rests', async () => {
    render(<Drawing />);
    const drawing = screen.getByRole('img', { name: 'Study' });
    expect(drawing).toHaveAttribute('data-tw-reveal', 'pending');
    const strokes = drawing.querySelectorAll('[data-tw-stroke]');
    expect([...strokes].map(stroke => (stroke as SVGElement).style.getPropertyValue('--tw-reveal-order'))).toEqual(['0', '1']);
    expect(drawing.querySelector('.tw-mark')).not.toHaveAttribute('data-tw-stroke');
    enterView();
    expect(drawing).toHaveAttribute('data-tw-reveal', 'play');
    expect(observers.every(observer => observer.disconnect.mock.calls.length > 0)).toBe(true);
    await act(async () => { await Promise.resolve(); });
    expect(drawing).toHaveAttribute('data-tw-reveal', 'done');
  });

  it('can replay a finished sequence', async () => {
    let replay = () => {};
    render(<Drawing onReplay={value => { replay = value; }} />);
    const drawing = screen.getByRole('img', { name: 'Study' });
    enterView();
    await act(async () => { await Promise.resolve(); });
    act(() => replay());
    expect(drawing).toHaveAttribute('data-tw-reveal', 'play');
    await act(async () => { await Promise.resolve(); });
    expect(drawing).toHaveAttribute('data-tw-reveal', 'done');
  });

  it('shows the still drawing inside a motion="off" theme boundary', () => {
    const { container } = render(<ThemeProvider motion="off"><ThemeProvider theme="ink"><Drawing /></ThemeProvider></ThemeProvider>);
    expect(container.firstElementChild).toHaveAttribute('data-tw-motion', 'off');
    expect(screen.getByRole('img', { name: 'Study' })).not.toHaveAttribute('data-tw-reveal');
    expect(observers).toHaveLength(0);
  });

  it('shows the still drawing when reduced motion is requested', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(query => ({ matches: query.includes('reduce'), media: query } as MediaQueryList));
    render(<Drawing />);
    expect(screen.getByRole('img', { name: 'Study' })).not.toHaveAttribute('data-tw-reveal');
  });

  it('leaves the default theme boundary without a motion attribute', () => {
    const { container } = render(<ThemeProvider><p>Content</p></ThemeProvider>);
    expect(container.firstElementChild).not.toHaveAttribute('data-tw-motion');
  });
});

describe('drafting motion without browser support', () => {
  it('shows the still drawing when the browser cannot observe visibility', () => {
    render(<Drawing />);
    expect(screen.getByRole('img', { name: 'Study' })).not.toHaveAttribute('data-tw-reveal');
  });
});
