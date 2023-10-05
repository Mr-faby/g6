<template>
  <a-form-model-item :label="label">
    <a-checkbox-group :value="value" @change="handleChange" :options="options"></a-checkbox-group>
  </a-form-model-item>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseSetter from "./baseSetter";

@Component
export default class Checkbox extends BaseSetter {}
</script>
