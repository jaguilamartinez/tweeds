import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { tokens, ThemeProvider, Logo, Button } from '../src/index';
import { BrandGeometry } from '../example/BrandGeometry';
import { ColorUsageRatio, OverlayStudy } from '../example/BrandColorStudies';
import { VisualElementsStudy } from '../example/VisualElementsStudy';
import { MathMarkStudy } from '../example/MathMarkStudy';
import { flattenTokenEntries, resolveTokenValue } from '../example/token-reference';

const rows = flattenTokenEntries(tokens);
const primitiveColors = Object.entries(tokens.primitive.color).map(([name, value]) => ({ name, value: String(value) }));
const contrastPairs = [['paper', 'ink'], ['inkMuted', 'ink'], ['graphite', 'ink'], ['signalOrange', 'ink'], ['ink', 'paper'], ['paperMuted', 'paper'], ['ink', 'signalOrange'], ['ink', 'lime']] as const;
function color(name: string): string { return primitiveColors.find(item => item.name === name)?.value ?? 'currentColor'; }
function contrast(first: string, second: string) {
  const luminance = (hex: string) => {
    const channels = hex.replace('#', '').match(/.{2}/g)?.map(channel => {
      const value = parseInt(channel, 16) / 255;
      return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
    }) ?? [0, 0, 0];
    return channels[0]! * .2126 + channels[1]! * .7152 + channels[2]! * .0722;
  };
  const a = luminance(first), b = luminance(second);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}
function TokenTable({ prefix = '' }: { prefix?: string }) {
  const selected = rows.filter(row => row.path.startsWith(prefix));
  return <div className="tw-table-scroll"><table><thead><tr><th>Token path</th><th>Source value</th><th>Resolved value</th></tr></thead><tbody>{selected.map(row => <tr key={row.path}><td><code>{row.path}</code></td><td><code>{row.value}</code></td><td><code>{resolveTokenValue(row.value, tokens)}</code></td></tr>)}</tbody></table></div>;
}
const principles = [
  ['Show the process', 'Explain how an idea becomes something people can use.'],
  ['Explain how things work', 'Use diagrams and interactions to show structure and behavior.'],
  ['Use contrasting typefaces', 'Pair expressive headings with precise technical detail.'],
  ['Leave room for curiosity', 'Keep the interface clear without removing its personality.'],
  ['Give accents a purpose', 'Use orange and lime to draw attention to something specific.'],
  ['Show the work', 'Explain what was made and what was learned.'],
  ['Check every format', 'Keep content readable on desktop, mobile, and in print.'],
];
function Principles() { return <><h1>Principles and language</h1><p>Tinker Works is an independent lab for invention and experimentation. Its approved statement is “From curiosity to real things.”</p><h2>Design principles</h2><ol>{principles.map(([title, description]) => <li key={title}><p><strong>{title}.</strong> {description}</p></li>)}</ol><h2>Writing</h2><p>Use familiar words and describe what people can do. Button labels name an action, errors explain how to fix the problem, and confirmations say what changed. Prefer “Save changes” to “Bring your ideas to life.” Keep technical detail when it helps someone complete a task.</p></>; }
function Palette() {
  return (
    <>
      <h2>Color</h2>
      <p>Ink is the default surface, with paper-colored text; Paper reverses the two for reading-heavy pages and print. Every grey is ink diluted on paper, so the neutrals share one temperature. Add orange for action or attention and lime for exploration or discovery. Keep accent areas small and include text when color communicates a state.</p>
      <div className="tw-story-grid">
        {primitiveColors.map(({ name, value }) => (
          <div key={name}>
            <div className="tw-color-swatch" style={{ background: value, color: contrast(value, color('ink')) >= 4.5 ? color('ink') : color('paper') }}><code>{name}</code></div>
            <p><code>{value}</code></p>
          </div>
        ))}
      </div>
      <h3>Color proportions</h3>
      <p>Let ink occupy most of the composition, with paper for text and structure and graphite for the working lines. The reference below guides a screen or a publication. Each control still uses the colors it needs to be clear.</p>
      <ColorUsageRatio />
      <p>The proportions read <code>tokens.brand.colorUsage</code>; the swatches read the same token source's primitive colors.</p>
      <h3>Contrast</h3>
      <p>These contrast ratios are calculated from the primitive tokens. Normal text needs 4.5:1 at WCAG AA; large text and meaningful control boundaries need 3:1. Graphite is for working lines and decorative details. Use semantic text and border tokens for readable content and controls.</p>
      <div className="tw-table-scroll">
        <table>
          <thead><tr><th>Foreground / background</th><th>Ratio</th><th>Normal text</th></tr></thead>
          <tbody>
            {contrastPairs.map(([foreground, background]) => {
              const ratio = contrast(color(foreground), color(background));
              return <tr key={`${foreground}-${background}`}><td>{foreground} / {background}</td><td>{ratio.toFixed(2)}:1</td><td>{ratio >= 4.5 ? 'AA' : 'Use a semantic alternative'}</td></tr>;
            })}
          </tbody>
        </table>
      </div>
      <TokenTable prefix="primitive.color" />
      <TokenTable prefix="brand.colorUsage" />
    </>
  );
}

