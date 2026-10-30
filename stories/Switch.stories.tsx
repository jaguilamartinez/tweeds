import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from '../src/index';

const meta = {
  title: 'Components/Switch', component: Switch,
  args: { label: 'Email notifications', checked: false, disabled: false, onCheckedChange: (_checked: boolean) => {} },
  argTypes: { onCheckedChange: { action: 'checked changed' } },
  parameters: { docs: { description: { component: 'Use for an immediately applied on/off setting. Keep the label stable as state changes. Switch is controlled: pass checked and update it in onCheckedChange. Its accessible switch semantics and keyboard activation communicate state. Use Checkbox for a selection submitted later with a form.' } } },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = { render: args => { const [checked, setChecked] = useState(args.checked); useEffect(() => setChecked(args.checked), [args.checked]); return <Switch {...args} checked={checked} onCheckedChange={value => { setChecked(value); args.onCheckedChange?.(value); }} />; } };
export const On: Story = { args: { checked: true } };
export const DisabledOff: Story = { args: { disabled: true } };
export const DisabledOn: Story = { args: { disabled: true, checked: true } };
