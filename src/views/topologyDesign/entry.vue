<template>
  <div style="height: 100%">
    <preview v-if="isPreview" :graphData="DefaultGraph"></preview>
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
import DefaultGraph from './asset/defaultGraph.json'

type GraphDTO = {
  canvasId: string
  canvasData: string
  canvasName: string
  remark: string
}

const route = useRoute()

const isPreview = ref(false)
// 元素列表
const components: any[] = [
  {
    name: '圆',
    icon: 'smile',
    id: 'circle',
    type: 'circle',
    attrData: [
      {
        name: 'firstName',
        label: '名',
        value: 'chunjiao',
        type: 'input'
      },
      {
        name: 'age',
        label: '年龄',
        value: '30',
        type: 'select',
        options: [
          {
            title: '10',
            disabled: false,
            value: '10'
          },
          {
            title: '20',
            disabled: false,
            value: '20'
          },
          {
            title: '30',
            disabled: true,
            value: '30'
          }
        ]
      },
      {
        name: 'fullName',
        label: '全名',
        value: 'zhiming',
        type: 'input'
      }
    ]
  },
  {
    name: '椭圆',
    icon: 'smile',
    id: 'ellipse',
    type: 'ellipse',
    label: '产业科技服务器',
    attrData: [{ hello: 'ellipse', name: 'ellipse' }]
  },
  {
    name: 'SoSmart服务器',
    icon: 'smile',
    type: 'custom-rect',
    attrData: [{ hello: 'rect' }],
    label: 'SoSmart服务器',
    labelCfg: {
      style: {
        fill: 'rgb(45, 204, 255)'
      }
    },
    style: {
      stroke: 'rgb(45, 204, 255)',
      fill: 'rgb(7, 29, 51)',
      lineWidth: 2,
      height: 60,
      width: 150,
      shadowColor: 'rgb(45, 204, 255)',
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowBlur: 10
    }
  },
  {
    name: '产业科技服务器',
    icon: 'smile',
    type: 'rect',
    attrData: [{ hello: 'rect' }],
    label: '产业科技服务器',
    labelCfg: {
      style: {
        fill: 'rgb(45, 204, 255)'
      }
    },
    style: {
      stroke: 'rgb(45, 204, 255)',
      fill: 'rgb(7, 29, 51)',
      lineWidth: 2,
      height: 60,
      width: 150,
      shadowColor: 'rgb(45, 204, 255)',
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowBlur: 10
    }
  },
  {
    name: '菱形',
    icon: 'smile',
    id: 'diamond',
    type: 'diamond',
    label: '产业科技服务器',
    attrData: [{ hello: 'diamond' }]
  },
  {
    name: '星形',
    icon: 'smile',
    id: 'star',
    type: 'star',
    label: '产业科技服务器',
    attrData: [{ hello: 'star' }]
  },
  {
    name: '三角形',
    icon: 'smile',
    id: 'triangle',
    label: '产业科技服务器',
    type: 'triangle',
    attrData: [{ hello: 'triangle' }]
  },
  {
    name: '图片',
    icon: 'smile',
    id: 'image',
    type: 'image',
    label: '产业科技服务器',
    img: 'https://gw.alipayobjects.com/os/s/prod/antv/assets/image/logo-with-text-73b8a.svg',
    attrData: [{ hello: 'image' }]
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
