import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextLink } from '../src/index';

const meta = {
  title: 'Components/TextLink', component: TextLink,
  args: { children: 'Read the setup guide', href: '#setup', arrow: true },
  parameters: { docs: { description: { component: 'Use a native anchor for navigation. Labels should describe the destination in isolation. An optional decorative arrow adds direction and nudges on hover. A thin rule marks the link at rest; on hover an orange pen line draws over it. Hover and visible keyboard focus remain legible in both themes. Use Button for submitting a form or changing application state.' } } },
} satisfies Meta<typeof TextLink>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Directional: Story = {};
export const Inline: Story = { args: { arrow: false, children: 'account settings' }, render: args => <p>You can change your email address in <TextLink {...args} />.</p> };
