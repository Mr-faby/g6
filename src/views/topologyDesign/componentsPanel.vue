<template>
  <draggable
    class="components-panel"
    :list="components"
    group="components"
    :move="onMove"
    @start="onDragStart"
    @end="onDragEnd"
  >
    <template #item="{ element, index }">
      <div class="comp-item">
        <span class="control-name">{{ element.controlName }}</span>
      </div>
    </template>
  </draggable>
</template>

<script setup lang="ts">
import { type DesignComponent } from './type'
import draggable from 'vuedraggable'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    components: DesignComponent[]
  }>(),
  {
    components: () => []
  }
)

const emit = defineEmits(['update:modelValue', 'update:components'])

const onMove = (dragEvent: Record<string, any>) => {
  return dragEvent.from !== dragEvent.to
}

const onDragStart = (ev: any) => {
  emit('update:modelValue', ev.item)
}

const onDragEnd = () => {
  emit('update:modelValue', {})
}
</script>

<style lang="less" scoped>
.components-panel {
  width: calc(15% - 20px);
  box-sizing: border-box;
  padding: 10px;

  .comp-item {
    margin-bottom: 10px;
    padding: 0 15px;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    line-height: 35px;
    width: 80%;

    .control-name {
      margin-left: 5px;
    }

    .custom-icon {
      width: 1em;
      height: 1em;
    }
  }
}
</style>
