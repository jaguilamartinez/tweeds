# Maintaining Tweeds

Tweeds is the Tinker Works Design System. It provides brand styles and reusable React controls through the `@tinker-works/ui` package. Instrument Serif draws the Tweeds and Tinker Works wordmarks, the TW monogram, and editorial headings, so the identity and the voice come from one hand. Instrument Sans, its companion, carries the interface and reading text. IBM Plex Mono annotates captions, measurements, and technical details.

The Vite application is the Tweeds playbook, with Overview, Foundations, Components, Patterns, and Examples. Its private `example/TweedsLogo.tsx` identifies the playbook in the sidebar and Overview. The optional descriptor reads “Tinker Works Design System.” This mark is separate from the public `Logo` component, which continues to show Tinker Works in Foundations, brand stories, and consuming applications.

Keep the public library independent of a particular product or domain. Patterns show common interface tasks such as completing a form, changing a setting, and searching a list. Product-specific screens belong in the optional example application.

`example/main.tsx` only loads global styles and mounts React. `example/App.tsx` owns the playbook shell, theme, and hash navigation; its typed page registry supplies navigation labels and lazy-loaded reference views. `example/Overview.tsx` owns the opening page. Keep route content out of the bootstrap and avoid loading the product example until its page is opened. Navigation focus uses local element refs rather than document-wide selectors.

The component catalog derives its IDs and categories from the metadata and checks its preview switch exhaustively. Add both metadata and a preview for a new public component; type checking rejects an unhandled ID. The keyed preview preserves state isolation when switching components. Foundations and Storybook share `example/token-reference.ts` for token-table paths and resolution; missing, invalid, and circular references produce explicit display messages.

## Source and outputs

`src/tokens.json` is the authored token source. Primitive tokens name raw materials: colors, font families, dimensions, spacing, motion, and layering. Semantic tokens map those materials to roles separately for `paper` and `ink`. Component tokens are a small layer for properties that need coordinated overrides.

`brand.colorUsage` records the reference composition: 60% ink, 20% paper, 10% graphite, 5% signal orange, and 5% lime. It guides an overall page or publication rather than an individual control. Foundations and Storybook share `example/BrandColorStudies.tsx` to render those proportions directly from the token source.

References use brace paths such as `{primitive.color.ink}`. The generation script resolves references and emits CSS custom properties. `src/tokens.ts` imports the same JSON directly and exposes typed token objects; the library build emits their declarations. Do not edit generated CSS directly. The Storybook inventory reads the exported `tokens` object so documentation cannot drift into a second list of raw values.

