<template>
  <a-form-item :label="label">
    <a-select :value="value" @change="handleChange" :disabled="readonlyBol">
      <a-select-option v-for="i in options" :key="i.value" :value="i.value" :disabled="i.disabled">
        {{ i.title }}
      </a-select-option>
    </a-select>
  </a-form-item>
</template>

<script lang="ts">
import BaseSetter from './baseSetter'
import { defineComponent, type PropType } from 'vue'

type OptionT = {
  title: string
  value: unknown
  disabled: boolean
}

export default defineComponent({
  extends: BaseSetter,
  props: {
    options: {
      type: Array as PropType<OptionT[]>,
      default: () => []
    }
  }
})
</script>
