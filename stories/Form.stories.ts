import type { Meta, StoryObj } from "@storybook/vue3";
import { ref, reactive } from "vue";
import { FormInstance, GForm, GFormItem } from "../components/Form";
import { GInput } from "../components/Input";
import { GConfigProvider } from "../components/ConfigProvider";
import { GButton } from "../components/Button/src";
const meta: Meta<FormInstance> = {
  title: "Form/Form",
  component: GForm,
  parameters: {
    docs: {
      description: {
        component: `El componente \`Form\` se utiliza para crear formularios con validaciones integradas, manejo de estados y mensajes de error personalizables. 
        
Para las validaciones y reglas se utiliza <a href="https://github.com/yiminghe/async-validator" target="_blank">async-validator</a>, una potente librería que permite implementar validaciones síncronas y asíncronas.

Las reglas de validación pueden ser aplicadas de dos formas:
- Globalmente en el componente Form usando la prop \`rules\`
- Individualmente en cada FormItem usando la prop \`rules\`

Una característica importante es que el validador es lo suficientemente inteligente para omitir las validaciones de campos que están condicionalmente ocultos (v-if/v-show).

### Características

> - Validación síncrona y asíncrona
> - Reglas personalizables
> - Manejo de estados
> - Validación por eventos
> - Reseteo de campos
> - Scroll automático a errores
> - Integración con FormItem

### Instalación

\`\`\`bash
yarn add @flash-global66/b2b-ui-form
\`\`\`

### Importación

\`\`\`typescript
import { GForm } from '@flash-global66/b2b-ui-form'
import '@flash-global66/b2b-ui-form/form.styles.scss'
\`\`\`

### Dependencias
Este componente trabaja en conjunto con el componente \`FormItem\` para proporcionar una experiencia completa de formularios. Para más detalles sobre FormItem consulta la [documentación de FormItem](/docs/form-form-item--docs).`
      }
    }
  },
  argTypes: {
    model: {
      description: "Objeto de datos del formulario",
      control: "object",
      table: {
        type: { summary: "object" },
      },
    },
    rules: {
      description: "Reglas de validación para los campos del formulario",
      control: "object",
    },
    disabled: {
      description: "Deshabilita todos los campos del formulario",
      control: "boolean",
      defaultValue: false,
    },
    validateOnRuleChange: {
      description: "Validar cuando cambian las reglas",
      control: "boolean",
      defaultValue: true,
    },
    validate: {
      description: "Valida el formulario completo. Recibe un callback o retorna una Promise",
      table: {
        category: "Expuesto",
        type: { summary: "() => Promise<boolean>" }
      }
    },
    validateField: {
      description: "Valida campos específicos del formulario",
      table: {
        category: "Expuesto",
        type: { summary: "(props?: Arrayable<FormItemProp>, callback?: FormValidateCallback) => FormValidationResult" }
      }
    },
    resetFields: {
      description: "Reinicia los campos especificados y elimina los resultados de validación",
      table: {
        category: "Expuesto",
        type: { summary: "(props?: Arrayable<FormItemProp>) => void" }
      }
    },
    clearValidate: {
      description: "Limpia los mensajes de validación para los campos especificados",
      table: {
        category: "Expuesto",
        type: { summary: "(props?: Arrayable<FormItemProp>) => void" }
      }
    },
    scrollToField: {
      description: "Desplaza la vista hacia el campo especificado",
      table: {
        category: "Expuesto",
        type: { summary: "(prop: FormItemProp) => void" }
      }
    },
    fields: {
      description: "Contexto de todos los campos del formulario",
      table: {
        category: "Expuesto",
        type: { summary: "FormItemContext[]" }
      }
    }
  },

};

export default meta;type Story = StoryObj<FormInstance>;

// Historia Principal
export const Primary: Story = {
  name: "Básico",
  parameters: {
    docs: {
      description: {
        story: "Ejemplo básico del formulario con validaciones.",
      },
    },
  },
  render: () => ({
    components: { GForm, GFormItem, GInput, GConfigProvider, GButton },
    setup() {
      const formRef = ref();
      const formData = reactive({
        nombre: "",
        email: "",
      });

      const rules = {
        nombre: [
          {
            required: true,
            message: "El nombre es requerido",
            trigger: "blur",
          },
          { min: 3, message: "Mínimo 3 caracteres", trigger: "blur" },
        ],
        email: [
          { required: true, message: "El email es requerido", trigger: "blur" },
          { type: "email", message: "Email inválido", trigger: "blur" },
        ],
      };

      async function handleSubmit() {
        if (!formRef.value) return;
        await formRef.value.validate((valid, fields) => {
          if (valid) {
            console.log("submit!", fields);
          } else {
            console.log("error submit!" + fields);
          }
        });
      }

      async function handleReset() {
        if (!formRef.value) return;
        formRef.value.resetFields();
      }

      return { formRef, formData, rules, handleSubmit, handleReset };
    },
    template: `
      <g-config-provider>
        <g-form ref="formRef" :model="formData" :rules="rules" class="flex flex-col gap-4">
          <g-form-item prop="nombre">
            <g-input v-model="formData.nombre" label="Nombre" />
          </g-form-item>
          <g-form-item prop="email">
            <g-input v-model="formData.email" label="Email" />
          </g-form-item>
          <div class="flex gap-4 mt-4">
            <g-button @click="handleSubmit" type="primary">Enviar</g-button>
            <g-button @click="handleReset" variant="secondary">Limpiar</g-button>
          </div>
        </g-form>
      </g-config-provider>
    `,
  }),
};

