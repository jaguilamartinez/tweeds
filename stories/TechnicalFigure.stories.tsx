import type { Meta, StoryObj } from '@storybook/react-vite';
import { TechnicalFigure } from '../src/index';
import { FigureStudy } from '../example/FigureStudy';

const meta = {
  title: 'Components/TechnicalFigure',
  component: TechnicalFigure,
  args: {
    children: <FigureStudy />,
    figure: 'FIG. 01',
    caption: 'A connection between two interface regions. Lime marks selected content; orange traces the connection.',
  },
  argTypes: {
    children: { control: false },
    caption: { control: 'text' },
    figure: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: 'A native figure with a consistent number and caption. Supply the image, SVG, code sample, or other content as children. The wrapper does not choose the subject or control its behavior. Give an SVG a useful title, an image appropriate alt text, and keep the caption understandable on its own. For interactive artwork, the consuming application owns its controls, state, and reduced-motion behavior.',
      },
    },
  },
} satisfies Meta<typeof TechnicalFigure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ConnectionStudy: Story = {};

export const RichCaption: Story = {
  args: {
    figure: 'FIG. 02',
    caption: <><strong>Selected content and its connection.</strong> The same content is shown in two regions of an interface.</>,
  },
};

export const CodeSample: Story = {
  args: {
    children: <pre aria-label="CSS layout example"><code>{'.content {\n  display: grid;\n  gap: var(--tw-space-lg);\n}'}</code></pre>,
    figure: 'FIG. 03',
    caption: 'A content grid using the shared spacing token.',
  },
  parameters: {
    docs: {
      description: {
        story: 'The content slot also accepts ordinary HTML. Keep the number and caption outside the supplied content rather than nesting another figure.',
      },
    },
  },
};
