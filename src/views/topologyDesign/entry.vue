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
        attributeInstanceId: 'attributexk3mcnnn66n9b6c124bn26r',
        dataName: 'Input',
        attributeId: '04f9e4bf469c49618d11345a07944614',
        attributeInstanceValue: '',
        attributeName: '输入属性',
        attributeDefaultValue: ''
      }
    ]
  },
  {
    controlName: '中间件',
    controlIcon: 'middleWare',
    controlId: 'middleWare',
    controlShape: 'rect',
    layerType: 'physicalLayer',
    attrData: [
      {
        attributeInstanceId: 'attributehz7xjimvhqrbctjimgeroay',
        dataName: 'Radio',
        attributeId: 'c6898dc0401a45f9be2e84b6731adee9',
        attributeInstanceValue: 'GET|POST|[DELETE]|PUT|HEAD|TRACE|OPTIONS',
        attributeName: '单选属性',
        attributeDefaultValue: 'GET|POST|[DELETE]|PUT|HEAD|TRACE|OPTIONS'
      }
    ]
  },
  {
    controlName: '执行引擎',
    controlIcon: 'engine',
    controlId: 'engine',
    controlShape: 'rect',
    layerType: 'applicationLayer',
    attrData: [
      {
        attributeInstanceId: 'attributeec6v5hapcknimm10r3y3zk6',
        dataName: 'Checkbox',
        attributeId: 'beb6a039d835488da92444f4e40cfc81',
        attributeInstanceValue: '[A]|B|[C]|D',
        attributeName: '多选属性',
        attributeDefaultValue: '[A]|B|[C]|D'
      }
    ]
  },
  {
    controlName: '接口',
    controlIcon: 'interface',
    controlId: 'interface',
    controlShape: 'rect',
    layerType: 'businessLayer',
    attrData: [
      {
        attributeInstanceId: 'attributenciqpjrgf6y8i3kkfsdg8ryu4v',
        dataName: 'Select',
        attributeId: '46536d0d2dbe488e963ec30807eb5e6c',
        attributeInstanceValue: 'A|[B]|C|D',
        attributeName: '下拉属性',
        attributeDefaultValue: 'A|[B]|C|D'
      }
    ]
  },
  {
    controlName: '项目',
    controlIcon: 'project',
    controlId: 'project',
    controlShape: 'rect',
    layerType: 'applicationLayer',
    attrData: [
      {
        attributeInstanceId: 'attributenciqpjrgf6y8i3kk2f8ry',
        dataName: 'Number',
        attributeId: 'c97fa3ec6fc342e438b3c88a5624a3e29',
        attributeInstanceValue: '',
        attributeName: '数字输入属性',
        attributeDefaultValue: ''
      }
    ]
  },
  {
    controlName: '系统',
    controlIcon: 'system',
    controlId: 'system',
    controlShape: 'rect',
    layerType: 'businessLayer',
    attrData: [
      {
        attributeInstanceId: 'attributehz7xjimvhghherssfaase',
        dataName: 'Color',
        attributeId: 'c6898dc0401a45f9be2e3e4d4f5g',
        attributeInstanceValue: 'green',
        attributeName: '颜色属性',
        attributeDefaultValue: 'green'
      }
    ]
  },

  {
    controlName: '服务器',
    controlIcon: 'server',
    controlId: 'server',
    controlShape: 'rect',
    layerType: 'middleWareLayer',
    attrData: [
      {
        attributeInstanceId: 'attributehz7xjimvhqrbctjimgeroay',
        dataName: 'Textarea',
        attributeId: 'c6898dc0401a45f9be23d3e3ss6g',
        attributeInstanceValue: '',
        attributeName: '多行输入属性',
        attributeDefaultValue: ''
      }
    ]
  },
  {
    controlName: '数据库',
    controlIcon: 'data',
    controlId: 'data',
    controlShape: 'rect',
    layerType: 'physicalLayer',
    attrData: [
      {
        attributeInstanceId: 'attributehz7xjiheewsddx',
        dataName: 'Input',
        attributeId: 'c6898dc0401a45f9be2ett8e9e55f',
        attributeInstanceValue: '',
        attributeName: '输入属性',
        attributeDefaultValue: ''
      }
    ]
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
