<template>
  <div class="preview-comp">
    <div id="preview" ref="previewContainer"></div>
    <!-- <attribute-panel
      class="attribute"
      v-if="activatedNodeData.id"
      :activatedNodeData="activatedNodeData"
      :readonlyBol="true"
    ></attribute-panel> -->
    <div class="operate-panel">
      <!-- <a-icon title="清除画布" type="redo" @click="clearGraph" /> -->
      <a-icon title="网格开关" type="number" @click="switchLayerGrid" />
    </div>
    <!-- <detail-modal ref="detailModalRef"></detail-modal> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import G6, { Graph, G6GraphEvent } from '@antv/g6'
import type { INode, Item } from '@antv/g6'
import { clone, mix, isNumber } from '@antv/util'
// import AttributePanel from './attributePanel'
import { Action, GlobalConfig } from './type'
import type { DesignComponent, NodeAttr } from './type'
// import DetailModal from './detail.vue'

const DEFAULTCOLOR = 'rgb(45, 204, 255)',
  SELECTEDCOLOR = 'rgb(95, 149, 255)',
  FILLCOLOR = 'rgb(7, 29, 51)'

const props = withDefaults(
  defineProps<{
    graphData: Record<string, any>
  }>(),
  {
    graphData: () => ({})
  }
)

const previewContainer: Ref<null | HTMLElement> = ref(null)
const detailModalRef: Ref<null | HTMLElement> = ref(null)

let activatedNodeData: Record<string, any> = {}
let graph: any
const activatedGraph = ''
let activatedNode: Record<string, any> = {}
// 高亮节点ID，接口返回的highlightNodeId优先级大于defaultHighlightNodeId
const highlightNodeId = ''

onMounted(() => {
  initG6()
})

function initG6() {
  registerArrowEdge()
  registerCustomShape()
  registerCustomCombo()
  const tooltip = registerToolTip()
  const contextMenu = registerMenu()
  const designerRef: HTMLElement = previewContainer.value as HTMLElement
  graph = new G6.Graph({
    container: 'preview',
    width: designerRef.offsetWidth,
    height: designerRef.offsetHeight,
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
    plugins: [tooltip, contextMenu]
  })
  graph.data(props.graphData)
  graph.render()
  registryListener()
}

