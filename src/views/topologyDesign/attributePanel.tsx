import InputSetter from './setter/input.vue';
import SelectSetter from './setter/select.vue';
import NumberSetter from './setter/number.vue';
import CheckboxSetter from './setter/checkbox.vue';
import TextareaSetter from './setter/textarea.vue';
import RadioSetter from './setter/radio.vue';
// import HandlerSetter from './setter/handler.vue';
import ColorSetter from './setter/color.vue';
import { GlobalConfig } from "./type";
import type { NodeAttr } from "./type"
import { Graph } from "@antv/g6";
import { h, defineComponent } from 'vue'
import { Tabs, TabPane } from 'ant-design-vue';

const commonAttr = [
  {
    name: 'label',
    type: 'input',
    label: '节点名称',
    group: 'basic'
  },
  {
    name: 'width',
    type: 'number',
    label: '宽度'
  },
  {
    name: 'height',
    type: 'number',
    label: '高度'
  },
  {
    name: 'radius',
    type: 'number',
    label: '圆角'
  },
  {
    name: 'r',
    type: 'number',
    label: '半径'
  },
  {
    name: 'imageSize',
    type: 'number',
    label: '图标大小'
  },
  {
    name: 'fontSize',
    type: 'number',
    label: '文字大小'
  },
]
const globalAttr = [
  // {
  //   name: 'unlinkOpacity',
  //   type: 'Number',
  //   label: '失活透明度'
  // },
  {
    name: 'defaultHighlightNodeId',
    type: 'Input',
    label: '高亮链路节点ID'
  },
  // {
  //   name: 'alarmColorOne',
  //   type: 'Color',
  //   label: '一级告警色'
  // },
  // {
  //   name: 'alarmColorTwo',
  //   type: 'Color',
  //   label: '二级告警色'
  // },
  // {
  //   name: 'alarmColorThree',
  //   type: 'Color',
  //   label: '三级告警色'
  // },
  // {
  //   name: 'alarmColorFour',
  //   type: 'Color',
  //   label: '四级告警色'
  // },
  // {
  //   name: 'alarmColorFive',
  //   type: 'Color',
  //   label: '五级告警色'
  // },
  {
    name: 'layerOneHeight',
    type: 'Number',
    max: 100,
    label: '层级一高度百分比'
  },
  {
    name: 'layerTwoHeight',
    type: 'Number',
    max: 100,
    label: '层级二高度百分比'
  },
  {
    name: 'layerThreeHeight',
    type: 'Number',
    max: 100,
    label: '层级三高度百分比'
  },
  {
    name: 'layerFourHeight',
    type: 'Number',
    max: 100,
    label: '层级四高度百分比'
  },
  {
    name: 'layerLabelSize',
    type: 'Number',
    label: '层级文本字号'
  },
  {
    name: 'layerLabelColor',
    type: 'Color',
    label: '层级名称颜色'
  },
]
const excludeAttr = ['实例编号', '实例名称']
const needOptionsSetter = ['Checkbox', 'Radio', "Select"]

export default defineComponent({
  components: {
    aTabs: Tabs,
    aTabPane: TabPane,
    InputSetter,
    SelectSetter,
    NumberSetter,
    CheckboxSetter,
    TextareaSetter,
    RadioSetter,
    ColorSetter,
  },
  props: {
    activatedNodeData: {
      type: Object,
      required: true,
      default: () => ({})
    },
    globalConfig: {
      type: GlobalConfig,
      required: true,
      default: () => new GlobalConfig()
    },
    graph: {
      type: Object,
      required: true,
      default: () => ({})
    },
    readonlyBol: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const getOptions = (attr: NodeAttr): any[] => {
      if (!needOptionsSetter.includes(attr.dataName)) return []
      try {
        return attr.attributeDefaultValue.split('|').map(item => {
          const str = /^\[.*\]$/.test(item) ? item.substring(1, item.length - 1) : item
          return { label: str, value: str }
        })
      } catch {
        return []
      }
    }

    const getValue = (attr: NodeAttr): string | any[] => {
      if (needOptionsSetter.includes(attr.dataName) && typeof attr.attributeInstanceValue === 'string') {
        // 给checkbox类setter设置初始值，只有新创建的节点需要设置
        const options = attr.attributeInstanceValue.split('|')
        if (options.length < 2) {
          return attr.attributeInstanceValue
        }
        const validArr = options.filter(item => /^\[.*\]$/.test(item))
        const defaultValue = validArr.map(item => item.substring(1, item.length - 1))
        return attr.dataName === 'Radio' ? defaultValue[0] : defaultValue
      }
      return attr.attributeInstanceValue || ''
    }

    const render = () => {
      const { attrData } = props.activatedNodeData
      return (
        <div class="attribute-panel" style="width: calc(20% - 40px);padding-bottom: 10px;">
          <a-tabs style="height: 100%;overflow-y: auto;">
            <a-tab-pane tab="数据" key="1" style="padding: 0 10px;">
              {props.activatedNodeData?.id &&
                attrData.map((item: NodeAttr, index: number) => {
                  if (excludeAttr.includes(item.attributeName) || !item.dataName) return ''
                  return h(eval(`${item.dataName}Setter`), {
                    ...item,
                    attrData,
                    label: item.attributeName,
                    value: getValue(item),
                    options: getOptions(item),
                    readonlyBol: props.readonlyBol,
                    onUpdate: (data: any) => {
                      handleDataAttrChange(data, index)
                    }
                  })
                })
              }
            </a-tab-pane>

            {props.readonlyBol &&
              <a-tab-pane tab="基础" key="2" style="padding: 0 10px;">
                {props.activatedNodeData?.id &&
                  commonAttr.map((item) => {
                    return h(`${item.type}Setter`, {
                      props: {
                        ...item,
                        value: item.group ? props.activatedNodeData[item.name] : props.activatedNodeData.style[item.name]
                      },
                      on: {
                        change: (data: any) => {
                          handleCommonAttrChange(data, item.name, item.group)
                        }
                      }
                    })
                  })
                }
              </a-tab-pane>
            }
            <a-tab-pane tab="全局" key="3" style="padding: 0 10px;">
              {
                globalAttr.map((item) => {
                  return h(eval(`${item.type}Setter`), {
                    ...item,
                    value: props.globalConfig[item.name as keyof GlobalConfig],
                    onUpdate: (data: any) => {
                      handleGlobalAttrChange(data, item.name)
                    }
                  })
                })
              }
            </a-tab-pane>
          </a-tabs>

        </div>
      )
    }

    // 数据属性变更
    const handleDataAttrChange = (data: any, idx: number) => {
      props.activatedNodeData.attrData[idx].attributeInstanceValue = data
    }

    // 基础属性变更
    const handleCommonAttrChange = (data: any, attrKey: string, group?: string) => {
      if (group === 'basic') {
        props.activatedNodeData[attrKey] = data
      } else {
        props.activatedNodeData.style[attrKey] = data
      }
      props.graph.updateItem(props.activatedNodeData.id, {
        ...props.activatedNodeData
      });
    }

    // 全局属性变更
    const handleGlobalAttrChange = (data: any, attrKey: string) => {
      console.log('%c 🍅 data: ', 'font-size:12px;background-color: #4b4b4b;color:#fff;', data);
      // @ts-ignore
      props.globalConfig[attrKey] = data
    }

    return render
  }
})
