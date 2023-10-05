<template>
  <a-form-model-item :label="label">
    <a-input-number :value="value" :readonly="readonlyBol" :max="max" @change="handleChange" placeholder="请输入"></a-input-number>
  </a-form-model-item>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import BaseSetter from "./baseSetter";

@Component
export default class Number extends BaseSetter {
  @Prop() value: number;
}
</script>

<style lang="less">
.ant-input-number {
  width: 100%
}
</style>
