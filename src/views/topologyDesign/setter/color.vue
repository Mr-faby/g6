<template>
  <a-form-model-item :label="label">
    <a-input type="color" :value="value" @change="handleChange" />
  </a-form-model-item>  
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseSetter from "./baseSetter";

@Component
export default class Color extends BaseSetter {
  handleChange(ev: any) {
    this.$emit("change", ev.target.value);
  }
}
</script>

<style scoped></style>
