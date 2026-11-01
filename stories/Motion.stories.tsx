import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrandGeometry } from '../example/BrandGeometry';
import { EasingCurves, MotionVerbs } from '../example/MotionStudy';

const meta = {
  title: 'Foundations/Motion',
  parameters: { docs: { description: { component: 'Motion is drafting: it shows how a drawing or page is put together, in the order a person would make it. Each verb is a class from the shared stylesheet. Place verbs inside a root attached to `useReveal()`; the root plays them once when it scrolls into view and then rests on the authored still image. Set `--tw-reveal-at` to order a sequence. Reduced motion, print, and `ThemeProvider motion="off"` show the finished drawing.' } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Verbs: Story = {
  render: () => <MotionVerbs />,
  parameters: { docs: { description: { story: 'Draft, mark, register, measure, type, and assemble. Use Replay to run a verb again.' } } },
};

export const EasingCurves_: Story = {
  name: 'Easing curves',
  render: () => <EasingCurves />,
  parameters: { docs: { description: { story: 'Each curve is plotted from the token source. The point moves across at a constant rate and up at the token’s easing, so it traces the curve; the orange tick on the right shows the value, including the spring’s overshoot.' } } },
};

export const DraftingSequence: Story = {
  render: () => <BrandGeometry variant="specimen" title="Interface layers with alignment guides and interaction details" caption="Guides, then each layer's linework and markers. The layers lift apart and the notes are labelled." />,
  parameters: { docs: { description: { story: 'The verbs combined: the interface drawing drafts itself in about two seconds and rests on the authored drawing.' } } },
};
