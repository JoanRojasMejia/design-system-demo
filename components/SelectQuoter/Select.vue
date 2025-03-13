<template>
  <div
    @click="onClick"
    class="gui-select-wrapper"
    :class="[
      {
        'gui-select-border-bg': border,
        'gui-select-wrapper--shadow': shadow && !transparent,
        'gui-select-wrapper--transparent': transparent,
      },
      'size--' + size,
    ]"
  >
    <!-- <label
      v-if="label"
      class="gui-input-label"
      :class="[
        isVisible || isValue ? 'label--active' : 'label--no-active',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      ]"
      :style="{ marginLeft: `${prefixWidth}px`}">
      {{ label }}
    </label> -->
    <el-select
      ref="refSelect"
      popper-class="!z-100"
      autocomplete="off"
      v-bind="{ ...attrsCustom, ...propsCustom }"
      :id="inputId"
      :suffix-icon="IconArrow"
      :clear-icon="IconTimes"
      :placeholder="label ? ' ' : placeholder"
      :aria-label="label ? label : placeholder"
      @change="onChange"
      @visible-change="onVisibleChange"
      @remove-tag="(event) => $emit('remove-tag', event)"
      @clear="(event) => $emit('clear', event)"
      @blur="onBlur"
      @focus="onFocus"
    >
      <!--
        @slot customize prefix
      -->
      <template v-if="$slots.prefix" #prefix>
        <slot name="prefix" :value="$attrs.modelValue" />
      </template>
      <!--
        @slot customize default content
      -->
      <slot />
    </el-select>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  onMounted,
  PropType,
  ref,
  watch,
  computed,
  onUpdated,
} from "vue";
import { ElSelect } from "element-plus";

import { useResizeObserver } from "@vueuse/core";

// ICONS
import IconArrow from "./components/IconArrow.vue";
import IconTimes from "./components/IconTimes.vue";

// TYPES
import { SelectSize } from "./select.type";

