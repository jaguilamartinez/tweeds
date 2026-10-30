import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from '../src/index';

const options = <><option value="">Choose a language</option><option value="en">English</option><option value="es">Spanish</option><option value="fr">French</option></>;
const meta = {
  title: 'Components/Select', component: Select,
  args: { label: 'Language', hint: 'Used for account emails.', children: options, defaultValue: '' },
  argTypes: { children: { control: false } },
  parameters: { docs: { description: { component: 'A labelled native select retains platform keyboard behavior and mobile pickers. Supply native option elements as children. Use a prompt option when no choice is selected, and never communicate the label only through that option. For a few visible choices, a group of controls can be easier to scan.' } } },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Selected: Story = { args: { defaultValue: 'en' } };
export const Error: Story = { args: { required: true, error: 'Choose a language to continue.' } };
export const Disabled: Story = { args: { disabled: true } };
