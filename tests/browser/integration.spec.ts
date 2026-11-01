import { createRequire } from 'node:module';
import { expect, test, type Page } from '@playwright/test';

const require = createRequire(import.meta.url);

async function revealPlaybookNavigation(page: Page) {
  const navigation = page.getByRole('navigation', { name: 'Playbook', exact: true });
  if (!await navigation.isVisible()) await page.getByRole('button', { name: 'Open playbook navigation', exact: true }).click();
  return navigation;
}

async function openSection(page: Page, section: string) {
  const navigation = await revealPlaybookNavigation(page);
  await navigation.locator(`a[href="#${section}"]`).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(async () => { await document.fonts.ready; });
});

test('opens the component playbook first and filters the public catalog', async ({ page }) => {
  const identity = page.getByRole('main').getByRole('heading', { level: 1, name: 'Tweeds — Tinker Works Design System', exact: true });
  await expect(identity).toBeVisible();
  const home = page.getByRole('link', { name: 'Tweeds design system home', exact: true });
  await expect(home).toBeVisible();
  await expect(home).toHaveAttribute('href', '#overview');
  await expect(home).toContainText('Tweeds');
  await page.evaluate(async () => { await document.fonts.ready; });
  const lockup = await identity.locator('svg').evaluate(svg => {
    const words = [...svg.querySelectorAll<SVGTextElement>('text')];
    const wordmark = words.find(text => text.textContent?.trim() === 'Tweeds')!;
    const descriptor = words.find(text => text.textContent?.trim() === 'Tinker Works Design System')!;
    const screenWidth = (text: SVGTextElement) => {
      const bounds = text.getBBox();
      const matrix = text.getScreenCTM()!;
      return new DOMPoint(bounds.x + bounds.width, bounds.y).matrixTransform(matrix).x - new DOMPoint(bounds.x, bounds.y).matrixTransform(matrix).x;
    };
    return { wordmark: screenWidth(wordmark), descriptor: screenWidth(descriptor) };
  });
  expect(lockup.wordmark).toBeGreaterThan(0);
  expect(Math.abs(lockup.wordmark - lockup.descriptor), 'The descriptor spans the wordmark width').toBeLessThanOrEqual(Math.max(2, lockup.wordmark * .015));
  await openSection(page, 'components');
  await expect(page).toHaveURL(/#components$/);
  const search = page.getByLabel('Find a component', { exact: true });
  await expect(search).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Button', exact: true })).toBeVisible();
  await search.fill('Pagination');
  await expect(page.getByRole('heading', { name: 'Pagination', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Button', exact: true })).not.toBeVisible();
  for (const name of ['ContributorBadge', 'WorkflowDiagram', 'ActivityTimeline', 'ArtifactCard']) {
    await search.fill(name);
    await expect(page.getByRole('heading', { name: 'No matching components', exact: true })).toBeVisible();
  }
  await page.getByRole('button', { name: 'Clear search', exact: true }).click();
  await expect(search).toHaveValue('');
  await page.getByRole('combobox', { name: 'Component category', exact: true }).selectOption('Actions');
  const index = page.getByRole('navigation', { name: 'Component list', exact: true });
  await expect(index.getByRole('button', { name: 'TextField', exact: true })).not.toBeVisible();
  await index.getByRole('button', { name: 'TextLink', exact: true }).click();
  await expect(page.getByRole('article', { name: 'TextLink', exact: true })).toBeVisible();
  await expect(index.getByRole('button', { name: 'TextLink', exact: true })).toHaveAttribute('aria-current', 'true');
  await index.getByRole('button', { name: 'Button', exact: true }).click();
  const buttonPreview = page.getByRole('article', { name: 'Button', exact: true });
  // A theme reset must not erase the typography belonging to a component size.
  await expect(buttonPreview.getByRole('button', { name: 'Save changes', exact: true })).toHaveCSS('font-size', '14px');
  await expect(buttonPreview.getByRole('button', { name: 'Disabled', exact: true })).toHaveCSS('font-size', '14px');
  const stateHeights = await Promise.all(['Save changes', 'Disabled', 'Saving'].map(name => buttonPreview.getByRole('button', { name, exact: true }).evaluate(button => button.getBoundingClientRect().height)));
  expect(stateHeights.every(height => Math.abs(height - stateHeights[0]) <= 1), 'Enabled, disabled, and loading controls retain the same size').toBe(true);
  expect(stateHeights[0]).toBeGreaterThanOrEqual(44);
  await buttonPreview.getByRole('combobox', { name: 'Button variant', exact: true }).selectOption('secondary');
  await buttonPreview.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(buttonPreview.getByRole('status')).toHaveText('Changes saved.');

  // A wide viewport can still contain a narrow specimen beside the component index.
  await page.setViewportSize({ width: 900, height: 1000 });
  await page.getByRole('combobox', { name: 'Component category', exact: true }).selectOption('All');
  await index.getByRole('button', { name: 'Navigation', exact: true }).click();
  const navigationPreview = page.getByRole('article', { name: 'Navigation', exact: true }).locator('.pb-component-preview');
  await expect(navigationPreview).toBeVisible();
  const overflow = await navigationPreview.evaluate(preview => {
    const container = preview.getBoundingClientRect();
    return [...preview.querySelectorAll('a, button')].filter(element => element.getClientRects().length).filter(element => {
      const bounds = element.getBoundingClientRect();
      return bounds.left < container.left - 1 || bounds.right > container.right + 1;
    }).map(element => element.textContent?.trim() || element.getAttribute('aria-label'));
  });
  expect(overflow, 'Navigation controls stay inside their available container').toEqual([]);
});

test('supports keyboard section navigation, direct links, and theme changes', async ({ page }) => {
  const navigation = await revealPlaybookNavigation(page);
  const foundations = navigation.locator('a[href="#foundations"]');
  await foundations.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#foundations$/);
  await page.reload();
  await expect(page).toHaveURL(/#foundations$/);
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Logo', exact: true }).getByRole('img', { name: 'Tinker Works', exact: true })).toHaveCount(2);
  const theme = page.getByRole('button', { name: 'Switch to paper theme', exact: true });
  await theme.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Switch to ink theme', exact: true })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Switch to paper theme', exact: true })).toBeVisible();
});

test('preserves the brand typography and colored component signals in both themes', async ({ page }) => {
  await page.goto('/#components');
  const index = page.getByRole('navigation', { name: 'Component list', exact: true });
  for (const theme of ['ink', 'paper']) {
    if (theme === 'paper') await page.getByRole('button', { name: 'Switch to paper theme', exact: true }).click();
    await index.getByRole('button', { name: 'Logo', exact: true }).click();
    const logos = page.getByRole('article', { name: 'Logo', exact: true }).getByRole('img', { name: 'Tinker Works', exact: true });
    await expect(logos).toHaveCount(3);
    const font = await page.evaluate(async () => {
      const faces = await document.fonts.load('400 112px "Instrument Serif"', 'Tinker Works');
      return { loaded: faces.filter(face => face.status === 'loaded').length, available: document.fonts.check('400 112px "Instrument Serif"') };
    });
    expect(font.loaded, 'The bundled logo face loads instead of relying on a fallback').toBeGreaterThan(0);
    expect(font.available).toBe(true);
    const logoTreatment = await logos.evaluateAll(marks => marks.map(mark => [mark, ...mark.querySelectorAll('*')].map(element => {
      const style = getComputedStyle(element);
      return { stroke: style.stroke, fontSynthesis: style.fontSynthesis, fontFamily: style.fontFamily };
    })));
    for (const mark of logoTreatment) {
      expect(mark.every(element => element.stroke === 'none'), 'Logo glyphs render without an outline').toBe(true);
      expect(mark.every(element => element.fontSynthesis === 'none'), 'Logo glyphs use the supplied face without synthetic weight').toBe(true);
      expect(mark.every(element => element.fontFamily.includes('Instrument Serif')), 'Every logo variant uses the shared serif face').toBe(true);
    }
    const wordSpacing = await logos.evaluateAll(marks => {
      const context = document.createElement('canvas').getContext('2d')!;
      return marks.map(mark => {
        const words = [...mark.querySelectorAll<SVGTextElement>('text')];
        const ink = words.map(word => {
          const style = getComputedStyle(word);
          context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
          const metrics = context.measureText(word.textContent ?? '');
          const baseline = word.getStartPositionOfChar(0);
          const matrix = word.getScreenCTM()!;
          const top = new DOMPoint(baseline.x, baseline.y - metrics.actualBoundingBoxAscent).matrixTransform(matrix).y;
          const bottom = new DOMPoint(baseline.x, baseline.y + metrics.actualBoundingBoxDescent).matrixTransform(matrix).y;
          return { top, bottom };
        });
        return { naturalWidth: words.every(word => !word.hasAttribute('textLength')), gaps: ink.slice(1).map((word, index) => word.top - ink[index].bottom) };
      });
    });
    expect(wordSpacing.flatMap(mark => mark.gaps)).toHaveLength(2);
    for (const mark of wordSpacing) {
      expect(mark.naturalWidth, 'Letter widths are supplied by the font').toBe(true);
      expect(mark.gaps.every(gap => gap > 0), 'Stacked words retain visible space between their ink bounds').toBe(true);
    }
    await index.getByRole('button', { name: 'Tag', exact: true }).click();
    const tags = page.getByRole('article', { name: 'Tag', exact: true });
    const limeTag = tags.getByText('Complete', { exact: true });
    const orangeTag = tags.getByText('Needs attention', { exact: true });
    await expect(limeTag).toHaveCSS('background-color', 'rgb(199, 244, 100)');
    await expect(orangeTag).toHaveCSS('background-color', 'rgb(255, 90, 0)');
    for (const tag of [limeTag, orangeTag]) await expect(tag).toHaveCSS('color', 'rgb(19, 21, 26)');
    const progress = tags.getByText('In progress', { exact: true });
    await expect(progress.locator('.tw-tag__status')).toHaveCSS('background-color', 'rgb(199, 244, 100)');
    await expect(progress).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');

    await index.getByRole('button', { name: 'Tabs', exact: true }).click();
    const tabs = page.getByRole('article', { name: 'Tabs', exact: true });
    const overview = tabs.getByRole('tab', { name: 'Overview', exact: true });
    await expect(overview).toHaveAttribute('aria-selected', 'true');
    await expect(overview).toHaveCSS('border-bottom-color', 'rgb(255, 90, 0)');
    expect(await overview.evaluate(tab => parseFloat(getComputedStyle(tab).borderBottomWidth))).toBeGreaterThan(0);
    await overview.focus();
    await page.keyboard.press('ArrowRight');
    const details = tabs.getByRole('tab', { name: 'Details', exact: true });
    await expect(details).toBeFocused();
    await expect(details).toHaveAttribute('aria-selected', 'true');
    await expect(details).toHaveCSS('border-bottom-color', 'rgb(255, 90, 0)');
  }
});

test('lets readers compare artwork and preview motion at both track endpoints', async ({ page }) => {
  await page.goto('/#foundations');
  const study = page.locator('figure.pb-geometry--specimen');
  const assemble = study.getByRole('button', { name: 'Assemble layers', exact: true });
  await expect(study).toHaveAttribute('data-layer-view', 'separated');
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
  const transitions = await study.locator('.pb-geometry-layer').evaluateAll(layers => layers.map(layer => getComputedStyle(layer).transitionDuration));
  expect(transitions.every(duration => duration.split(',').every(value => parseFloat(value) <= 0.001))).toBe(true);
  await assemble.focus();
  await page.keyboard.press('Enter');
  await expect(study).toHaveAttribute('data-layer-view', 'assembled');
  const separate = study.getByRole('button', { name: 'Separate layers', exact: true });
  await expect(separate).toBeFocused();
  await expect(study.getByRole('status')).toHaveText('Interface layers are shown together.');
  await page.keyboard.press('Space');
  await expect(study).toHaveAttribute('data-layer-view', 'separated');
  expect(await study.evaluate(figure => figure.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length)).toBe(0);
  const motion = page.locator('.pb-motion-demo');
  const track = motion.locator('.pb-motion-track');
  const preview = motion.getByRole('button', { name: 'Preview transition', exact: true });
  const endpointGap = (end: 'start' | 'end') => track.evaluate((element, end) => {
    const trackBounds = element.getBoundingClientRect();
    const circleBounds = element.querySelector('span')!.getBoundingClientRect();
    return end === 'start' ? circleBounds.left - trackBounds.left : trackBounds.right - circleBounds.right;
  }, end);
  await expect(track).toHaveAttribute('data-state', 'A');
  expect(Math.abs(await endpointGap('start'))).toBeLessThanOrEqual(1);
  await preview.focus();
  await page.keyboard.press('Enter');
  await expect(track).toHaveAttribute('data-state', 'B');
  await expect(motion.getByRole('status')).toHaveText('State B');
  expect(Math.abs(await endpointGap('end'))).toBeLessThanOrEqual(1);
  await page.keyboard.press('Space');
  await expect(track).toHaveAttribute('data-state', 'A');
  expect(Math.abs(await endpointGap('start'))).toBeLessThanOrEqual(1);
  await page.setViewportSize({ width: 320, height: 800 });
  await assemble.scrollIntoViewIfNeeded();
  await expect(assemble).toBeVisible();
  expect(await assemble.evaluate(button => button.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  const bounds = await study.evaluate(figure => {
    const { left, right } = figure.getBoundingClientRect();
    return { left, right, width: window.innerWidth, pageWidth: document.documentElement.scrollWidth };
  });
  expect(bounds.left).toBeGreaterThanOrEqual(0);
  expect(bounds.right).toBeLessThanOrEqual(bounds.width + 1);
  expect(bounds.pageWidth).toBeLessThanOrEqual(bounds.width + 1);
  await page.goto('/#overview');
  const overviewStudy = page.locator('figure.pb-geometry--overview');
  const overviewDrawing = overviewStudy.getByRole('img', { name: 'Layout, content, and interaction layers of an interface', exact: true });
  const overviewAssemble = overviewStudy.getByRole('button', { name: 'Assemble layers', exact: true });
  await expect(overviewDrawing).toBeVisible();
  const controlledId = await overviewDrawing.getAttribute('id');
  expect(controlledId).toBeTruthy();
  await expect(overviewAssemble).toHaveAttribute('aria-controls', controlledId!);
  expect(await overviewAssemble.evaluate(button => button.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  await expect(overviewStudy).toHaveAttribute('data-layer-view', 'separated');
  await overviewAssemble.focus();
  await page.keyboard.press('Enter');
  await expect(overviewStudy).toHaveAttribute('data-layer-view', 'assembled');
  await expect(overviewStudy.getByRole('button', { name: 'Separate layers', exact: true })).toBeFocused();
  await expect(overviewStudy.getByRole('status')).toHaveText('Interface layers are shown together.');
  await page.keyboard.press('Space');
  await expect(overviewStudy).toHaveAttribute('data-layer-view', 'separated');
  await expect(overviewAssemble).toBeFocused();
  await expect(overviewStudy.getByRole('status')).toHaveText('Layout, content, and interaction are shown apart.');
  for (const width of [393, 320]) {
    await page.setViewportSize({ width, height: 800 });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth), `Overview fits a ${width}px viewport`).toBeLessThanOrEqual(width + 1);
  }
});

test('drafts the overview once and rests on the authored drawing', async ({ page }) => {
  await page.goto('/#overview');
  await expect(page.locator('figure.pb-geometry--overview .pb-geometry-drawing')).toBeVisible();
  await expect(page.locator('[data-tw-reveal]'), 'Reduced motion shows the still drawing').toHaveCount(0);

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload();
  const roots = page.locator('.pb-hero [data-tw-reveal]');
  await expect(roots).toHaveCount(5);
  // Each root waits until it is in view, so bring it there before expecting it to finish.
  for (const root of await roots.all()) {
    await root.scrollIntoViewIfNeeded();
    await expect(root).toHaveAttribute('data-tw-reveal', 'done', { timeout: 10_000 });
  }
  const rest = await page.evaluate(() => ({
    drawn: document.querySelectorAll('.pb-hero [data-tw-stroke="draw"]').length,
    dashed: [...document.querySelectorAll('.pb-hero [data-tw-stroke="draw"]')].filter(shape => getComputedStyle(shape).strokeDasharray !== 'none').length,
    running: document.getAnimations().filter(animation => animation.playState === 'running' && animation.effect?.getTiming().iterations !== Infinity).length,
    interaction: getComputedStyle(document.querySelector('.pb-hero .pb-geometry-layer--interaction')!).transform,
  }));
  expect(rest.drawn, 'Pen strokes were drafted').toBeGreaterThan(20);
  expect(rest.dashed, 'Every stroke rests undashed').toBe(0);
  expect(rest.running).toBe(0);
  expect(rest.interaction, 'Layers rest at their separated positions').toBe('matrix(1, 0, 0, 1, 0, -140)');
});

test('validates a form, moves focus to the error, and confirms a valid save', async ({ page }) => {
  await page.goto('/#patterns');
  const form = page.getByRole('tabpanel');
  const name = form.getByRole('textbox', { name: 'Name', exact: true });
  const email = form.getByRole('textbox', { name: 'Email', exact: true });
  await expect(name).toHaveCSS('font-size', '15px');
  await form.getByRole('button', { name: 'Save details', exact: true }).click();
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await expect(name).toHaveAccessibleDescription('Enter your name.');
  await name.fill('Alex Morgan');
  await email.fill('invalid');
  await form.getByRole('button', { name: 'Save details', exact: true }).click();
  await expect(email).toBeFocused();
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await email.fill('alex@example.com');
  await form.getByRole('button', { name: 'Save details', exact: true }).click();
  await expect(form.getByRole('status')).toContainText('Details saved');
  await form.getByRole('button', { name: 'Reset form', exact: true }).click();
  await expect(name).toHaveValue('');
  await expect(email).toHaveValue('');
  await expect(name).not.toHaveAttribute('aria-invalid', 'true');
  await expect(form.getByRole('status')).not.toBeVisible();
});

test('changes settings by keyboard and restores an empty filtered list', async ({ page }) => {
  await page.goto('/#patterns');
  const settings = page.getByRole('tab', { name: 'Settings', exact: true });
  await settings.click();
  const notifications = page.getByRole('switch', { name: 'Email notifications', exact: true });
  await expect(notifications).toBeChecked();
  await notifications.focus();
  await page.keyboard.press('Space');
  await expect(notifications).not.toBeChecked();
  await expect(page.getByRole('tabpanel').getByRole('status')).toHaveText('Email notifications off. Weekly summary off.');
  await settings.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Search', exact: true })).toHaveAttribute('aria-selected', 'true');
  const search = page.getByRole('searchbox', { name: 'Search resources', exact: true });
  await search.fill('Getting started');
  await expect(page.getByRole('heading', { name: 'Getting started', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Release notes', exact: true })).not.toBeVisible();
  await page.getByRole('combobox', { name: 'Resource type', exact: true }).selectOption('Article');
  await expect(page.getByRole('heading', { name: 'No resources found', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await expect(search).toHaveValue('');
  await expect(page.getByRole('combobox', { name: 'Resource type', exact: true })).toHaveValue('all');
  await expect(page.getByRole('heading', { name: 'Release notes', exact: true })).toBeVisible();
});

test('keeps the product landing and workspace inside the example SPA', async ({ page }) => {
  await openSection(page, 'example');
  await expect(page).toHaveURL(/#example$/);
  const example = page.getByRole('region', { name: 'Common Thread example application', exact: true });
  await expect(example.getByRole('button', { name: 'Landing', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await example.getByRole('button', { name: 'Explore workspace', exact: true }).click();
  await expect(example.getByRole('heading', { name: 'Workspace', exact: true })).toBeVisible();
  await expect(example.getByRole('button', { name: 'Workspace', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/#example$/);
  await example.getByRole('button', { name: 'Landing', exact: true }).click();
  await expect(example.getByRole('button', { name: 'Explore workspace', exact: true })).toBeVisible();
});

test('filters artifacts and recovers from an empty product collection', async ({ page }) => {
  await page.goto('/#example');
  const example = page.getByRole('region', { name: 'Common Thread example application', exact: true });
  await example.getByRole('button', { name: 'Workspace', exact: true }).click();
  const search = example.getByRole('searchbox', { name: 'Find an artifact', exact: true });
  await search.fill('Decision log');
  await expect(example.getByRole('article', { name: 'Decision log', exact: true })).toBeVisible();
  await expect(example.getByRole('article', { name: 'Design brief', exact: true })).not.toBeVisible();
  await example.getByRole('combobox', { name: 'Artifact status', exact: true }).selectOption('draft');
  await expect(example.getByRole('heading', { name: 'No artifacts match', exact: true })).toBeVisible();
  await example.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await expect(search).toHaveValue('');
  await expect(example.getByRole('article', { name: 'Design brief', exact: true })).toBeVisible();
});

test('records a human review loop and carries its history into an agent draft', async ({ page }) => {
  await page.goto('/#example');
  const example = page.getByRole('region', { name: 'Common Thread example application', exact: true });
  await example.getByRole('button', { name: 'Workspace', exact: true }).click();
  await example.getByRole('button', { name: 'Open artifact: Design brief', exact: true }).click();
  await expect(example.getByRole('button', { name: 'Create next version', exact: true })).toBeDisabled();
  await example.getByRole('button', { name: 'Request revision', exact: true }).click();
  await expect(example.getByText('Design brief v0.3: revision requested by Maya Chen. Added to the activity history.', { exact: true })).toBeVisible();
  await expect(example.getByRole('button', { name: 'Accept version', exact: true })).toBeDisabled();
  await example.getByRole('button', { name: 'Submit for review', exact: true }).click();
  await expect(example.getByText('Design brief v0.3: submitted for review by Research agent. Added to the activity history.', { exact: true })).toBeVisible();
  await expect(example.getByRole('button', { name: 'Accept version', exact: true })).toBeEnabled();
  await example.getByRole('button', { name: 'Accept version', exact: true }).click();
  await expect(example.getByText('Design brief v0.3: accepted by Maya Chen. Added to the activity history.', { exact: true })).toBeVisible();
  await expect(example.getByRole('button', { name: 'Accept version', exact: true })).toBeDisabled();
  const history = example.getByRole('list', { name: 'Activity history', exact: true });
  await expect(history.getByText('Requested a revision', { exact: true })).toBeVisible();
  await expect(history.getByText('Submitted the draft for review', { exact: true })).toBeVisible();
  await expect(history.getByText('Accepted this version', { exact: true })).toBeVisible();
  await example.getByRole('button', { name: 'Create next version', exact: true }).click();
  await expect(example.getByText('Design brief v0.4: a new draft started by Research agent. Added to the activity history.', { exact: true })).toBeVisible();
  await expect(example.getByRole('button', { name: 'Accept version', exact: true })).toBeDisabled();
  await expect(example.getByRole('button', { name: 'Submit for review', exact: true })).toBeVisible();
  await expect(history.getByText('Accepted this version', { exact: true })).toBeVisible();
  await expect(history.getByText('Started the next version', { exact: true })).toBeVisible();
  await example.getByRole('tab', { name: 'Workflow', exact: true }).click();
  const workflow = example.getByRole('list', { name: 'Workflow', exact: true });
  await expect(workflow.getByText('Propose a draft', { exact: true })).toBeVisible();
  await expect(workflow.locator('[aria-current="step"]')).toContainText('Propose a draft');
  await example.getByRole('button', { name: 'Reset demo', exact: true }).click();
  await expect(example.getByRole('button', { name: 'Create next version', exact: true })).toBeDisabled();
  await expect(example.getByRole('list', { name: 'Activity history' }).getByText('Started the next version', { exact: true })).not.toBeVisible();
});

for (const section of ['overview', 'foundations', 'components', 'patterns', 'example']) {
  test(`has no rendered WCAG A/AA violations in the ${section} reference in either theme`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto(`/#${section}`);
    if (section === 'example') await page.getByRole('region', { name: 'Common Thread example application' }).getByRole('button', { name: 'Workspace', exact: true }).click();
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    for (const theme of ['ink', 'paper']) {
      if (theme === 'paper') await page.getByRole('button', { name: 'Switch to paper theme', exact: true }).click();
      await expect(page.locator('.playbook')).toHaveAttribute('data-tw-theme', theme);
      // Axe samples rendered pixels. Let the committed theme and local fonts
      // paint before comparing foreground and background colors.
      await page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      });
      const violations = await page.evaluate(async () => {
        const axe = (window as unknown as { axe: typeof import('axe-core') }).axe;
        const result = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } });
        return result.violations.map(({ id, impact, nodes }) => ({ id, impact, elements: nodes.map(node => ({ target: node.target, summary: node.failureSummary })) }));
      });
      expect(violations, `${section} / ${theme} theme accessibility`).toEqual([]);
    }
  });
}