Use semantic custom properties in components. Select a primitive directly only for a deliberately fixed brand asset or a documented graphic signal. The colors are two materials. Ink is a deep, cool blue-black; paper is a soft, nearly white sheet. Every grey between them is ink diluted on paper or paper diluted in ink, so lines, borders, and muted text share one temperature in both themes. Graphite is the working-line color for drawings and decorative details, not the default for essential text. Signal orange is a soft apricot (#F09563). On Ink it measures about 8:1, so it works for text, icons, and fills that carry ink labels. On Paper it measures about 2.2:1, so use it for decoration and for cues that are repeated in words or shape, and use ink for anything that must be read or that identifies a state on its own. Accessible text and control roles use darker alternatives when needed.

## Public contract

The root entry exports components, their TypeScript types, the theme boundary, the `useReveal` motion hook, and token objects. Additional exports expose CSS, the optional font stylesheet, the token module, and raw token JSON. Consumers import public paths and avoid reaching into source folders.

CSS uses the `tw-` namespace for classes and custom properties. Components share primitive and semantic values instead of inventing a palette or spacing scale. Public names follow PascalCase for components, camelCase for props, and short literal unions for variants and sizes. Native attributes are preserved where possible.

The package ships ESM with declarations. Relative library imports and exports use explicit `.js` paths so the emitted declarations resolve in both Bundler and NodeNext projects. Token exports infer their public object types from the JSON source without retaining a JSON import in declarations. React and React DOM 19 are peer dependencies, which keeps the application in control of its React runtime. Native refs use React 19 conventions. Local fonts are optional assets; use the font stylesheet or the application's own font delivery mechanism.

`scripts/library-entry.ts` is Vite's private bundling entry: it imports the shared stylesheet and re-exports `src/index.ts`. Vite extracts `dist/styles.css`; the public index and its declarations contain only the JavaScript API. Applications import package styles explicitly. Storybook and the unit-test setup import source styles at their own environment boundary.

`pnpm test:types` checks the built package through public exports using independent Bundler and NodeNext fixtures in `tests/types/`. They disable `skipLibCheck` and JSON resolution and include no Vite ambient types or source aliases. `build:example` runs these checks after the library build, and `check` includes them through that command. Keep these fixtures independent of the development TypeScript configuration.

## Dependency settings

The project pins pnpm 11.25.0. Its `pnpm-workspace.yaml` includes only the root package and permits esbuild's build step. Keep the package manifest and lockfile together when updating dependencies so local development and validation use the same versions.

## Composition conventions

`Button` performs actions; `TextLink` navigates. `Card` is an article surface, not an automatic click target. Inputs, text areas, and selects keep visible labels and programmatic hint/error associations. `Checkbox` is a native form selection; `Switch` applies an immediate setting. `Tag` conveys type or status in text as well as color.

Keep the chosen button size when its state changes. Disabled and loading controls retain the same height as an enabled control of that size. Paper inputs use a square ink keyboard-focus outline. Error fields retain a high-contrast ink or paper boundary and readable foreground text. An orange inset marker adds a visual cue; the message and its association with the field carry the meaning.

Controls answer in the drawing language rather than with a fade. On hover, a button's second sheet slides out behind it like a second pass of the pen, and pressing moves the button onto that sheet. The sheet is an outer shadow, so it never paints under the button; `--tw-button-backdrop` names the surface behind it and `Card` sets it to its own surface. Keyboard focus keeps the outline and adds registration corners that snap in around it. Signal sweeps a lighter mark across on hover. A link keeps a thin rule at rest, and an orange pen line draws over it on hover. Arrow icons nudge in the direction they point; `Icon` exposes its name as `data-tw-icon` for this. A checkbox tick is drawn with the pen. A switch sweeps lime across its track and its thumb springs over. Loading shows an asterisk that turns a sixth of a revolution at a time; reduced motion replaces it with a dotted ring. When an action inside a `Card` is hovered or focused, orange corner marks frame that card. `Alert` registers its mark and `EmptyState` draws its icon when they first appear.

`Tabs` supports controlled or local selection and the horizontal tab keyboard pattern. Uncontrolled selection retains a valid fallback when items arrive, disappear, or reorder; an empty loading interval preserves the last selection. Normalization does not emit user-change callbacks. A selected tab uses a single orange underline. When the selection changes, the underline travels from the previous tab and then rests on the selected tab's own border; reduced motion skips the journey. Current navigation links use a text underline. `Pagination` uses one-based page numbers. `Navigation` adapts to a compact menu and owns the home link around its logo slot; pass a logo element rather than another anchor.

`TechnicalFigure` is a native `<figure>` wrapper with required `children`, an optional React `caption`, and a `figure` label that defaults to `FIG. 001`. It forwards native HTML attributes and `className`. The application owns the image, SVG, code, or other supplied content, along with any controls or animation. Keep the caption and figure number in the wrapper; do not pass another `<figure>` as its child. The wrapper contains no built-in illustration or subject-specific state.

`Logo` keeps Tinker above Works in Instrument Serif at weight 400, using natural letter widths, aligned left edges, and a visible line gap, without synthetic bold or an SVG outline. The wordmark shares its face with editorial headings; `primitive.font.logo` still names it separately so the mark can be tuned on its own. The TW monogram provides a compact option for navigation and small surfaces; its accessible name remains Tinker Works. Keep supporting copy outside the mark and preserve its proportions.

`Icon` uses a shared 24-unit drawing area. Arrows, corner marks, projected planes, and centerlines give the set its technical character. The rendering component owns stroke treatment and accessibility attributes; symbol definitions own geometry. Stroke width compensates for the displayed size to keep a light, one-pixel line at 16, 24, and 40 px. Butt caps and miter joins preserve the square-ended pen marks. Larger specimens can add finer construction guides. Keep the name list and any catalog labels with those definitions rather than maintaining a second inventory in documentation. A small icon should keep its meaning without construction guides or a colored background.

`MathMark` provides large, filled `plus`, `minus`, and `asterisk` graphics in `orange` or `lime`. The shapes use authored SVG geometry with square ends rather than font glyphs. `size` defaults to 96 px, and an optional `label` gives a meaningful standalone mark an accessible name; otherwise the mark is decorative. Use a single mark beside editorial content and show lime on ink for clear separation. Functional controls continue to use the thin `Icon` set. The private `example/MathMarkStudy.tsx` shares specimens and a short editorial composition between documentation surfaces.

```tsx
import { MathMark } from '@tinker-works/ui';

<MathMark symbol="plus" tone="orange" size={128} />
```

The larger SVG illustration in `example/` shows the layers of an interface, with alignment guides, interaction details, hatching, and marker accents. Overview, Foundations, and the Storybook motion and Foundations stories share that implementation. `example/OverviewSheet.tsx` frames it as the opening drawing sheet with the brand statement and a title block; the playbook Overview and the Storybook Welcome page both render it. It is documentation artwork rather than a public component. Keep drawing helpers close to the artwork and reuse them for repeated panels and marks. Use small, intentional variations to suggest a pen drawing; avoid random geometry that changes on each render or makes screenshots unstable.

`example/FigureStudy.tsx` is a smaller connection drawing shared by the component catalog and TechnicalFigure stories. It drafts itself when it scrolls into view; pass `drafted={false}` when a surrounding root already reveals it. `example/MotionStudy.tsx` holds the verb specimens and the easing plots shared by Foundations and the Storybook motion stories. It returns an accessible SVG, so it can be placed inside the public wrapper without nesting figures. Keep these authored studies in the example layer rather than baking their paths or application concepts into a reusable component.

The interface drawing drafts itself once each time it scrolls into view: guides, then each layer's linework, then its markers, before the layers lift apart and the notes are labelled. It then rests on the authored still image and never loops. The overview and Foundations specimen also offer a manual control for assembling or separating the layers. The control names its drawing and announces the resulting state in text. Reduced motion shows the finished drawing and removes the transform transition. On the overview, nearer layers follow a fine pointer by a few pixels; touch input and reduced motion leave them still. Keep future animated drawings usable as still images, and let the reader choose any change of view after the first drawing.

Orange and lime marks should identify the part under discussion. Use labels and shape changes as well as color. Keep guides lighter than the main contour, and keep annotations readable at the final display size. A mobile drawing may omit secondary views and notes while retaining the subject. Grid fields belong behind drawings rather than reading text.

`HighlightOverlay` wraps caller-owned visual content in a translucent orange or lime tint. Its pseudo-element supplies the color without changing the opacity of the drawing itself. Keep essential labels outside that area and retain the child's accessible description. It forwards native span attributes and uses shared tokens rather than duplicating color values in application CSS. Titles use typography and spacing for hierarchy.

Use native children for content: headings, paragraphs, options, and links remain ordinary HTML. Components do not own routing, data fetching, persistence, or business workflows. Application screens own those decisions.

Common Thread is a separate local product example. Contributor labels, workflow steps, activity history, and versioned cards are private to that application and live outside `src/`. They are not included in package exports or public component documentation. The application imports generic controls and styles from the library. It owns its state transitions and business rules, and stores changes in memory. Refresh or Reset demo restores its sample data.

The private `example/common-thread/model.ts` owns its shared domain types, and `data.ts` owns sample records. Opening Workspace moves focus to its heading after the view renders, without taking focus on initial mount.

## Theming

`ThemeProvider` creates a local `data-tw-theme` boundary. CSS values inherit from the nearest boundary. Ink is the default; Paper is the light theme for reading-heavy pages, light surroundings, and print. Themes can nest, allowing a Paper card inside an Ink section. `motion="off"` renders every animation and transition in its subtree as a still image, for capture and comparison; nested boundaries inherit it.

Storybook follows the toolbar theme in its manager (`.storybook/theme.ts` and `manager.ts`) and on docs pages (`.storybook/DocsContainer.tsx`), and each canvas carries registration marks in its corners.

Print resets every semantic color role to the Paper palette, including error text, control boundaries, and action colors. Verify print through browser media emulation so Ink foregrounds cannot remain on light print surfaces.

Apply overrides at the narrowest useful scope. Semantic properties include `--tw-color-bg`, `--tw-color-surface`, `--tw-color-text`, `--tw-color-muted`, `--tw-color-border`, and `--tw-color-focus`. Preserve orange and lime's meaning and verify foreground/background contrast when changing a color pair. To add a theme, extend the token source, generated selector, theme type, and Storybook toolbar, then run the same component checks in that theme.

## Motion

Motion in Tweeds is drafting: it shows how a drawing or a page is put together, in the order a person would make it. `primitive.motion` holds the durations (`fast` for feedback, `base` for state changes, and `mark`, `mechanism`, and `draw` for the verbs below), a `stagger` between strokes, and four easing curves. `ease` settles, `easePen` accelerates and slows like a pen stroke, `easeMark` makes one decisive sweep, and `easeMechanism` is a damped spring with a small overshoot. Browsers without `linear()` easing use their default curve for the spring.

The stylesheet provides six verbs as classes:

- `tw-draft` draws each stroked shape in a group along its path. Dashed and fill-only shapes fade in.
- `tw-mark` sweeps a highlighter region in from its leading edge.
- `tw-register` turns a mark and snaps it onto its point.
- `tw-measure` extends a rule from its starting edge.
- `tw-type` reveals an annotation a character at a time. Set `--tw-type-steps` to the label length.
- `tw-assemble` moves a part from `--tw-assemble-from` (the assembled stack by default) to its resting transform. Set `--tw-assemble-opacity: 0` when the part should also appear.

Set `--tw-reveal-at` on a verb or group to place it in the sequence. Shapes in a `tw-draft` group follow document order, one `stagger` apart.

Verbs play only inside a reveal root. `useReveal()` returns a `ref` for the root and a `replay` function. The root holds its verbs on their first frame until it scrolls into view, plays them once, and then removes them. Every animation fills backwards only, so the resting style is the still image. Without the hook, under reduced motion, in print, and inside `ThemeProvider motion="off"`, the authored drawing is shown as it is. The root also waits for any other finite CSS animation inside it, so a page can add its own sequence beside the verbs. Reveal roots do not nest; give separate regions their own root.

```tsx
import { useReveal } from '@tinker-works/ui';

const reveal = useReveal<SVGSVGElement>();
<svg ref={reveal.ref} viewBox="0 0 240 160">
  <g className="tw-draft">{/* guides and linework */}</g>
  <path className="tw-mark" style={{ '--tw-reveal-at': '900ms' } as CSSProperties} d="…" />
</svg>
```

Use motion when it explains something: the order of construction, the part under discussion, or the result of an action. Keep a sequence under about 2.5 seconds, keep content readable while it plays, and never loop. Pointer-driven effects respond only to a fine pointer and stop under reduced motion.

In the playbook, a new page rises into place, and Paper and Ink spread from the theme toggle where the browser supports view transitions. Foundations sections are numbered figures whose rules are measured out as they arrive; spacing tokens are dimension lines, and each easing token is plotted with a point that traces it.

## Adding a component

1. Check whether composition covers the need. A public component should solve a common interface problem. Keep product-specific data shapes, roles, statuses, and business rules in the consuming application.
2. Implement a typed native-prop API under `src/components`, with semantic HTML and a stable `tw-` class. Prefer literal `variant` and `size` values to unrelated boolean flags.
3. Use shared tokens. Add a token when an existing role cannot express the need, then regenerate the outputs.
4. Export the component and props through the component and root barrels.
5. Add a behavior test for critical keyboard, state, or form interactions. Use browser tests for real layout and focus behavior.
6. Add `stories/ComponentName.stories.tsx` with `Meta<typeof Component>`, a useful default, editable controls, representative states, recommendations, and accessibility guidance. Autodocs derives the API table from TypeScript.
7. Add a realistic composition when behavior is best understood in context. Check both themes, long labels, narrow screens, and reduced motion where applicable.
8. Run the repository checks. Review intentional snapshot changes before updating visual baselines.

## Review conventions

Every visible action needs an accessible name, keyboard reachability, and visible focus. Loading prevents repeated actions and preserves context. Errors explain the correction. Empty surfaces explain the next useful step. Status never depends on color alone.

Use a container, line, color, or animation only when it helps someone read or use the interface. Write headings that describe the section and actions that say what will happen. The approved brand statement is exactly “From curiosity to real things.”

The reference image and written brief guide the palette, editorial typefaces, stacked wordmark, and geometric drawing style. The approved statement remains exactly “From curiosity to real things.” All sample names and records in examples are illustrative.
