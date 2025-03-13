import type { StorybookConfig } from '@storybook/vue3-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  framework: {
    name: "@storybook/vue3-vite",
    options: {}
  },
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-jest",
    "@storybook/addon-controls",
    '@storybook/addon-docs'
  ],


  async viteFinal(config) {
    return config
  },

  docs: { autodocs: 'tag' }
};

export default config