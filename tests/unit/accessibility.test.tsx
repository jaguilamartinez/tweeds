import axe from 'axe-core';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Alert, Button, Card, Checkbox, EmptyState, Select, Switch, Tabs, Tag, TextArea, TextField, ThemeProvider } from '../../src';

describe('accessible composition', () => {
  it.each(['paper', 'ink'] as const)('has no structural accessibility violations in the %s theme', async theme => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <main>
          <h1>Settings</h1>
          <Tag>GENERAL</Tag>
          <Alert title="Settings saved" tone="success">Your changes have been saved.</Alert>
          <form aria-label="Account settings">
            <TextField label="Display name" hint="This name appears on your profile." />
            <TextField label="Contact email" type="email" error="Enter a valid email address." />
            <TextArea label="About you" hint="Add a short introduction." />
            <Select label="Language" defaultValue="en">
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </Select>
            <Checkbox label="Send a copy by email" />
            <Switch label="Email notifications" checked={false} onCheckedChange={() => {}} />
            <Button type="submit">Save changes</Button>
          </form>
          <Tabs items={[
            { id: 'profile', label: 'Profile', content: <p>Manage your name and contact details.</p> },
            { id: 'preferences', label: 'Preferences', content: <p>Choose how you receive updates.</p> },
          ]} />
          <h2>Saved items</h2>
          <Card><h3>Getting started</h3><p>Set up your profile and choose your preferences.</p></Card>
          <EmptyState title="No saved items">Items you save will appear here.</EmptyState>
        </main>
      </ThemeProvider>,
    );
    // jsdom has no layout or canvas implementation. Real contrast is checked
    // against the rendered application in the Playwright suite.
    const result = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(result.violations.map(({ id, nodes }) => ({ id, elements: nodes.map(node => node.target) }))).toEqual([]);
  });
});
