<!--
 * @Description: 打印机设置
 * @Author: 尚夏
 * @Date: 2024-01-27 13:41:26
 * @LastEditTime: 2024-03-11 20:08:51
 * @FilePath: /cbank-client/src/views/system/otherSystem/printerSystem.vue
-->

<template>
  <div class="table-box bg-f p-24">
    <div class="mb-24">
      <el-button type="primary" icon="Plus" @click="handleAddPrinter">新增</el-button>
      <el-button  @click="handleReceiptTemplateConfig">小票模版配置</el-button>
    </div>
    <el-table :data="printerList" class="ml10" ref="tableRef">
      <el-table-column label="序号" align="center" key="id" prop="id" />
      <el-table-column label="设备名称" align="center" key="deviceName" prop="deviceName" />
      <el-table-column label="品牌" align="center" key="manufacturerName" prop="manufacturerName" />
      <el-table-column label="设备ID(厂商提供)" align="center" key="deviceId" prop="deviceId" :show-overflow-tooltip="true" />
      <el-table-column label="使用区域" align="center" key="printNodeName" prop="printNodeName"  :show-overflow-tooltip="true" />
      <el-table-column label="最近更新时间" align="center" key="editTime" prop="editTime"  :show-overflow-tooltip="true" />
      <el-table-column label="状态" align="center" key="status" prop="status"  :show-overflow-tooltip="true">
        <template #default="scope">
          <span v-if="scope.row.status == 0">在线</span>
          <span v-else-if="scope.row.status == 1">在线缺纸</span>
          <span v-else>离线</span>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" align="center" key="deviceStatus" prop="deviceStatus" :formatter="(a,b,c,d) => c == 1 ? '是' : '否' " :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" width="180px">
        <template #default="scope">
          <div class="d-flex">
            <el-link :underline="false" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-link>
            <el-link :underline="false" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination  v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
    v-model:limit="queryParams.pageRow" @pagination="getList" />
    <PrinterModal v-if="visible" :visible="visible" @cancel="handleCancel" @success="handleSuccess" :dataSource="dataSource"/>
    <TemplateManageModal v-if="visibleTemplate" :visible="visibleTemplate" @cancel="handleCancelTemplate" @success="handleSuccessTemplate" />
  </div>
</template>

<script setup>
  import {
    getOrderPrintInPage,
    deleteOrderPrint,
  } from "@/api/system/other-system";
  import PrinterModal from './Modal/PrinterModal.vue';
  import TemplateManageModal from './Modal/TemplateManageModal.vue';
  import { onMounted, reactive, toRefs } from "vue";
  const { proxy } = getCurrentInstance();

  const dataSource = ref(null);
  const printerList = ref([]);
  const total = ref(0);
  const data = reactive({
    queryParams: {
      pageNum: 1,
      pageRow: 10,
    }
  })
  const { queryParams } = toRefs(data);

  const visible = ref(false);
  const visibleTemplate = ref(false);
  
  function getList() {
    getOrderPrintInPage(queryParams.value).then(res => {
      printerList.value = res.list;
      total.value = res.count;
    })
  }
  onMounted(() => {
    getList();
  })

  function handleAddPrinter() {
    dataSource.value = null;
    visible.value = true;
  }
  function handleReceiptTemplateConfig() {
    visibleTemplate.value = true;
  }
  function handleEdit(index, item) {
    visible.value = true;
    dataSource.value = item;
  }
  function handleDel(index, item) {
    proxy.$modal.confirm('是否删除该设备?').then(function () {
      let params = {
        idList: [item.id],
      }
      return deleteOrderPrint(params);
    }).then(() => {
      proxy.$modal.msgSuccess("操作成功");
      getList();
    }).catch(function () {
    });
  }

  function handleCancel() {
    visible.value = false;
  }
  function handleSuccess() {
    visible.value = false;
    getList()
  }

  function handleCancelTemplate() {
    visibleTemplate.value = false;
  }
  function handleSuccessTemplate() {
    visibleTemplate.value = false;
  }
</script>

<style lang="scss" scoped>
.table-box {
  border-radius: 10px;
}
</style>