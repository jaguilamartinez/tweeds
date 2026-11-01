import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Button, Icon, Tabs, ThemeProvider, useReveal } from '../../src';

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

describe('component motion', () => {
  const items = [
    { id: 'overview', label: 'Overview', content: <p>Summary</p> },
    { id: 'details', label: 'Details', content: <p>Details</p> },
  ];
  afterEach(() => { vi.useRealTimers(); });

  it('moves the tab underline from the previous tab, then leaves it on the selected tab', () => {
    vi.useFakeTimers();
    render(<Tabs items={items} />);
    const list = screen.getByRole('tablist');
    expect(list).not.toHaveAttribute('data-sliding');
    fireEvent.click(screen.getByRole('tab', { name: 'Details' }));
    expect(list).toHaveAttribute('data-sliding', 'true');
    expect(list.querySelector('.tw-tabs__indicator')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getAllByRole('tab')).toHaveLength(2);
    act(() => { vi.advanceTimersByTime(600); });
    expect(list).not.toHaveAttribute('data-sliding');
    expect(list.querySelector('.tw-tabs__indicator')).toBeNull();
    expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute('aria-selected', 'true');
  });

  it('changes tabs without the journey when reduced motion is requested', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(query => ({ matches: query.includes('reduce'), media: query } as MediaQueryList));
    render(<Tabs items={items} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Details' }));
    expect(screen.getByRole('tablist')).not.toHaveAttribute('data-sliding');
    expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute('aria-selected', 'true');
  });

  it('names icon drawings and their construction layer for interaction styles', () => {
    const { container } = render(<><Icon name="arrow-right" /><Icon name="crosshair" size={32} /></>);
    const [arrow, crosshair] = container.querySelectorAll('svg');
    expect(arrow).toHaveAttribute('data-tw-icon', 'arrow-right');
    expect(crosshair.querySelector('.tw-icon__construction')).toBeInTheDocument();
  });

  it('keeps the loading indicator out of the button name', () => {
    render(<Button loading>Saving changes</Button>);
    const button = screen.getByRole('button', { name: 'Saving changes' });
    expect(button).toBeDisabled();
    expect(button.querySelector('svg.tw-spinner')).toHaveAttribute('aria-hidden', 'true');
  });
});
