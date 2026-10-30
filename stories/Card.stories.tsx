import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, Tag, TextLink } from '../src/index';

const meta = {
  title: 'Components/Card', component: Card,
  args: { children: <><Tag>Guide</Tag><h3>Getting started</h3><p>Install the package and build your first screen.</p><TextLink href="#setup">Read the setup guide</TextLink></> },
  argTypes: { children: { control: false } },
  parameters: { docs: { description: { component: 'An editorial article surface composed from ordinary content. Add a meaningful heading, optional metadata, a concise description, and a specific link. The card itself does not create an ambiguous click target or wrap nested controls in a link. Use a grid container for responsive collections; do not impose a fixed card height on long content.' } } },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Content: Story = {};
export const Collection: Story = { render: () => <div className="tw-story-grid"><Card><Tag>Guide</Tag><h3>Getting started</h3><p>Install the package and build your first screen.</p><TextLink href="#setup">Read the setup guide</TextLink></Card><Card><Tag>Guide</Tag><h3>Writing labels</h3><p>Choose clear names for controls and actions.</p><TextLink href="#labels">Read about labels</TextLink></Card><Card><Tag>Article</Tag><h3>Release notes</h3><p>See what changed in the latest release.</p><TextLink href="#releases">Read the release notes</TextLink></Card></div> };
