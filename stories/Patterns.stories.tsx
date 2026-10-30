import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, Button, Card, EmptyState, Select, Switch, Tag, TextField, TextLink } from '../src/index';

function ProfileForm() {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  return <main className="tw-pattern" style={{ maxWidth: 640 }}><h1>Profile details</h1><p>Visible labels, field errors, and a save confirmation.</p><form className="tw-story-stack" noValidate onSubmit={event => {
    event.preventDefault(); setSubmitted(true); setSaved(false);
    if (!name.trim()) { inputRef.current?.focus(); return; }
    setSaved(true);
  }}><TextField ref={inputRef} label="Name" name="name" autoComplete="name" required value={name} onChange={event => { setName(event.target.value); setSaved(false); }} error={submitted && !name.trim() ? 'Enter your name.' : undefined} /><TextField label="Email" name="email" type="email" autoComplete="email" defaultValue="alex@example.com" hint="Used for account updates." /><div className="tw-story-row"><Button type="submit">Save details</Button><Button type="reset" variant="secondary" onClick={() => { setName(''); setSubmitted(false); setSaved(false); }}>Reset form</Button></div>{saved && <Alert tone="success" title="Details saved">Your changes have been saved in this preview.</Alert>}</form></main>;
}

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [summary, setSummary] = useState(false);
  return <main className="tw-pattern" style={{ maxWidth: 720 }}><h1>Notifications</h1><p>These settings apply immediately.</p><div className="tw-story-stack"><div><Switch label="Email notifications" checked={notifications} onCheckedChange={setNotifications} /><p>Receive updates about your account.</p></div><div><Switch label="Weekly summary" checked={summary} onCheckedChange={setSummary} /><p>Get one email with the week's updates.</p></div><p role="status">Email notifications {notifications ? 'on' : 'off'}. Weekly summary {summary ? 'on' : 'off'}.</p></div></main>;
}

const resources = [
  { title: 'Getting started', category: 'Guide', description: 'Install the package and build your first screen.', href: '#setup' },
  { title: 'Writing labels', category: 'Guide', description: 'Choose clear names for controls and actions.', href: '#labels' },
  { title: 'Release notes', category: 'Article', description: 'Read about the latest changes.', href: '#releases' },
];
function ResourceSearch() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const filtered = resources.filter(item => item.title.toLowerCase().includes(query.toLowerCase()) && (category === 'all' || category === item.category));
  return <main className="tw-pattern"><h1>Resources</h1><div className="tw-story-row"><TextField label="Search resources" type="search" value={query} onChange={event => setQuery(event.target.value)} /><Select label="Resource type" value={category} onChange={event => setCategory(event.target.value)}><option value="all">All types</option><option value="Guide">Guide</option><option value="Article">Article</option></Select></div><p role="status">{filtered.length} {filtered.length === 1 ? 'resource' : 'resources'} found</p>{filtered.length ? <div className="tw-story-grid">{filtered.map(item => <Card key={item.title}><Tag>{item.category}</Tag><h2>{item.title}</h2><p>{item.description}</p><TextLink href={item.href}>Read {item.title.toLowerCase()}</TextLink></Card>)}</div> : <EmptyState title="No resources found" action={<Button variant="secondary" onClick={() => { setQuery(''); setCategory('all'); }}>Clear filters</Button>}>Try another search or clear the filters.</EmptyState>}</main>;
}

const meta = {
  title: 'Patterns/Common layouts',
  parameters: { layout: 'fullscreen', controls: { disable: true }, docs: { description: { component: 'Examples of common interface tasks built from the public components: completing a form, changing a setting, browsing content, and filtering a list. Each example uses local state. The application supplies routing, persistence, and business rules.' } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const FormValidation: Story = { render: () => <ProfileForm /> };
export const ImmediateSettings: Story = { render: () => <Settings /> };
export const SearchAndFilters: Story = { render: () => <ResourceSearch /> };
export const ContentCollection: Story = { render: () => <main className="tw-pattern"><h1>Resources</h1><div className="tw-story-grid">{resources.map(item => <Card key={item.title}><Tag>{item.category}</Tag><h2>{item.title}</h2><p>{item.description}</p><TextLink href={item.href}>Read {item.title.toLowerCase()}</TextLink></Card>)}</div></main> };
