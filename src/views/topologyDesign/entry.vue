<template>
  <div style="height: 100%">
    <preview v-if="isPreview"></preview>
    <topology-design
      v-else
      :components="components"
      :graphData="graphData"
      @saveGraph="saveGraph"
    ></topology-design>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import TopologyDesign from './index.vue'
import preview from './preview.vue'
import type { DesignComponent } from './type'

type GraphDTO = {
  canvasId: string
  canvasData: string
  canvasName: string
  remark: string
}

const route = useRoute()

const isPreview = ref(false)
// 元素列表
const components: DesignComponent[] = [
  {
    controlName: '数据中心',
    controlIcon: 'smile',
    controlId: 'dataCenter',
    controlShape: 'rect',
    layerType: 'middleWareLayer',
    attrData: [
      {
        dataName: 'input',
        attributeId: 'c1',
        attributeInstanceId: 'c1',
        attributeName: '实例名称',
        attributeInstanceValue: '',
        attributeDefaultValue: ''
      },
      {
        attributeInstanceId: 'attributehz7xjimvhqrbctjimgeroay',
        dataName: 'radio',
        attributeId: 'c6898dc0401a45f9be2e84b6731adee9',
        attributeInstanceValue: 'GET|POST|DELETE|PUT|HEAD|TRACE|OPTIONS',
        attributeName: '请求方法',
        attributeDefaultValue: 'GET|POST|DELETE|PUT|HEAD|TRACE|OPTIONS'
      }
    ]
  },
  {
    controlName: '中间件',
    controlIcon: 'middleWare',
    controlId: 'middleWare',
    controlShape: 'rect',
    layerType: 'physicalLayer',
    attrData: []
  },
  {
    controlName: '执行引擎',
    controlIcon: 'engine',
    controlId: 'engine',
    controlShape: 'rect',
    layerType: 'applicationLayer',
    attrData: []
  },
  {
    controlName: '接口',
    controlIcon: 'interface',
    controlId: 'interface',
    controlShape: 'rect',
    layerType: 'businessLayer',
    attrData: []
  },
  {
    controlName: '项目',
    controlIcon: 'project',
    controlId: 'project',
    controlShape: 'rect',
    layerType: 'applicationLayer',
    attrData: []
  },
  {
    controlName: '系统',
    controlIcon: 'system',
    controlId: 'system',
    controlShape: 'rect',
    layerType: 'businessLayer',
    attrData: []
  },

  {
    controlName: '服务器',
    controlIcon: 'server',
    controlId: 'server',
    controlShape: 'rect',
    layerType: 'middleWareLayer',
    attrData: []
  },
  {
    controlName: '数据库',
    controlIcon: 'data',
    controlId: 'data',
    controlShape: 'rect',
    layerType: 'physicalLayer',
    attrData: []
  }
]
// 图表数据
const graphData: Record<string, any> = {
  nodes: [],
  edges: []
}

onBeforeMount(() => {
  isPreview.value = !!route.query.isPreview
})

function saveGraph() {
  console.log(
    '%c 🍲 graphData: ',
    'font-size:12px;background-color: #EA7E5C;color:#fff;',
    graphData
  )
}
</script>
