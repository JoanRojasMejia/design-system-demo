import { StoryFn, Meta } from "@storybook/vue3";
import { Button, ButtonType, ButtonColor, ButtonSize } from '../components/Button-old';

export default {
  title: 'Data/Button',
  component: Button,
  argTypes: {
    type: {
      options: Object.keys(ButtonType),
    },
    typeColor: {
      options: Object.keys(ButtonColor),
    },
    size: {
      options: Object.keys(ButtonSize)
    },
  }
} as Meta<typeof Button>;

const Template: StoryFn<typeof Button> = (args) => ({
  components: { Button },
  template: `<Button v-bind="args">`,
  setup() {
    return { args };
  },
});

export const Primary = Template.bind({});
Primary.args = {
  type: 'Primary',
  typeColor: 'Primary',
  size: 'M',
  icon: 'home'
};