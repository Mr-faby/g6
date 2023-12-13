<template>
  <a-form-item :label="label">
    <a-checkbox-group :value="value" @change="handleChange" :options="options"></a-checkbox-group>
  </a-form-item>
</template>

<script lang="ts">
import BaseSetter from './baseSetter'
import { defineComponent } from 'vue'

export default defineComponent({
  extends: BaseSetter,
})
</script>
