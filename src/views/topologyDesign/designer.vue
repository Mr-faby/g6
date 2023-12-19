<template>
  <div class="designer">
    <div id="designer" ref="designer"></div>
    <div class="operate-panel">
      <!-- <a-icon title="清除画布" type="redo" @click="clearGraph" /> -->
      <BorderlessTableOutlined title="网格开关" @click="switchLayerGrid" />
      <SaveOutlined title="保存" @click="saveGraph" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, onMounted } from 'vue'
import G6, { Graph, G6GraphEvent } from '@antv/g6'
import type { Item, IEdge, INode } from '@antv/g6'
import { type DesignComponent, type NodeAttr, GlobalConfig } from './type'
import draggable from 'vuedraggable'
import { clone, mix, isNumber } from '@antv/util'
import { SaveOutlined, BorderlessTableOutlined } from '@ant-design/icons-vue'

const props = withDefaults(
  defineProps<{
    components: DesignComponent[]
    graphData: Record<string, any>
    dragOriginObj: Record<string, any>
    globalConfig: GlobalConfig
  }>(),
  {
    components: () => [],
    graphData: () => ({}),
    dragOriginObj: () => ({}),
    globalConfig: () => new GlobalConfig()
  }
)

const emit = defineEmits(['setGraph', 'saveGraph', 'handleNodeClick'])

const designer = ref(null)

const DEFAULTCOLOR = 'rgb(45, 204, 255)',
  SELECTEDCOLOR = 'rgb(95, 149, 255)',
  FILLCOLOR = 'rgb(7, 29, 51)'
const Rect = {
  type: 'custom-rect',
  label: '默认节点',
  labelCfg: {
    style: {
      fill: DEFAULTCOLOR
    }
  },
  style: {
    stroke: DEFAULTCOLOR,
    fill: FILLCOLOR,
    lineWidth: 2,
    height: 60,
    width: 150,
    shadowColor: DEFAULTCOLOR,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 50,
    r: 30
  }
}
let graph: Graph
let addingEdge = false // 正在执行连线操作的状态
let edge: Item | boolean // 当前正在绘制的那条线
const layerArr = [
  {
    id: 'physicalLayer',
    name: '物理层'
  },
  {
    id: 'applicationLayer',
    name: '应用层'
  },
  {
    id: 'businessLayer',
    name: '业务层'
  },
  {
    id: 'middleWareLayer',
    name: '中间件 数据库'
  }
]

watch(
  () => props.graphData,
  () => {
    if (props.graphData.nodes) {
      initG6()
    }
  }
)
// 拖拽生成组件时画布层级高亮
watch(
  () => props.dragOriginObj,
  (newValue, oldValue) => {
    const { _underlying_vm_: config } = newValue || {}
    console.log('%c 🥩 config: ', 'font-size:12px;background-color: #FCA650;color:#fff;', config)
    layerArr.map((layer) => {
      const item = graph.findById(layer.id)
      const style = item.getModel().style
      ;(style!.fill = !config
        ? 'none'
        : layer.id === config.layerType
        ? 'rgba(0,128,0,0.5)'
        : 'rgba(255,0,0,0.5)'),
        item.update({
          style
        })
    })
  }
)
watch(() => props.globalConfig.layerLabelColor, updateLayerLabelColor)
function updateLayerLabelColor() {
  graph.getCombos().map((layer) => {
    layer.update({
      layerLabelColor: props.globalConfig.layerLabelColor
    })
  })
}

watch(
  () => props.globalConfig.layerLabelSize,
  (newValue, oldValue) => {
    graph.getCombos().map((layer) => {
      layer.update({
        layerLabelSize: newValue
      })
    })
  }
)

watch(
  [
    () => props.globalConfig.layerOneHeight,
    () => props.globalConfig.layerTwoHeight,
    () => props.globalConfig.layerThreeHeight,
    () => props.globalConfig.layerFourHeight
  ],
  layerHeightChange
)
// 根据画布缩放比例重新计算层级宽高
function layerHeightChange() {
  const canvasW = graph.getWidth(),
    canvasH = graph.getHeight(),
    zoom = graph.getZoom()
  const newW = canvasW / zoom,
    newH = canvasH / zoom
  const { layerOneHeight, layerTwoHeight, layerThreeHeight, layerFourHeight } = props.globalConfig
  const hPercentArr = [layerOneHeight, layerTwoHeight, layerThreeHeight, layerFourHeight]
  console.log(
    '%c 🍯 hPercentArr: ',
    'font-size:12px;background-color: #FFDD4D;color:#fff;',
    hPercentArr
  )
  layerArr.map((layer, index) => {
    const reducePercent = hPercentArr.slice(0, index + 1).reduce((a, b) => a + b, 0)
    const fixSize = [newW, (newH * hPercentArr[index]) / 100]
    graph.updateItem(layer.id, {
      fixSize,
      x: canvasW / 2,
      y: (newH * reducePercent) / 100 - fixSize[1] / 2
    })
  })
  updateNodePositionOfZoom()
}