export const CustomRules: Story = {
  name: 'Reglas Personalizadas',
  parameters: {
    docs: {
      description: {
        story: `Las reglas de validación pueden ser personalizadas usando funciones validadoras. Por ejemplo, para validar la edad de un usuario:

\`\`\`typescript
// 1. Definir la función validadora
const checkAge = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('La edad es requerida'))
  }
  if (!Number.isInteger(Number(value))) {
    callback(new Error('Ingrese solo números'))
  } else if (Number(value) < 18) {
    callback(new Error('La edad debe ser mayor a 18'))
  } else {
    callback()
  }
}

// 2. Integrar la función en las reglas
const rules = {
  age: [{ validator: checkAge, trigger: "blur" }]
}

// 3. Aplicar las reglas al formulario
<g-form :rules="rules">
  <g-form-item prop="age">
    <g-input v-model="formData.age" />
  </g-form-item>
</g-form>
\`\`\`

La validación se ejecutará cuando el campo pierda el foco (trigger: "blur") y mostrará los mensajes de error correspondientes.`
      }
    }
  },
  render: () => ({
    components: { GForm, GFormItem, GInput, GConfigProvider, GButton },
    setup() {
      const formRef = ref<FormInstance>();
      const formData = reactive({
        pass: "",
        checkPass: "",
        age: "",
      });

      const validatePass = (rule: any, value: any, callback: any) => {
        if (value === "") {
          callback(new Error("Ingrese una contraseña"));
        } else {
          if (formData.checkPass !== "") {
            formRef.value?.validateField("checkPass");
          }
          callback();
        }
      };

      const validatePass2 = (rule: any, value: any, callback: any) => {
        if (value === "") {
          callback(new Error("Confirme su contraseña"));
        } else if (value !== formData.pass) {
          callback(new Error("Las contraseñas no coinciden"));
        } else {
          callback();
        }
      };

      const checkAge = (rule: any, value: any, callback: any) => {
        if (!value) {
          return callback(new Error("La edad es requerida"));
        }
        setTimeout(() => {
          if (!Number.isInteger(Number(value))) {
            callback(new Error("Ingrese solo números"));
          } else if (Number(value) < 18) {
            callback(new Error("La edad debe ser mayor a 18"));
          } else {
            callback();
          }
        }, 1000);
      };

      const rules = {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        age: [{ validator: checkAge, trigger: "blur" }],
      };

      async function handleSubmit() {
        if (!formRef.value) return;
        await formRef.value.validate((valid, fields) => {
          if (valid) {
            console.log("submit!", formData);
          } else {
            console.log("error submit!", fields);
          }
        });
      }

      async function handleReset() {
        if (!formRef.value) return;
        formRef.value.resetFields();
      }

      return { formRef, formData, rules, handleSubmit, handleReset };
    },
    template: `
      <g-config-provider>
        <g-form ref="formRef" :model="formData" :rules="rules" class="flex flex-col gap-4">
          <g-form-item label="Contraseña" prop="pass">
            <g-input 
              v-model="formData.pass" 
              type="password" 
              show-password
              autocomplete="off"
              placeholder="Ingrese su contraseña"
              help-text="La contraseña debe tener al menos 6 caracteres"
            />
          </g-form-item>
          <g-form-item label="Confirmar" prop="checkPass">
            <g-input 
              v-model="formData.checkPass" 
              type="password"
              show-password
              autocomplete="off"
              placeholder="Confirme su contraseña"
              help-text="Repita la contraseña ingresada"
            />
          </g-form-item>
          <g-form-item label="Edad" prop="age">
            <g-input 
              v-model="formData.age"
              label="Edad"
              placeholder="Ingrese su edad"
              help-text="Debe ser mayor de 18 años"
            />
          </g-form-item>
          <div class="flex gap-4 mt-4">
            <g-button @click="handleSubmit" type="primary">Enviar</g-button>
            <g-button @click="handleReset" variant="secondary">Limpiar</g-button>
          </div>
        </g-form>
      </g-config-provider>
    `,
  }),
};


