<template>
  <a-form-model-item :label="label">
    <a-textarea :value="value" :readonly="readonlyBol" @change="handleChange"></a-textarea>
  </a-form-model-item>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseSetter from "./baseSetter";

@Component
export default class Textarea extends BaseSetter {

  handleChange(ev: any) {
    this.$emit("change", ev.target.value);
  }
}
</script>
