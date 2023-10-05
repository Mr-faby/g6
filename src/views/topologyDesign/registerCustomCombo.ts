import G6 from '@antv/g6';
import type { Item } from '@antv/g6';
import { clone, mix, isNumber } from '@antv/util';

// 注册自定义 Combo
export const registerCustomCombo = () => {
G6.registerCombo(
'customCombo',
{
drawShape: function drawShape(cfg, group) {
console.log('%c 🍯 cfg: ', 'font-size:12px;background-color: #33A5FF;color:#fff;', cfg);
const self = this;
// 获取样式配置，style.width 与 style.height 对应 rect Combo 位置说明图中的 width 与 height
const style = self.getShapeStyle(cfg);
// 绘制一个矩形作为 keyShape，与 'rect' Combo 的 keyShape 一致
const rect = group?.addShape('rect', {
attrs: {
...style
},
name: 'combo-keyShape'
});
group?.addShape('text', {
attrs: {
text: cfg?.labelName,
fill: cfg?.layerLabelColor as string
},
name: 'layerLabel'
});

return rect;
},
update(cfg: any, item: Item) {
let padding: number | number[] = cfg.padding || this.options.padding;
if (isNumber(padding)) padding = [padding, padding, padding, padding];
const cfgStyle = clone(cfg.style);
let width, height;
let { fixSize } = cfg;
if (!fixSize) fixSize = [0, 0];
width = fixSize[0];
height = fixSize[1];
cfgStyle.width = width;
cfgStyle.height = height;
// 下面这些属性需要覆盖默认样式与目前样式，但若在 cfg 中有指定则应该被 cfg 的相应配置覆盖。
const strokeStyle = {
stroke: cfg.gridShow && fixSize[0] ? '#fff' : 'none',
x: -width / 2,
y: -height / 2
};
// 与 getShapeStyle 不同在于，update 时需要获取到当前的 style 进行融合。即新传入的配置项中没有涉及的属性，保留当前的配置。
const keyShape = item.get('keyShape');
const style = mix({}, keyShape.attr(), strokeStyle, cfgStyle); (this as any).updateShape(cfg, item, style, false);

// 缩放时更新label位置
const textShape = item.get('group').find((e) => e.get('name') === 'layerLabel');
textShape.attr('x', -width / 2 + 15);
textShape.attr('fontSize', cfg.layerLabelSize);
textShape.attr('fill', cfg.gridShow && fixSize[0] ? cfg.layerLabelColor : 'none');
}
},
'rect'
);
};
