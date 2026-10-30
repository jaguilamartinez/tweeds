# Tweeds

**From curiosity to real things.**

Tweeds is the Tinker Works Design System. Its React and TypeScript library provides styles and components for Tinker Works websites and applications. The playbook documents colors, typography, spacing, themes, reusable components, and common interface patterns. Storybook provides controls, API tables, and additional examples.

The library is independent of any product or use case. The optional Common Thread SPA lives under `example/`; its product-specific screens and components are private and are not exported by the package.

## Tool choices

React and TypeScript provide typed, composable public APIs. CSS custom properties keep the brand visible in ordinary CSS and allow scoped themes without a runtime styling dependency. Native HTML controls preserve familiar browser and keyboard behavior. Vite builds the ESM library and example application; Storybook documents foundations, APIs, interaction states, and compositions. Vitest and Testing Library check behavior, axe checks accessibility, and Playwright checks browser interactions and visual snapshots.

The implementation uses the Tinker Works palette, editorial typefaces, stacked wordmark, and approved statement. Paper is the default theme; Ink provides a dark theme. Font files are included locally.

The Tweeds wordmark identifies the playbook. It uses the same DM Serif Display face as the Tinker Works logo, with “Tinker Works Design System” beneath it in the full lockup. The public `Logo` component keeps the Tinker Works wordmark and TW monogram for applications; its examples remain in Foundations and **Brand / Logo**.

The Tinker Works logo keeps Tinker over Works with aligned left edges and a visible line gap. It uses DM Serif Display at weight 400 for fuller drawn strokes and natural letter proportions. Instrument Serif remains the editorial and display face, with regular roman and italic styles at weight 400. Drawings use construction guides, hatching, handwritten notes, and orange or lime marker strokes to explain a form or interaction. The playbook's opening drawing studies the layers of a digital interface. Utility icons keep the same line vocabulary, simplified for small controls. Foundations and Storybook show how to use each.

## Run locally

Use **Node.js 22.12 or later** and **pnpm 11.25.0**. From the repository root:

```sh
pnpm install
pnpm dev
```

`pnpm-workspace.yaml` holds installation settings for this single package and permits esbuild's build step.

The playbook opens at the local URL printed by Vite, normally `http://127.0.0.1:5173`. Its sidebar links to **Overview**, **Foundations**, **Components**, **Patterns**, and **Examples**. The address hash preserves the selected section. Use Components to try the library and Patterns for forms, settings, search, and empty states.

Development resolves public package imports to source aliases, so component edits update through HMR without a library rebuild. The existing command name `pnpm build:example` builds the complete playbook and verifies production consumption of the built package JavaScript and declarations. It also checks strict TypeScript consumers using Bundler and NodeNext resolution. Storybook reads source files directly.

```sh
pnpm storybook
```

Open `http://127.0.0.1:6006`. Foundations documents the basic styles and tokens. Components includes typed APIs and interactive controls. **Patterns / Common layouts** covers forms, settings, search, and content collections. Use the toolbar to check Paper and Ink.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Regenerate tokens and run the design-system playbook with Vite. |
| `pnpm tokens:build` | Generate CSS custom properties from `src/tokens.json`. Typed token exports import the same JSON directly. |
| `pnpm build` | Generate tokens, build the ESM library, emit declarations, and copy styles, JSON, and font assets. |
| `pnpm build:example` | Build the library, check strict package consumers, type-check the playbook and embedded SPA against public declarations, and build the production playbook. |
| `pnpm preview` | Serve the production playbook build. |
| `pnpm typecheck` | Check library, stories, example, and test TypeScript. |
| `pnpm test` | Run the component and accessibility test suite once. |
| `pnpm test:watch` | Run component tests in watch mode. |
| `pnpm test:types` | Check built public declarations with strict Bundler and NodeNext consumers. Run `pnpm build` first. |
| `pnpm test:browser` | Run browser interaction and accessibility checks. |
| `pnpm test:visual` | Compare browser screenshots to visual baselines. |
| `pnpm test:visual:update` | Create or intentionally update visual baselines. Review the resulting images before accepting them. |
| `pnpm storybook` | Regenerate tokens and run Storybook on port 6006. |
| `pnpm build-storybook` | Regenerate tokens and build the static reference in `storybook-static/`. |
| `pnpm check` | Run type checking, component tests, library/example builds, and the Storybook build. |
| `pnpm pack` | Build and create a consumable package tarball. |

On Windows, the browser suites use an installed Microsoft Edge by default. No browser download is needed when Edge is already installed. Linux and macOS use Playwright Chromium; install it once:

```sh
pnpm exec playwright install chromium
```

Run the suites on either platform:

```sh
pnpm test:browser
pnpm test:visual
```