function Typography() {
  return (
    <>
      <h2>Typography</h2>
      <div style={{ marginBlock: 32 }}>
        <p style={{ fontFamily: 'Instrument Serif', fontSize: 'clamp(48px, 7vw, 96px)', lineHeight: 1.02, margin: 0 }}>From curiosity<br /><i>to real things.</i></p>
      </div>
      <p><strong>Instrument Serif</strong> is the editorial and display typeface. Use its regular roman and italic styles at weight 400 for large titles and headings. Desktop display text is approximately 72–120px. Reduce the size on smaller screens and preserve comfortable line breaks.</p>
      <h3>Wordmark</h3>
      <Logo variant="compact" />
      <p>The wordmark and TW monogram use <strong>Instrument Serif</strong> too, so the identity and the editorial voice are drawn by one hand. Keep the natural letter widths, aligned left edges, and a visible gap between Tinker and Works.</p>
      <p style={{ fontSize: 32, fontWeight: 500 }}>Account settings</p>
      <p><strong>Instrument Sans</strong>, the companion to Instrument Serif, is used for navigation, controls, and reading text. Body text is generally 16–20px; section headings are 32–48px.</p>
      <p className="tw-pattern-kicker">FIG. 01 / WIDTH 1440 PX</p>
      <p><strong>IBM Plex Mono</strong> is used for captions, identifiers, measurements, and code. Use 12–14px for short annotations, and keep extended reading in Instrument Sans.</p>
      <h3>Font files</h3>
      <p>Import <code>@tinker-works/ui/fonts.css</code> to use the included fonts, or load the same families through your application. The included stylesheet serves local files.</p>
      <TokenTable prefix="primitive.font." /><TokenTable prefix="primitive.fontSize" /><TokenTable prefix="primitive.lineHeight" />
    </>
  );
}

function GraphicAccents() {
  return (
    <>
      <h2>Graphic accents</h2>
      <OverlayStudy />
      <p>Lay a translucent orange or lime block over the part of a drawing being discussed. Keep the underlying lines visible and place labels and essential text outside the tinted area.</p>
      <p>Use <code>HighlightOverlay</code> around supplied visual content. The application still owns that content and its accessible description.</p>
    </>
  );
}
function VisualElements() {
  return (
    <>
      <h2>Visual elements</h2>
      <p>Use these marks to explain position, alignment, and relationships. Keep construction lines lighter than the part being described.</p>
      <VisualElementsStudy />
      <p>Give each mark a job. A leader points to a detail, a crosshair locates a center, and a grid shows alignment. Add measurements only when they describe something real.</p>
    </>
  );
}

