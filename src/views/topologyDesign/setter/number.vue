<template>
  <a-form-item :label="label">
    <a-input-number
      :value="value"
      :readonly="readonlyBol"
      :max="max"
      @change="handleChange"
      placeholder="请输入"
    ></a-input-number>
  </a-form-item>
</template>

<script lang="ts">
import BaseSetter from './baseSetter'
import { defineComponent } from 'vue'

export default defineComponent({
  extends: BaseSetter
})
</script>

<style lang="less">
.ant-input-number {
  width: 100%;
}
</style>
