import type { Meta, StoryObj } from '@storybook/vue3';
import { computed, ref } from 'vue';
import { GIconFont } from '../components/IconFont';
import { GConfigProvider } from '../components/ConfigProvider';
import { ICON_SETS } from '../components/IconFont/iconSets';
import { GSegmented } from '../components/Segmented';
import { GInput } from '../components/Input';
import { GButton } from '../components/Button/src';

export const generateIconOptions = () => {
  const options: string[] = [];
  
  Object.entries(ICON_SETS).forEach(([weight, icons]) => {
    icons.forEach(icon => {
      options.push(`${weight} ${icon}`);
    });
  });
  
  return options;
};

const meta: Meta<typeof GIconFont> = {
  title: 'Basic/IconFont',
  component: GIconFont,
  parameters: {
    docs: {
      description: {
        component: `
## Descripción
Componente wrapper de <a href="https://fontawesome.com/search" target="_blank">Font Awesome</a> 6 Pro que permite usar iconos de forma sencilla y tipada.

## Uso
Para usar un icono necesitas especificar dos partes:
1. El peso o estilo del icono (solid, regular, light, etc)
2. El nombre del icono

Ejemplo: \`name="regular home"\`

## Pesos disponibles
- **solid**: Iconos sólidos (rellenos)
- **regular**: Iconos con trazo medio  
- **light**: Iconos con trazo fino
- **brands**: Logos de marcas
- **duotone**: Iconos de dos tonos

## Agregar nuevos iconos
1. Identifica el icono en <a href="https://fontawesome.com/search" target="_blank">Font Awesome</a>
2. Agrega la importación en la carpeta src del componente según el peso
3. Registra el nombre en el archivo iconSets.ts

## Autocompletado
El editor te mostrará las opciones disponibles gracias al tipado estricto.
        `
      }
    }
  },
  argTypes: {
    name: {
      description: 'Nombre completo del icono (peso + nombre)',
      control: 'select',
      options: generateIconOptions(),
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'solid user' },
      }
    }
  },
  args: {
    name: 'solid user'
  }
} as Meta;

export default meta;
type Story = StoryObj<typeof GIconFont>;

export const Primary: Story = {
  name: 'Uso básico',
  render: (args) => ({
    components: { GIconFont, GConfigProvider },
    setup() {
      return { args };
    },
    template: `
      <g-config-provider>
        <div class="flex flex-col gap-4">
          <g-icon-font v-bind="args" class="text-8 text-grey-700"/>
        </div>
      </g-config-provider>
    `
  })
};

export const Galería: Story = {
  name: 'Galería de iconos',
  parameters: {
    docs: {
      description: {
        story: 'Galería completa de íconos disponibles en el sistema. Haz clic en cualquier ícono para copiar su nombre. 📋'
      }
    }
  },
  render: () => ({
    components: { GIconFont, GConfigProvider, GSegmented, GInput, GButton },
    setup() {
      const selectedWeight = ref('regular');
      const searchTerm = ref('');

      const filteredIcons = computed(() => {
        if (!searchTerm.value.trim()) {
          return ICON_SETS;
        }
        
        const searchTermLower = searchTerm.value.toLowerCase().trim();
        
        return Object.entries(ICON_SETS).reduce((filtered, [weight, icons]) => {
          filtered[weight] = icons.filter(icon => 
            icon.toLowerCase().includes(searchTermLower)
          );
          return filtered;
        }, {} as typeof ICON_SETS);
      });

      const clearSearch = () => {
        searchTerm.value = ''
      }
      
      const weightOptions = Object.keys(ICON_SETS).map(weight => ({
        label: weight.charAt(0).toUpperCase() + weight.slice(1),
        value: weight
      }));

      const copyIconName = (iconName: string) => {
        navigator.clipboard.writeText(iconName)
          .then(() => {
            console.log('Nombre del icono copiado al portapapeles');
          })
          .catch(() => {
            alert('No se pudo copiar el nombre del icono')
          })
      }

      return {
        iconSets: ICON_SETS,
        selectedWeight,
        weightOptions,
        copyIconName,
        searchTerm,
        clearSearch,
        filteredIcons
      };
    },
    template: `
      <g-config-provider>
        <div class="space-y-8">
          <g-segmented
            block
            v-model="selectedWeight"
            :options="weightOptions"
            class="mb-8"
          />

          <div class="flex items-center gap-2">
            <g-input
              v-model="searchTerm"
              placeholder="Buscar icono..."
              class="w-full max-w-md"
              size="small"
            >
              <template #prefix>
                <g-icon-font name="solid magnifying-glass" size="18px" />
              </template>
            </g-input>
            <g-button 
              v-if="searchTerm"
              @click="clearSearch"
              size="small"
            >
              Limpiar
            </g-button>
          </div>


          <div v-for="(icons, weight) in filteredIcons" :key="weight">
            <div v-if="selectedWeight === weight">
              <h3 class="text-lg font-medium mb-4 capitalize">{{ weight }}</h3>
              <div class="grid grid-cols-6 gap-4">
                <div
                  v-for="icon in icons"
                  :key="icon"
                  class="flex bg-white flex-col items-center justify-center p-4 border rounded-md hover:bg-gray-50 cursor-pointer text-grey-600"
                  @click="copyIconName(\`\${weight} \${icon}\`)"
                >
                  <g-icon-font :name="\`\${weight} \${icon}\`" class="text-6 mb-2"/>
                  <span class="text-xs text-center">{{ icon }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </g-config-provider>
    `
  })
};