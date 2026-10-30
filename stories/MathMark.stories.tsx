import type { Meta, StoryObj } from '@storybook/react-vite';
import { MathMark, ThemeProvider, type MathMarkSymbol } from '../src/index';

const symbols: MathMarkSymbol[] = ['plus', 'minus', 'asterisk'];
const meta = {
  title: 'Brand/MathMark',
  component: MathMark,
  args: { symbol: 'plus', tone: 'orange', size: 96 },
  argTypes: {
    symbol: { control: 'inline-radio', options: symbols },
    tone: { control: 'inline-radio', options: ['orange', 'lime'] },
    size: { control: { type: 'range', min: 48, max: 240, step: 8 } },
    label: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: 'MathMark is a large brand graphic, separate from utility icons. Equal square-ended filled bars form the plus, minus, and six-arm asterisk on a 96-unit grid. Use at least 48px; 96–160px gives the shapes comfortable presence. Leave at least a quarter of the displayed mark width as clear space around the mark and use one mark per composition. Orange and lime remain the same in Paper and Ink; lime reads most clearly on charcoal. No essential content should rely on decorative color. These graphic accents are decorative, so their colors do not need to meet text contrast. Do not substitute a mark for an action icon, status indicator, mathematical text, or a readable label. Marks are decorative and hidden from assistive technology by default. Provide label only when a standalone graphic conveys information that is not already in nearby copy; it then exposes an image role and accessible name. Native SVG attributes, className, and React19 refs are supported.',
      },
    },
  },
} satisfies Meta<typeof MathMark>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Playground: Story = {};

export const Family: Story = {
  parameters: { docs: { description: { story: 'The family specimen compares all three shapes. In an application composition, choose one.' } } },
  render: () => <div className="tw-story-row">{symbols.map(symbol => <div key={symbol} className="tw-story-stack" style={{ gap: 16, padding: 16 }}><MathMark symbol={symbol} /><p className="tw-story-label">{symbol}</p></div>)}</div>,
};

export const SmallAndLarge: Story = {
  render: () => <div className="tw-story-row" style={{ alignItems: 'end' }}>{[48, 96, 160].map(size => <div key={size} className="tw-story-stack" style={{ gap: 16, padding: 16 }}><MathMark symbol="asterisk" size={size} /><p className="tw-story-label">{size}px{size === 48 ? ' / minimum' : size === 96 ? ' / default' : ' / large'}</p></div>)}</div>,
};

export const PaperAndInk: Story = {
  render: () => <div className="tw-story-grid">{(['paper', 'ink'] as const).flatMap(theme => (['orange', 'lime'] as const).map(tone => <ThemeProvider key={`${theme}-${tone}`} theme={theme}><div className="tw-story-stack" style={{ padding: 32, minHeight: 208, border: '1px solid var(--tw-color-line)' }}><p className="tw-story-label">{theme} / {tone}</p><MathMark symbol="plus" tone={tone} /></div></ThemeProvider>))}</div>,
};

export const MeaningfulLabel: Story = {
  args: { symbol: 'asterisk', label: 'A six-arm Tinker Works brand mark' },
  parameters: { docs: { description: { story: 'A label gives a meaningful standalone mark an image role and accessible name. The mark remains outside the keyboard tab order.' } } },
};
