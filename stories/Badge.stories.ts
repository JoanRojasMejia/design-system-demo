import { StoryFn, Meta } from "@storybook/vue3";

import { GBadge } from '../components/Badge';
import { GConfigProvider } from '../components/ConfigProvider';

export default {
  title: 'Data/Badge',
  component: GBadge,
} as Meta<typeof GBadge>;

const Template: StoryFn<typeof GBadge> = (args) => ({
  components: { GBadge, GConfigProvider },
  template: `
  <g-config-provider>
    <g-badge value="8" v-bind="args">
      Hola
    </g-badge>
  </g-config-provider>
  `,
  setup() {
    return { args };
  }
});

export const Default = Template.bind({});
Default.args = {
  text: 'JA'
};