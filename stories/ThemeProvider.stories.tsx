import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeProvider, Button, Card, Tag, TextField } from '../src/index';

const Sample = () => <div className="tw-story-stack"><h2 style={{ fontFamily: 'Instrument Serif', fontSize: 48, fontWeight: 400, margin: 0 }}>Profile</h2><p>The same components use the colors of their nearest theme.</p><TextField label="Display name" defaultValue="Alex Morgan" /><Button>Save changes</Button></div>;
const meta = {
  title: 'Foundations/ThemeProvider', component: ThemeProvider,
  args: { theme: 'paper', children: <Sample /> },
  argTypes: { theme: { control: 'inline-radio', options: ['paper', 'ink'] }, motion: { control: 'inline-radio', options: ['auto', 'off'] }, children: { control: false } },
  parameters: { docs: { description: { component: 'ThemeProvider establishes a local data-tw-theme boundary for CSS custom properties. Paper is the editorial default; ink reverses the hierarchy for a deliberate dark surface. It forwards native div attributes, so className and style can define layout or scoped token overrides. It does not access global document state, and themes can nest safely. Set motion to off to show every animation and transition in the subtree as a still image. Use the toolbar to inspect every component in either theme.' } } },
} satisfies Meta<typeof ThemeProvider>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const SideBySide: Story = { render: () => <div className="tw-story-grid"><ThemeProvider theme="paper"><div className="tw-theme-example"><Sample /></div></ThemeProvider><ThemeProvider theme="ink"><div className="tw-theme-example"><Sample /></div></ThemeProvider></div> };
export const Nested: Story = { render: () => <ThemeProvider theme="ink"><div className="tw-theme-example"><h2>Ink section</h2><ThemeProvider theme="paper"><Card><Tag>Paper</Tag><p>A Paper card inside an Ink section.</p><Button variant="secondary">Show details</Button></Card></ThemeProvider></div></ThemeProvider> };
