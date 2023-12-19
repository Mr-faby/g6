<template>
  <a-form-item :label="label">
    <a-input type="color" :value="value" @change="handleChange" />
  </a-form-item>
</template>

<script lang="ts">
import BaseSetter from './baseSetter'
import { defineComponent } from 'vue'

export default defineComponent({
  extends: BaseSetter,
  methods: {
    handleChange(ev: any) {
      this.$emit('update', ev.target.value)
    }
  }
})
</script>

<style scoped></style>
