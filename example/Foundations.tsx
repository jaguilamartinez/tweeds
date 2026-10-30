import { useMemo, useState } from 'react';
import { Button, Icon, Logo, Select, TextField, ThemeProvider, iconCatalog, primitiveTokens, tokens } from '@tinker-works/ui';
import { BrandGeometry } from './BrandGeometry';
import { ColorUsageRatio, OverlayStudy } from './BrandColorStudies';
import { VisualElementsStudy } from './VisualElementsStudy';
import { MathMarkStudy } from './MathMarkStudy';
import { flattenTokenEntries, resolveTokenValue } from './token-reference';
const principles = ['Show how an idea becomes something people can use.', 'Use diagrams and interactions to explain how things work.', 'Pair expressive typography with precise technical detail.', 'Leave room for curiosity without losing clarity.', 'Use orange and lime to draw attention to something specific.', 'Show the work and explain what you learned.', 'Keep content readable on screens and in print.'];
function VisualElements() {
  return (
    <section className="pb-section" aria-labelledby="visual-elements-title">
      <div className="pb-section-title">
        <h2 id="visual-elements-title">Visual elements</h2>
        <p>Use these marks to explain position, alignment, and relationships. Keep construction lines lighter than the part being described.</p>
      </div>
      <VisualElementsStudy />
    </section>
  );
}

function ImageryStyle() {
  return (
    <section className="pb-section" aria-labelledby="imagery-style-title">
      <div className="pb-section-title">
        <h2 id="imagery-style-title">Imagery style</h2>
        <p>Draw a screen as something you can take apart and examine. Separate its layers, trace a connection, or show a closer view. Leave enough of the working lines to explain how the parts fit.</p>
      </div>
      <div className="pb-geometry-specimen">
        <BrandGeometry
          variant="specimen"
          title="Interface layers with alignment guides and interaction details"
          caption="A drawing of an interface: layout, content, and interaction, with marked areas for closer inspection."
        />
      </div>
      <div className="pb-geometry-guidance">
        <p>Use readable wireframes or monochrome crops of real work and materials. Add guides, hatching, and short notes where they help explain the subject. Use translucent orange or lime for a detail worth inspecting, with the image still visible underneath.</p>
        <p>Use the layer control to compare the separated and assembled views. Nothing moves automatically, and reduced motion removes the transition. On small screens, keep the main view and omit secondary notes.</p>
      </div>
    </section>
  );
}

function MathematicalMarks() {
  return (
    <section className="pb-section" aria-labelledby="math-marks-title">
      <div className="pb-section-title">
        <h2 id="math-marks-title">Mathematical marks</h2>
        <p>A large plus, minus, or asterisk adds a bolder shape to an editorial composition. Use one at a time, with open space around it. Orange draws attention; lime works best against charcoal.</p>
      </div>
      <MathMarkStudy />
      <div className="pb-geometry-guidance">
        <p>Use 96–160 px for most compositions and at least 48 px for smaller accents. Leave at least a quarter of the mark’s width clear on every side. Keep the same proportions and square ends.</p>
        <p>Keep these marks away from buttons, form labels, and navigation, where they could suggest an action, a required field, or a footnote. Use the functional icon set for controls and real text for mathematical expressions. Decorative marks are hidden from assistive technology by default.</p>
      </div>
    </section>
  );
}

function Iconography() {
  return (
    <section className="pb-section" aria-labelledby="iconography-title">
      <div className="pb-section-title">
        <h2 id="iconography-title">Iconography</h2>
        <p>Arrows, corner marks, centerlines, and projected planes come from technical drawing. In a control, reduce them to a clear silhouette on a 24-unit grid. Keep hatching and loose pen marks for larger illustrations.</p>
      </div>
      <div className="pb-icon-vocabulary">
        {iconCatalog.map(({ name, label }) => (
          <div className="pb-icon-sample" key={name}>
            <Icon name={name} size={24} />
            <span className="pb-small">{label}</span>
          </div>
        ))}
      </div>
      <div className="pb-foundation-details">
        <div>
          <h3>Check the displayed size</h3>
          <div className="pb-demo-row" aria-label="Layer icon at three sizes">
            {([16, 24, 40] as const).map(size => (
              <div className="pb-icon-sample" key={size}>
                <Icon name="layers" size={size} />
                <code>{size} px</code>
              </div>
            ))}
          </div>
          <p>Icons keep a light stroke at each size. Small icons show the main contour; larger specimens add fine construction marks. Use 16 px beside compact text and 24 px in most controls. Keep the surrounding hit area at least 44 px for touch controls.</p>
        </div>
        <div>
          <h3>Name the action</h3>
          <div className="pb-demo-row">
            <Button variant="secondary" size="sm" icon={<Icon name="search" size={16} />}>Search</Button>
            <Button variant="secondary" size="sm" icon={<Icon name="layers" size={16} />}>Show layers</Button>
            <Button variant="secondary" size="sm" icon={<Icon name="frame" size={16} />}>Fit to view</Button>
          </div>
          <p>Use a visible label when the meaning may be unfamiliar. An icon-only button still needs an accessible name. Keep utility icons monochrome; pair a colored state with text or a shape change.</p>
        </div>
      </div>
    </section>
  );
}

