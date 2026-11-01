import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Icon } from '../src/index';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Save prototype', variant: 'primary', size: 'md', loading: false, disabled: false },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'signal'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    icon: { control: false },
    onClick: { action: 'clicked' },
  },
  parameters: { docs: { description: { component: 'Compact rectangular controls use regular Space Grotesk labels and restrained 2px corners. Primary is charcoal on paper; secondary keeps a thin outlined boundary; tertiary stays open. Reserve signal orange for a consequential action. A horizontal arrow is optional and should indicate progression. On hover, a second sheet slides out behind the button and pressing moves the button onto it; focus adds registration corners around the outline. Loading shows a ticking asterisk. Use a TextLink for navigation, and use a native button for an action. Even the small size retains a 44px minimum touch target. Keyboard activation, visible focus, disabled, and loading states are included. Loading preserves the label and prevents repeat activation; announce completion in the surrounding interface.' } } },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Variants: Story = { render: () => <div className="tw-story-row"><Button icon={<Icon name="arrow-right" size={18} />}>Start an experiment</Button><Button variant="secondary">View artifacts</Button><Button variant="tertiary" icon={<Icon name="arrow-right" size={18} />}>Show observations</Button><Button variant="signal">Run experiment</Button></div> };
export const Sizes: Story = { render: () => <div className="tw-story-row"><Button size="sm">Explore</Button><Button size="md">Explore</Button><Button size="lg">Explore</Button></div> };
export const WithDirectionalIcon: Story = { args: { children: 'Continue', icon: <Icon name="arrow-right" size={18} /> } };
export const WithAndWithoutArrow: Story = { render: () => <div className="tw-story-row"><Button>Save prototype</Button><Button icon={<Icon name="arrow-right" size={18} />}>Next observation</Button><Button variant="secondary" icon={<Icon name="arrow-right" size={18} />}>Review artifacts</Button></div> };
export const Loading: Story = { args: { loading: true, children: 'Saving changes' } };
export const Disabled: Story = { args: { disabled: true } };
export const InteractionStates: Story = { render: () => <div className="tw-story-stack"><p>These controls share the medium size. Disabled and loading states keep the same height. Press Tab to inspect keyboard focus.</p><div className="tw-story-row"><Button size="md">Save observation</Button><Button size="md" variant="secondary">Review notes</Button><Button size="md" disabled>Unavailable</Button><Button size="md" loading>Saving observation</Button></div></div> };
