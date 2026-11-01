import { addons } from 'storybook/manager-api';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { inkTheme, paperTheme } from './theme';

addons.setConfig({ theme: inkTheme });

// The manager follows the Paper / Ink toolbar, like the stories it frames.
addons.register('tweeds/theme', api => {
  const apply = ({ globals }: { globals?: Record<string, unknown> }) => {
    const ink = globals?.theme !== 'paper';
    api.setOptions({ theme: ink ? inkTheme : paperTheme });
    // Storybook sets selected sidebar text in white; manager-head.html darkens it on lime.
    document.documentElement.dataset.tweedsTheme = ink ? 'ink' : 'paper';
  };
  api.on(SET_GLOBALS, apply);
  api.on(GLOBALS_UPDATED, apply);
});
