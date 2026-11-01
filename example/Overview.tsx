import { Icon, MathMark, ThemeProvider, useReveal, type Theme } from '@tinker-works/ui';
import { OverviewSheet } from './OverviewSheet';

const topics = [
  { id: 'foundations', title: 'Foundations', description: 'Choose colors, typography, spacing, and other styles.', icon: 'crosshair' },
  { id: 'components', title: 'Components', description: 'Find a component, try its states, and see how to use it.', icon: 'cube' },
  { id: 'patterns', title: 'Patterns', description: 'Combine components for common tasks such as forms and settings.', icon: 'nodes' },
] as const;

/** The library band uses the opposite theme to the page, so the page changes pace partway down. */
export default function Overview({ theme = 'ink' }: { theme?: Theme }) {
  const closing = useReveal<HTMLElement>({ threshold: 0.6 });
  return <>
    <OverviewSheet action={{ label: 'Browse components', href: '#components' }} />
    <section className="pb-overview-topics" aria-label="Design system reference">
      {topics.map(({ id, title, description, icon }) => (
        <a href={`#${id}`} key={id}>
          <div><Icon name={icon} size={28} /><h2>{title}</h2><p>{description}</p></div>
          <Icon name="arrow-right" size={20} />
        </a>
      ))}
    </section>
    <ThemeProvider theme={theme === 'paper' ? 'ink' : 'paper'} className="pb-band">
    <section className="pb-get-started" aria-labelledby="get-started-title">
      <div>
        <h2 id="get-started-title">Use the library</h2>
        <p>Import the components and styles into a React application. The optional font stylesheet includes the brand fonts.</p>
        <p>Choose Paper or Ink with <code>ThemeProvider</code>. Components use the same tokens in either theme.</p>
      </div>
      <ThemeProvider theme={theme} className="pb-code-panel">
        <pre tabIndex={0}><code>{`import { Button, ThemeProvider } from '@tinker-works/ui';
import '@tinker-works/ui/styles.css';
import '@tinker-works/ui/fonts.css';

<ThemeProvider theme="ink">
  <Button>Save changes</Button>
</ThemeProvider>`}</code></pre>
      </ThemeProvider>
    </section>
    </ThemeProvider>
    <section className="pb-overview-example" ref={closing.ref}>
      <div>
        <h2>See it in an application</h2>
        <p>The examples show how the library can be used in a product. Their data and application logic stay outside the design system.</p>
        <a href="#example">View examples <Icon name="arrow-right" size={16} /></a>
      </div>
      <MathMark symbol="asterisk" tone="orange" size={96} className="tw-register" />
    </section>
  </>;
}
