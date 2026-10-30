import { createRef, useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button, Checkbox, Navigation, Pagination, Select, Switch, Tabs, TechnicalFigure, TextArea, TextField } from '../../src';
import * as publicApi from '../../src';

it('keeps application-specific components outside the public library', () => {
  for (const name of ['ContributorBadge', 'WorkflowDiagram', 'ActivityTimeline', 'ArtifactCard']) {
    expect(publicApi).not.toHaveProperty(name);
  }
});

describe('actions and form controls', () => {
  it('prevents disabled and loading actions and exposes busy state', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<><Button disabled onClick={onClick}>Unavailable action</Button><Button loading onClick={onClick}>Save changes</Button><Button onClick={onClick}>Continue</Button></>);
    const disabled = screen.getByRole('button', { name: 'Unavailable action' });
    const loading = screen.getByRole('button', { name: /Save changes/ });
    expect(disabled).toBeDisabled();
    expect(loading).toBeDisabled();
    expect(loading).toHaveAttribute('aria-busy', 'true');
    await user.click(disabled);
    await user.click(loading);
    expect(onClick).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('associates hints and errors with native labeled controls', async () => {
    const user = userEvent.setup();
    render(<><TextField label="Title" hint="Use a short title." /><TextField label="Email" type="email" error="Enter a valid email address." /><TextArea label="Description" hint="Add more detail." /><Select label="Category" defaultValue="general"><option value="general">General</option><option value="other">Other</option></Select></>);
    const title = screen.getByRole('textbox', { name: 'Title' });
    expect(title).toHaveAccessibleDescription('Use a short title.');
    await user.type(title, 'Sample title');
    expect(title).toHaveValue('Sample title');
    const email = screen.getByRole('textbox', { name: 'Email' });
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAccessibleDescription('Enter a valid email address.');
    expect(screen.getByRole('textbox', { name: 'Description' })).toHaveAccessibleDescription('Add more detail.');
    const category = screen.getByRole('combobox', { name: 'Category' });
    await user.selectOptions(category, 'other');
    expect(category).toHaveValue('other');
  });

  it('lets keyboard users change checkbox and switch values', async () => {
    const user = userEvent.setup();
    function Controls() {
      const [enabled, setEnabled] = useState(false);
      return <><Checkbox label="Include attachments" /><Switch label="Email notifications" checked={enabled} onCheckedChange={setEnabled} /><Switch label="Unavailable setting" checked={false} onCheckedChange={vi.fn()} disabled /></>;
    }
    render(<Controls />);
    const checkbox = screen.getByRole('checkbox', { name: 'Include attachments' });
    const toggle = screen.getByRole('switch', { name: 'Email notifications' });
    await user.tab();
    expect(checkbox).toHaveFocus();
    await user.keyboard(' ');
    expect(checkbox).toBeChecked();
    await user.tab();
    expect(toggle).toHaveFocus();
    await user.keyboard(' ');
    expect(toggle).toBeChecked();
    await user.keyboard(' ');
    expect(toggle).not.toBeChecked();
    expect(screen.getByRole('switch', { name: 'Unavailable setting' })).toBeDisabled();
  });
});

