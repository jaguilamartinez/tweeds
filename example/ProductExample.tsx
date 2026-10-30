import { useEffect, useRef, useState } from 'react';
import {
  Alert, Button, EmptyState, Icon, Select, Tabs, Tag, TextField,
} from '@tinker-works/ui';
import { ActivityTimeline, ArtifactCard, ContributorBadge, WorkflowDiagram, type WorkflowStep } from './common-thread/components';
import { createInitialArtifacts, maya, projectQuestion, researchAgent } from './common-thread/data';
import { artifactStatusLabels, type ActivityItem, type Artifact } from './common-thread/model';
import { BrandGeometry } from './BrandGeometry';
import './product.css';

function workflowSteps(status: Artifact['status']): WorkflowStep[] {
  return [
    { id: 'question', label: 'Frame a question', actor: 'human', status: 'complete' },
    { id: 'draft', label: 'Propose a draft', actor: 'agent', status: status === 'draft' ? 'active' : 'complete' },
    { id: 'review', label: 'Review together', actor: 'shared', status: status === 'in-review' ? 'active' : status === 'accepted' ? 'complete' : 'queued' },
    { id: 'artifact', label: 'Keep an artifact', actor: 'shared', status: status === 'accepted' ? 'complete' : 'queued' },
  ];
}

