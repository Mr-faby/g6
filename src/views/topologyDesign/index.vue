<template>
  <div class="topology-design">
    <components-panel :components="components" v-model="dragOriginObj"></components-panel>
    <designer
      :components="components"
      :graphData="graphData"
      :dragOriginObj="dragOriginObj"
      :globalConfig="globalConfig"
      @setGraph="setGraph"
      @saveGraph="saveGraph"
      @handleNodeClick="handleNodeClick"
    ></designer>
    <attribute-panel
      :activatedNodeData="activatedNodeData"
      :globalConfig="globalConfig"
      :graph="graph"
    ></attribute-panel>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ComponentsPanel from './componentsPanel.vue'
import Designer from './designer.vue'
import AttributePanel from './attributePanel'
import { GlobalConfig, type DesignComponent } from './type'
import { Graph } from '@antv/g6'

const props = withDefaults(
  defineProps<{
    components: DesignComponent[]
    graphData: Record<string, any>
  }>(),
  {
    components: () => [],
    graphData: () => ({})
  }
)

const emit = defineEmits(['saveGraph'])

let activatedNodeData: Record<string, any> = ref({})
let graph: any = {}
let dragOriginObj: Record<string, any> = ref({ name: 'hello' })
let globalConfig: GlobalConfig = new GlobalConfig()

watch(
  () => activatedNodeData,
  (newValue, oldValue) => {
    globalConfig = props.graphData?.globalConfig || new GlobalConfig()
  }
)

const handleNodeClick = (node: Record<string, any>) => {
  activatedNodeData.value = node
  console.log('%c 🍓 node: ', 'font-size:12px;background-color: #FFDD4D;color:#fff;', node)
}

const saveGraph = (graphData: Record<string, any>) => {
  emit('saveGraph', Object.assign(graphData, { globalConfig: globalConfig }))
}

const setGraph = (graphData: Graph) => {
  graph = graphData
}
</script>

<style lang="less" scoped>
.topology-design {
  width: 100%;
  height: 100%; // 这里设置设计器的高度

  & > div {
    display: inline-block;
    margin: 10px;
    border: 1px solid rgb(196, 196, 196);
    height: calc(100% - 20px);
    vertical-align: top;
  }
}
</style>
