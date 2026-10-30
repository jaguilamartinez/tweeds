import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from '../src/index';

const meta = {
  title: 'Components/Tag', component: Tag,
  args: { children: 'Experiment', tone: 'neutral', status: false },
  argTypes: { tone: { control: 'inline-radio', options: ['neutral', 'orange', 'lime'] } },
  parameters: { docs: { description: { component: 'Compact technical labels use uppercase IBM Plex Mono and very small corners. Neutral categories and IDs have thin outlines. Orange and lime category tags use solid brand fills with charcoal text in both themes. Status tags stay open: the default lime dot marks progress, and an explicit orange tone marks attention. Always write the status in words; color is supporting information. Tags are labels, not buttons or filters, and their compact size does not imply an interactive target.' } } },
} satisfies Meta<typeof Tag>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Categories: Story = { render: () => <div className="tw-story-row">{['Experiment', 'Prototype', 'Tool', 'Article'].map(label => <Tag key={label}>{label}</Tag>)}</div> };
export const Signals: Story = { render: () => <div className="tw-story-row"><Tag>TW—014</Tag><Tag tone="orange">Review required</Tag><Tag tone="lime">New finding</Tag></div> };
export const Status: Story = { render: () => <div className="tw-story-row"><Tag status>In progress</Tag><Tag status>Observing</Tag><Tag tone="orange" status>Review required</Tag><Tag>Archived</Tag></div> };
export const ExperimentMetadata: Story = { render: () => <div className="tw-story-stack"><p className="tw-story-label">Interface connection study</p><div className="tw-story-row"><Tag>TW—014</Tag><Tag>Prototype</Tag><Tag status>In progress</Tag></div></div> };
