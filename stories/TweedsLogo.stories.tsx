import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeProvider } from '../src/index';
import { TweedsLogo } from '../example/TweedsLogo';

const meta = {
  title: 'Brand/Tweeds',
  component: TweedsLogo,
  args: { withDescriptor: false },
  argTypes: { withDescriptor: { control: 'boolean' } },
  parameters: {
    docs: {
      description: {
        component: 'Tweeds identifies the Tinker Works Design System playbook. Its wordmark uses DM Serif Display, with “Tinker Works Design System” beneath it in the full lockup. This is a private playbook component in example/, separate from the public Tinker Works Logo used in applications. Keep its natural letter proportions and use the supplied descriptor rather than adding other copy inside the mark.',
      },
    },
  },
} satisfies Meta<typeof TweedsLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Wordmark: Story = {};
export const Lockup: Story = { args: { withDescriptor: true } };
export const Reversed: Story = {
  args: { withDescriptor: true },
  render: args => (
    <ThemeProvider theme="ink">
      <div style={{ width: 360, maxWidth: '100%', padding: 24 }}><TweedsLogo {...args} /></div>
    </ThemeProvider>
  ),
};
