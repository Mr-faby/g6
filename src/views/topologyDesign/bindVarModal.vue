<template>
  <a-modal v-model="visible" title="选择字段" width="800px" :zIndex="2001">
    <a-row type="flex" :gutter="8">
      <a-col :span="24">
        <div class="wrapper">
          <a-row type="flex" style="height: 100%">
            <a-col :span="8" style="height: 100%; overflow: auto">
              <ul>
                <li
                  v-for="i in formFieldList"
                  :key="i.attributeInstanceId"
                  @click="selectedItem = i"
                  :class="selectedItem.attributeInstanceId === i.attributeInstanceId ? 'active' : ''"
                >
                  {{ i.attributeName }}
                  <div class="check-icon">
                    <a-icon class="icon" type="check" />
                  </div>
                </li>
              </ul>
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>
    <div slot="footer">
      <a-button @click="visible = false">取消</a-button>
      <!-- <a-button :disabled="!selectedItem" type="dashed" @click="unbind">解除绑定</a-button> -->
      <a-button :disabled="!selectedItem.attributeInstanceId" type="primary" @click="confirm"
        >确定</a-button
      >
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component({
  components: {},
})
export default class BindVarModal extends Vue {
  @Prop() value: Record<string, any>;
  formFieldList: Record<string, any>[] = [];
  visible = false;
  selectedItem: Record<string, any> = {};

  show(data: Record<string, any>[]) {
    console.log('%c 🥧 data: ', 'font-size:12px;background-color: #33A5FF;color:#fff;', data);
    this.formFieldList = data;
    this.selectedItem = {};
    this.selectedItem = this.value;
    this.visible = true;
  }

  selectItem(item: any) {
    this.selectedItem = item;
  }

  confirm() {
    this.visible = false;
    console.log(
      "%c 🍵 selectedItem: ",
      "font-size:12px;background-color: #F5CE50;color:#fff;",
      this.selectedItem
    );
    this.$emit("change", this.selectedItem);
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  padding: 12px 0;
  height: 400px;
  //border: 1px solid rgba(31, 56, 88, 0.3);
  border-radius: 8px;
  background: #f2f2f2;
}
.right-ul {
  li {
    color: rgba(153, 153, 153, 1);
    &.active {
      font-weight: bold;
      background: #fff;
      color: #000;
      .check-icon {
        color: #ff0042;
      }
    }
  }
}
ul {
  padding-left: 0;
  li {
    height: 40px;
    line-height: 40px;
    padding: 0 30px 0 12px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: rgba(121, 121, 121, 1);
    &.active {
      border-radius: 4px;
      background: rgba(153, 158, 173, 1);
      color: #fff;
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
</style>
