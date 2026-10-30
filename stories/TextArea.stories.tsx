import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextArea } from '../src/index';

const meta = {
  title: 'Components/TextArea', component: TextArea,
  args: { label: 'Message', placeholder: 'Add any details that would help us respond.', hint: 'Do not include passwords or payment details.', rows: 5 },
  parameters: { docs: { description: { component: 'Use for an observation, abstract, or other multi-line text. Keep a persistent label, provide a useful starting height, and allow resizing. Hint and error messages are associated programmatically with the control. Do not impose a character limit without showing the reason and remaining allowance.' } } },
} satisfies Meta<typeof TextArea>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Filled: Story = { args: { defaultValue: 'I would like to change the email address used for my account.' } };
export const Error: Story = { args: { error: 'Enter a message before sending.', required: true } };
export const Disabled: Story = { args: { disabled: true } };
