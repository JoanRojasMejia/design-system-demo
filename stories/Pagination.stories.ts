import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

// COMPONENTS
import { GPagination } from '../components/Pagination';
import { GButton } from '../components/Button/src';

// CONFIG
import { GConfigProvider } from '../components/ConfigProvider';

export default {
  title: 'Data/Pagination',
  component: GPagination,
  argTypes: {
    'v-model': {
      description: 'binding value.',
      table: {
        type: { summary: 'Number, String' }
      }
    },
  },
  args: {
    total: 100,
  },
} as Meta<typeof GPagination>;

const Template: StoryFn<typeof GPagination> = (args, selected) => {
  return {
    components: { GPagination, GConfigProvider, GButton },
    setup() {
      const dialogVisible = ref(true);

      function handleClose() {
        console.log('close padre')
      }

      return {
        args,
        dialogVisible,
        handleClose,
      };
    },
    template: `
      <g-config-provider>
        <g-pagination v-bind="args" />
      </g-config-provider>
    `,
  }
};

export const Default = Template.bind({});

Default.parameters = {
  docs: {
    description: {
      component: `If you have too much data to display in one page, use pagination.`,
    },
  },
};

