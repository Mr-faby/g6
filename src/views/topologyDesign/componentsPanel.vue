<template>
  <draggable class="components-panel" v-model="componentsObj" :group="{ name: 'group', pull: 'clone', put: false }"
    :move="onMove" @start="onDragStart" @end="onDragEnd">
    <!-- <div class="comp-item" v-for="comp in components" :key="comp.controlId">
      <a-button :icon="comp.controlIcon">{{ comp.controlName }}</a-button>
    </div> -->

    <div v-for="comp in componentsObj" :key="comp.controlId" class="comp-item">
      <span class="control-name">{{ comp.controlName }}</span>
    </div>
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

const emit = defineEmits(['input', 'update:components'])

const componentsObj = computed({
  get() {
    return props.components
  },
  set(value) {
    emit('update:components', value)
  }
})

const onMove = (dragEvent: Record<string, any>) => {
  return dragEvent.from !== dragEvent.to
}

const onDragStart = (ev: any) => {
  console.log('%c 🍠 ev: ', 'font-size:12px;background-color: #7F2B82;color:#fff;', ev)
  emit('input', ev.item)
}

const onDragEnd = () => {
  emit('input', {})
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
