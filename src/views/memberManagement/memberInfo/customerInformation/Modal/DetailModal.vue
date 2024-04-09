<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-19 17:00:25
 * @LastEditTime: 2024-02-19 21:05:56
 * @FilePath: /cbank-client/src/views/memberManagement/memberInfo/customerInformation/Modal/DetailModal.vue
-->

<template>
  <el-dialog :title="title" :model-value="visible" width="1300px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <div class="header fw-500">
      <span>流水号：2024020415263254</span>
      <span>入客时间：2024-02-04 10:00:00</span>
      <span>买单时间：2024-02-04 10:00:00</span>
      <span>清扫时间：2024-02-04 10:00:00</span>
    </div>
    <div class="mb-14">
      <div class="fw-500">账单信息</div>
      <div class="header">
        <span>订房人：小溪</span>
        <span>订房部门：酒水部</span>
        <span>客人姓名：李四</span>
        <span>客人手机号：15326748541</span>
        <span>菜品消费：¥2000</span>
        <span>低消：¥200</span>
        <span>房台标签：</span>
      </div>
    </div>
    <div class="fw-500 mb-14">账单明细</div>
    <el-table :data="detailList" class="ml10" ref="tableRef">
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="品名" align="center" key="templateName" prop="templateName" :show-overflow-tooltip="true" />
      <el-table-column label="单位" align="center" key="manufacturerName" prop="manufacturerName" :show-overflow-tooltip="true" />
      <el-table-column label="价格" align="center" key="notes" prop="notes" :show-overflow-tooltip="true" />
      <el-table-column label="数量" align="center" key="editTime" prop="editTime" :show-overflow-tooltip="true" />
      <el-table-column label="金额" align="center" key="editTime" prop="editTime" :show-overflow-tooltip="true" />
      <el-table-column label="口味" align="center" key="editTime" prop="editTime" :show-overflow-tooltip="true" />
      <el-table-column label="是否赠送" align="center" key="editTime" prop="editTime" :show-overflow-tooltip="true" />
      <el-table-column label="赠送人" align="center" key="editTime" prop="editTime" :show-overflow-tooltip="true" />
      <el-table-column label="状态" align="center" key="editTime" prop="editTime" :show-overflow-tooltip="true" />
      <el-table-column label="点菜人" align="center" key="editTime" prop="editTime" :show-overflow-tooltip="true" />
      <el-table-column label="点菜时间" align="center" key="editTime" prop="editTime" :show-overflow-tooltip="true" />
      <el-table-column label="折扣" align="center" key="editTime" prop="editTime" :show-overflow-tooltip="true" />
      <el-table-column label="打折人" align="center" key="editTime" prop="editTime" :show-overflow-tooltip="true" />
      <el-table-column label="出品时间" align="center" key="editTime" prop="editTime" :show-overflow-tooltip="true" />
      <el-table-column label="低消" align="center" key="editTime" prop="editTime" :show-overflow-tooltip="true" />
      <el-table-column label="签收状态" align="center" key="editTime" prop="editTime" :show-overflow-tooltip="true" />
      <el-table-column label="付款状态" align="center" key="editTime" prop="editTime" :show-overflow-tooltip="true" />
    </el-table>
  </el-dialog>
</template>

<script setup>
  const { proxy } = getCurrentInstance();
  const title = ref('V888明细');
  const emit = defineEmits([ 'cancel', 'success']);

  const detailList = ref([]);
  const props = defineProps({
    visible: {
      type: Boolean,
      required: true,
      default: false,
    },
    dataSource: {
      type: Object,
      default: null,
    },
  });

  const { visible, dataSource }  = toRefs(props);

  function handleBeforeClose() {
    emit('cancel');
  }

</script>

<style lang="scss" scoped>
  .header {
    display: flex;
    > span {
      margin-right: 24px;
      margin-bottom: 24px;
    }
  }
</style>