import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Icon, ThemeProvider, type Theme } from '@tinker-works/ui';
import Overview from './Overview';
import { TweedsLogo } from './TweedsLogo';

const pages = {
  overview: { label: 'Overview' },
  foundations: {
    label: 'Foundations',
    description: 'The styles and tokens used throughout the library, with guidance on when and how to use them.',
    View: lazy(() => import('./Foundations')),
  },
  components: {
    label: 'Components',
    description: 'Reusable interface components with examples, API details, and usage guidance.',
    View: lazy(() => import('./ComponentCatalog')),
  },
  patterns: {
    label: 'Patterns',
    description: 'Examples of components working together to handle common interface tasks.',
    View: lazy(() => import('./Patterns')),
  },
  example: {
    label: 'Examples',
    description: 'Working application examples built with the library. Their features and data are separate from the design system.',
    View: lazy(() => import('./ProductExample')),
  },
} as const;

type Page = keyof typeof pages;
const pageIds = Object.keys(pages) as Page[];

function currentPage(): Page {
  const id = window.location.hash.slice(1);
  return Object.hasOwn(pages, id) ? id as Page : 'overview';
}

function ReferencePage({ page }: { page: Exclude<Page, 'overview'> }) {
  const { label, description, View } = pages[page];
  return <>
    <div className="pb-page-intro"><h1>{label}</h1><p>{description}</p></div>
    {page === 'example' ? <div className="pb-example-container"><View /></div> : <View />}
  </>;
}

export default function App() {
  const [page, setPage] = useState<Page>(currentPage);
  const [theme, setTheme] = useState<Theme>('paper');
  const [menuOpen, setMenuOpen] = useState(false);
  const main = useRef<HTMLElement>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const selected = pages[page];

  useEffect(() => {
    function handleRoute() {
      setPage(currentPage());
      setMenuOpen(false);
      window.scrollTo(0, 0);
      main.current?.focus({ preventScroll: true });
    }
    window.addEventListener('hashchange', handleRoute);
    return () => window.removeEventListener('hashchange', handleRoute);
  }, []);

  useEffect(() => { document.title = `${selected.label} — Tweeds`; }, [selected.label]);

  return (
    <ThemeProvider theme={theme} className="playbook">
      <a className="pb-skip" href="#playbook-main" onClick={event => {
        event.preventDefault();
        main.current?.focus();
        main.current?.scrollIntoView();
      }}>Skip to content</a>
      <aside className={`pb-sidebar ${menuOpen ? 'pb-sidebar--open' : ''}`}>
        <div className="pb-sidebar-brand">
          <a href="#overview" aria-label="Tweeds design system home"><TweedsLogo aria-hidden="true" /></a>
          <button
            ref={menuToggle}
            type="button"
            className="pb-mobile-menu"
            aria-label={menuOpen ? 'Close playbook navigation' : 'Open playbook navigation'}
            aria-expanded={menuOpen}
            aria-controls="playbook-navigation"
            onClick={() => setMenuOpen(open => !open)}
          ><Icon name={menuOpen ? 'close' : 'menu'} /></button>
        </div>
        <nav id="playbook-navigation" aria-label="Playbook" onKeyDown={event => {
          if (event.key === 'Escape') {
            setMenuOpen(false);
            menuToggle.current?.focus();
          }
        }}>
          {pageIds.map(id => (
            <a href={`#${id}`} key={id} aria-current={page === id ? 'page' : undefined} onClick={() => setMenuOpen(false)}>
              {pages[id].label}
            </a>
          ))}
        </nav>
        <div className="pb-sidebar-footer"><span>Tweeds</span><code>v0.1.0</code></div>
      </aside>
      <div className="pb-shell">
        <header className="pb-topbar">
          <span>{selected.label}</span>
          <button
            className="pb-theme-button"
            type="button"
            aria-label={`Switch to ${theme === 'paper' ? 'ink' : 'paper'} theme`}
            onClick={() => setTheme(current => current === 'paper' ? 'ink' : 'paper')}
          >
            <Icon name={theme === 'paper' ? 'sun' : 'moon'} size={17} />
            <span>{theme === 'paper' ? 'Paper' : 'Ink'}</span>
          </button>
        </header>
        <main id="playbook-main" ref={main} tabIndex={-1} className={`pb-main pb-main--${page}`}>
          <Suspense fallback={<p className="pb-small" role="status">Loading reference…</p>}>
            {page === 'overview' ? <Overview /> : <ReferencePage page={page} />}
          </Suspense>
          <footer className="pb-page-footer">
            <span>Tweeds — Tinker Works Design System</span>
            <a href="#foundations">Foundations</a><a href="#components">Components</a>
          </footer>
        </main>
      </div>
    </ThemeProvider>
  );
}
