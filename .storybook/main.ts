import type { StorybookConfig } from '@storybook/react-vite';

const fontFiles = ['instrument-serif', 'instrument-sans', 'ibm-plex-mono']
  .map(name => ({ from: `../node_modules/@fontsource/${name}/files`, to: '/fonts' }));

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: '@storybook/react-vite',
  // The manager frame loads brand faces from here (manager-head.html); stories use fonts.css.
  staticDirs: fontFiles,
  docs: { defaultName: 'Reference' },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      // Configuration and decorators are type-checked, but do not define component APIs.
      exclude: ['**/*.stories.tsx', '**/.storybook/**'],
    },
  },
};

export default config;
