import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';
import { action } from '@storybook/addon-actions';

// COMPONENTS
import { GSelect } from '../components/SelectQuoter';
import { GSelectOption } from '../components/SelectOption';
import { ElSelect } from 'element-plus';
import { ElOption } from 'element-plus';

// CONFIG
import { GConfigProvider } from '../components/ConfigProvider';

export default {
  title: "Form/SelectQuoter",
  component: GSelect,
  subcomponents: { GSelectOption },
  parameters: {
    docs: {
      description: {
        component: `When there are plenty of options, use a drop-down menu to display and select desired ones.`,
      },
    },
  },
} as Meta<typeof GSelect>;

const Template: StoryFn<typeof GSelect> = (args, selected) => {
  return {
    components: { GSelect, GSelectOption, GConfigProvider, ElSelect, ElOption },
    setup() {
      const selected = ref('');

      const options = [
        {
          "countryCode": "CO",
          "nameDisplay": "Cédula de Ciudadanía",
          "numberType": "CC",
          "numberTypeLabel": "Número CC",
          "docType": "CC",
          "minSize": 6,
          "maxSize": 10,
          "idDefault": true,
          "enabled": true,
          "jumioIdType": "ID_CARD",
          "tooltip": null
        },
        {
          "countryCode": "CO",
          "nameDisplay": "Cédula de Extranjería",
          "numberType": "CE",
          "numberTypeLabel": "Número CE",
          "docType": "CE",
          "minSize": 6,
          "maxSize": 10,
          "idDefault": false,
          "enabled": true,
          "jumioIdType": "ID_CARD",
          "tooltip": null
        },
        {
          "countryCode": "CO",
          "nameDisplay": "Pasaporte",
          "numberType": "PASS",
          "numberTypeLabel": "Número Pasaporte",
          "docType": "PASS",
          "minSize": 8,
          "maxSize": 10,
          "idDefault": false,
          "enabled": true,
          "jumioIdType": "ID_CARD",
          "tooltip": null
        },
        {
          "countryCode": "CO",
          "nameDisplay": "Permiso Especial de Permanencia",
          "numberType": "PEP",
          "numberTypeLabel": "Número PEP",
          "docType": "PEP",
          "minSize": 15,
          "maxSize": 15,
          "idDefault": false,
          "enabled": true,
          "jumioIdType": "ID_CARD",
          "tooltip": null
        }
      ];

      return {
        args,
        selected,
        options,
        onChange: action('change'),
        onFocus: action('focus'),
        onBlur: action('blur'),
        onVisible: action('visible-change'),
        onRemoteTag: action('remove-tag'),
        onClear: action('clear'),
      };
    },
    template: `
      <g-config-provider>
        <div class="p-7 h-80">
          <g-select
            class="flex items-center gap-x-8"
            v-model="selected"
            label="Seleccionar"
            v-bind="args"
            @change="onChange"
            @focus="onFocus"
            @blur="onBlur"
            @clear="onClear"
            @visible-change="onVisible"
            @remove-tag="onRemoteTag"
          >
            <g-select-option
              v-for="item in options"
              :key="item.numberType"
              :label="item.nameDisplay"
              :value="item.numberType"
            >
              {{ item.nameDisplay }} - {{ item.numberType }}
            </g-select-option>
          </g-select>
        </div>
      </g-config-provider>
    `,
  }
};

export const Default = Template.bind({});