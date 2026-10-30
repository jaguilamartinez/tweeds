import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from '../src/index';

const meta = {
  title: 'Components/Pagination', component: Pagination,
  args: { page: 1, totalPages: 5, onPageChange: (_page: number) => {} },
  argTypes: { page: { control: { type: 'number', min: 1 } }, totalPages: { control: { type: 'number', min: 1 } }, onPageChange: { action: 'page changed' } },
  parameters: { docs: { description: { component: 'Navigate a finite set of pages. Page numbers start at one. Pass the current page and update it through onPageChange. Previous and next controls are disabled at the boundaries. When results change, update the result heading or announcement so the change is clear to assistive technology.' } } },
} satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Interactive: Story = { render: args => { const [page, setPage] = useState(args.page); useEffect(() => setPage(args.page), [args.page]); return <Pagination {...args} page={page} onPageChange={value => { setPage(value); args.onPageChange?.(value); }} />; } };
export const Middle: Story = { args: { page: 3 } };
export const Last: Story = { args: { page: 5 } };
export const SinglePage: Story = { args: { totalPages: 1 } };
