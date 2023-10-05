<template>
  <div id="preview" ref="previewContainer" style="width: 500px; height: 500px"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import G6 from '@antv/g6'

const props = withDefaults(
  defineProps<{
    graphData: Record<string, any>
  }>(),
  {
    graphData: () => ({})
  }
)
const previewContainer = ref(null)

onMounted(() => {
  const graph = new G6.Graph({
    container: 'preview',
    width: (previewContainer.value as any).offsetWidth,
    height: (previewContainer.value as any).offsetHeight,
    renderer: 'svg',
    // fitView: true,
    modes: {
      default: ['drag-canvas', 'zoom-canvas', 'click-select']
    },
    defaultEdge: {
      type: 'arrow-running',
      style: {
        lineDash: [5, 2, 1, 2],
        endArrow: {
          path: G6.Arrow.triangle(),
          fill: 'rgb(45, 204, 255)'
        },
        stroke: 'rgb(45, 204, 255)'
      }
    },

  })
  graph.data(props.graphData)
  graph.render()
})
</script>
