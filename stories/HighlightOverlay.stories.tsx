import type { Meta, StoryObj } from '@storybook/react-vite';
import { HighlightOverlay } from '../src';
import { OverlayStudy } from '../example/BrandColorStudies';

const meta = {
  title: 'Components/HighlightOverlay', component: HighlightOverlay,
  args: { tone: 'orange' },
  argTypes: { tone: { control: 'inline-radio', options: ['orange', 'lime'] }, children: { control: false } },
  parameters: { docs: { description: { component: 'A translucent orange or lime layer for a drawing or image. It can wrap supplied artwork or be positioned above a region with a className. Its opacity changes the graphic layer only; the wrapper and children keep their own opacity. Keep captions, labels, and essential reading text outside the tint. The overlay does not intercept pointer events. Use solid accessible colors for controls and status messages.' } } },
} satisfies Meta<typeof HighlightOverlay>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: args => <HighlightOverlay {...args}><svg viewBox="0 0 280 180" width="280" role="img" aria-label="Curves and alignment guides beneath a colored layer"><g fill="none" stroke="currentColor" strokeWidth="1"><path d="M20 90h240M140 20v140" strokeDasharray="6 4 2 4" /><path d="M25 130C90 130 74 40 140 40S190 140 255 75M25 134C91 130 78 37 140 37S190 144 258 76" /><circle cx="140" cy="90" r="50" /><path d="m134 90h12m-6-6v12M25 155h230M25 150v10m230-10v10" /></g></svg></HighlightOverlay>,
};
export const OverADrawing: Story = { render: () => <OverlayStudy /> };
