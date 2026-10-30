import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, EmptyState } from '../src/index';

const meta = {
  title: 'Components/EmptyState', component: EmptyState,
  args: { title: 'No projects yet', children: 'Create a project to keep your work in one place.', action: <Button>Create project</Button> },
  argTypes: { action: { control: false } },
  parameters: { docs: { description: { component: 'Explain why a surface has no content and provide one useful next action. Use a real heading and plain language. Separate an empty collection from a failed request: a network error needs an error explanation and retry action. Avoid blaming the user or filling the space with decorative artwork.' } } },
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;
export const FirstUse: Story = {};
export const NoResults: Story = { args: { title: 'No results found', children: 'Try another search or clear the filters.', action: <Button variant="secondary">Clear filters</Button> } };
export const ReadOnly: Story = { args: { title: 'No recent activity', children: 'Recent updates will appear here.', action: undefined } };