// 来一个防抖
function debounce(func: Function, delay: number = 500) {
  let timer: any
  return function (...args: any[]) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      // @ts-ignore
      func.apply(this, args)
    }, delay)
  }
}
const computedLayerSizeDebounce = debounce(layerHeightChange)

onMounted(() => {
  initG6()
  layerHeightChange()
  updateLayerLabelColor()
})

function initG6() {
  registerArrowEdge()
  registerCustomShape()
  registerCustomCombo()
  const contextMenu = registerMenu()
  const designerRef: HTMLElement = designer.value as unknown as HTMLElement
  graph = new G6.Graph({
    container: 'designer',
    width: designerRef.offsetWidth,
    height: designerRef.offsetHeight,
    renderer: 'svg',
    // fitView: true,
    modes: {
      default: ['drag-canvas', 'zoom-canvas', 'click-select', 'drag-node']
    },
    defaultEdge: {
      type: 'arrow-running',
      style: {
        lineDash: [5, 2, 1, 2],
        endArrow: {
          path: G6.Arrow.triangle(),
          fill: DEFAULTCOLOR
        },
        stroke: DEFAULTCOLOR
      }
    },
    nodeStateStyles: {
      selected: {
        lineWidth: 4,
        stroke: SELECTEDCOLOR,
        fill: FILLCOLOR
      },
      highlight: {
        lineWidth: 4,
        stroke: SELECTEDCOLOR,
        fill: FILLCOLOR
      },
      dark: {
        opacity: 0.5
      }
    },
    comboStateStyles: {
      selected: {
        fill: 'green',
        lineWidth: 0
      }
    },
    plugins: [contextMenu]
  })
  const data = Object.assign(props.graphData, { combos: initLayer() })
  console.log('%c 🎂 data: ', 'font-size:12px;background-color: #E41A6A;color:#fff;', data)
  graph.data(data)
  graph.render()
  registryListener()
  emit('setGraph', graph)
}

// 初始化分层
function initLayer() {
  return layerArr.map((layer, index) => {
    return {
      id: layer.id,
      type: 'customCombo',
      labelName: layer.name,
      gridShow: true,
      style: {
        lineDash: [5, 2, 1, 2],
        fill: 'none'
      }
    }
  })
}

// 注册自定义 Combo
function registerCustomCombo() {
  G6.registerCombo(
    'customCombo',
    {
      drawShape: function drawShape(cfg, group) {
        console.log('%c 🍯 cfg: ', 'font-size:12px;background-color: #33A5FF;color:#fff;', cfg)
        const self = this
        // 获取样式配置，style.width 与 style.height 对应 rect Combo 位置说明图中的 width 与 height
        const style = self.getShapeStyle(cfg)
        // 绘制一个矩形作为 keyShape，与 'rect' Combo 的 keyShape 一致
        const rect = group!.addShape('rect', {
          attrs: {
            ...style
          },
          name: 'combo-keyShape'
        })
        group!.addShape('text', {
          attrs: {
            text: cfg!.labelName,
            fill: cfg!.layerLabelColor as string
          },
          name: 'layerLabel'
        })

        return rect
      },
      update(cfg: any, item: Item) {
        let padding: number | number[] = cfg.padding || this.options?.padding
        if (isNumber(padding)) padding = [padding, padding, padding, padding]
        const cfgStyle = clone(cfg.style)
        let width, height
        let { fixSize } = cfg
        console.log('%c 🍒 cfg: ', 'font-size:12px;background-color: #3F7CFF;color:#fff;', cfg)
        if (!fixSize) fixSize = [0, 0]
        width = fixSize[0]
        height = fixSize[1]
        cfgStyle.width = width
        cfgStyle.height = height
        // 下面这些属性需要覆盖默认样式与目前样式，但若在 cfg 中有指定则应该被 cfg 的相应配置覆盖。
        const strokeStyle = {
          stroke: cfg.gridShow && fixSize[0] ? '#fff' : 'none',
          x: -width / 2,
          y: -height / 2
        }
        // 与 getShapeStyle 不同在于，update 时需要获取到当前的 style 进行融合。即新传入的配置项中没有涉及的属性，保留当前的配置。
        const keyShape = item.get('keyShape')
        const style = mix({}, keyShape.attr(), strokeStyle, cfgStyle)
        ;(this as any).updateShape(cfg, item, style, false)

        // 缩放时更新label位置
        const textShape = item.get('group').find((e: any) => e.get('name') === 'layerLabel')
        textShape.attr('x', -width / 2 + 15)
        textShape.attr('fontSize', cfg.layerLabelSize)
        textShape.attr('fill', cfg.gridShow && fixSize[0] ? cfg.layerLabelColor : 'none')
      }
    },
    'rect'
  )
}

