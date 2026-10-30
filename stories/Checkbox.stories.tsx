import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '../src/index';

const meta = {
  title: 'Components/Checkbox', component: Checkbox,
  args: { label: 'Send me a copy', disabled: false },
  parameters: { docs: { description: { component: 'A native checkbox supports binary selections, Space activation, forms, and a clickable visible label. Use defaultChecked for an uncontrolled field or checked with onChange for controlled state. Group related checkboxes inside a fieldset with a legend. Use Switch when a setting takes effect immediately.' } } },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Unchecked: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledChecked: Story = { args: { disabled: true, defaultChecked: true } };
export const Group: Story = { render: () => <fieldset style={{ border: '1px solid currentColor', padding: 24 }}><legend>Include in the download</legend><div className="tw-story-stack"><Checkbox label="Images" defaultChecked /><Checkbox label="Attachments" /><Checkbox label="Comments" defaultChecked /></div></fieldset> };
