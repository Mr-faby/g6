<template>
  <a-modal :visible="visible" @cancel="visible = false" :footer="null">
    <a-table
      :columns="columns"
      :loading="loading"
      :dataSource="dataSource"
    ></a-table>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getInterfaceListByData } from "@/traditional/api/topologicalGraph";
import { NodeAttr } from "./type";

@Component
export default class DetailModal extends Vue {
  visible = false;
  loading = false;
  dataSource: Record<string, any> = [];
  columns = [
    {
      title: "名称",
      dataIndex: "interfaceName",
      key: "interfaceName",
    },
    {
      title: "地址",
      dataIndex: "ipAddress",
      key: "ipAddress",
    },
    {
      title: "端口",
      dataIndex: "portNum",
      key: "portNum",
    },
    {
      title: "协议",
      dataIndex: "httpProtocolName",
      key: "httpProtocolName",
    },
    {
      title: "状态",
      dataIndex: "interfaceStatusName",
      key: "interfaceStatusName",
    },
  ];

  async show(attrData: NodeAttr[]) {
    this.visible = true;
    this.loading = true;
    // 这里有点奇葩，后端每个属性有一个归属的id，根据这个归属id去找这个属性实例
    const projectIdRelatedAttrId = '04f9e4bf469c49618d11345a07944629'
    const ipAddressRelatedAttrId = '49eae81e689a4addbc9bda2044f265c5'
    const portNumRelatedAttrId = '85cbd376ffca441295ef3bd79b87eca5'
    const { attributeInstanceValue: projectId } = attrData.find(item => item.attributeId === projectIdRelatedAttrId) || {}
    const { attributeInstanceValue: ipAddress } = attrData.find(item => item.attributeId === ipAddressRelatedAttrId) || {}
    const { attributeInstanceValue: portNum } = attrData.find(item => item.attributeId === portNumRelatedAttrId) || {}
    const res = await getInterfaceListByData({
      projectId,
      ipAddress,
      portNum,
      pageIndex: 0,
      pageSize: 0,
    });
    this.dataSource = res?.data || [];
    this.loading = false;
  }

  confirm() {
    this.visible = false;
  }
}
</script>