function ImageryStyle() {
  return (
    <>
      <h2>Imagery style</h2>
      <p>Draw a screen as something you can take apart and examine. Separate its layers, trace a connection, or show a closer view. Leave enough of the working lines to explain how the parts fit.</p>
      <BrandGeometry
        variant="specimen"
        title="Interface layers with alignment guides and interaction details"
        caption="A drawing of an interface: layout, content, and interaction, with marked areas for closer inspection."
      />
      <h3>Preparing an illustration</h3>
      <ul>
        <li>Start with a readable interface, wireframe, or connection. Add a second view when it helps explain the subject.</li>
        <li>Use guides, hatching, and short notes to show structure. Keep the main outline clear.</li>
        <li>Mark a small region with translucent orange or lime so its linework stays visible. Keep labels outside the tint.</li>
        <li>On small screens, retain the main view and omit secondary notes.</li>
      </ul>
      <p>For photographs, choose monochrome crops of real work and materials. Keep enough context to understand the subject. Add an annotation or small color overlay when it points to a useful detail.</p>
      <h3>Movement</h3>
      <p>The drawing drafts itself once when it scrolls into view, then rests on the still image. It never loops. The layer control switches between separated and assembled views. Reduced-motion settings show the finished drawing and remove the transition; both views remain available.</p>
      <p>The drawing above is shared documentation artwork in <code>example/</code>. Applications supply their own subject and content; the drawing is separate from reusable controls.</p>
    </>
  );
}
function Layout() { const spaces = rows.filter(row => row.path.startsWith('primitive.space.')); return <><h2>Spacing and layout</h2><p>Use an 8px baseline with 4px steps for small gaps. The desktop reference has 12 columns, a 1440px maximum content width, 24px gutters, and margins of about 60px on wide screens. Stack columns on smaller screens.</p><div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: 8 }} aria-label="Twelve equal layout columns">{Array.from({ length: 12 }, (_, i) => <div key={i} style={{ minHeight: 96, border: '1px solid currentColor', display: 'grid', placeItems: 'center', fontFamily: 'IBM Plex Mono', fontSize: 12 }}>{String(i + 1).padStart(2, '0')}</div>)}</div><h3>Spacing scale</h3><div className="tw-table-scroll"><table><thead><tr><th>Token</th><th>Value</th><th>Preview</th></tr></thead><tbody>{spaces.map(row => <tr key={row.path}><td><code>{row.path}</code></td><td><code>{String(row.value)}</code></td><td><span className="tw-token-rail" style={{ width: typeof row.value === 'number' ? row.value : String(row.value) }} /></td></tr>)}</tbody></table></div><h3>Borders, corners, and shadows</h3><p>Use thin rules to separate content and subtle corner radii for controls. Add a shadow when it helps explain elevation. Try spacing and alignment before adding another container.</p><TokenTable prefix="primitive.size" /><TokenTable prefix="primitive.layout" /><TokenTable prefix="primitive.border" /><TokenTable prefix="primitive.radius" /><TokenTable prefix="primitive.shadow" /></>; }
function Motion() { return <><h2>Motion and layers</h2><p>Motion is drafting: it shows how a drawing or page is put together, in the order a person would make it. Use short transitions to show state changes and confirm actions, and keep hover and press feedback subtle. Required content must remain available without animation.</p><h3>Drafting verbs</h3><p>The stylesheet provides <code>tw-draft</code>, <code>tw-mark</code>, <code>tw-register</code>, <code>tw-measure</code>, <code>tw-type</code>, and <code>tw-assemble</code>. Place them inside a root attached to <code>useReveal()</code>. The root plays its verbs once when it scrolls into view, then rests on the authored still image. Set <code>--tw-reveal-at</code> to order the sequence. <code>ThemeProvider motion="off"</code> shows every state as a still image.</p><h3>Reduced motion</h3><p>Respect <code>prefers-reduced-motion: reduce</code>. Remove nonessential animation while preserving labels, states, and keyboard access.</p><h3>Layers</h3><p>Use the shared scale for sticky navigation, raised controls, overlays, and notices. Manage focus when opening or closing an overlay.</p><TokenTable prefix="primitive.motion" /><TokenTable prefix="primitive.layer" /><TokenTable prefix="primitive.zIndex" /></>; }
function Themes() { return <><h2>Themes</h2><p>Ink is the default: ink backgrounds with paper-colored text. Paper reverses those roles on a soft, nearly white sheet for reading-heavy pages and print. Components use semantic tokens so they inherit the surrounding theme. Add a nested ThemeProvider for a section with a different theme.</p><div className="tw-story-grid">{(['ink', 'paper'] as const).map(theme => <ThemeProvider theme={theme} key={theme}><div className="tw-theme-example"><Logo variant="compact" /><h3>{theme === 'paper' ? 'Paper' : 'Ink'}</h3><p>Text and controls inherit the colors of this theme.</p><Button>Save changes</Button></div></ThemeProvider>)}</div><h3>Semantic tokens</h3><TokenTable prefix="semantic." /><h3>Component tokens</h3><TokenTable prefix="component." /></>; }
function AccessibilityAndPrint() { return <><h2>Clarity at every scale.</h2><h3>Reading and interaction</h3><ul><li>Use semantic landmarks, a logical heading hierarchy, and native controls.</li><li>Keep a visible label for every form control. Associate hint and error text programmatically.</li><li>Keep essential text and meaningful control boundaries on accessible semantic color pairs.</li><li>Make every operation reachable by keyboard and preserve visible focus.</li><li>Use words alongside colored status signals and give drawings a useful caption.</li><li>Honor reduced motion and test enlarged text, narrow screens, and long labels.</li></ul><h3>Print and physical artifacts</h3><p>Keep the same typography, paper-stock sensibility, thin linework, figure numbers, and small accent regions. For technical sheets, retain dimensions and explanatory captions at a readable size. Prefer a clear monochrome output over printing dark screen surfaces. Verify actual print scale and pagination for each publication.</p><h3>Evidence and limits</h3><p>Automated component and accessibility checks cover important semantics and interactions. The browser suite checks real layout and keyboard behavior. Visual snapshots guard representative states at desktop and mobile sizes. Automated checks complement human review with a keyboard, a screen reader, browser zoom, and printed output.</p></>; }

