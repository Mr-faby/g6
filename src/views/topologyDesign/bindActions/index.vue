<template>
  <div class="bind-actions">
    <a-modal
      title="绑定动作"
      width="900px"
      :maskClosable="false"
      v-model="visible"
    >
      <IfElse :value="actionData.actionCheckValRule" :attrData="attrData"></IfElse>
      <a-row
        type="flex"
        :gutter="8"
        style="min-height: 400px; margin-top: 10px"
      >
        <a-col :span="6">
          <p><b style="color: #999">响应动作</b></p>
          <div class="action-select">
            <ul class="action-type-select">
              <li
                v-for="i in actionTypes"
                :key="i.actionType"
                :class="{
                  active: i.actionType === actionData.actionType,
                }"
                @click="selectHandler(i)"
              >
                {{ i.actionName }}
                <div class="check-icon">
                  <a-icon class="icon" type="check" />
                </div>
              </li>
            </ul>
          </div>
        </a-col>
        <a-col :span="18">
          <p><b style="color: #999">动作面板</b></p>
          <div class="component-wrapper" v-show="actionData.actionType">
            <a-input v-model="actionData.actionValue"></a-input>
          </div>
        </a-col>
      </a-row>
      <div slot="footer">
        <a-button @click="visible = false">取消</a-button>
        <a-button type="primary" @click="confirm">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import IfElse from "./ifElse.vue";
import { Action, NodeAttr, IIfElse } from "../type";

type ActionType = {
  actionType?: string;
  actionName?: string;
};

@Component({
  components: { IfElse },
})
export default class BindActions extends Vue {
  @Prop({ default: () => [] }) attrData: NodeAttr[];
  visible = false;
  edit = false;
  actionTypes: ActionType[] = [
    {
      actionType: "fill",
      actionName: "节点背景色",
    },
    {
      actionType: "icon",
      actionName: "节点图标",
    },
    {
      actionType: "alert",
      actionName: "消息提示",
    },
  ];
  actionData: Action = new Action();

  initData() {
    this.actionData = new Action();
    this.actionData.actionCheckValRule = this.initDefaultCondition();
    this.edit = false;
  }

  initDefaultCondition(): IIfElse[] {
    return [
      {
        type: "condition", // 条件类型
        title: "&&", // 值：and = 并且  or = 或者
        key: "0",
        parentId: "",
        expanded: true,
        children: [
          {
            type: "addCondition", // 添加条件类型
            title: "condition", // 值：unionCondition = 联合类型  condition = 条件类型
            key: "0-1",
            parentId: "0",
            isLeaf: true,
          },
        ],
      },
    ];
  }

  selectHandler(item: ActionType) {
    Object.assign(this.actionData, item);
  }

  confirm() {
    this.visible = false;
    this.$emit("change", this.edit, this.actionData);
  }

  show(actionData?: Action) {
    console.log('%c 🍖 actionData: ', 'font-size:12px;background-color: #FCA650;color:#fff;', actionData);
    this.initData();
    this.visible = true;
    if (!actionData) return;
    this.edit = true;
    this.actionData = JSON.parse(JSON.stringify(actionData));
  }
}
</script>

<style lang="less" scoped>
.action-select {
  height: calc(100% - 35px);
  padding: 12px 0;
  min-height: 400px;
  //border: 1px solid rgba(31, 56, 88, 0.3);
  border-radius: 8px;
  background: #f2f2f2;
  .action-type-select {
    li {
      color: #797979;
      &.active {
        background: #999ead;
        color: #fff;
      }
    }
  }
}
.component-wrapper {
  padding: 12px 16px;
  height: calc(100% - 35px);
  color: #999;
  background: #f9f9f9;
  border-radius: 4px;
}
ul {
  padding-left: 0;
  li {
    height: 36px;
    line-height: 36px;
    padding: 0 30px 0 12px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &.active {
      //background: rgba(31, 56, 88, 0.06);
      .check-icon {
        display: block;
      }
    }
    .check-icon {
      display: none;
      position: absolute;
      right: 12px;
      top: 0;
      height: 28px;
    }
  }
}

.condition {
  overflow: auto;
  &::-webkit-scrollbar {
    width: 5px;
  }
}
</style>
