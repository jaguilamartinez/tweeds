import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Icon, iconCatalog, iconNames } from '../src/index';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  args: { name: 'arrow-up-right' },
  argTypes: { name: { control: 'select', options: iconNames } },
  parameters: {
    docs: {
      description: {
        component: 'Icons use a shared 24-unit grid. Their arrows, corner marks, centerlines, and projected planes come from technical drawing, simplified to remain clear in a control. Small icons omit secondary construction marks; larger specimens include them. Keep utility icons monochrome and give unfamiliar symbols a visible label. Icons are decorative by default, so the enclosing button or link needs an accessible name. A touch control needs at least a 44 px hit area even when its icon is smaller. Hatching, pen variation, and accent strokes belong in larger illustrations.',
      },
    },
  },
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Vocabulary: Story = {
  render: () => (
    <div className="tw-story-grid">
      {iconCatalog.map(({ name, label }) => (
        <div key={name} className="tw-story-row">
          <Icon name={name} />
          <div><span>{label}</span><br /><code>{name}</code></div>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Review symbols at the size people will use. At 16 px, preserve the main contour and open gaps. At 40 px, check the same geometry for balance. The icon size does not set the hit area of its enclosing control.',
      },
    },
  },
  render: () => (
    <div className="tw-story-grid">
      {(['search', 'layers', 'crosshair', 'frame'] as const).map(name => (
        <div className="tw-story-stack" key={name}>
          <code>{name}</code>
          <div className="tw-story-row">
            {([16, 24, 40] as const).map(size => (
              <div className="tw-story-stack" key={size}>
                <Icon name={name} size={size} />
                <code>{size} px</code>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const WithLabels: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Choose an icon for the action it describes. Keep the label short and specific; a crosshair alone may be clear in a drawing tool but unfamiliar in a form.',
      },
    },
  },
  render: () => (
    <div className="tw-story-row">
      <Button variant="secondary" icon={<Icon name="search" />}>Search</Button>
      <Button variant="secondary" icon={<Icon name="layers" />}>Show layers</Button>
      <Button variant="secondary" icon={<Icon name="frame" />}>Fit to view</Button>
      <Button variant="secondary" icon={<Icon name="crosshair" />}>Center selection</Button>
    </div>
  ),
};
