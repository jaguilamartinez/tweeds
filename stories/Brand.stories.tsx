import type { Meta, StoryObj } from '@storybook/react-vite';
import { Logo, ThemeProvider } from '../src/index';

const meta = {
  title: 'Brand/Logo', component: Logo,
  args: { variant: 'stacked' },
  argTypes: { variant: { control: 'inline-radio', options: ['stacked', 'compact', 'monogram'] } },
  parameters: { docs: { description: { component: 'The main mark sets Tinker above Works in Instrument Serif at regular weight 400, the same face as editorial headings. Keep natural letter widths, aligned left edges, and a visible gap between the lines. Use the included font and leave open space around the mark. Supporting copy stays outside it. Use the TW monogram where the full wordmark would crowd a small surface; every variant keeps the accessible name Tinker Works. Use paper on ink or ink on paper. When the logo links home, name the enclosing link “Tinker Works home”.' } } },
} satisfies Meta<typeof Logo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Stacked: Story = {};
export const Compact: Story = { args: { variant: 'compact' } };
export const Monogram: Story = { args: { variant: 'monogram' } };
export const Reversed: Story = { render: () => <ThemeProvider theme="ink"><div style={{ padding: 48, display: 'inline-block' }}><Logo /></div></ThemeProvider> };
export const ClearSpace: Story = { parameters: { docs: { description: { story: 'Leave at least the height of the capital T between the wordmark and nearby content. The dashed boundary here is a spacing guide and is not part of the mark. Do not stretch either word independently or add a descriptor between the lines.' } } }, render: () => <div style={{ padding: '1em', fontSize: 70, display: 'inline-block', border: '1px dashed var(--tw-color-line)' }}><Logo /></div> };