// 绘制节点操作菜单
function registerMenu(): Record<string, any> {
  return new G6.Menu({
    getContent() {
      return `
          <div class="context-menu">
            <p key="edge" title="连接">连接</p>
            <p key="delete" title="删除">删除</p>
          </div>
        `
    },
    handleMenuClick: (target: any, item: any) => {
      const type = target.getAttribute('key')
      if (type === 'delete') {
        graph.removeItem(item)
        emit('handleNodeClick', {})
      } else if (type === 'edge') {
        const model = item.getModel()
        if (!(edge && addingEdge)) {
          // Add anew edge, the end node is the current node user clicks
          edge = graph.addItem('edge', {
            source: model.id,
            target: model.id
          })
          addingEdge = true
        }
      }
    },
    itemTypes: ['node', 'edge'],
    trigger: 'contextmenu',
    className: 'node-context-menu'
  })
}

// 绘制流动线条
function registerArrowEdge() {
  G6.registerEdge(
    'arrow-running',
    {
      afterDraw(cfg, group) {
        const shape = group?.get('children')[0]
        const arrow = group?.addShape('marker', {
          attrs: {
            x: 16,
            y: 0,
            r: 8,
            lineWidth: 1,
            stroke: DEFAULTCOLOR,
            fill: DEFAULTCOLOR,
            symbol: (x: number, y: number) => {
              return [
                ['M', x - 6, y - 4],
                ['L', x - 2, y],
                ['L', x - 6, y + 4]
              ]
            }
          }
        })
        arrow?.animate(
          (ratio: any) => {
            const { getLabelPosition, transform } = G6.Util
            const tmpPoint = shape.getPoint(ratio)
            const pos = getLabelPosition(shape, ratio)
            let matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1]
            matrix = transform(matrix, [
              ['t', -tmpPoint.x, -tmpPoint.y],
              ['r', pos.angle],
              ['t', tmpPoint.x, tmpPoint.y]
            ])
            return {
              x: tmpPoint.x,
              y: tmpPoint.y,
              matrix
            }
          },
          {
            repeat: true,
            duration: 2000
          }
        )
      }
    },
    'line' // extend the built-in edge 'cubic'
  )
}

// 自定义元素
function registerCustomShape() {
  G6.registerNode('custom-rect', {
    drawShape(cfg, group) {
      console.log('%c 🍠 cfg: ', 'font-size:12px;background-color: #FFDD4D;color:#fff;', cfg)
      const style = cfg!.style
      const { width = 200, height = 60, imageSize = 20, fontSize = 14, stroke } = style!
      const shape = group!.addShape('rect', {
        attrs: style!,
        name: 'main-box',
        draggable: true
      })
      group?.addShape('dom', {
        attrs: {
          x: 10,
          y: (height - imageSize) / 2,
          height: imageSize,
          width: imageSize,
          html: `<svg class="custom-icon"  aria-hidden="true">
    <use xlink:href="#${cfg?.controlIcon}" style="color: white;"></use>
</svg>`
        },
        draggable: true,
        name: 'node-icon'
      })
      group?.addShape('text', {
        attrs: {
          text: cfg?.label,
          fontSize: fontSize,
          x: width / 2,
          y: (height - fontSize) / 2,
          textBaseline: 'top',
          textAlign: 'center',
          fill: stroke
        },
        draggable: true,
        name: 'node-title'
      })
      return shape
    },
    setState(name, value, item) {
      const group = item?.get('group')
      const rect = group.find((e: any) => e.get('name') === 'main-box')
      if (name === 'selected' || name === 'highlight') {
        rect.attr({
          lineWidth: value ? 4 : 2,
          stroke: value ? SELECTEDCOLOR : DEFAULTCOLOR
        })
      } else if (name === 'dark') {
        rect.attr({
          opacity: value ? 0.5 : 1
        })
      }
    }
  })
}

