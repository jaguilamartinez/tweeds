import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button, HighlightOverlay, Icon, iconCatalog, iconNames, Logo, MathMark } from '../../src';
import userEvent from '@testing-library/user-event';
import { BrandGeometry } from '../../example/BrandGeometry';
import { TweedsLogo } from '../../example/TweedsLogo';

describe('playbook identity', () => {
  it.each([
    { withDescriptor: false, name: 'Tweeds' },
    { withDescriptor: true, name: 'Tweeds — Tinker Works Design System' },
  ])('names the wordmark correctly with descriptor=$withDescriptor', ({ withDescriptor, name }) => {
    render(<TweedsLogo withDescriptor={withDescriptor} />);
    expect(screen.getByRole('img', { name })).toBeVisible();
    expect(screen.getAllByRole('img')).toHaveLength(1);
    if (withDescriptor) expect(screen.getByText('Tinker Works Design System')).toBeVisible();
    else expect(screen.queryByText('Tinker Works Design System')).not.toBeInTheDocument();
  });
});

describe('brand accessibility', () => {
  it('keeps mathematical decoration out of an action’s accessible name', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<><MathMark symbol="plus" size={48} /><Button onClick={onClick}>Add a note</Button></>);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    await user.tab();
    const button = screen.getByRole('button', { name: 'Add a note' });
    expect(button).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('exposes a mathematical mark only when its supplied label carries meaning', () => {
    const { rerender } = render(<MathMark symbol="asterisk" label="Tinker Works mathematical mark" />);
    expect(screen.getByRole('img', { name: 'Tinker Works mathematical mark' })).not.toHaveAttribute('aria-hidden', 'true');
    rerender(<MathMark symbol="asterisk" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('forwards native SVG attributes and the mathematical mark ref', () => {
    const ref = createRef<SVGSVGElement>();
    render(<><MathMark ref={ref} symbol="minus" tone="lime" size={128} label="Lime minus brand mark" className="publication-mark" aria-describedby="mark-caption" /><p id="mark-caption">Mathematical brand graphics.</p></>);
    const mark = screen.getByRole('img', { name: 'Lime minus brand mark' });
    expect(ref.current).toBe(mark);
    expect(mark).toHaveClass('publication-mark');
    expect(mark).toHaveAttribute('width', '128');
    expect(mark).toHaveAttribute('height', '128');
    expect(mark).toHaveAccessibleDescription('Mathematical brand graphics.');
  });

  it.each(['stacked', 'compact', 'monogram'] as const)('gives the %s logo the full brand name', variant => {
    render(<Logo variant={variant} />);
    expect(screen.getByRole('img', { name: 'Tinker Works' })).toBeVisible();
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });

  it('keeps a decorative icon out of a control’s accessible name', () => {
    render(<Button icon={<Icon name="arrow-up-right" />}>Open details</Button>);
    expect(screen.getByRole('button', { name: 'Open details' })).toBeVisible();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('allows a standalone icon to expose a meaningful name', () => {
    render(<Icon name="layers" aria-hidden={false} role="img" aria-label="Layers" />);
    expect(screen.getByRole('img', { name: 'Layers' })).toBeVisible();
  });

  it('preserves native SVG attributes and the element ref through the public API', () => {
    const ref = createRef<SVGSVGElement>();
    render(<Icon ref={ref} name="crosshair" size={32} className="diagram-key" strokeWidth={2} aria-hidden={false} role="img" aria-label="Reference point" />);
    const icon = screen.getByRole('img', { name: 'Reference point' });
    expect(ref.current).toBe(icon);
    expect(icon).toHaveAttribute('width', '32');
    expect(icon).toHaveAttribute('height', '32');
    expect(icon).toHaveAttribute('stroke-width', '2');
    expect(icon).toHaveClass('diagram-key');
  });

  it('can render every catalog entry through the public icon API with its documented name', () => {
    render(<>{iconCatalog.map(icon => <Icon key={icon.name} name={icon.name} aria-hidden={false} role="img" aria-label={icon.label} />)}</>);
    expect(iconCatalog.map(icon => icon.name)).toEqual(iconNames);
    expect(new Set(iconNames).size).toBe(iconNames.length);
    for (const icon of iconCatalog) expect(screen.getByRole('img', { name: icon.label })).toBeVisible();
  });

  it('keeps construction detail out of small controls while retaining the same icon meaning', () => {
    render(<><Icon name="crosshair" size={16} aria-hidden={false} role="img" aria-label="Small reference point" /><Icon name="crosshair" size={40} aria-hidden={false} role="img" aria-label="Large reference point" /></>);
    const small = screen.getByRole('img', { name: 'Small reference point' });
    const large = screen.getByRole('img', { name: 'Large reference point' });
    expect(large.childElementCount).toBeGreaterThan(small.childElementCount);
    expect(Number(small.getAttribute('stroke-width'))).toBeGreaterThan(Number(large.getAttribute('stroke-width')));
  });

  it('retains accessible drawing content and child keyboard actions in either highlight tone', async () => {
    const user = userEvent.setup();
    const onInspect = vi.fn();
    const ref = createRef<HTMLSpanElement>();
    const content = <><svg role="img" aria-label="Query path" viewBox="0 0 100 40"><path d="M10 20h80" /></svg><button onClick={onInspect}>Inspect drawing</button></>;
    const { rerender } = render(<HighlightOverlay ref={ref} id="drawing-highlight" className="drawing-highlight">{content}</HighlightOverlay>);
    expect(ref.current).toHaveAttribute('id', 'drawing-highlight');
    expect(ref.current).toHaveClass('drawing-highlight');
    expect(ref.current).not.toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('img', { name: 'Query path' })).toBeVisible();
    await user.tab();
    await user.keyboard('{Enter}');
    expect(onInspect).toHaveBeenCalledOnce();
    rerender(<HighlightOverlay tone="lime" ref={ref}>{content}</HighlightOverlay>);
    expect(screen.getByRole('img', { name: 'Query path' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Inspect drawing' })).toHaveFocus();
    await user.keyboard(' ');
    expect(onInspect).toHaveBeenCalledTimes(2);
  });
});

describe('documentation artwork', () => {
  it('allows a keyboard user to compare interface layers and announces the result', async () => {
    const user = userEvent.setup();
    render(<BrandGeometry variant="specimen" title="Interface layers" />);
    const control = screen.getByRole('button', { name: 'Assemble layers' });
    await user.tab();
    expect(control).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Separate layers' })).toHaveFocus();
    expect(screen.getByRole('status')).toHaveTextContent('Interface layers are shown together.');
    await user.keyboard(' ');
    expect(screen.getByRole('button', { name: 'Assemble layers' })).toHaveFocus();
    expect(screen.getByRole('status')).toHaveTextContent('Layout, content, and interaction are shown apart.');
  });

  it('keeps SVG names and drawing references distinct when artwork is repeated', () => {
    const { container } = render(<><BrandGeometry variant="specimen" title="First study" /><BrandGeometry variant="specimen" title="Second study" /></>);
    const ids = [...container.querySelectorAll('[id]')].map(element => element.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const control of screen.getAllByRole('button', { name: 'Assemble layers' })) {
      for (const id of control.getAttribute('aria-controls')!.split(' ')) expect(document.getElementById(id)?.tagName).toBe('svg');
    }
    for (const image of screen.getAllByRole('img')) {
      expect(image).toHaveAccessibleName(/First study|Second study/);
      expect(document.getElementById(image.getAttribute('aria-labelledby')!)).toBeInTheDocument();
    }
  });
});
