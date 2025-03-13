import { Meta, StoryFn } from '@storybook/vue3';
import { computed, ref } from 'vue';
import { GInfiniteScroll } from './../components/InfiniteScroll';

// CONFIG
import { GConfigProvider } from '../components/ConfigProvider';

export default {
  title: 'Data/Infinite Scroll',
  argTypes: {
    'v-g-infinite-scroll': {
      description: 'Load more data while reach bottom of the page',
      table: null,
    },
    'infinite-scroll-disabled': {
      description: 'is disabled. \`Default: false\`',
      table: {
        type: { summary: 'Boolean' }
      }
    },
    'infinite-scroll-delay': {
      description: 'throttle delay (ms). \`Default: 200\`',
      table: {
        type: { summary: 'Number' }
      }
    },
    'infinite-scroll-distance': {
      description: 'trigger distance (px). \`Default 0\`',
      table: {
        type: { summary: 'Number' }
      }
    },
    'infinite-scroll-immediate': {
      description: 'Whether to execute the loading method immediately, in case the content cannot be filled up in the initial state. \`Default: true\`',
      table: {
        type: { summary: 'Boolean' }
      }
    },
  },
  args: {
    'infinite-scroll-immediate': true,
  },
} as Meta;

const Template: StoryFn = (args, selected) => {
  return {
    components: { GConfigProvider },
    directives: {
      GInfiniteScroll,
    },
    setup() {
      const count = ref(0)
      function load() {
        count.value += 2
      }

      return {
        args,
        load,
        count,
      };
    },
    template: `
      <g-config-provider>
        <div class="h-80 overflow-y-auto border-blue-3 border-solid border rounded-sm py-4 px-4">
          <ul
            v-g-infinite-scroll="load"
            class="grid grid-cols-1 gap-3"
            :infinite-scroll-disabled="disabled"
          >
            <li
              v-for="i in count"
              :key="i"
              class="h-12 flex justify-center items-center text-white font-semibold even:bg-gray-5 odd:bg-gray-6 rounded-sm">
              {{ i }}
            </li>
          </ul>
        </div>
      </g-config-provider>
    `,
  }
};

export const Default = Template.bind({});
Default.parameters = {
  docs: {
    description: {
      component: `Load more data while reach bottom of the page <br /> Add \`v-g-infinite-scroll\` to the list to automatically execute loading method when scrolling to the bottom.`,
    },
  },
};

const TemplateDisabled: StoryFn = (args, selected) => {
  return {
    components: { GConfigProvider },
    directives: {
      GInfiniteScroll,
    },
    setup() {
      const count = ref(10)
      const loading = ref(false)
      const noMore = computed(() => count.value >= 50)
      const disabled = computed(() => loading.value || noMore.value)
      const load = () => {
        loading.value = true
        setTimeout(() => {
          count.value += 2
          loading.value = false
        }, 2000)
      }

      return {
        args,
        disabled,
        load,
        loading,
        noMore,
        count,
      };
    },
    template: `
      <g-config-provider>
        <div class="h-80 overflow-y-auto border-blue-3 border-solid border rounded-sm py-4 px-4">
          <ul
            v-g-infinite-scroll="load"
            class="grid grid-cols-1 gap-3"
            :infinite-scroll-disabled="disabled"
          >
            <li
              v-for="i in count"
              :key="i"
              class="h-12 flex justify-center items-center text-white font-semibold even:bg-gray-5 odd:bg-gray-6 rounded-sm">
              {{ i }}
            </li>
          </ul>
          <div class="text-center text-5 py-5">
            <p v-if="loading">Loading...</p>
            <p v-if="noMore">No more</p>
          </div>
        </div>
      </g-config-provider>
    `,
  }
};

export const Disabled = TemplateDisabled.bind({});
Disabled.parameters = {
  docs: {
    description: {
      story: `We can deactivate the load to wait for the previous answer.`,
    },
  },
};