<template>
  <a-form-item :label="label">
    <a-select :value="value" @change="handleChange" :disabled="readonlyBol">
      <a-select-option v-for="i in options" :key="i.value" :value="i.value" :disabled="i.disabled">
        {{ i.label }}
      </a-select-option>
    </a-select>
  </a-form-item>
</template>

<script lang="ts">
import BaseSetter from './baseSetter'
import { defineComponent, type PropType } from 'vue'

type OptionT = {
  label: string
  value: unknown
  disabled: boolean
}

export default defineComponent({
  extends: BaseSetter,
  created() {
    console.log(
      '%c 🍨 created: ',
      'font-size:12px;background-color: #4b4b4b;color:#fff;',
      this.options
    )
  },
  props: {
    options: {
      type: Array as PropType<OptionT[]>,
      default: () => []
    }
  }
})
</script>