// 绘制流动线条
function registerArrowEdge() {
  G6.registerEdge(
    'arrow-running',
    {
      afterDraw(cfg: any, group: any) {
        const shape = group.get('children')[0]
        const arrow = group.addShape('marker', {
          attrs: {
            x: 16,
            y: 0,
            r: 8,
            lineWidth: 1,
            stroke: 'rgb(45, 204, 255)',
            fill: 'rgb(45, 204, 255)',
            symbol: (x: number, y: number, r: number) => {
              return [
                ['M', x - 6, y - 4],
                ['L', x - 2, y],
                ['L', x - 6, y + 4]
              ]
            }
          }
        })
        arrow.animate(
          (ratio: number) => {
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
    drawShape(cfg: any, group: any) {
      const attrs = cfg.style
      const { width = 200, height = 60, imageSize = 20, fontSize = 14, stroke, alarmIcon } = attrs
      if (!attrs['defaultFill']) {
        attrs['defaultFill'] = attrs.fill
      }
      attrs.fill = attrs['alarmFill'] || attrs['defaultFill']

      const shape = group.addShape('rect', {
        attrs: {
          ...attrs
        },
        name: 'main-box',
        draggable: true
      })
      group.addShape('dom', {
        attrs: {
          x: 10,
          y: (height - imageSize) / 2,
          height: imageSize,
          width: imageSize,
          html: `<svg class="custom-icon" aria-hidden="true">
    <use xlink:href="#${alarmIcon || cfg.controlIcon}" style="color: white;"></use>
</svg>`
          // filter: "invert(100%)",
        },
        draggable: true,
        name: 'node-icon'
      })
      group.addShape('text', {
        attrs: {
          text: cfg.label,
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
      if (cfg.collapsed) {
        // 如果被折叠了，加三个点标识
        group.addShape('text', {
          attrs: {
            text: '...',
            fill: SELECTEDCOLOR,
            x: width - 20,
            y: height + 20,
            fontSize: 30
          }
        })
      }
      return shape
    },
    setState(name, value, item: any) {
      const group = item.get('group')
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

// 注册自定义 Combo
function registerCustomCombo() {
  G6.registerCombo(
    'customCombo',
    {
      drawShape: function drawShape(cfg: any, group: any) {
        const self = this
        // 获取样式配置，style.width 与 style.height 对应 rect Combo 位置说明图中的 width 与 height
        const style = self.getShapeStyle(cfg)
        // 绘制一个矩形作为 keyShape，与 'rect' Combo 的 keyShape 一致
        const rect = group.addShape('rect', {
          attrs: {
            ...style
          },
          name: 'combo-keyShape'
        })
        group.addShape('text', {
          attrs: {
            text: cfg.labelName,
            fill: cfg.layerLabelColor as string
          },
          name: 'layerLabel'
        })

        return rect
      },
      update(cfg: any, item: Item) {
        let padding: number | number[] = cfg.padding
        if (isNumber(padding)) padding = [padding, padding, padding, padding]
        const cfgStyle = clone(cfg.style)
        let width, height
        let { fixSize } = cfg
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

function registerToolTip() {
  return new G6.Tooltip({
    itemTypes: ['node'],
    getContent: (e: any) => {
      const outDiv = document.createElement('div')
      //outDiv.style.padding = '0px 0px 20px 0px';
      outDiv.innerHTML = `
      <h4>${e.item.getModel().style.alarmTooltip}</h4>`
      return outDiv
    },
    shouldBegin: (e: any) => {
      // if (e.item.getModel().tooltip) return true;
      return !!e.item.getModel().style.alarmTooltip
    }
  })
}

// 绘制节点操作菜单
function registerMenu(): Record<string, any> {
  return new G6.Menu({
    getContent(ev: any) {
      const model = ev.item.getModel()
      return `
          <div class="context-menu">
            ${model.collapsed ? '<p key="expand">展开</p>' : '<p key="collapse">折叠</p>'}
            ${
              model.controlId === '5db42808281349a1929803417c572671'
                ? '<p key="detail">详情</p>'
                : ''
            }
          </div>
        `
    },
    handleMenuClick: (target: HTMLElement, item: any) => {
      const type = target.getAttribute('key')
      if (['expand', 'collapse'].includes(type as string)) {
        const childNodes = item.getNeighbors('target')
        if (!childNodes.length) return
        const collapseBol = childNodes[0].isVisible()
        graph.updateItem(item, {
          collapsed: collapseBol
        })
        collapseNode(item, collapseBol)
      } else if (type === 'detail') {
        ;(detailModalRef as any).value.show(item.getModel()?.attrData)
      }
    },
    itemTypes: ['node', 'edge'],
    trigger: 'contextmenu',
    className: 'node-context-menu'
  })
}

// 注册监听事件
function registryListener() {
  graph.on('node:click', (nodeObj: G6GraphEvent) => {
    activatedNodeData = (nodeObj.item._cfg as any).model
    console.log(
      '%c 🥕 activatedNodeData: ',
      'font-size:12px;background-color: #4b4b4b;color:#fff;',
      activatedNodeData
    )
    activatedNode = nodeObj.item
  })
  graph.on('canvas:click', () => {
    activatedNode = {}
    activatedNodeData = {}
  })
  graph.on('node:mouseenter', nodeHighLight)
  graph.on('node:mouseleave', () => {
    clearAllStatus()
    nodeHighLight(highlightNodeId)
  })
}

// 折叠展开子节点
function collapseNode(parentNode: INode, collapseBol: boolean) {
  const childNodes = parentNode.getNeighbors('target')
  childNodes.map((node: any) => {
    const grandSonNodes = node.getNeighbors('target')
    if (grandSonNodes.length) {
      collapseNode(node, collapseBol)
    }
    if (collapseBol) {
      graph.hideItem(node, false)
    } else {
      graph.showItem(node, true)
      graph.updateItem(node, { collapsed: false })
    }
  })
}

// 节点hover高亮
function nodeHighLight(nodeObj: G6GraphEvent | string) {
  if (!nodeObj) return
  const item = (typeof nodeObj === 'string' ? graph.findById(nodeObj) : nodeObj.item) as INode
  if (!item) return
  clearAllStatus((node: INode) => {
    graph.setItemState(node, 'dark', true)
  }, false)
  highLightLinkByNode(item)
  highLightLinkByNode(item, 'target')
  graph.paint()
  graph.setAutoPaint(true)
}

// 根据节点反查关联链路并高亮
function highLightLinkByNode(currNode: INode, searchType: 'target' | 'source' = 'source') {
  graph.setItemState(currNode, 'dark', false)
  graph.setItemState(currNode, 'highlight', true)
  const edges = searchType === 'source' ? currNode.getInEdges() : currNode.getOutEdges()
  edges.map((edge) => {
    graph.setItemState(edge, 'highlight', true)
  })
  const nodes = currNode.getNeighbors(searchType)
  nodes.map((node) => {
    highLightLinkByNode(node, searchType)
  })
}

// 清除所有元素的状态
function clearAllStatus(callback?: Function, isPaint = true) {
  graph.setAutoPaint(false)
  graph.getNodes().map((node: any) => {
    graph.clearItemStates(node)
    callback && callback(node)
  })
  graph.getEdges().map((edge: any) => {
    graph.clearItemStates(edge)
    // callback(edge)
  })
  if (isPaint) {
    graph.paint()
    graph.setAutoPaint(true)
  }

  if (activatedNode.setState) {
    activatedNode.setState('selected', true)
  }
}

// 更新属性面板
function updateAttrPanel(resAttrData: Record<string, any>[]) {
  if (!activatedNodeData.id) return
  if (!resAttrData) return
  const attrData: NodeAttr[] = activatedNodeData.attrData
  const responseAttrMap = new Map(
    resAttrData.map((resAttr) => [resAttr.attributeInstanceId, resAttr.attributeInstanceValue])
  )
  attrData.map((updateAttr) => {
    if (responseAttrMap.has(updateAttr.attributeInstanceId)) {
      updateAttr.attributeInstanceValue = responseAttrMap.get(
        updateAttr.attributeInstanceId
      ) as string
    }
  })
}

// 更新节点的告警属性
function updateNodesAlarmAttr(resNodesData: Record<string, any>[]) {
  if (!resNodesData) return
  const needUpdates = resNodesData.filter(
    (data) => data.alarmLevel || data.alarmTooltip || data.alarmIcon
  )
  needUpdates.map((item) => {
    const { alarmLevel, alarmTooltip, alarmIcon } = item
    graph.updateItem(item.controlInstanceId, {
      style: {
        alarmLevel,
        alarmTooltip,
        alarmIcon
      }
    })
  })
}

// 切换网格线显示隐藏
function switchLayerGrid() {
  graph.getCombos().map((layer: INode) => {
    const gridShow = !layer.getModel().gridShow
    layer.update({ gridShow })
  })
}

onUnmounted(() => {
  graph && graph.destroy()
})
</script>

<style lang="less" scoped>
.preview-comp {
  position: relative;
  height: 100%;
  background: url('~@/topologyDesign/asset/bj.png') no-repeat center;
  #preview {
    height: 100%;
    position: relative;
    user-select: none;
  }
  .operate-panel {
    position: absolute;
    top: 10px;
    right: 20px;
    padding: 5px;
    color: #fff;
    font-size: 20px;
  }
  .attribute {
    position: absolute;
    right: 0;
    top: 0;
    background-color: rgb(7, 29, 51);
    box-shadow: 1px 0 12px rgb(45, 204, 255);
    height: 100%;
  }
}
</style>

<style lang="less">
.preview-comp {
  .attribute {
    .ant-tabs .ant-tabs-content {
      pointer-events: none;
    }
    .ant-form-item {
      .ant-form-item-label > label,
      .ant-radio-wrapper,
      .ant-checkbox-wrapper {
        color: #fff;
      }
    }
  }
  .context-menu {
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
./test.js./test.ts