export type DesignComponent = {
  controlId: string
  controlName: string
  controlIcon: string
  controlShape: string
  attrData?: NodeAttr[]
  layerType: string
  tooltip?: string
}

export type NodeAttr = {
  attributeName: string
  dataName: SetterType
  attributeInstanceValue: string | Action[]
  attributeDefaultValue: string
  attributeInstanceId: string
  attributeId: string
}

export type SetterType =
  | 'input'
  | 'select'
  | 'number'
  | 'handler'
  | 'checkbox'
  | 'radio'
  | 'textarea'

export class Action {
  actionName = ''
  actionType = ''
  actionValue = ''
  actionCurrVal = ''
  actionCheckValRule!: IIfElse[]
}

export enum Ecomparator {
  '包含' = '包含',
  '不包含' = '不包含',
  '为空' = '为空',
  '不为空' = '不为空',
  '开始于' = '开始于',
  '结束于' = '结束于',
  '等于' = '等于',
  '不等于' = '不等于',
  '小于' = '小于',
  '大于' = '大于',
  '大于等于' = '大于等于',
  '小于等于' = '小于等于'
}

export type BindVarType = {
  type: string
  title: any
  variable?: string
  loopIndex?: number
  version?: string
  varType?: string
}

export type ActionValue = {
  title: string
  name: string
  value: any
  ifElseList?: IIfElse[]
  needIfElse?: boolean
  errorMessage?: string
  nativeActionType?: string
  isCrossEnd?: boolean
}

export interface IIfElse {
  type: 'condition' | 'compare' | 'addCondition' // 条件类型  condition = 条件关系 compare=条件比对 addCondition添加条件
  title: string // && = 并且  || = 或者
  key: string
  parentId: string
  expanded?: boolean
  isLeaf?: boolean
  leftVar?: BindVarType
  rightVar?: BindVarType
  comparator?: string
  children?: IIfElse[]
}

export enum EAddCondition {
  'condition' = '添加条件',
  'unionCondition' = '添加联合条件'
}

export enum Ecalculation {
  '大于等于' = '>=',
  '小于等于' = '<=',
  '等于' = '===',
  '小于' = '<',
  '大于' = '>',
  '不等于' = '!=='
}

export class GlobalConfig {
  unlinkOpacity = 50 // 失活透明度
  defaultHighlightNodeId = '' // 高亮链路节点ID
  alarmColorOne = '#FF4500' // 一级告警色
  alarmColorTwo = '#800080' // 二级告警色
  alarmColorThree = '#A52A2A' // 三级告警色
  alarmColorFour = '#FFA500' // 四级告警色
  alarmColorFive = '#FFFF00' // 五级告警色
  layerLabelColor = '#FF0000' // 层级文本颜色
  layerLabelSize = '15' // 层级文本字号
  layerOneHeight = 25 // 层级一高度百分比
  layerTwoHeight = 25 // 层级二高度百分比
  layerThreeHeight = 25 // 层级三高度百分比
  layerFourHeight = 25 // 层级四高度百分比
}
