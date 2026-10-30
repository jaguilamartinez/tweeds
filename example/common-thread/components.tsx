import { useId, type HTMLAttributes } from 'react';
import { Button, Icon, Tag } from '@tinker-works/ui';
import { artifactStatusLabels, type ActivityItem, type ArtifactStatus, type Contributor } from './model';
import './components.css';

// Product-specific UI for this example. These components are not package exports.

export type { ActivityItem, Contributor } from './model';

export interface ContributorBadgeProps extends Contributor {
  /** Retain the name and kind while using less horizontal space. */
  compact?: boolean;
}

/** A contributor's kind is always written out; shape and color only reinforce it. */
export function ContributorBadge({ name, kind, compact = false }: ContributorBadgeProps) {
  return <span className={`ct-contributor ct-contributor--${kind}${compact ? ' ct-contributor--compact' : ''}`}>
    <span className="ct-contributor__mark" aria-hidden="true">{kind === 'human' ? name.trim().slice(0, 1).toUpperCase() : '+'}</span>
    <span className="ct-contributor__identity"><span className="ct-contributor__name">{name}</span><span className="ct-contributor__kind">{kind === 'human' ? 'Human' : 'Agent'}</span></span>
  </span>;
}

export interface WorkflowStep {
  id: string;
  label: string;
  actor: 'human' | 'agent' | 'shared';
  status: 'complete' | 'active' | 'queued';
}

export interface WorkflowDiagramProps extends HTMLAttributes<HTMLDivElement> {
  steps?: WorkflowStep[];
  /** The selected detail, independent from the workflow's active execution step. */
  activeStep?: string;
  onStepSelect?: (id: string) => void;
  compact?: boolean;
}

const defaultSteps: WorkflowStep[] = [
  { id: 'question', label: 'Question', actor: 'human', status: 'complete' },
  { id: 'draft', label: 'Agent draft', actor: 'agent', status: 'complete' },
  { id: 'review', label: 'Human review', actor: 'human', status: 'active' },
  { id: 'artifact', label: 'Versioned artifact', actor: 'shared', status: 'queued' },
];

/** A linear, readable account of handoffs between people and intelligent agents. */
export function WorkflowDiagram({ steps = defaultSteps, activeStep, onStepSelect, compact = false, className = '', ...props }: WorkflowDiagramProps) {
  const selected = activeStep ?? steps.find(step => step.status === 'active')?.id;
  return <div className={`ct-workflow${compact ? ' ct-workflow--compact' : ''} ${className}`} {...props}>
    {steps.length === 0 ? <p className="ct-workflow__empty">No workflow steps yet.</p> : <ol className="ct-workflow__steps" aria-label="Workflow">
      {steps.map((step, index) => {
        const content = <><span className="ct-workflow__meta"><span className="ct-workflow__index">{String(index + 1).padStart(2, '0')}</span><span className={`ct-workflow__status ct-workflow__status--${step.status}`}>{step.status === 'complete' && <Icon name="check" size={12} />}{step.status === 'active' ? 'In progress' : step.status === 'complete' ? 'Complete' : 'Queued'}</span></span><span className="ct-workflow__label">{step.label}</span><span className="ct-workflow__actor">{step.actor === 'shared' ? 'Human + agent' : step.actor === 'human' ? 'Human' : 'Agent'}</span></>;
        return <li className="ct-workflow__step" key={step.id} aria-current={step.status === 'active' ? 'step' : undefined}>
          {onStepSelect ? <button className="ct-workflow__node" type="button" aria-pressed={selected === step.id} onClick={() => onStepSelect(step.id)}>{content}</button> : <div className="ct-workflow__node" data-selected={selected === step.id || undefined}>{content}</div>}
        </li>;
      })}
    </ol>}
  </div>;
}

export interface ActivityTimelineProps extends HTMLAttributes<HTMLDivElement> {
  items: ActivityItem[];
}

/** Chronological provenance with explicit human and agent attribution. */
export function ActivityTimeline({ items, className = '', ...props }: ActivityTimelineProps) {
  return <div className={`ct-activity ${className}`} {...props}>
    {items.length === 0 ? <p className="ct-activity__empty">No activity yet. Changes will appear here.</p> : <ol className="ct-activity__items" aria-label="Activity history">
      {items.map(item => <li className={`ct-activity__item ct-activity__item--${item.actor.kind}`} key={item.id}>
        <span className="ct-activity__marker" aria-hidden="true" />
        <div className="ct-activity__entry"><div className="ct-activity__heading"><ContributorBadge {...item.actor} compact />{item.dateTime ? <time className="ct-activity__time" dateTime={item.dateTime}>{item.time}</time> : <span className="ct-activity__time">{item.time}</span>}</div>
          <p className="ct-activity__action">{item.action}</p>
          {item.detail && <p className="ct-activity__detail">{item.detail}</p>}
          {item.version && <span className="ct-activity__version">{item.version}</span>}
        </div>
      </li>)}
    </ol>}
  </div>;
}

export interface ArtifactCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: string;
  description: string;
  version: string;
  status: ArtifactStatus;
  contributors: Contributor[];
  onOpen?: () => void;
  selected?: boolean;
}

/** A versioned piece of shared work, with attribution and a single explicit action. */
export function ArtifactCard({ title, description, version, status, contributors, onOpen, selected = false, className = '', ...props }: ArtifactCardProps) {
  const headingId = useId();
  return <article className={`ct-artifact${selected ? ' ct-artifact--selected' : ''} ${className}`} aria-labelledby={headingId} {...props}>
    <div className="ct-artifact__meta"><span className="ct-artifact__version">{version}</span><Tag tone={status === 'accepted' ? 'lime' : 'neutral'} status={status === 'in-review'}>{artifactStatusLabels[status]}</Tag></div>
    <h3 className="ct-artifact__title" id={headingId}>{title}</h3>
    <p className="ct-artifact__description">{description}</p>
    <div className="ct-artifact__contributors" aria-label="Contributors">{contributors.length === 0 ? <span className="ct-artifact__unassigned">No contributors assigned</span> : contributors.map((contributor, index) => <ContributorBadge key={`${contributor.kind}-${contributor.name}-${index}`} {...contributor} compact />)}</div>
    <div className="ct-artifact__footer">{selected && <span className="ct-artifact__selected"><Icon name="check" size={14} /> Selected artifact</span>}{onOpen && <Button variant="tertiary" size="sm" onClick={onOpen} aria-label={`Open artifact: ${title}`} icon={<Icon name="arrow-up-right" size={16} />}>Open artifact</Button>}</div>
  </article>;
}
