import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from '../src/index';

const meta = {
  title: 'Components/Alert', component: Alert,
  args: { tone: 'info', title: 'Changes are not saved yet', children: 'Save your changes before leaving this page.' },
  argTypes: { tone: { control: 'inline-radio', options: ['info', 'error', 'success'] } },
  parameters: { docs: { description: { component: 'Use for a concise update relevant to the current task. Error explains the problem and a useful next action; success confirms completion; info adds context. Words and semantics convey the status alongside color. Alerts use a live region, so avoid rendering large collections of them or replacing the user’s focus with an announcement.' } } },
} satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Information: Story = {};
export const Error: Story = { args: { tone: 'error', title: 'Changes could not be saved', children: 'Your text is still here. Check your connection and try again.' } };
export const Success: Story = { args: { tone: 'success', title: 'Changes saved', children: 'Your account details are up to date.' } };
