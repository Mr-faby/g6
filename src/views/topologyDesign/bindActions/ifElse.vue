<template>
  <div>
    <a-tree
      :treeData="ifElseList"
      :selectable="false"
      ref="tree"
      :expandedKeys="expandedKeys"
      @expand="expandChange"
      class="tree"
    >
      <a-icon slot="switcherIcon" type="down" />
      <template #title="{ dataRef }">
        <div style="display: flex">
          <a-select
            v-model="dataRef.title"
            size="small"
            v-if="dataRef.type === 'condition'"
          >
            <a-select-option
              v-for="option in conditionList"
              :key="option.value"
              :value="option.value"
              >{{ option.label }}</a-select-option
            >
          </a-select>
          <a-dropdown v-if="dataRef.type === 'addCondition'" size="small">
            <a-menu slot="overlay" @click="addCondition($event, dataRef)">
              <a-menu-item v-for="(label, key) in EAddCondition" :key="key">
                {{ label }}
              </a-menu-item>
            </a-menu>
            <a-button size="small">
              {{ EAddCondition[dataRef.title] }} <a-icon type="down" />
            </a-button>
          </a-dropdown>
          <div class="compare" v-if="dataRef.type === 'compare'">
            <a-input
              size="small"
              class="selectVar"
              v-model="dataRef.leftVar.title.attributeName"
            >
              <template slot="addonAfter">
                <span @click="selectField(dataRef)">选择字段</span>
              </template>
            </a-input>
            <a-dropdown
              class="comparator"
              placeholder="请选择比较操作符"
              :size="'small'"
            >
              <a-menu slot="overlay">
                <a-menu-item
                  v-for="option in comparatorList"
                  :key="option"
                  @click="dataRef.comparator = option"
                >
                  {{ option }}
                </a-menu-item>
              </a-menu>
              <a-button size="small"
                >{{ dataRef.comparator }}<a-icon type="down"
              /></a-button>
            </a-dropdown>
            <a-input
              size="small"
              class="selectVar"
              v-model="dataRef.rightVar.title"
            >
            </a-input>
          </div>
          <a-popconfirm
            @confirm="deleteCondition(dataRef)"
            title="确认删除该条件?"
          >
            <a-button
              type="danger"
              icon="delete"
              size="small"
              v-if="dataRef.type !== 'addCondition' && dataRef.key !== '0'"
              style="margin-left: 10px"
            ></a-button>
          </a-popconfirm>
        </div>
      </template>
    </a-tree>
    <BindVarModal
      ref="bindVarRef"
      :value="clickRowCondition.leftVar.title"
      @change="
        ($event) => {
          clickRowCondition.leftVar.title = $event;
        }
      "
    ></BindVarModal>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Vue, Watch } from "vue-property-decorator";
import { Ecomparator, IIfElse, BindVarType, EAddCondition, NodeAttr } from "../type";
import BindVarModal from "../bindVarModal.vue";

@Component({
  components: { BindVarModal },
})
export default class IfElse extends Vue {
  @Prop({ default: () => [] }) value!: IIfElse[];
  @Prop({ default: () => [] }) attrData: NodeAttr[];
  @Prop({ default: true }) canSelectPage!: boolean;
  clickRowCondition: Record<string, any> = { leftVar: {} };

  @Watch("value", { deep: true })
  valueChange(v: IIfElse[]) {
    this.ifElseList = v;
  }

  EAddCondition = EAddCondition;

  // 初始化
  ifElseList: IIfElse[] = [];

  conditionList: any[] = [
    { label: "并且", value: "&&" },
    { label: "或者", value: "||" },
  ];

  comparatorList = Object.keys(Ecomparator);

  get flatTreeList(): IIfElse[] {
    return this.flattenTree(this.ifElseList);
  }

  get expandedKeys() {
    return this.flatTreeList.filter((it) => it.expanded).map((it) => it.key);
  }

  created() {
    this.ifElseList = this.value;
  }

  flattenTree<T extends { [x: string]: any } = any>(
    tree: T[],
    childKey = "children",
    list: T[] = []
  ): T[] {
    tree.forEach((i) => {
      list.push(i);
      if (i && i[childKey]) {
        this.flattenTree(i[childKey], childKey, list);
      }
    });
    return list;
  }

  expandChange(expandedKeys: string[], { node }: any) {
    const current = this.flatTreeList.find((it) => it.key === node.eventKey)!;
    current.expanded = !current.expanded;
  }

  addCondition(
    { key }: { key: "condition" | "unionCondition" },
    item: IIfElse
  ) {
    item.title = key;
    const parent = this.flatTreeList.find((it) => it.key === item.parentId)!;
    if (!parent) return;
    const len = parent.children?.length || 0;
    let obj: IIfElse;
    if (parent && parent.children) {
      if (this.EAddCondition[key] === "添加联合条件") {
        obj = {
          type: "condition",
          title: "&&",
          key: `${parent.key}-${len - 1}`,
          parentId: parent.key,
          expanded: true,
          children: [
            {
              type: "addCondition",
              title: "condition",
              key: `${parent.key}-${len - 1}-0`,
              parentId: `${parent.key}-${len - 1}`,
              isLeaf: true,
            },
          ],
        };
      } else {
        obj = {
          type: "compare",
          title: "compare",
          key: `${parent.key}-${len - 1}`,
          parentId: parent.key,
          leftVar: {
            type: "var",
            title: "",
          },
          comparator: "等于",
          rightVar: {
            type: "value",
            title: "",
          },
          isLeaf: true,
        };
      }
      parent.children.splice(len - 1, 0, obj); // len -1 倒数第二个
    }
    // 修改最后的id
    item.key = `${parent.key}-${len}`;
    this.$emit("change", this.ifElseList);
  }

  deleteCondition(dataRef: IIfElse) {
    const parent = this.flatTreeList.find((it) => it.key === dataRef.parentId);
    if (!parent) return;
    // 由父节点删除当前节点
    if (
      (!dataRef.children?.length || dataRef.children.length === 1) &&
      parent.children
    ) {
      // 没有子节点可以直接删
      const index = parent.children.findIndex((it) => it.key === dataRef.key);
      parent.children.splice(index, 1);
    } else if (dataRef.children!.length >= 2) {
      this.$message.warning("请先删除当前条件下子条件!");
    }
    this.$emit("change", this.ifElseList);
  }

  varChange(val: BindVarType, dataRef: IIfElse, key: "leftVar" | "rightVar") {
    dataRef[key] = val;
  }

  selectField(row: IIfElse) {
    this.clickRowCondition = row;
    setTimeout(() => {
      (this.$refs.bindVarRef as any).show(this.attrData);
    }, 0);
  }
}
</script>

<style scoped lang="less">
.tree {
  max-height: 300px;
  overflow-y: auto;
}
.tree :deep(li .ant-tree-node-content-wrapper):hover {
  background-color: unset;
}
.tree :deep(li ul) {
  border-left: 1px #999 solid;
  margin-left: 12px;
}
.compare {
  display: flex;
  .comparator {
    width: 100px;
    margin: 0 10px;
  }
  .selectVar {
    width: 180px;
  }
}
</style>