const meta = {
  title: 'Foundations/System reference',
  parameters: { layout: 'fullscreen', controls: { disable: true }, docs: { description: { component: 'The approved Tinker Works direction, implemented as primitive, semantic, and component tokens. Every token table in these stories reads the exported tokens object directly; values are never copied into documentation.' } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
const page = (children: ReactNode) => <article className="tw-reference">{children}</article>;
export const StartHere: Story = { name: 'Principles and voice', render: () => page(<Principles />) };
export const Color: Story = { render: () => page(<Palette />) };
export const Type: Story = { name: 'Typography', render: () => page(<Typography />) };
export const GraphicAccentSystem: Story = { name: 'Graphic accents', render: () => page(<GraphicAccents />) };
export const VisualElementSystem: Story = { name: 'Visual elements', render: () => page(<VisualElements />) };
export const MathematicalMarks: Story = { name: 'Mathematical marks', render: () => page(<><h2>Mathematical marks</h2><p>Use one large plus, minus, or asterisk in an editorial composition, with clear space around it. Keep these decorative marks away from controls, required-field labels, and footnotes. Lime reads most clearly on ink. Use the MathMark component at 96–160 px, with 48 px as the minimum, and leave at least a quarter of its width clear around it.</p><MathMarkStudy /></>) };
export const ImageryStyleReference: Story = { name: 'Imagery style', render: () => page(<ImageryStyle />) };
export const GridAndSpace: Story = { name: 'Grid, spacing, and surfaces', render: () => page(<Layout />) };
export const MotionAndLayering: Story = { render: () => page(<Motion />) };
export const ThemeSystem: Story = { render: () => page(<Themes />) };
export const AccessibilityPrint: Story = { name: 'Accessibility and print', render: () => page(<AccessibilityAndPrint />) };
export const AllTokens: Story = { name: 'Token reference', render: () => page(<><h2>Tokens</h2><p>Edit <code>src/tokens.json</code> to change token values, then regenerate the CSS and review the affected stories. The build resolves references into CSS custom properties. TypeScript exports read the same JSON directly.</p><p>The public exports are <code>tokens</code>, <code>primitiveTokens</code>, <code>semanticTokens</code>, <code>componentTokens</code>, and <code>brandTokens</code>. Raw JSON is available at <code>@tinker-works/ui/tokens.json</code>.</p><TokenTable /></>) };
