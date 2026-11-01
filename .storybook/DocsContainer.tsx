import { useEffect, useState, type PropsWithChildren } from 'react';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
import { ThemeProvider, type Theme } from '../src/index';
import { inkTheme, paperTheme } from './theme';

type GlobalsContext = DocsContainerProps['context'] & { store?: { userGlobals?: { get(): Record<string, unknown> } } };
const themeOf = (globals?: Record<string, unknown>): Theme => globals?.theme === 'ink' ? 'ink' : 'paper';

/** Docs pages take the toolbar theme too, so prose and examples sit on the same sheet. */
export function TweedsDocsContainer({ context, children }: PropsWithChildren<DocsContainerProps>) {
  const [theme, setTheme] = useState<Theme>(() => themeOf((context as GlobalsContext).store?.userGlobals?.get()));
  useEffect(() => {
    const update = ({ globals }: { globals: Record<string, unknown> }) => setTheme(themeOf(globals));
    context.channel.on(GLOBALS_UPDATED, update);
    return () => context.channel.off(GLOBALS_UPDATED, update);
  }, [context]);
  return <ThemeProvider theme={theme} className="tw-docs">
    <DocsContainer context={context} theme={theme === 'ink' ? inkTheme : paperTheme}>{children}</DocsContainer>
  </ThemeProvider>;
}