// 注册监听事件
const registryListener = () => {
  graph.on('node:click', (nodeObj: G6GraphEvent) => {
    emit('handleNodeClick', nodeObj.item._cfg!.model)
    if (addingEdge && edge) {
      graph.updateItem(edge as Item, {
        target: nodeObj.item._cfg!.model!.id
      })

      edge = false
      addingEdge = false
    }
  })

  graph.on('canvas:click', () => {
    emit('handleNodeClick', {})
  })

  graph.on('mousemove', (ev) => {
    // 连线实时绘制
    const point = { x: ev.x, y: ev.y }
    if (addingEdge && edge) {
      graph.updateItem(edge as Item, {
        target: point
      })
    }
  })

  graph.on('contextmenu', (ev) => {
    if (edge) {
      graph.removeItem(edge as IEdge)
      edge = false
    }
  })

  graph.on('wheelzoom', (ev) => {
    computedLayerSizeDebounce()
  })

  // 将拖拽的组件添加到对应的分层
  graph.on('combo:drop', (ev: G6GraphEvent) => {
    if (!props.dragOriginObj) return
    const { originalEvent: event }: any = ev
    const dropCombo = ev.item.getModel()
    const { _underlying_vm_: dragItem } = props.dragOriginObj
    if (!dropCombo || !dragItem) return
    if (dragItem.layerType !== dropCombo.id) return
    // if (dropCombo.id !== "middleWareLayer") return;
    const model = JSON.parse(JSON.stringify(dragItem))
    Object.assign(model, Rect)
    model.attrData.forEach((item: NodeAttr) => {
      // 初始化一个attr ID
      item.attributeInstanceId = 'attribute' + createUuid(23)
    })
    const node = graph.addItem('node', {
      ...model,
      id: dragItem.controlShape + createUuid(8),
      x: ev.x,
      y: ev.y,
      label: model.controlName || model.label,
      type: model.controlShape === 'rect' ? 'custom-rect' : model.controlShape,
      style: Rect.style,
      labelCfg: Rect.labelCfg,
      parentComboId: dropCombo.id
    })
    reSetNodePosition(node as INode)
  })

  graph.on('node:dragend', (ev) => {
    reSetNodePosition(ev.item as INode)
  })
}

// 节点拖拽时不能拖出当前层级
const reSetNodePosition = (item: INode, ev?: any) => {
  const node = item.getModel()
  const parentComboId = node.parentComboId as string
  if (!parentComboId) return
  const combo = graph.findById(parentComboId).getModel()
  const fixSize: number[] = combo.fixSize as number[]
  const nodeW = node.style!.width as number,
    nodeH = node.style!.height as number
  const comboHalfW = fixSize[0] / 2,
    comboHalfH = fixSize[1] / 2
  const leftBoundary = combo.x! - comboHalfW,
    rightBoundary = combo.x! + comboHalfW,
    topBoundary = combo.y! - comboHalfH,
    bottomBoundary = combo.y! + comboHalfH
  let { x, y } = node
  // 上
  if (node.y! <= topBoundary) {
    y = topBoundary
  }
  // 下
  if (node.y! >= bottomBoundary - nodeH) {
    y = bottomBoundary - nodeH
  }
  // 左
  if (node.x! <= leftBoundary) {
    x = leftBoundary
  }
  // 右
  if (node.x! >= rightBoundary - nodeW) {
    x = rightBoundary - nodeW
  }
  const model: Record<string, any> = { x, y }
  if (ev) {
    // 更新节点相对层级的位置
    model['style'] = {
      offsetLayerX: combo.x! - ev.x,
      offsetLayerY: combo.y! - ev.y
    }
  }
  graph.updateItem(item, model)
}

// 缩放时重新计算node相对于所属层级中心的位置
const updateNodePositionOfZoom = () => {
  graph.setAutoPaint(false)
  graph.getNodes().map((node) => {
    const model = node.getModel()
    const parentCombo = graph.findById(model.parentComboId as string)
    if (!parentCombo) return
    graph.updateItem(node, {
      x: parentCombo.getModel().x! - model.style!.offsetLayerX,
      y: parentCombo.getModel().y! - model.style!.offsetLayerY
    })
    reSetNodePosition(node)
  })
  graph.paint()
  graph.setAutoPaint(true)
}

const createUuid = (n = 36): string => {
  const str = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < n; i++) {
    result += str[parseInt(Math.random() * str.length + '')]
  }
  return result
}

// 保存图表
const saveGraph = () => {
  emit('saveGraph', graph.save())
}

// 切换网格线显示隐藏
const switchLayerGrid = () => {
  graph.getCombos().map((layer) => {
    const gridShow = !layer.getModel().gridShow
    layer.update({ gridShow })
  })
}

const clearGraph = () => {
  graph.clear()
}

onUnmounted(() => {
  graph && graph.destroy()
})
</script>

<style lang="less" scoped>
.designer {
  width: calc(65% - 20px);
  position: relative;
  background: url('~@/topologyDesign/asset/bj.png') no-repeat center;

  #designer {
    width: 100%;
    height: 100%;
    user-select: none;
  }

  .operate-panel {
    position: absolute;
    top: 10px;
    right: 20px;
    padding: 5px;
    color: #fff;
    font-size: 20px;

    .anticon {
      padding-left: 5px;
    }
  }

  /deep/.context-menu {
    background-color: #fff;
    border-radius: 5px;
    padding: 5px 10px;
    font-size: 13px;
    cursor: pointer;
    p {
      &:hover {
        color: rgb(95, 149, 255);
      }
    }
  }
}
</style>