describe('navigation and figures', () => {
  const items = [
    { id: 'overview', label: 'Overview', content: <p>A short introduction.</p> },
    { id: 'details', label: 'Details', content: <p>Additional information.</p> },
    { id: 'history', label: 'History', content: <p>Previous updates.</p> },
  ];

  it('supports roving focus, arrow keys, wrapping, Home and End in tabs', async () => {
    const user = userEvent.setup();
    render(<Tabs items={items} defaultValue="overview" />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('tabindex', '-1');
    await user.tab();
    expect(tabs[0]).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(tabs[1]).toHaveFocus();
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Additional information.');
    await user.keyboard('{End}');
    expect(tabs[2]).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(tabs[0]).toHaveFocus();
    await user.keyboard('{End}{Home}');
    expect(tabs[0]).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', tabs[0].id);
  });

  it('honors controlled tab state and emits a selection request', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Tabs items={items} value="overview" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('tab', { name: 'Details' }));
    expect(onValueChange).toHaveBeenCalledWith('details');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps the first loaded tab selected when asynchronously loaded items reorder', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Tabs items={[]} onValueChange={onValueChange} />);
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();

    rerender(<Tabs items={items} onValueChange={onValueChange} />);
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');

    rerender(<Tabs items={[items[1], items[0], items[2]]} onValueChange={onValueChange} />);
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('A short introduction.');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('commits a replacement selection instead of reviving a removed uncontrolled tab', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Tabs items={items} defaultValue="details" onValueChange={onValueChange} />);
    expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute('aria-selected', 'true');

    rerender(<Tabs items={[items[0], items[2]]} onValueChange={onValueChange} />);
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');

    rerender(<Tabs items={[items[1], items[0], items[2]]} onValueChange={onValueChange} />);
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute('tabindex', '-1');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('retains an uncontrolled selection through an empty loading interval', () => {
    const { rerender } = render(<Tabs items={items} defaultValue="details" />);
    rerender(<Tabs items={[]} />);
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();

    rerender(<Tabs items={[items[2], items[1], items[0]]} />);
    expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps a dynamic controlled value caller-owned and only emits user selection requests', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(<Tabs items={[]} value="details" onValueChange={onValueChange} />);

    rerender(<Tabs items={items} value="details" onValueChange={onValueChange} />);
    expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute('aria-selected', 'true');
    rerender(<Tabs items={[items[2], items[0]]} value="details" onValueChange={onValueChange} />);
    expect(screen.getByRole('tab', { name: 'History' })).toHaveAttribute('aria-selected', 'true');
    rerender(<Tabs items={[items[2], items[1], items[0]]} value="details" onValueChange={onValueChange} />);
    expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute('aria-selected', 'true');
    expect(onValueChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole('tab', { name: 'Overview' }));
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('overview');
    expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps pagination within its bounds and displays the current page', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const { rerender } = render(<Pagination page={1} totalPages={3} onPageChange={onPageChange} />);
    const navigation = screen.getByRole('navigation', { name: 'Pagination' });
    const previous = within(navigation).getByRole('button', { name: /previous/i });
    expect(previous).toBeDisabled();
    await user.click(previous);
    expect(onPageChange).not.toHaveBeenCalled();
    await user.click(within(navigation).getByRole('button', { name: /next/i }));
    expect(onPageChange).toHaveBeenLastCalledWith(2);
    rerender(<Pagination page={3} totalPages={3} onPageChange={onPageChange} />);
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    expect(navigation).toHaveTextContent(/Page 03.*of 03/);
  });

  it('exposes mobile menu state and restores focus on Escape', async () => {
    const user = userEvent.setup();
    render(<Navigation activeHref="#build" items={[{ label: 'Discover', href: '#discover' }, { label: 'Build', href: '#build' }, { label: 'Notes', href: '#notes' }]} />);
    const trigger = screen.getByLabelText('Open navigation');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    const controlledId = trigger.getAttribute('aria-controls');
    expect(controlledId).toBeTruthy();
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById(controlledId!)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Build' }).some(link => link.getAttribute('aria-current') === 'page')).toBe(true);
    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('keeps a consumer-owned drawing and rich caption inside a native figure', () => {
    const ref = createRef<HTMLElement>();
    render(<TechnicalFigure ref={ref} id="search-study" className="search-study" aria-label="Search interaction study" figure="FIG. 07" caption={<p><strong>Search flow.</strong> A query opens a set of results.</p>}><svg role="img" aria-label="A query linked to results" viewBox="0 0 100 40"><path d="M10 20h80" /></svg></TechnicalFigure>);
    const figure = screen.getByRole('figure', { name: 'Search interaction study' });
    expect(ref.current).toBe(figure);
    expect(figure).toHaveAttribute('id', 'search-study');
    expect(figure).toHaveClass('search-study');
    expect(within(figure).getByRole('img', { name: 'A query linked to results' })).toBeVisible();
    expect(figure.querySelector('figcaption')).toHaveTextContent('FIG. 07Search flow. A query opens a set of results.');
    expect(figure.querySelector('figcaption strong')).toHaveTextContent('Search flow.');
    const paragraph = figure.querySelector('figcaption p');
    expect(paragraph).toHaveTextContent('Search flow. A query opens a set of results.');
    expect(paragraph?.parentElement?.tagName).toBe('DIV');
    expect(within(figure).queryByRole('button')).not.toBeInTheDocument();
  });
});
