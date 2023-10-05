<template>
  <a-form-model-item :label="label">
    <a-select :value="value" @change="handleChange" :disabled="readonly">
      <a-select-option
        v-for="i in options"
        :key="i.value"
        :value="i.value"
        :disabled="i.disabled"
      >
        {{ i.title }}
      </a-select-option>
    </a-select>
  </a-form-model-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import BaseSetter from "./baseSetter";

@Component
export default class Select extends BaseSetter {
  @Prop() options: { title: string; value: any; disabled: boolean }[] = [];
}
</script>