export default function ProductExample() {
  const [route, setRoute] = useState<'landing' | 'workspace'>('landing');
  const [artifacts, setArtifacts] = useState(createInitialArtifacts);
  const [selectedId, setSelectedId] = useState('brief');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [notice, setNotice] = useState('');
  const [detailTab, setDetailTab] = useState('activity');
  const workspaceHeading = useRef<HTMLHeadingElement>(null);
  const focusWorkspace = useRef(false);
  const filtered = artifacts.filter(artifact => (status === 'all' || artifact.status === status) && `${artifact.title} ${artifact.description}`.toLowerCase().includes(query.toLowerCase()));
  const selected = filtered.find(artifact => artifact.id === selectedId) ?? filtered[0];

  useEffect(() => {
    if (focusWorkspace.current && route === 'workspace') {
      workspaceHeading.current?.focus();
      focusWorkspace.current = false;
    }
  }, [route]);

  function navigate(nextRoute: typeof route) {
    setNotice('');
    if (nextRoute === route) return;
    focusWorkspace.current = nextRoute === 'workspace';
    setRoute(nextRoute);
  }

  function reset() {
    setArtifacts(createInitialArtifacts()); setSelectedId('brief'); setQuery(''); setStatus('all'); setDetailTab('activity');
    setNotice('The demo has been reset. Both sample artifacts are restored.');
  }
  function updateArtifact(action: 'revision' | 'submit' | 'accept' | 'version') {
    if (!selected) return;
    if ((action === 'accept' || action === 'revision') && selected.status !== 'in-review') return;
    if (action === 'submit' && selected.status !== 'draft') return;
    if (action === 'version' && selected.status !== 'accepted') return;
    const version = action === 'version' ? `${selected.version.split('.')[0]}.${Number(selected.version.split('.')[1]) + 1}` : selected.version;
    const activity: ActivityItem = {
      id: `${selected.id}-${Date.now()}-${selected.activity.length}`, actor: action === 'version' || action === 'submit' ? researchAgent : maya,
      action: action === 'accept' ? 'Accepted this version' : action === 'revision' ? 'Requested a revision' : action === 'submit' ? 'Submitted the draft for review' : 'Started the next version',
      detail: action === 'accept' ? 'Human review complete. This version is a reference for the next step.' : action === 'revision' ? 'Clarify the acceptance criteria before another review. The artifact returns to draft.' : action === 'submit' ? 'The working draft is ready for Maya to review. Its contributions and earlier decisions remain attached.' : `A new working draft follows version ${selected.version}. Earlier contributions stay in the history.`,
      time: 'Just now', version,
    };
    setArtifacts(current => current.map(artifact => artifact.id === selected.id ? { ...artifact, version, status: action === 'accept' ? 'accepted' : action === 'submit' ? 'in-review' : 'draft', activity: [...artifact.activity, activity] } : artifact));
    setSelectedId(selected.id); setStatus('all'); setDetailTab('activity');
    setNotice(`${selected.title} v${version}: ${action === 'accept' ? 'accepted by Maya Chen' : action === 'revision' ? 'revision requested by Maya Chen' : action === 'submit' ? 'submitted for review by Research agent' : 'a new draft started by Research agent'}. Added to the activity history.`);
  }

  return <section className="px-product" aria-label="Common Thread example application">
    <div className="px-demo-bar">
      <span className="px-caption">EXAMPLE SPA <span aria-hidden="true">/</span> COMMON THREAD</span>
      <nav className="px-route-switch" aria-label="Example application pages">
        <button type="button" aria-pressed={route === 'landing'} onClick={() => navigate('landing')}>Landing</button>
        <button type="button" aria-pressed={route === 'workspace'} onClick={() => navigate('workspace')}>Workspace</button>
      </nav>
    </div>
    <div className="px-app">
      <header className="px-app-header">
        <div className="px-product-name"><span className="px-thread-mark" aria-hidden="true"><i /><i /><i /></span><span>Common Thread<small>EXAMPLE APPLICATION</small></span></div>
        <span className="px-local-label"><span />Local demo</span>
      </header>
      {route === 'landing' ? <div className="px-landing">
        <div className="px-hero">
          <div className="px-hero-copy">
            <p className="px-caption"><span className="px-signal" />DOCUMENT HISTORY AND REVIEW</p>
            <h2>Review work<br /><em>from people and agents.</em></h2>
            <p className="px-lead">See who changed a document, read the reasons for each change, and decide what to accept.</p>
            <Button icon={<Icon name="arrow-right" />} onClick={() => navigate('workspace')}>Explore workspace</Button>
            <p className="px-demo-note">Try reviewing a design brief and creating its next version.</p>
          </div>
          <div className="px-hero-figure">
            <div className="px-figure-heading"><span className="px-caption">FIG. 01 / THE INTERFACE, OPENED UP</span><Tag>Sample data</Tag></div>
            <BrandGeometry className="px-interface-study" title="A digital interface separated into layout, content and interaction layers." interactive={false} />
            <div className="px-example-artifact"><span className="px-document-icon" aria-hidden="true"><Icon name="layers" size={26} /></span><div><span className="px-caption">ARTIFACT / 001</span><h3>Design brief <span>v0.3</span></h3></div><Tag status tone="orange">IN REVIEW</Tag></div>
            <div className="px-figure-note"><ContributorBadge {...maya} /><span>Maya reviews this version before it is accepted.</span></div>
          </div>
        </div>
        <div className="px-research-question"><span className="px-caption">ABOUT THIS EXAMPLE</span><p>{projectQuestion}</p></div>
      </div> : <div className="px-workspace">
        <div className="px-workspace-title"><div><span className="px-caption">WORKSPACE / 001</span><h2 ref={workspaceHeading} tabIndex={-1}>Workspace</h2><p>Review documents and their change history.</p></div><Button variant="tertiary" size="sm" onClick={reset}>Reset demo</Button></div>
        {notice && <Alert title="Workspace updated" tone="success" className="px-notice">{notice}</Alert>}
        <div className="px-work-grid">
          <aside className="px-artifact-list" aria-label="Artifacts">
            <div className="px-list-heading"><h3>Artifacts</h3><span className="px-caption" aria-live="polite">{filtered.length} OF {artifacts.length}</span></div>
            <TextField label="Find an artifact" type="search" placeholder="Search title or description" value={query} onChange={event => setQuery(event.target.value)} />
            <Select label="Artifact status" value={status} onChange={event => setStatus(event.target.value)}><option value="all">All statuses</option><option value="draft">Draft</option><option value="in-review">In review</option><option value="accepted">Accepted</option></Select>
            <div className="px-artifact-cards">{filtered.map(artifact => <ArtifactCard key={artifact.id} title={artifact.title} description={artifact.description} version={`v${artifact.version}`} status={artifact.status} contributors={artifact.contributors} selected={selected?.id === artifact.id} onOpen={() => { setSelectedId(artifact.id); setDetailTab('activity'); setNotice(''); }} />)}</div>
          </aside>
          <div className="px-artifact-detail">
            {selected ? <>
              <div className="px-detail-overview">
              <div className="px-detail-heading"><span className="px-caption">ARTIFACT / {selected.id === 'brief' ? '001' : '002'}</span><Tag tone={selected.status === 'accepted' ? 'lime' : selected.status === 'in-review' ? 'orange' : 'neutral'} status={selected.status === 'in-review'}>{artifactStatusLabels[selected.status]}</Tag></div>
              <div className="px-detail-title"><h3>{selected.title}</h3><span className="px-version">v{selected.version}</span></div>
              <p className="px-detail-description">{selected.description}</p>
              <div className="px-contributors">{selected.contributors.map(actor => <ContributorBadge key={actor.name} {...actor} />)}</div>
              </div>
              <Tabs label="Artifact details" value={detailTab} onValueChange={setDetailTab} items={[
                { id: 'activity', label: 'Activity', content: <div className="px-tab-content"><p className="px-caption px-section-caption">CONTRIBUTIONS, CONTEXT & DECISIONS</p><ActivityTimeline items={selected.activity.map(item => ({ ...item, version: item.version ? `v${item.version}` : undefined }))} /></div> },
                { id: 'overview', label: 'Overview', content: <div className="px-tab-content"><h4>About this document</h4><p>{projectQuestion}</p><dl className="px-artifact-facts"><div><dt>Objective</dt><dd>Make contributions and review decisions easy to trace.</dd></div><div><dt>Review process</dt><dd>Agents propose changes. People review and accept them.</dd></div><div><dt>Current step</dt><dd>{selected.status === 'accepted' ? 'Accepted. You can start a new version and retain this history.' : selected.status === 'in-review' ? 'Maya is reviewing the proposed changes.' : 'This draft is open for changes.'}</dd></div></dl></div> },
                { id: 'workflow', label: 'Workflow', content: <div className="px-tab-content"><p className="px-caption px-section-caption">FROM QUESTION TO SHARED ARTIFACT</p><WorkflowDiagram steps={workflowSteps(selected.status)} compact /><p className="px-demo-note">The current step follows the artifact status. Human review records a decision before work moves forward.</p></div> },
              ]} />
              <div className="px-artifact-actions"><span className="px-caption">NEXT STEP / {selected.status === 'draft' ? 'AGENT PROPOSAL' : selected.status === 'accepted' ? 'NEXT VERSION' : 'HUMAN REVIEW'}</span><div>{selected.status === 'draft' && <Button size="sm" icon={<Icon name="arrow-right" size={16} />} onClick={() => updateArtifact('submit')}>Submit for review</Button>}<Button size="sm" variant="secondary" disabled={selected.status !== 'in-review'} onClick={() => updateArtifact('revision')}>Request revision</Button><Button className="px-accept-action" size="sm" disabled={selected.status !== 'in-review'} icon={<Icon name="check" size={16} />} onClick={() => updateArtifact('accept')}>Accept version</Button><Button size="sm" variant="tertiary" disabled={selected.status !== 'accepted'} icon={<Icon name="plus" size={16} />} onClick={() => updateArtifact('version')}>Create next version</Button></div><p>{selected.status === 'draft' ? 'Submit this draft for human review before accepting it.' : selected.status === 'accepted' ? 'This version is accepted. A new version keeps its earlier history.' : 'Choose a next step. Your decision becomes part of this artifact’s history.'}</p></div>
            </> : <EmptyState title="No artifacts match" action={<Button variant="secondary" onClick={() => { setQuery(''); setStatus('all'); }}>Clear filters</Button>}>Try another title or choose a different status.</EmptyState>}
          </div>
        </div>
      </div>}
      <footer className="px-app-footer"><span className="px-caption">COMMON THREAD / EXAMPLE</span><span>Changes clear on reload or reset.</span></footer>
    </div>
  </section>;
}
