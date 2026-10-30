import { useRef, useState } from 'react';
import { Alert, Button, Card, EmptyState, Select, Switch, Tabs, Tag, TextField } from '@tinker-works/ui';

function FormExample() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const nameError = submitted && !name.trim() ? 'Enter your name.' : undefined;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailError = submitted && !emailValid ? 'Enter an email address, such as name@example.com.' : undefined;
  return <div className="pb-pattern-columns"><div className="pb-section-title"><h2>Form with validation</h2><p>Keep labels visible. Explain how to fix an error beside the field, and confirm when the form has been saved.</p><p>This example checks the form when you submit it. Nothing is sent to a server.</p></div><form className="pb-pattern-form" noValidate onSubmit={event => {
    event.preventDefault(); setSubmitted(true); setSaved(false);
    if (!name.trim()) { nameRef.current?.focus(); return; }
    if (!emailValid) { emailRef.current?.focus(); return; }
    setSaved(true);
  }}>
    <TextField ref={nameRef} label="Name" name="name" autoComplete="name" required value={name} error={nameError} onChange={event => { setName(event.target.value); setSaved(false); }} />
    <TextField ref={emailRef} label="Email" name="email" type="email" autoComplete="email" required value={email} error={emailError} hint="Used for account updates." onChange={event => { setEmail(event.target.value); setSaved(false); }} />
    <div className="pb-demo-row"><Button type="submit">Save details</Button><Button type="reset" variant="secondary" onClick={() => { setName(''); setEmail(''); setSubmitted(false); setSaved(false); }}>Reset form</Button></div>
    {saved && <Alert tone="success" title="Details saved">Your changes have been saved in this preview.</Alert>}
  </form></div>;
}

function SettingsExample() {
  const [notifications, setNotifications] = useState(true);
  const [summary, setSummary] = useState(false);
  return <div className="pb-pattern-columns"><div className="pb-section-title"><h2>Settings</h2><p>Use a switch when a setting changes immediately. Place a short explanation beside it so people know what will happen.</p><p>Changes in this preview last until you leave the page.</p></div><div className="pb-pattern-settings">
    <div><Switch label="Email notifications" checked={notifications} onCheckedChange={setNotifications} /><p>Receive updates about your account.</p></div>
    <div><Switch label="Weekly summary" checked={summary} onCheckedChange={setSummary} /><p>Get one email with the week's updates.</p></div>
    <p className="pb-small" role="status">Email notifications {notifications ? 'on' : 'off'}. Weekly summary {summary ? 'on' : 'off'}.</p>
  </div></div>;
}

const resources = [
  { title: 'Getting started', category: 'Guide', description: 'Set up the package and build your first screen.' },
  { title: 'Writing labels', category: 'Guide', description: 'Choose clear names for controls and actions.' },
  { title: 'Release notes', category: 'Article', description: 'Read about the latest changes.' },
];
function SearchExample() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const filtered = resources.filter(item => `${item.title} ${item.description}`.toLowerCase().includes(query.trim().toLowerCase()) && (category === 'all' || item.category === category));
  return <div className="pb-pattern-body"><div className="pb-section-title"><h2>Search and filters</h2><p>Show the current results and keep filters available when nothing matches. A clear action should restore the full list.</p></div>
    <div className="pb-token-tools"><TextField type="search" label="Search resources" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by title or description" /><Select label="Resource type" value={category} onChange={event => setCategory(event.target.value)}><option value="all">All types</option><option value="Guide">Guide</option><option value="Article">Article</option></Select></div>
    <p className="pb-small" role="status">{filtered.length} {filtered.length === 1 ? 'resource' : 'resources'} found</p>
    {filtered.length ? <div className="pb-pattern-results">{filtered.map(item => <Card key={item.title}><Tag>{item.category}</Tag><h3>{item.title}</h3><p>{item.description}</p></Card>)}</div> : <EmptyState title="No resources found" action={<Button variant="secondary" onClick={() => { setQuery(''); setCategory('all'); }}>Clear filters</Button>}>Try another search or clear the filters.</EmptyState>}
  </div>;
}

export default function Patterns() {
  return <Tabs label="Pattern examples" items={[
    { id: 'form', label: 'Forms', content: <FormExample /> },
    { id: 'settings', label: 'Settings', content: <SettingsExample /> },
    { id: 'search', label: 'Search', content: <SearchExample /> },
  ]} />;
}
