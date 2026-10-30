import type { Preview } from '@storybook/react-vite';
import { ThemeProvider } from '../src/index';
import '../src/styles/index.css';
import '../src/styles/fonts.css';
import './storybook.css';

const preview: Preview = {
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      description: 'Tinker Works color theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'paper', title: 'Paper / warm cream' },
          { value: 'ink', title: 'Ink / charcoal' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'paper' },
  decorators: [
    (Story, context) => (
      <ThemeProvider theme={context.globals.theme === 'ink' ? 'ink' : 'paper'}>
        <div className="tw-story-stage"><Story /></div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: 'error' },
    docs: { toc: true },
    options: {
      storySort: {
        order: ['Start here', 'Foundations', 'Brand', 'Components', 'Patterns'],
      },
    },
  },
};

export default preview;