// Validación en Tiempo Real
export const TriggerValidation: Story = {
  name: "Tipo de ejecución",
  parameters: {
    docs: {
      description: {
        story: `La validación de campos puede realizarse de dos formas:

- **change**: La validación se ejecuta cada vez que el valor del campo cambia
- **blur**: La validación se ejecuta cuando el campo pierde el foco

Ejemplo de reglas de validación:

\`\`\`typescript
const rules = {
  email: [
    { type: 'email', message: 'Ingrese un email válido', trigger: 'change' }
  ],
  password: [
    { min: 6, message: 'La contraseña debe tener al menos 6 caracteres', trigger: 'blur' }
  ]
};
\`\`\`

En este ejemplo, el email se valida en tiempo real mientras el usuario escribe, mientras que la contraseña se valida cuando el campo pierde el foco.`,
      },
    },
  },
  render: () => ({
    components: { GForm, GFormItem, GInput, GConfigProvider, GButton },
    setup() {
      const formRef = ref();
      const formData = reactive({
        email: "",
        password: "",
      });

      const rules = {
        email: [
          {
            required: true,
            message: "El email es requerido",
            trigger: "change",
          },
          {
            type: "email",
            message: "Ingrese un email válido",
            trigger: "change",
          },
        ],
        password: [
          {
            required: true,
            message: "La contraseña es requerida",
            trigger: "blur",
          },
          {
            min: 6,
            message: "La contraseña debe tener al menos 6 caracteres",
            trigger: "blur",
          },
        ],
      };

      async function handleSubmit() {
        if (!formRef.value) return;
        await formRef.value.validate((valid, fields) => {
          if (valid) {
            console.log("submit!", fields);
          } else {
            console.log("error submit!" + fields);
          }
        });
      }

      async function handleReset() {
        if (!formRef.value) return;
        formRef.value.resetFields();
      }

      return { formRef, formData, rules, handleSubmit, handleReset };
    },
    template: `
      <g-config-provider>
        <g-form ref="formRef" :model="formData" :rules="rules" class="flex flex-col gap-4">
          <g-form-item prop="email">
            <g-input 
              v-model="formData.email" 
              label="Email"
              help-text="La validación se ejecuta mientras escribes"
            />
          </g-form-item>
          <g-form-item prop="password">
            <g-input 
              v-model="formData.password" 
              type="password"
              label="Contraseña"
              help-text="La validación se ejecuta al perder el foco"
            />
          </g-form-item>
          <div class="flex gap-4 mt-4">
            <g-button @click="handleSubmit" type="primary">Enviar</g-button>
            <g-button @click="handleReset" variant="secondary">Limpiar</g-button>
          </div>
        </g-form>
      </g-config-provider>
    `,
  }),
};

// Formulario Deshabilitado
export const DisabledForm: Story = {
  name: "Formulario Deshabilitado",
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo de un formulario completamente deshabilitado con múltiples campos.",
      },
    },
  },
  render: () => ({
    components: { GForm, GFormItem, GInput, GConfigProvider, GButton },
    setup() {
      const formData = reactive({
        name: "Juan Pérez",
        email: "juan@ejemplo.com",
        phone: "+51 999888777",
        address: "Av. Principal 123",
        ciudad: "Lima",
        country: "Perú",
      });

      return { formData };
    },
    template: `
      <g-config-provider>
        <g-form :model="formData" disabled>
          <div class="grid grid-cols-2 gap-4">
            <g-form-item>
              <g-input v-model="formData.name" label="Nombre Completo" />
            </g-form-item>
            <g-form-item>
              <g-input v-model="formData.email" label="Correo Electrónico" />
            </g-form-item>
            <g-form-item>
              <g-input v-model="formData.phone" label="Teléfono" />
            </g-form-item>
            <g-form-item>
              <g-input v-model="formData.address" label="Dirección" />
            </g-form-item>
            <g-form-item>
              <g-input v-model="formData.ciudad" label="Ciudad" />
            </g-form-item>
            <g-form-item>
              <g-input v-model="formData.country" label="País" />
            </g-form-item>
          </div>
          <div class="flex gap-4 mt-4">
            <g-button disabled>No disponible</g-button>
            <g-button variant="secondary" disabled>Cancelar</g-button>
          </div>
        </g-form>
      </g-config-provider>
    `,
  }),
};

