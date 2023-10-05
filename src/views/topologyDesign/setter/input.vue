<template>
  <a-form-model-item :label="label">
    <a-input :value="value" :readonly="readonlyBol" @change="handleChange" :placeholder="'请输入' + label"></a-input>
  </a-form-model-item>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseSetter from "./baseSetter";

@Component
export default class Input extends BaseSetter {

  handleChange(ev: any) {
    this.$emit("change", ev.target.value);
  }
}
</script>
