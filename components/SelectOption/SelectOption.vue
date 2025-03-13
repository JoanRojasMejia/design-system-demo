<template>
  <el-option v-bind="{ ...attrsCustom, ...propsCustom }">
    <!--
      @slot customize default content
    -->
    <slot />
  </el-option>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { ElOption } from 'element-plus';

export default defineComponent({
  name: 'Option',
  components: {
    ElOption,
  },
  props: {
    /**
     * whether option is disabled
    */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     *  label of option, same as value if omitted
    */
    label: {
      type: [String, Number],
    },
    /**
     *  value that will be returned in the v-model of the select
    */
    value: {
      type: [String, Number, Boolean, Object],
      default: '',
    },
  },
  setup(props, { attrs }) {
    const attrsCustom = computed(() => {
      const excludeKeys = ['class'];
      return Object.fromEntries(Object.entries(attrs).filter(([key]) => !excludeKeys.includes(key)));
    });

    const propsCustom = computed(() => {
      const excludeKeys = [''];
      return Object.fromEntries(Object.entries(props).filter(([key]) => !excludeKeys.includes(key)));
    });

    return {
      attrsCustom,
      propsCustom,
    }
  }
});
</script>
