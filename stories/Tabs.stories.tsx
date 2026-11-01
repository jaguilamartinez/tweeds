import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from '../src/index';

const items = [
  { id: 'overview', label: 'Overview', content: <div><h3>Account overview</h3><p>View your profile and contact details.</p></div> },
  { id: 'notifications', label: 'Notifications', content: <div><h3>Notifications</h3><p>Choose which updates you receive.</p></div> },
  { id: 'security', label: 'Security', content: <div><h3>Security</h3><p>Manage your password and sign-in preferences.</p></div> },
];
const meta = {
  title: 'Components/Tabs', component: Tabs,
  args: { items, defaultValue: 'overview' },
  argTypes: { items: { control: false }, onValueChange: { action: 'tab changed' } },
  parameters: { docs: { description: { component: 'Organize related panels under short, predictable labels. A single signal-orange underline marks the selected tab and travels from the previous tab when the selection changes. Labels remain readable, selection is exposed through aria-selected, and keyboard focus has its own visible outline. Tab enters the active tab; Left and Right move between tabs; Home and End reach the first and last. Panels are linked to their tabs by accessible IDs. Use defaultValue for local state or value/onValueChange for controlled state. Essential sequential reading should remain ordinary document sections.' } } },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Interactive: Story = {};
export const SelectedTab: Story = { args: { defaultValue: 'security' } };
export const LongLabels: Story = { args: { items: [{ id: 'one', label: 'Personal information', content: <p>Manage your name, email address, and contact details.</p> }, { id: 'two', label: 'Notification preferences', content: <p>Choose the updates you want to receive.</p> }, { id: 'three', label: 'Privacy and security', content: <p>Review your account privacy settings.</p> }] } };
