<template>
  <a-form-item :label="label">
    <a-radio-group :value="value" :options="options" @change="handleChange"></a-radio-group>
  </a-form-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseSetter from './baseSetter'

export default defineComponent({
  extends: BaseSetter,
  methods: {
    handleChange(ev: any) {
      this.$emit('update', ev.target.value)
    }
  }
})
</script>