export default defineComponent({
  name: "GSelect",
  components: {
    ElSelect,
  },
  props: {
    /**
     * binding value.
     */
    // modelValue: {
    //   type: [Array, String, Number, Boolean, Object],
    //   default: undefined,
    // },
    /**
     * unique identity key name for value, required when value is an object
     */
    valueKey: {
      type: String,
      default: "",
    },
    /**
     * @description size of Input
     */
    size: {
      type: String as PropType<SelectSize>,
      default: "medium",
    },
    /**
     * whether select can be cleared
     */
    clearable: {
      type: Boolean,
      default: false,
    },
    /**
     *  the name attribute of select input
     */
    name: {
      type: String,
      default: "",
    },
    /**
     *  the autocomplete attribute of select input
     */
    autocomplete: {
      type: String,
      default: "off",
    },
    /**
     *  whether Select is filterable
     */
    filterable: {
      type: Boolean,
      default: false,
    },
    /**
     *  whether creating new items is allowed. To use this, filterable must be true
     */
    allowCreate: {
      type: Boolean,
      default: false,
    },
    /**
     *  custom filter method
     */
    filterMethod: {
      type: Function,
    },
    /**
     * whether Select is loading data from server
     */
    loading: {
      type: Boolean,
      default: false,
    },
    /**
     * displayed text while loading data from server
     */
    loadingText: {
      type: String,
      default: "",
    },
    /**
     * displayed text when no data matches the filtering query, you can also use slot empty
     */
    noMatchText: {
      type: String,
      default: "Sin datos coincidentes",
    },
    /**
     * displayed text when there is no options, you can also use slot empty
     */
    noDataText: {
      type: String,
      default: "Sin datos",
    },
    /**
     * select first matching option on enter key. Use with filterable or remote
     */
    defaultFirstOption: {
      type: Boolean,
      default: false,
    },
    /**
     * whether select dropdown is teleported to the body
     */
    teleported: {
      type: Boolean,
      default: false,
    },
    /**
     * when select dropdown is inactive and persistent is false, select dropdown will be destroyed
     */
    // persistent: {
    //   type: Boolean,
    //   default: false,
    // },
    /**
     * for non-filterable Select, this prop decides if the option menu pops up when the input is focused
     */
    automaticDropdown: {
      type: Boolean,
      default: false,
    },
    /**
     * whether the width of the dropdown is the same as the input
     */
    fitInputWidth: {
      type: Boolean,
      default: false,
    },
    /**
     * whether to trigger form validation
     */
    validateEvent: {
      type: Boolean,
      default: true,
    },
    /**
     *  the label
     */
    label: {
      type: String,
      default: "",
    },
    /**
     *  As a requirement you must not declare the label
     */
    placeholder: {
      type: String,
      default: " ",
    },
    /**
     * whether Select is disabled
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * same as readonly in native input
     */
    readonly: {
      type: Boolean,
      default: false,
    },
    /**
     * Remove rounded corners from the right side to join with another component.
     */
    joinRight: {
      type: Boolean,
      default: false,
    },
    /**
     * Remove rounded edges from left side to join with another component.
     */
    joinLeft: {
      type: Boolean,
      default: false,
    },
    /**
     * Add borders for white backgrounds.
     */
    border: {
      type: Boolean,
      default: false,
    },
    /**
     * Add shadow box.
     */
    shadow: {
      type: Boolean,
      default: true,
    },
    /**
     * Add shadow box.
     */
    transparent: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    /**
     * triggers when the bound value changes
     */
    "change",
    "visible-change",
    "remove-tag",
    "clear",
    "blur",
    "focus",
  ],
  setup(props, { emit, slots, attrs }) {
    const refSelect = ref();

    const isVisible = ref(false);
    const isValue = ref(false);
    const prefixWidth = ref(0);

    const inputId = computed(
      () => `select-${Math.random().toString(36).substring(2, 9)}`
    );

    const styleInputInner = computed(() => {
      return props.label && (isVisible.value || isValue.value) ? "8px" : "0px";
    });

    const inputRounded = computed(() => {
      const rounded = 0.625;

      if (props.joinLeft) {
        return `0 ${rounded}rem ${rounded}rem 0`;
      }

      if (props.joinRight) {
        return `${rounded}rem 0 0 ${rounded}rem`;
      }
      return `${rounded}rem ${rounded}rem ${rounded}rem ${rounded}rem`;
    });

    const attrsCustom = computed(() => {
      const excludeKeys = ["class", "persistent"];
      return Object.fromEntries(
        Object.entries(attrs).filter(([key]) => !excludeKeys.includes(key))
      );
    });

    const propsCustom = computed(() => {
      const excludeKeys = ["joinRight", "joinLeft", "persistent"];
      return Object.fromEntries(
        Object.entries(props).filter(([key]) => !excludeKeys.includes(key))
      );
    });

    const labelStyleWidth = computed(() => {
      return `${prefixWidth.value}px`;
    });

    function yieldToMain() {
      return new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    }

    watch(
      () => attrs.modelValue,
      (val) => {
        isValue.value = !!val;
      }
    );

    onMounted(() => {
      nextTick(() => {
        console.log(refSelect.value.$el);

        const inputSelect = refSelect.value.$el.children[0];

        if (inputSelect) {
          console.log(inputSelect);

          inputSelect.style.borderRadius = "99999px";
        }

        isValue.value = !!attrs.modelValue;
        yieldToMain();
        updateWidthPrefix();
      });
    });

    function updateWidthPrefix() {
      const refEl = refSelect.value && refSelect.value.$el;
      if (!refEl) return;

      if (slots.prefix) {
        const prefix = refEl.querySelector(".gui-select__prefix");
        useResizeObserver(prefix, (entries) => {
          const entry = entries[0];
          const { width } = entry.contentRect;
          prefixWidth.value = width + 5;
        });
      }
    }

    function onClick() {
      if (props.disabled || props.readonly) return;
      // isValue.value = true;
      refSelect.value.toggleMenu();
    }

    function onFocus(event: Event) {
      emit("focus", event);
    }

    function onBlur(event: Event) {
      emit("blur", event);
    }

    function onChange(event) {
      emit("change", event);
      const valuesFalse = ["", ``, null, undefined, NaN];

      if (valuesFalse.includes(event)) {
        isValue.value = false;
      } else {
        isValue.value = true;
      }
    }

    function onVisibleChange(event: boolean) {
      emit("visible-change", event);
      isVisible.value = event;
    }

    return {
      refSelect,
      inputRounded,
      isVisible,
      isValue,
      styleInputInner,
      propsCustom,
      prefixWidth,
      labelStyleWidth,
      attrsCustom,

      onVisibleChange,
      onClick,
      onFocus,
      onBlur,
      onChange,

      IconArrow,
      IconTimes,
      inputId,
    };
  },
});
</script>

<style lang="scss">
// .gui-select-wrapper {
//   .gui-select {
//     .gui-select__wrapper {
//       @apply rounded-full;
//     }
//   }
//   .gui-input-label {
//     width: calc(100% - v-bind(labelStyleWidth));
//   }
// }
</style>
