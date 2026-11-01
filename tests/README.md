# Verification

`pnpm test` runs component interaction tests and structural axe checks in jsdom.
Those checks disable only the color-contrast rule because jsdom does not render
layout. Unit regressions cover dynamic tab selection, example-view focus, and
safe token-reference resolution. `pnpm test:browser` runs the playbook at desktop and mobile sizes and
checks section navigation, catalog search, theme controls, component interaction,
generic form validation, settings, and search patterns. Separate application
checks cover the optional Common Thread SPA and its private business rules.
Axe WCAG A/AA checks include rendered
contrast in Paper and Ink across the reference and workspace.
Brand tests check that mathematical marks stay decorative by default, expose an
explicit standalone label, and preserve native SVG attributes and refs. Large
marks have their own visual specimen; they remain separate from functional icons.
Brand tests also check that highlight overlays preserve accessible child content,
native attributes, and keyboard actions. Browser checks compare button state
heights and confirm that the motion preview reaches both ends of its track.
They load the bundled Instrument Serif face, check that all logo variants render
without an outline or synthetic weight, and verify space between the stacked
words. Filled tag colors, the lime status dot, and the selected tab underline are
checked in both themes.

The print-media regression checks every semantic color role and verifies that
Ink form errors become ink on paper in print. `pnpm test:types` checks the
built public exports through independent strict Bundler and NodeNext consumers,
without JSON resolution, Vite ambient types, or skipped declaration checking.
Run `pnpm build` first, or use `pnpm build:example`, which includes both fixtures.

Windows defaults to the installed Microsoft Edge browser (`msedge`); no
Playwright browser download is needed when Edge is already installed. Linux and
macOS default to Playwright's bundled Chromium: install it once with
`pnpm exec playwright install chromium`.

Set `PLAYWRIGHT_CHANNEL` to select another browser channel, such as `chrome`,
`msedge`, or `chromium`. Edge and Chrome channels require the selected browser to
be installed. Choosing `chromium` requires the Playwright installation command
above, including on Windows. For example, in PowerShell:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'chromium'
pnpm test:browser
```

On Linux or macOS, use `PLAYWRIGHT_CHANNEL=chrome pnpm test:browser`. The same
variable applies to visual tests. Remove the variable to restore platform
defaults.

Run `pnpm test:visual:update` to generate or intentionally update visual baselines,
then inspect the screenshots before committing them. `pnpm test:visual` compares
the playbook overview, Foundations, Button and Icon component pages, Tag, Tabs, and MathMark
specimens, and the optional Common Thread landing page and workspace in both
themes at desktop and mobile sizes, for 36 baselines. Tag, Tabs, and MathMark images crop to
the component preview; the other cases capture the page. Image names use
`playbook-*`, `foundations-*`, `components-button-*`, `components-icon-*`,
`components-tag-*`, `components-tabs-*`, `components-mathmark-*`, `product-landing-*`, and
`product-workspace-*`. Project names include the selected
channel, and baselines are stored by operating system and project because font
rendering differs between browsers, Windows, Linux, and macOS. Use the same OS,
browser channel/version, and fonts when comparing. Browser tests wait for local
fonts and reduce motion. Each axe theme scan verifies the committed theme and
waits for two browser paint frames before sampling rendered colors. Visual checks
also disable animations and text carets.

For an icon change, inspect the 16, 24, and 40 px specimens at normal browser
zoom. Check open gaps, stroke balance, and whether the symbol still describes its
action beside a label. For drawing changes, review both the separated and
assembled views in Foundations, including the compact view on mobile. Check the
layer button by keyboard and repeat with reduced motion enabled; the view should
change without a transition. Screenshot comparisons alone do not check those
judgments.

Review wordmark kerning at normal zoom. The loaded-font bounds check catches
collisions between the two lines; spacing within a word still needs visual review.

Review orange and lime overlays in both themes. Construction lines should remain
visible through the tint, labels should sit outside it, and the overlay must not
intercept pointer input. Check title spacing and restrained control states at
normal zoom. Treat the 60/20/10/5/5 color mix as composition guidance;
it is not a pixel quota for every screen or a reason to reduce text contrast.

Playwright starts Vite automatically at `http://127.0.0.1:5173` and reuses an
existing local server outside CI. Browser runs use two workers to keep local and
CI resource use predictable. The HTML report is available after a run with
`pnpm exec playwright show-report`.
