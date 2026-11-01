import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from '../src/index';

const meta = {
  title: 'Components/TextField', component: TextField,
  args: { label: 'Experiment name', placeholder: 'For example, Interface study', hint: 'Choose a short, specific name.', disabled: false, required: false },
  parameters: { docs: { description: { component: 'A simple outlined native input uses a regular-weight visible label and a high-contrast 1px boundary. Paper uses a square ink focus outline. Placeholders provide an example and never replace the label. Hint and error text are associated with the input. Errors retain an ink or paper boundary and readable text, with an orange inset marker as an additional cue. Use type, autoComplete, inputMode, and required to match the task. An error sets aria-invalid and describes the correction in words. Validate on submission or after the user has interacted, and move focus to a useful summary for long forms.' } } },
} satisfies Meta<typeof TextField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Filled: Story = { args: { defaultValue: 'Interface study', placeholder: undefined } };
export const Error: Story = { args: { label: 'Contact email', type: 'email', defaultValue: 'maker@', hint: 'We will use this to reply about the experiment.', error: 'Enter a complete email address, such as maker@example.com.' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Interface study' } };
export const Required: Story = { args: { required: true } };
export const Search: Story = { args: { type: 'search', label: 'Find an experiment', placeholder: 'Experiment ID, title, or keyword', hint: 'Try TW—014 or interface.' } };
