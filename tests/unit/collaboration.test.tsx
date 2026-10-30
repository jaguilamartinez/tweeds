import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ActivityTimeline, ArtifactCard, ContributorBadge, WorkflowDiagram } from '../../example/common-thread/components';
import ProductExample from '../../example/ProductExample';

const contributors = [{ name: 'Maya Chen', kind: 'human' as const }, { name: 'Atlas', kind: 'agent' as const }];
const steps = [
  { id: 'question', label: 'Frame the question', actor: 'human' as const, status: 'complete' as const },
  { id: 'review', label: 'Review together', actor: 'shared' as const, status: 'active' as const },
  { id: 'evolve', label: 'Evolve the artifact', actor: 'agent' as const, status: 'queued' as const },
];

describe('Common Thread example components', () => {
  it('identifies humans and agents explicitly in both compact and regular badges', () => {
    render(<><ContributorBadge {...contributors[0]} /><ContributorBadge {...contributors[1]} compact /></>);
    expect(screen.getByText('Maya Chen').parentElement).toHaveTextContent('Human');
    expect(screen.getByText('Atlas').parentElement).toHaveTextContent('Agent');
  });

  it('keeps keyboard selection requests independent from recorded workflow status', async () => {
    const user = userEvent.setup();
    const onStepSelect = vi.fn();
    const { rerender } = render(<WorkflowDiagram steps={steps} activeStep="review" onStepSelect={onStepSelect} />);
    const workflow = screen.getByRole('list', { name: 'Workflow' });
    const question = within(workflow).getByRole('button', { name: /Frame the question/ });
    const review = within(workflow).getByRole('button', { name: /Review together/ });
    expect(review).toHaveAttribute('aria-pressed', 'true');
    expect(review.closest('li')).toHaveAttribute('aria-current', 'step');
    await user.tab();
    expect(question).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onStepSelect).toHaveBeenLastCalledWith('question');
    expect(review).toHaveAttribute('aria-pressed', 'true');
    rerender(<WorkflowDiagram steps={steps} activeStep="question" onStepSelect={onStepSelect} />);
    expect(question).toHaveAttribute('aria-pressed', 'true');
    expect(review).toHaveTextContent('In progress');
    expect(review.closest('li')).toHaveAttribute('aria-current', 'step');
    await user.tab();
    await user.keyboard(' ');
    expect(onStepSelect).toHaveBeenLastCalledWith('review');
  });

  it('renders a readable static workflow without adding unused keyboard stops', () => {
    render(<WorkflowDiagram steps={steps} />);
    const workflow = screen.getByRole('list', { name: 'Workflow' });
    expect(within(workflow).queryByRole('button')).not.toBeInTheDocument();
    expect(within(workflow).getAllByRole('listitem')).toHaveLength(3);
    expect(workflow).toHaveTextContent('Human + agent');
    expect(workflow).toHaveTextContent('Queued');
  });

  it('preserves contribution order, attribution, version and machine-readable time', () => {
    render(<ActivityTimeline items={[
      { id: 'proposal', actor: contributors[1], action: 'Proposed a draft', detail: 'Compared three source notes.', time: '09:24', dateTime: '2026-10-29T09:24:00+01:00', version: 'v0.2' },
      { id: 'accept', actor: contributors[0], action: 'Accepted this version', time: '09:38', version: 'v0.3' },
    ]} />);
    const history = screen.getByRole('list', { name: 'Activity history' });
    const events = within(history).getAllByRole('listitem');
    expect(events[0]).toHaveTextContent('AtlasAgent');
    expect(events[0]).toHaveTextContent('Proposed a draft');
    expect(events[0]).toHaveTextContent('Compared three source notes.');
    expect(events[0]).toHaveTextContent('v0.2');
    expect(within(events[0]).getByText('09:24')).toHaveAttribute('datetime', '2026-10-29T09:24:00+01:00');
    expect(events[1]).toHaveTextContent('Maya ChenHuman');
    expect(events[1]).toHaveTextContent('Accepted this version');
  });

  it('opens a named artifact through one keyboard action and keeps selected state explicit', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<ArtifactCard title="Design brief" description="A reviewable proposal." version="v0.3" status="in-review" contributors={contributors} selected onOpen={onOpen} />);
    const artifact = screen.getByRole('article', { name: 'Design brief' });
    expect(artifact).toHaveTextContent('In review');
    expect(artifact).toHaveTextContent('Selected artifact');
    expect(artifact).toHaveTextContent('Maya Chen');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Open artifact: Design brief' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onOpen).toHaveBeenCalledOnce();
  });
});

describe('Common Thread example navigation', () => {
  it('focuses Workspace after an intentional transition without taking initial focus', async () => {
    const user = userEvent.setup();
    render(<><button>Before the example</button><ProductExample /></>);
    expect(document.activeElement).toBe(document.body);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Before the example' })).toHaveFocus();

    screen.getByRole('button', { name: 'Explore workspace' }).focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('heading', { name: 'Workspace' })).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Landing' }));
    expect(screen.getByRole('button', { name: 'Landing' })).toHaveFocus();
    const workspace = screen.getByRole('button', { name: 'Workspace' });
    await user.click(workspace);
    expect(screen.getByRole('heading', { name: 'Workspace' })).toHaveFocus();

    await user.click(workspace);
    expect(workspace).toHaveFocus();
  });
});
