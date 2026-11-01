import { useMemo, useState } from 'react';
import { FigureStudy } from './FigureStudy';
import { OverlayStudy } from './BrandColorStudies';
import { MathMarkStudy } from './MathMarkStudy';
import { Alert, Button, Card, Checkbox, EmptyState, Icon, iconCatalog, Logo, Navigation, Pagination, Select, Switch, Tabs, Tag, TechnicalFigure, TextArea, TextField, TextLink, ThemeProvider, type ButtonProps } from '@tinker-works/ui';

const catalog = [
  { id: 'button', name: 'Button', group: 'Actions', description: 'Run an action, such as saving a form or opening a dialog.', guidance: 'Use one primary button for the main action in a group. Use a link when the action takes someone to another page.', api: 'variant: primary | secondary | tertiary | signal · size: sm | md | lg · loading · native button props', code: '<Button variant="primary" onClick={saveChanges}>Save changes</Button>' },
  { id: 'text-link', name: 'TextLink', group: 'Actions', description: 'Navigate to a page or another location.', guidance: 'Use text that describes the destination. Links should make sense when read without the surrounding sentence.', api: 'href · arrow: boolean · native anchor props', code: '<TextLink href="/settings">Account settings</TextLink>' },
  { id: 'text-field', name: 'TextField', group: 'Inputs', description: 'Enter a short piece of text.', guidance: 'Keep the label visible. Use hint text for instructions and an error message to explain how to correct a value.', api: 'label: string · hint · error · required · native input props', code: '<TextField label="Name" autoComplete="name" required />' },
  { id: 'text-area', name: 'TextArea', group: 'Inputs', description: 'Enter text that may need more than one line.', guidance: 'Give the field enough space for the expected answer. Put formatting instructions in the hint rather than the placeholder.', api: 'label: string · rows · hint · error · native textarea props', code: '<TextArea label="Message" rows={4} />' },
  { id: 'select', name: 'Select', group: 'Inputs', description: 'Choose one option from a list.', guidance: 'Use short option labels. For a small set that should stay visible, consider a group of native radio buttons.', api: 'label: string · hint · error · children: option elements · native select props', code: '<Select label="Language"><option>English</option></Select>' },
  { id: 'checkbox', name: 'Checkbox', group: 'Inputs', description: 'Select one or more independent options.', guidance: 'Describe what selecting the checkbox will do. A checkbox in a form usually takes effect when the form is submitted.', api: 'label: string · checked / defaultChecked · onChange · disabled', code: '<Checkbox label="Email me a copy" />' },
  { id: 'switch', name: 'Switch', group: 'Inputs', description: 'Turn a setting on or off.', guidance: 'Use a switch for a setting that takes effect immediately. Keep its label the same in both states.', api: 'label: string · checked: boolean · onCheckedChange · disabled', code: '<Switch label="Email notifications" checked={enabled} onCheckedChange={setEnabled} />' },
  { id: 'tag', name: 'Tag', group: 'Feedback', description: 'Show a short label, category, or status.', guidance: 'Include words that explain the meaning. Color and the optional dot support the label; they do not replace it.', api: 'tone: neutral | orange | lime · status: boolean · children', code: '<Tag status>In progress</Tag>' },
  { id: 'alert', name: 'Alert', group: 'Feedback', description: 'Explain an outcome or a problem that needs attention.', guidance: 'Say what happened and what the person can do next. Keep the message near the action or content it concerns.', api: 'tone: info | error | success · title: string · children', code: '<Alert title="Changes saved" tone="success">Your settings have been updated.</Alert>' },
  { id: 'empty-state', name: 'EmptyState', group: 'Feedback', description: 'Explain why an area has no content and what to do next.', guidance: 'Distinguish a new collection from an empty search result or a loading error. Offer an action when there is a useful next step.', api: 'title: string · children · action: ReactNode', code: '<EmptyState title="No items yet" action={<Button>Add an item</Button>} />' },
  { id: 'tabs', name: 'Tabs', group: 'Navigation', description: 'Switch between related views in the same area.', guidance: 'Keep tab labels short. Use page navigation for separate destinations. Arrow keys move between tabs; Home and End move to the first and last.', api: 'items: {id, label, content}[] · label · defaultValue / value · onValueChange', code: '<Tabs label="Item information" items={views} />' },
  { id: 'pagination', name: 'Pagination', group: 'Navigation', description: 'Move between pages of results.', guidance: 'Keep the current page visible and preserve the search or filters when changing pages.', api: 'page: number · totalPages: number · onPageChange: (page) => void', code: '<Pagination page={page} totalPages={5} onPageChange={setPage} />' },
  { id: 'navigation', name: 'Navigation', group: 'Navigation', description: 'Move between the main areas of a site.', guidance: 'Keep the labels consistent across pages. The current destination is marked with aria-current; the mobile menu can be closed with Escape.', api: 'items: {label, href}[] · activeHref · homeHref · logo', code: '<Navigation homeHref="/" items={items} activeHref="/about" />' },
  { id: 'card', name: 'Card', group: 'Layout', description: 'Group related content in a bordered surface.', guidance: 'Use a card when the grouping helps people read or compare content. Use ordinary headings and spacing when a border adds no useful distinction.', api: 'children · native article props', code: '<Card><h3>Getting started</h3><p>Read the setup guide.</p></Card>' },
  { id: 'logo', name: 'Logo', group: 'Brand', description: 'Display the Tinker Works wordmark.', guidance: 'Use the stacked wordmark where space allows. Keep clear space around it, and use the compact or monogram form only at smaller sizes.', api: 'variant: stacked | compact | monogram · native div props', code: '<Logo variant="stacked" />' },
  { id: 'icon', name: 'Icon', group: 'Brand', description: 'Add a small symbol to support an action or label.', guidance: 'Icons are hidden from assistive technology by default. Give an icon-only button an accessible label that describes its action.', api: 'name: IconName · size: number · native SVG props', code: '<Button aria-label="Search"><Icon name="search" /></Button>' },
  { id: 'math-mark', name: 'MathMark', group: 'Brand', description: 'Use a large mathematical sign as an editorial brand accent.', guidance: 'Choose one mark per composition, leave clear space, and keep it away from controls or text that could imply an action or footnote. Use lime against ink. Marks are decorative by default; supply label only when a standalone graphic carries meaning. Use ordinary text for equations.', api: 'symbol: plus | minus | asterisk · tone: orange | lime · size: number · label?: string · native SVG props', code: '<MathMark symbol="asterisk" tone="orange" size={96} />' },
  { id: 'theme', name: 'ThemeProvider', group: 'Brand', description: 'Apply the Paper or Ink theme to a section or application.', guidance: 'Themes can be nested. Import the shared stylesheet once, then put the theme boundary around the content that should use it.', api: 'theme: paper | ink · children · native div props', code: '<ThemeProvider theme="ink"><Button>Save changes</Button></ThemeProvider>' },
  { id: 'figure', name: 'TechnicalFigure', group: 'Layout', description: 'Pair an image or diagram with an explanatory caption.', guidance: 'Pass artwork as children and describe what it shows in the caption. Give meaningful images an accessible name. Keep drawing content and its interactions in the application.', api: 'children: ReactNode · caption: ReactNode · figure: string · native figure props', code: '<TechnicalFigure figure="FIG. 01" caption="Connections between interface regions.">\n  <YourDiagram />\n</TechnicalFigure>' },
  { id: 'highlight-overlay', name: 'HighlightOverlay', group: 'Brand', description: 'Mark a region of a drawing with a transparent accent layer.', guidance: 'Use orange to draw attention to a point and lime to mark a region to explore. Keep the underlying drawing visible and essential text outside the tint. Position a patch through className or wrap artwork as children.', api: 'tone: orange | lime · children · native span props', code: '<HighlightOverlay tone="lime">\n  <YourDrawing />\n</HighlightOverlay>' },
] as const;