Set `PLAYWRIGHT_CHANNEL` to `chrome`, `msedge`, or `chromium` to override the browser. See [the test guide](tests/README.md) for platform-specific commands. Screenshot projects separate desktop and mobile by channel, and baseline paths include the operating system.

`pnpm check` does not include the browser or visual suites. Run those separately before releasing changes to interaction or layout. Screenshot baselines depend on browser, platform, viewport, and font rendering; establish and review them in the same environment used for comparisons.

## Install and consume

This repository creates a local package; publication to a registry is a separate distribution decision. To try it in another React application:

```sh
# In this repository
pnpm pack

# In the consuming application; adjust the tarball path
pnpm add ./tinker-works-ui-0.1.0.tgz
```

React and React DOM are peers, supporting versions `>=19.0.0 <20`. Public native-control refs follow React 19 conventions. The consuming application supplies its React runtime. Import the public package paths:

```tsx
import { Button, Card, TextField, ThemeProvider } from '@tinker-works/ui';
import '@tinker-works/ui/styles.css';
import '@tinker-works/ui/fonts.css'; // Optional self-hosted brand fonts

export function Profile() {
  return (
    <ThemeProvider theme="paper">
      <main>
        <h1>Profile</h1>
        <Card>
          <TextField label="Display name" defaultValue="Alex Morgan" />
          <Button onClick={() => console.log('Save changes')}>Save changes</Button>
        </Card>
      </main>
    </ThemeProvider>
  );
}
```

If the application already delivers DM Serif Display (regular), Instrument Serif (regular roman and italic), Space Grotesk, and IBM Plex Mono, omit the font stylesheet. The included stylesheet serves bundled font assets and does not call a remote font service. Import the styles explicitly; the JavaScript entry does not inject CSS. Package CSS is a side effect so bundlers preserve imported styles. ESM and declaration files are exported from `dist/`; source imports are not part of the public contract. Public JavaScript declarations support Bundler and NodeNext resolution without requiring `resolveJsonModule` or Vite ambient types.

## Foundations and themes

`src/tokens.json` is the single authored source of token values. Its primitive layer defines materials; its semantic layer maps roles for `paper` and `ink`; component tokens coordinate properties that need a shared override. Brand tokens record composition guidance. References use paths such as `{primitive.color.cream}`. Run `pnpm tokens:build` after editing tokens. Storybook reads the exported object to create its token tables, including resolved references and calculated contrast ratios.

```ts
import {
  tokens,
  primitiveTokens,
  semanticTokens,
  componentTokens,
  brandTokens,
} from '@tinker-works/ui/tokens';
```

Raw JSON is available at `@tinker-works/ui/tokens.json`. Components consume generated CSS custom properties. The semantic layer protects readable text and control boundaries; stone remains available for decorative marks. Signal orange marks action or attention. Lime marks exploration or discovery. Do not treat either accent as a default background for an entire page.

The reference color proportions are **60% cream, 20% charcoal, 10% stone, 5% signal orange, and 5% lime**. They guide the overall composition of a Paper page or printed piece. Ink reverses the main background and text roles; keep orange and lime restrained in either theme. The values live in `tokens.brand.colorUsage`, and the diagrams in Foundations and Storybook read them directly.

`HighlightOverlay` adds a translucent orange or lime tint around supplied visual content, leaving the drawing visible. Keep essential text and labels outside the tint. It accepts native span attributes and `className`.

```tsx
import { HighlightOverlay } from '@tinker-works/ui';

<>
  <h1>Layout study</h1>
  <HighlightOverlay tone="lime">
    <img src="/layout-study.svg" alt="Interface layout with alignment guides" />
  </HighlightOverlay>
</>
```

`ThemeProvider` renders a native `div` with a local `data-tw-theme` attribute. It forwards native attributes and `className`. Themes inherit through ordinary CSS and may nest:

```tsx
<ThemeProvider theme="ink" className="lab-section">
  <h2>Account settings</h2>
  <ThemeProvider theme="paper">
    <Card>A Paper card inside an Ink section.</Card>
  </ThemeProvider>
</ThemeProvider>
```

For a project-wide theme change, edit semantic token roles in the source and regenerate. For a local variation, scope a generated custom-property override to a class passed to `ThemeProvider` or to a component wrapper. Semantic properties include `--tw-color-bg`, `--tw-color-surface`, `--tw-color-text`, `--tw-color-muted`, `--tw-color-border`, and `--tw-color-focus`; primitives include `--tw-space-lg` and `--tw-font-display`. Check the Foundations token inventory and generated CSS for the full set. Preserve foreground/background contrast and verify both theme contexts when overriding colors.

## Library conventions

