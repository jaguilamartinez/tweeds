import type { Meta, StoryObj } from '@storybook/react-vite';
import { Navigation } from '../src/index';

const items = [{ label: 'Discover', href: '#discover' }, { label: 'Build', href: '#build' }, { label: 'Interact', href: '#interact' }, { label: 'Notes', href: '#notes' }];
const meta = {
  title: 'Components/Navigation', component: Navigation,
  args: { items, activeHref: '#discover', homeHref: '#top' },
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Quiet horizontal navigation uses regular Instrument Sans labels and gives the serif wordmark room. A fine high-contrast underline marks the current page. Supply readable link labels, activeHref for the current page, and homeHref for the logo destination. Navigation owns the home anchor; pass a Logo element in the logo slot, without another anchor. The compact mobile trigger and every link retain a 44px minimum touch target. Its labelled disclosure button exposes expanded state; Escape closes it and restores focus. Keep labels short, use one main Navigation per page, and give other navigation regions distinct accessible names. Resize this story to inspect the compact menu.' } } },
} satisfies Meta<typeof Navigation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const NoActivePage: Story = { args: { activeHref: undefined } };
export const LongLabels: Story = { args: { items: [{ label: 'Experiment archive', href: '#archive' }, { label: 'Tools and materials', href: '#tools' }, { label: 'People and process', href: '#process' }], activeHref: '#process' } };