type CatalogId = typeof catalog[number]['id'];
type CatalogCategory = 'All' | typeof catalog[number]['group'];
const categories: readonly CatalogCategory[] = ['All', ...new Set(catalog.map(item => item.group))];

function missingPreview(id: never): never {
  throw new Error(`No component preview is registered for ${id}`);
}

function ComponentPreview({ id }: { id: CatalogId }) {
  const [variant, setVariant] = useState<ButtonProps['variant']>('primary');
  const [checked, setChecked] = useState(true);
  const [value, setValue] = useState('Alex Morgan');
  const [page, setPage] = useState(2);
  const [saved, setSaved] = useState(false);
  const [tone, setTone] = useState<'info' | 'error' | 'success'>('info');
  switch (id) {
    case 'button': return <div className="pb-demo-stack"><Select label="Button variant" value={variant} onChange={event => setVariant(event.target.value as ButtonProps['variant'])}>{['primary', 'secondary', 'tertiary', 'signal'].map(item => <option key={item}>{item}</option>)}</Select><div className="pb-demo-row"><Button variant={variant} icon={<Icon name="arrow-right" size={18} />} onClick={() => setSaved(true)}>Save changes</Button><Button disabled>Disabled</Button><Button loading>Saving</Button></div><p className="pb-small" role="status">{saved ? 'Changes saved.' : 'Choose a variant to try it.'}</p></div>;
    case 'text-link': return <div className="pb-demo-stack"><TextLink href="#patterns">View patterns</TextLink><TextLink href="#foundations" arrow={false}>Read the foundations</TextLink></div>;
    case 'text-field': return <div className="pb-demo-stack"><TextField label="Name" autoComplete="name" value={value} onChange={event => setValue(event.target.value)} /><TextField label="Email address" type="email" autoComplete="email" error="Enter an email address, such as name@example.com." placeholder="name@example.com" /></div>;
    case 'text-area': return <TextArea label="Message" defaultValue="I'd like to know more about…" rows={4} hint="Include any details that will help us reply." />;
    case 'select': return <Select label="Language" defaultValue="en"><option value="en">English</option><option value="es">Español</option><option value="fr">Français</option></Select>;
    case 'checkbox': return <div className="pb-demo-stack"><Checkbox label="Email me a copy" checked={checked} onChange={event => setChecked(event.target.checked)} /><Checkbox label="Remember my preferences" defaultChecked /><Checkbox label="Managed by your organization" checked disabled /></div>;
    case 'switch': return <div className="pb-demo-stack"><Switch label="Email notifications" checked={checked} onCheckedChange={setChecked} /><p className="pb-small" role="status">{checked ? 'Email notifications are on.' : 'Email notifications are off.'}</p><Switch label="Required notifications" checked disabled onCheckedChange={() => {}} /></div>;
    case 'tag': return <div className="pb-demo-row"><Tag>Experiment</Tag><Tag>Prototype</Tag><Tag>Tool</Tag><Tag>Article</Tag><Tag status>In progress</Tag><Tag tone="lime">Complete</Tag><Tag tone="orange">Needs attention</Tag></div>;
    case 'alert': return <div className="pb-demo-stack"><Select label="Alert tone" value={tone} onChange={event => setTone(event.target.value as typeof tone)}><option value="info">Information</option><option value="error">Error</option><option value="success">Success</option></Select><Alert title={tone === 'error' ? 'Could not save changes' : tone === 'success' ? 'Changes saved' : 'Your session ends soon'} tone={tone}>{tone === 'error' ? 'Check your connection and try again.' : tone === 'success' ? 'Your settings have been updated.' : 'Save your changes before signing out.'}</Alert></div>;
    case 'empty-state': return saved ? <div className="pb-demo-stack"><p>First item</p><Button variant="tertiary" onClick={() => setSaved(false)}>Reset example</Button></div> : <EmptyState title="No items yet" action={<Button size="sm" onClick={() => setSaved(true)}>Add an item</Button>}>Items you add will appear here.</EmptyState>;
    case 'tabs': return <Tabs label="Item information" items={[{ id: 'overview', label: 'Overview', content: <p>A summary of the item.</p> }, { id: 'details', label: 'Details', content: <p>Additional information about the item.</p> }, { id: 'history', label: 'History', content: <p>No recent changes.</p> }]} />;
    case 'pagination': return <Pagination page={page} totalPages={5} onPageChange={setPage} />;
    case 'navigation': return <Navigation homeHref="#overview" logo={<Logo variant="compact" />} items={[{ label: 'Foundations', href: '#foundations' }, { label: 'Components', href: '#components' }, { label: 'Patterns', href: '#patterns' }]} activeHref="#components" />;
    case 'card': return <Card><h3>Getting started</h3><p>Find the styles and components you need for your application.</p><TextLink href="#foundations">Read the foundations</TextLink></Card>;
    case 'logo': return <div className="pb-logo-examples"><Logo /><Logo variant="compact" /><Logo variant="monogram" /></div>;
    case 'icon': return <div className="pb-icon-grid">{iconCatalog.map(({ name, label }) => <div key={name}><Icon name={name} size={32} /><span>{label}</span><code>{name}</code></div>)}</div>;
    case 'math-mark': return <MathMarkStudy />;
    case 'theme': return <div className="pb-theme-pair"><ThemeProvider theme="ink" className="pb-theme-mini"><span>Ink</span><Button size="sm">Save changes</Button></ThemeProvider><ThemeProvider theme="paper" className="pb-theme-mini"><span>Paper</span><Button size="sm">Save changes</Button></ThemeProvider></div>;
    case 'figure': return <div className="pb-figure-preview"><TechnicalFigure figure="FIG. 01" caption="Connections between interface regions."><FigureStudy /></TechnicalFigure></div>;
    case 'highlight-overlay': return <OverlayStudy />;
    default: return missingPreview(id);
  }
}

