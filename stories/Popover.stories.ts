import { Meta, StoryFn } from '@storybook/vue3';
import { ref, unref } from 'vue';
import { ClickOutside } from 'element-plus'
import { action } from '@storybook/addon-actions';
import { fn } from "@storybook/test";

// COMPONENTS
import { GPopover } from '../components/Popover';
import { GButton } from '../components/Button/src';
import { GSelect } from '../components/Select';
import { GSelectOption } from '../components/SelectOption';

// CONFIG
import { GConfigProvider } from '../components/ConfigProvider';

export default {
  title: 'Feedback/Popover',
  component: GPopover,
  argTypes: {
    placement: {
      options: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'],
      defaultValue: 'top-start',
    },
    trigger: {
      options: ['click', 'hover', 'contextmenu'],
      defaultValue: 'hover',
    },
  },
  args: {
    content: 'this is content, this is content, this is content',
    width: 200,
    title: 'Title',
    placement: 'top-start',
    trigger: 'hover',
  },
  parameters: {
    docs: {
      description: {
        component: `The trigger attribute is used to define how popover is triggered: \`hover\`, \`click\`, \`contextmenu\`. If you want to manually control it, you can set \`:visible\`.`,
      },
    },
  },
} as Meta<typeof GPopover>;

const Template: StoryFn<typeof GPopover> = (args) => {
  return {
    components: { GPopover, GConfigProvider, GButton },
    setup() {

      return {
        args,
        onChange: fn(action('change')),
      };
    },
    template: `
      <g-config-provider>
        <div class="flex items-center justify-center gap-3 h-72 px-10">

          <g-popover v-bind="args">
            <template #reference>
              <g-button class="w-56">Action</g-button>
            </template>
          </g-popover>

        </div>
      </g-config-provider>
    `,
  }
};


export const Default = Template.bind({});


const TemplateRichContent: StoryFn<typeof GPopover> = () => ({
  components: { GPopover, GConfigProvider, GButton, GSelectOption, GSelect },
  template: `
    <g-config-provider>
      <div class="flex gap-3 h-72">
        <g-popover
          placement="bottom-start"
          :width="400"
          trigger="click"
        >
          <template #reference>
            <g-button class="w-56">
              Click
            </g-button>
          </template>

          <div>
            <g-select
              class="flex items-center gap-x-8"
              v-model="selected"
              label="Seleccionar"
              border
            >
              <g-select-option
                v-for="item in options"
                :key="item.numberType"
                :label="item.nameDisplay"
                :value="item.numberType"
              />
            </g-select>
          </div>
        </g-popover>
      </div>
    </g-config-provider>
  `,
  setup() {
    const selected = ref('CC');

    const options = [
      {
        "nameDisplay": "Cédula de Ciudadanía",
        "numberType": "CC",
      },
      {
        "nameDisplay": "Cédula de Extranjería",
        "numberType": "CE",
      },
      {
        "nameDisplay": "Pasaporte",
        "numberType": "PASS",
      },
      {
        "nameDisplay": "Permiso Especial de Permanencia",
        "numberType": "PEP",
      }
    ];
    return {
      selected,
      options,
    };
  },
});

export const RichContent = TemplateRichContent.bind({});

RichContent.parameters = {
  docs: {
    description: {
      story: `Other components/elements can be nested in popover.`,
    },
  },
};

const TemplateNestedOperation: StoryFn<typeof GPopover> = () => ({
  components: { GPopover, GConfigProvider, GButton, GSelectOption, GSelect },
  template: `
    <g-config-provider>
      <div class="flex gap-3 h-72">
        <g-popover
          :visible="visible"
          placement="bottom-start"
          title="Title manual"
          :width="200"
        >
          <template #reference>
            <g-button class="w-56" @click="visible = !visible">
              Manual
            </g-button>
          </template>
          <div>
            <p class="mb-2">this is content, this is content, this is content</p>
            <g-button color="secondary" size="tiny" @click="visible = false">
              ok
            </g-button>
          </div>
        </g-popover>
      </div>
    </g-config-provider>
  `,
  setup() {
    const visible = ref(false);

    return {
      visible,
    };
  },
});

export const NestedOperation = TemplateNestedOperation.bind({});

NestedOperation.parameters = {
  docs: {
    description: {
      story: `Of course, you can nest other operations. It's more light-weight than using a dialog.`,
    },
  },
};

const TemplateContextMenu: StoryFn<typeof GPopover> = () => ({
  components: { GPopover, GConfigProvider, GButton, GSelectOption, GSelect },
  template: `
    <g-config-provider>
      <div class="flex gap-3 h-72">
        <g-popover
          title="Title contextmenu"
          :width="200"
          trigger="contextmenu"
          content="this is content, this is content, this is content"
        >
          <template #reference>
            <g-button class="w-56">contextmenu</g-button>
          </template>
        </g-popover>
      </div>
    </g-config-provider>
  `,
  setup() {
  },
});

export const ContextMenu = TemplateContextMenu.bind({});

ContextMenu.parameters = {
  docs: {
    description: {
      story: `Can be used as a context menu by right-clicking.`,
    },
  },
};

// const TemplateVirtualTriggering: StoryFn<typeof GPopover> = () => ({
//   components: { GPopover, GConfigProvider, GButton },
//   template: `
//     <g-config-provider>
//       <div class="flex gap-3 h-72">
//         <g-button class="w-56" ref="buttonRef" v-click-outside="onClickOutside">
//           Click
//         </g-button>
//         <g-popover
//           ref="popoverRef"
//           :virtual-ref="buttonRef"
//           trigger="click"
//           title="With title"
//           virtual-triggering
//         >
//           <span> Some content </span>
//         </g-popover>
//       </div>
//     </g-config-provider>
//   `,
//   directives: {
//     ClickOutside,
//   },
//   setup() {
//     const buttonRef = ref()
//     const popoverRef = ref()
//     const onClickOutside = () => {
//       console.log('hola')
//       unref(popoverRef).popperRef?.delayHide?.()
//     }

//     return {
//       buttonRef,
//       popoverRef,
//       onClickOutside,
//     }
//   },
// });

// export const VirtualTriggering = TemplateVirtualTriggering.bind({});

// VirtualTriggering.parameters = {
//   docs: {
//     description: {
//       story: `Popover can be triggered by virtual elements, if your use case includes separate the triggering element and the content element, you should definitely use the mechanism, normally we use #reference to place our triggering element, with triggering-element API you can set your triggering element anywhere you like, but notice that the triggering element should be an element that accepts mouse and keyboard event.`,
//     },
//   },
// };