export const PreventSubmit: Story = {
  name: "Prevenir Submit",
  parameters: {
    docs: {
      description: {
        story: `Por comportamiento nativo de HTML, cuando un formulario tiene un solo input, al presionar Enter se dispara automáticamente el evento submit. Se recomienda usar @submit.prevent para controlar este comportamiento.

Para más información sobre el comportamiento nativo de formularios HTML, puedes consultar la <a href="https://www.w3.org/MarkUp/html-spec/html-spec_8.html#SEC8.2" target="_blank">documentación oficial de W3C</a>.

Ejemplo de implementación:

\`\`\`typescript
async function handleSubmit() {
  if (!formRef.value) return

  await formRef.value.validate((valid, fields) => {
    if (valid) {
      console.log('submit!', formData)
    } else {
      console.log('error submit!', fields)
    }
  })
}
\`\`\`
`,
      },
    },
  },
  render: () => ({
    components: { GForm, GFormItem, GInput, GConfigProvider, GButton },
    setup() {
      const formRef = ref();
      const formData = reactive({
        usuario: "",
        clave: "",
      });

      const rules = {
        usuario: [
          {
            required: true,
            message: "El usuario es requerido",
            trigger: "blur",
          },
        ],
        clave: [
          { required: true, message: "La clave es requerida", trigger: "blur" },
        ],
      };

      async function handleSubmit() {
        if (!formRef.value) return;

        await formRef.value.validate((valid, fields) => {
          if (valid) {
            alert("submit!");
          } else {
            console.log("error submit!", fields);
          }
        });
      }

      return { formRef, formData, rules, handleSubmit };
    },
    template: `
      <g-config-provider>
        <g-form 
          ref="formRef" 
          :model="formData" 
          :rules="rules"
          @submit.prevent="handleSubmit"
        >
          <g-form-item prop="usuario">
            <g-input 
              v-model="formData.usuario" 
              label="Usuario"
            />
          </g-form-item>
          <div class="flex gap-4 mt-4">
            <g-button type="submit" type="primary">Enviar</g-button>
          </div>
        </g-form>
      </g-config-provider>
    `,
  }),
};

export const DynamicValidation: Story = {
  name: 'Validación Dinámica',
  parameters: {
    docs: {
      description: {
        story: `Puedes agregar o eliminar campos de formulario dinámicamente junto con sus reglas de validación.

\`\`\`typescript
interface DomainItem {
  key: number
  value: string
}

const formData = reactive({
  domains: [{ key: 1, value: '' }],
  email: ''
})

const addDomain = () => {
  formData.domains.push({
    key: Date.now(),
    value: ''
  })
}
\`\`\`
`
      }
    }
  },
  render: () => ({
    components: { GForm, GFormItem, GInput, GConfigProvider, GButton },
    setup() {
      const formRef = ref<FormInstance>();
      
      interface DomainItem {
        key: number
        value: string
      }

      const formData = reactive({
        domains: [
          {
            key: 1,
            value: '',
          },
        ],
        email: '',
      });

      const removeDomain = (item: DomainItem) => {
        const index = formData.domains.indexOf(item)
        if (index !== -1) {
          formData.domains.splice(index, 1)
        }
      };

      const addDomain = () => {
        formData.domains.push({
          key: Date.now(),
          value: '',
        });
      };

      async function handleSubmit() {
        if (!formRef.value) return
        await formRef.value.validate((valid, fields) => {
          if (valid) {
            console.log('submit!', formData)
          } else {
            console.log('error submit!', fields)
          }
        })
      }

      async function handleReset() {
        if (!formRef.value) return
        formRef.value.resetFields()
      }

      return { 
        formRef, 
        formData, 
        handleSubmit, 
        handleReset,
        addDomain,
        removeDomain
      };
    },
    template: `
      <g-config-provider>
        <g-form ref="formRef" :model="formData">
          <g-form-item
            class="mb-4"
            prop="email"
            label="Email"
            :rules="[
              { required: true, message: 'El email es requerido', trigger: 'blur' },
              { type: 'email', message: 'Ingrese un email válido', trigger: ['blur', 'change'] }
            ]"
          >
            <g-input 
              v-model="formData.email"
              placeholder="Ingrese su email"
              label="Email"
              help-text="Ejemplo: usuario@dominio.com"
            />
          </g-form-item>

          <g-form-item
            v-for="(domain, index) in formData.domains"
            class="mb-6"
            :key="domain.key"
            :label="'Dominio ' + (index + 1)"
            :prop="'domains.' + index + '.value'"
            :rules="{
              required: true,
              message: 'El dominio no puede estar vacío',
              trigger: 'blur'
            }"
          >
            <div class="flex gap-4">
              <g-input 
                v-model="domain.value"
                label="Dominio"
                placeholder="Ingrese el dominio"
              />
              <g-button 
                variant="secondary" 
                @click.prevent="removeDomain(domain)"
              >
                Eliminar
              </g-button>
            </div>
          </g-form-item>

          <div class="flex gap-4 mt-4">
            <g-button @click="handleSubmit" type="primary">Enviar</g-button>
            <g-button @click="addDomain" variant="secondary">Nuevo dominio</g-button>
            <g-button @click="handleReset" variant="secondary">Limpiar</g-button>
          </div>
        </g-form>
      </g-config-provider>
    `
  })
};