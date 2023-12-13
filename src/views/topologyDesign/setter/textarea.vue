<template>
  <a-form-item :label="label">
    <a-textarea :value="value" :readonly="readonlyBol" @change="handleChange"></a-textarea>
  </a-form-item>
</template>

<script lang="ts">
import BaseSetter from './baseSetter'
import { defineComponent } from 'vue'

export default defineComponent({
  extends: BaseSetter,
  methods: {
    handleChange(ev: any) {
      this.$emit('change', ev.target.value)
    }
  }
})
</script>
