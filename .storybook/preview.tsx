import type { Preview } from '@storybook/react-vite';
import { ThemeProvider } from '../src/index';
import { TweedsDocsContainer } from './DocsContainer';
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
          { value: 'ink', title: 'Ink / blue-black' },
          { value: 'paper', title: 'Paper / soft white' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'ink' },
  decorators: [
    (Story, context) => (
      <ThemeProvider theme={context.globals.theme === 'paper' ? 'paper' : 'ink'}>
        <div className="tw-story-stage"><Story /></div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: 'error' },
    docs: { toc: true, container: TweedsDocsContainer },
    options: {
      storySort: {
        order: ['Start here', 'Foundations', ['System reference', 'Motion', 'ThemeProvider'], 'Brand', 'Components', 'Patterns'],
      },
    },
  },
};

export default preview;
