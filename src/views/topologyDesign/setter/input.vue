<template>
  <a-form-item :label="label">
    <a-input
      :value="value"
      :readonly="readonlyBol"
      @change="handleChange"
      :placeholder="'请输入' + label"
    ></a-input>
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