function GraphicAccents() {
  return (
    <section className="pb-section" aria-labelledby="graphic-accents-title">
      <div className="pb-section-title">
        <h2 id="graphic-accents-title">Graphic accents</h2>
        <p>Use color to mark a point of attention or an area to explore. Keep the drawing visible so the mark helps explain what is happening.</p>
      </div>
      <OverlayStudy />
      <div className="pb-geometry-guidance">
        <p>Lay a translucent orange or lime block over the part of a drawing being discussed. Keep the underlying lines visible and place labels and essential text outside the tinted area.</p>
        <p>Use orange for a point of attention and lime for an area to explore. Keep the mark close to its subject rather than spreading color across the page.</p>
      </div>
    </section>
  );
}

export default function Foundations() {
  const [layer, setLayer] = useState('semantic');
  const [query, setQuery] = useState('');
  const [moved, setMoved] = useState(false);
  const entries = useMemo(() => flattenTokenEntries(tokens[layer as keyof typeof tokens], layer).filter(entry => `${entry.path} ${entry.value}`.toLowerCase().includes(query.toLowerCase())), [layer, query]);
  const colors = [ ['cream', 'Page backgrounds'], ['charcoal', 'Text and controls'], ['stone', 'Decorative details'], ['signalOrange', 'Action and attention'], ['lime', 'Exploration and discovery'] ] as const;
  return <div className="pb-foundations">
    <section className="pb-section" aria-labelledby="principles-title"><div className="pb-section-title"><h2 id="principles-title">Principles</h2><p>Use these when deciding how a screen should look, read, or behave.</p></div><ol className="pb-principles">{principles.map((principle, index) => <li key={principle}><span>{String(index + 1).padStart(2, '0')}</span>{principle}</li>)}</ol></section>
    <section className="pb-section" aria-labelledby="brand-title"><div className="pb-section-title"><h2 id="brand-title">Logo</h2><p>Set Tinker above Works in DM Serif Display at weight 400. Keep the natural letter widths, aligned left edges, and a visible gap between the lines. Leave open space around the mark, with supporting copy outside it.</p><p>DM Serif Display gives the wordmark its fuller drawn strokes. Instrument Serif remains the face for editorial headings; its roman and italic styles are supplied at weight 400.</p></div><div className="pb-brand-pair"><ThemeProvider theme="paper"><div className="pb-logo-sample"><Logo /><span className="pb-eyebrow">Paper</span></div></ThemeProvider><ThemeProvider theme="ink"><div className="pb-logo-sample"><Logo /><span className="pb-eyebrow">Ink</span></div></ThemeProvider></div></section>
    <VisualElements />
    <MathematicalMarks />
    <ImageryStyle />
    <Iconography />
    <section className="pb-section" aria-labelledby="colors-title"><div className="pb-section-title"><h2 id="colors-title">Color</h2><p>Use cream backgrounds and charcoal text by default. Add orange or lime sparingly, and always include a text label when color communicates a state.</p></div><div className="pb-color-grid">{colors.map(([name, role]) => <div className="pb-color" key={name}><div style={{ background: primitiveTokens.color[name] }} /><h3>{name === 'signalOrange' ? 'Signal orange' : name[0].toUpperCase() + name.slice(1)}</h3><code>{primitiveTokens.color[name]}</code><p>{role}</p></div>)}</div><p className="pb-small">Use <code>color.muted</code> for secondary text. Stone does not have enough contrast for small text on cream. Use charcoal labels on orange surfaces.</p><div className="pb-section-title pb-color-proportions"><h3>Color proportions</h3><p>Let cream occupy most of the composition, with charcoal giving it structure. These proportions describe a Paper page or printed piece. Ink reverses background and text roles; keep the accent areas small in either theme.</p></div><ColorUsageRatio /></section>
    <GraphicAccents />
    <section className="pb-section" aria-labelledby="type-title"><div className="pb-section-title"><h2 id="type-title">Typography</h2><p>Instrument Serif leads the editorial content. DM Serif Display is reserved for the wordmark and TW monogram.</p></div><div className="pb-type-specimens"><div><span className="pb-eyebrow">Instrument Serif</span><div><p className="pb-serif-specimen">From curiosity<br /><em>to real things.</em></p></div><p>For large titles and editorial headings, in regular roman or italic. Use 72–120 px on wide screens and a smaller scale on mobile.</p></div><div><span className="pb-eyebrow">Space Grotesk</span><p className="pb-sans-specimen">Account settings</p><p>For navigation, controls, section headings, and reading text. Use 16–20 px for body copy.</p></div><div><span className="pb-eyebrow">IBM Plex Mono</span><p className="pb-mono-specimen">FIG. 01<br />WIDTH / 1440 PX</p><p>For captions, identifiers, measurements, and code. Use 12–14 px for short annotations.</p></div></div></section>
    <section className="pb-section" aria-labelledby="layout-title"><div className="pb-section-title"><h2 id="layout-title">Spacing and layout</h2><p>Use an 8 px baseline with 4 px steps for small gaps. The desktop grid has 12 columns, 24 px gutters, and a reference maximum width of 1440 px. Stack columns on smaller screens.</p></div><div className="pb-spacing">{Object.entries(primitiveTokens.space).map(([name, value]) => <div key={name}><code>{name}</code><span style={{ width: value }} /><small>{value}</small></div>)}</div><div className="pb-grid-study" aria-label="Twelve-column grid">{Array.from({ length: 12 }, (_, index) => <span key={index}>{String(index + 1).padStart(2, '0')}</span>)}</div><div className="pb-foundation-details"><div><h3>Borders and corners</h3><p>Use thin rules to separate content. Controls have a {primitiveTokens.radius.sm} corner radius.</p></div><div><h3>Shadows and layers</h3><p>Use shadows only when elevation helps explain the interface. Shared layer values are base {primitiveTokens.layer.base}, raised {primitiveTokens.layer.raised}, sticky {primitiveTokens.layer.sticky}, and overlay {primitiveTokens.layer.overlay}.</p></div></div></section>
    <section className="pb-section" aria-labelledby="motion-title"><div className="pb-section-title"><h2 id="motion-title">Motion</h2><p>Use short transitions to show a state change. Feedback takes {primitiveTokens.motion.fast}; transitions take {primitiveTokens.motion.base}. Respect reduced-motion settings and keep the result understandable without animation.</p></div><div className="pb-motion-demo"><div className="pb-motion-track" data-state={moved ? 'B' : 'A'} aria-hidden="true"><span /></div><Button variant="secondary" size="sm" onClick={() => setMoved(!moved)}>Preview transition</Button><span className="pb-small" role="status">State {moved ? 'B' : 'A'}</span></div></section>
    <section className="pb-section" aria-labelledby="tokens-title"><div className="pb-section-title"><h2 id="tokens-title">Tokens</h2><p>Primitive tokens hold values. Semantic tokens give them a purpose in each theme. Component tokens cover shared control properties. Brand tokens record composition guidance. The reference below reads the library's token source.</p></div><details className="pb-token-reference"><summary>Browse tokens</summary><div className="pb-token-tools"><Select label="Token layer" value={layer} onChange={event => setLayer(event.target.value)}><option value="semantic">Semantic</option><option value="primitive">Primitive</option><option value="component">Component</option><option value="brand">Brand</option></Select><TextField label="Find a token" value={query} onChange={event => setQuery(event.target.value)} placeholder="Color, space, or focus" /></div><div className="pb-table-wrap" tabIndex={0} role="region" aria-label="Token reference"><table className="pb-table"><caption>{entries.length} tokens in the {layer} layer</caption><thead><tr><th scope="col">Token</th><th scope="col">Source value</th><th scope="col">Resolved value</th></tr></thead><tbody>{entries.map(entry => <tr key={entry.path}><th scope="row"><code>{entry.path}</code></th><td><code>{entry.value}</code></td><td><code>{resolveTokenValue(entry.value, tokens)}</code></td></tr>)}</tbody></table></div></details></section>
  </div>;
}