export default function ComponentCatalog() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CatalogCategory>('All');
  const [selectedId, setSelectedId] = useState<CatalogId>('button');
  const visible = useMemo(() => catalog.filter(item => (category === 'All' || item.group === category) && `${item.name} ${item.description} ${item.group}`.toLowerCase().includes(query.trim().toLowerCase())), [query, category]);
  const selected = visible.find(item => item.id === selectedId) ?? visible[0];
  return <>
    <div className="pb-catalog-tools"><TextField label="Find a component" placeholder="Search by name or purpose" value={query} onChange={event => setQuery(event.target.value)} /><Select label="Component category" value={category} onChange={event => setCategory(categories.find(item => item === event.target.value) ?? 'All')}>{categories.map(item => <option key={item} value={item}>{item}</option>)}</Select><span className="tw-sr-only" role="status">{visible.length} components found.</span></div>
    {selected ? <div className="pb-catalog-layout">
      <nav className="pb-component-index" aria-label="Component list"><ul>{visible.map(item => <li key={item.id}><button type="button" aria-current={selected.id === item.id ? 'true' : undefined} onClick={() => setSelectedId(item.id)}>{item.name}</button></li>)}</ul></nav>
      <article className="pb-component-detail" aria-labelledby={`component-${selected.id}`}>
        <header><h2 id={`component-${selected.id}`}>{selected.name}</h2><p>{selected.description}</p></header>
        <div className="pb-component-preview"><ComponentPreview key={selected.id} id={selected.id} /></div>
        <section className="pb-component-guidance"><h3>Usage</h3><p>{selected.guidance}</p><pre tabIndex={0}><code>{selected.code}</code></pre><h3>Props</h3><p className="pb-api">{selected.api}</p><p className="pb-small">Native attributes are supported where listed. Use a visible label and check keyboard interaction in your application.</p></section>
      </article>
    </div> : <EmptyState title="No matching components" action={<Button variant="secondary" onClick={() => { setQuery(''); setCategory('All'); }}>Clear search</Button>}>Try another name or category.</EmptyState>}
  </>;
}