- Components are PascalCase; props are camelCase. Variants and sizes use short literal unions.
- `Button` performs an action; `TextLink` navigates. Native props, labels, and form semantics are preserved.
- `TextField`, `TextArea`, and `Select` associate labels, hints, and errors. `Checkbox` is a form selection; `Switch` applies an immediate setting.
- `Tabs` supports keyboard navigation and controlled or local state. `Pagination` uses one-based numbers. `Navigation` includes a compact mobile menu.
- `Logo` keeps the two-line DM Serif Display wordmark together. Use its compact or monogram variant for smaller spaces rather than changing its proportions. `Tag` labels metadata and status. `Card`, `Alert`, and `EmptyState` compose ordinary content.
- `Icon` includes arrows, crosshairs, basic solids, layers, nodes, a grid, dimensions, and a frame. Each symbol is drawn on a shared 24-unit grid. Check it at the actual size used in a control; extra construction detail belongs in a larger drawing. Icons are decorative by default, so label the action that uses them.
- `MathMark` supplies filled plus, minus, and asterisk shapes for larger brand graphics. Use one beside editorial content, with orange or lime as a deliberate accent. The shapes use SVG geometry with square ends. Keep the thin `Icon` set for functional controls.
- `TechnicalFigure` wraps supplied content in a native figure with a number and caption. Pass an image, SVG, code sample, or other React content as children. The application supplies its artwork and any interactive behavior.
- CSS classes and properties use the `tw-` namespace. Components share tokens and use visible focus states. Consumers own application routing, data, persistence, and workflow.

`iconNames` lists valid icon names. `iconCatalog` adds a label and category for each symbol; both are derived from the same symbol definitions. Use the catalog to build a picker or reference rather than copying a list of names into application code.

```tsx
import { Button, Icon } from '@tinker-works/ui';

<Button variant="secondary" icon={<Icon name="layers" size={16} />}>
  Show layers
</Button>
```

Use a math mark as a graphic beside a title or drawing:

```tsx
import { MathMark } from '@tinker-works/ui';

<MathMark symbol="asterisk" tone="orange" size={128} />
```

`symbol` accepts `plus`, `minus`, or `asterisk`; `tone` accepts `orange` or `lime`. The default size is 96 px. Marks are decorative by default. Supply `label` when a standalone mark carries meaning that needs an accessible name. Lime reads clearly on charcoal; leave open space around the shape.

Keep an illustration separate from its presentation wrapper:

```tsx
import { TechnicalFigure } from '@tinker-works/ui';

<TechnicalFigure figure="FIG. 01" caption="A comparison of the two layouts.">
  <img src="/layout-study.svg" alt="Two layouts with different navigation positions" />
</TechnicalFigure>
```

Supply accessible content: an image needs appropriate alt text and an SVG needs a title or another accessible name. The caption accepts React content. `TechnicalFigure` forwards native figure attributes; it does not add artwork, nested figures, or animation controls.

The source is organized around the token source and generator, `src/components/`, shared styles, the public `src/index.ts` barrel, `stories/`, `.storybook/`, and `tests/`. `example/` contains the playbook and an optional product example. Generic controls come from public exports; product-specific components stay in the example. See [the architecture guide](docs/architecture.md) for maintenance decisions and review conventions.

## Add a component or story

First try composition of existing components. For a new reusable component, implement a typed native-prop API under `src/components`, use shared semantic tokens and a `tw-` class, and export the component and props through the public barrels. Keep business logic in the consuming application.

Add a `stories/ComponentName.stories.tsx` file with a default `Meta<typeof Component>`, editable args, useful variants, disabled/loading/error or empty states where applicable, and written usage/accessibility guidance. Storybook generates the API table from TypeScript. Add meaningful tests for state changes, form associations, or keyboard interaction; add a browser or screenshot check when real layout matters. Review both themes, narrow layouts, long labels, keyboard focus, and reduced motion.

```sh
pnpm tokens:build
pnpm check
pnpm test:browser
pnpm test:visual
```

## Validation scope

The tests exercise meaningful control behavior, accessibility relationships, and composed browser interactions. Visual checks cover representative desktop/mobile surfaces and themes rather than every permutation. Automated accessibility checks complement human keyboard and screen-reader review. Check printed output at its actual size for a publication or physical artifact.

The repository is marked `UNLICENSED`; choose a distribution license before publishing it externally.

## Optional product example

Common Thread is a separate SPA under Examples. It explores how people can track and review work created with intelligent agents. Its contributor labels, activity history, workflow diagram, and versioned cards are private application components. They do not define the design system's public APIs or its general patterns.

The demo stores changes in React memory. Refresh or **Reset demo** restores the initial records. It has no backend, authentication, actual agent execution, or permanent audit store. Application code owns those concerns.
