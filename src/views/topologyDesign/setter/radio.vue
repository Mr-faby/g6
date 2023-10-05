<template>
  <a-form-model-item :label="label">
    <a-radio-group
      :value="value"
      :options="options"
      @change="handleChange"
    ></a-radio-group>
  </a-form-model-item>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseSetter from "./baseSetter";

@Component
export default class Radio extends BaseSetter {
  handleChange(ev: any) {
    this.$emit("change", ev.target.value);
  }
}
</script>
