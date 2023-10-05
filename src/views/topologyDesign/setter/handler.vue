<template>
  <div>
    <a-card
      size="small"
      title="动作"
      :bodyStyle="{ paddingTop: 0, paddingBottom: 0 }"
      style="margin: 8px 0"
    >
      <div
        v-for="(item, index) in events"
        :key="item.actionName + index"
        class="fs-drag-box"
      >
        <div class="item-title" v-html="item.actionName" />
        <div class="icon-box-right" v-if="!readonlyBol">
          <a-icon
            slot="actions"
            type="setting"
            @click="bindActions(item, index)"
          />
          <a-icon slot="actions" type="delete" @click="delActions(index)" />
        </div>
      </div>
    </a-card>
    <a-button type="primary" block @click="bindActions(null)" v-if="!readonlyBol"
      >绑定动作</a-button
    >
    <bindActions
      ref="actionsRef"
      :attrData="attrData"
      @change="setActionsData"
    ></bindActions>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Prop, Vue, Watch } from "vue-property-decorator";
import { Action, NodeAttr } from "../type";
import BindActions from "../bindActions/index.vue";
@Component({
  components: { BindActions },
})
export default class HandlerSetter extends Vue {
  @Prop({ default: () => [] }) value: Action[];
  @Prop({ default: () => [] }) attrData: NodeAttr[];
  @Prop({ default: false }) readonlyBol: boolean;
  editIndex: number;

  @Watch('readonlyBol')
  changes(){
    console.log(this.readonlyBol)
  }

  get events() {
    return JSON.parse(JSON.stringify(this.value));
  }

  bindActions(action?: Action, index?: number) {
    (this.$refs.actionsRef as any).show(action);
    this.editIndex = index;
  }

  setActionsData(isEdit: boolean, data: Action) {
    if (!isEdit) {
      // 新增
      this.events.push(data);
    } else {
      // 编辑
      this.$set(this.events, this.editIndex, data);
    }
    this.$emit("change", this.events);
  }

  delActions(index: number) {
    this.events.splice(index, 1);
    this.$emit("change", this.events);
  }
}
</script>

<style lang="less" scoped>
.fs-drag-box {
  padding: 8px 0;
  display: flex;
  align-items: center;
  .item-title {
    flex: 1 1 auto;
    width: 0;
    font-size: 12px;
    /deep/ div {
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .icon-box-right {
    margin-left: 40px;
    cursor: pointer;
    i {
      padding: 0 8px;
      &:first-child {
        border-right: 1px solid #e8e8e8;
      }
    }
  }
}
.action-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover .copy-btn {
    display: inline-block;
  }
  .copy-btn {
    display: none;
  }
}
</style>
