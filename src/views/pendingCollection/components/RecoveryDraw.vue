<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-03-04 17:26:59
 * @LastEditTime: 2024-03-16 21:25:35
 * @FilePath: /cbank-client/src/views/pendingCollection/components/RecoveryDraw.vue
-->

<template>
  <el-drawer v-model="drawer" title="详情" direction="rtl" :show-close="false" :before-close="handleClose" size="38%">
    <div class="detail">
      <div class="title">回收信息</div>
      <el-row>
        <el-col :span="12">挂账责任人：{{ dataSource.creditUserName }}</el-col>
        <el-col :span="12">回收时间：{{ dataSource.editTime }}</el-col>
        <el-col :span="12">回收账单号：<span class="color-red">{{ dataSource.billNumber }}</span> </el-col>
        <el-col :span="12">回收操作人：{{ dataSource.creditUserName }}</el-col>
        <el-col :span="12">挂账金额：￥{{ fenToYuan(dataSource.creditAmount) }}</el-col>
        <el-col :span="12">实付金额：￥{{fenToYuan(dataSource.actualAmountReceived) }}</el-col>
        <!-- <el-col :span="12">结账账单号：<span class="color-red">TOdo</span></el-col>
        <el-col :span="12">应付金额：{{ dataSource.payableAmount }}</el-col> -->
        <el-col :span="12" v-for="item in dataSource.paymentInfo" :key="item.id">
              {{item.payName}}：¥{{ fenToYuan(item.amount) }}
            </el-col >
        <el-col :span="24">备注：{{ dataSource.remarks }}</el-col>
      </el-row>

      <div class="title">账单信息</div>
      <el-tabs v-model="activeName" @tab-change="tabChange">
        <el-tab-pane :label="item" :name="item" v-for="item in dataSource.orderList " :key="item" >
          <el-row>
            <el-col :span="12">开包时间：{{ tabData.openRoomTime }}</el-col>
            <el-col :span="12">挂账时间：{{ tabData.addTime }}</el-col>
            <el-col :span="12">包厢名称：{{ tabData.roomName }}</el-col>
            <el-col :span="12">客人： {{ tabData.custName }}</el-col>
            <el-col :span="12">挂账操作人：{{ tabData.operationUserName }}</el-col>
            <el-col :span="12">应付金额： ￥{{ fenToYuan(tabData.payableAmount) }}</el-col>
            <el-col :span="12" v-for="item in tabData.paymentMethod" :key="item.id">
              {{item.payName}}：¥{{ fenToYuan(item.amount) }}
            </el-col >
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-drawer>
</template>

<script setup>

import { getCreditInfo } from '@/api/pendingCollection'
import { fenToYuan } from '@/utils';
import { computed, reactive, watch, watchEffect } from 'vue';
const props = defineProps({
  drawer: {
    type: Boolean,
    require: true,
    default: false
  },
  dataSource: {
    type: Object,
    default: null,
  }
})
const emit = defineEmits(['cancel', 'success']);
const { drawer, dataSource } = toRefs(props);
const activeName = ref('');
const tabData = ref({})
watch(() => drawer.value, (val) => {
  if (val) {
    let billNumber =dataSource.value?.orderList?.length > 0 ? dataSource.value.orderList[0] : ''
    activeName.value = billNumber
    getTabData(billNumber)
  }
})

function tabChange(billNumber) {
  getTabData(billNumber)
}


const getTabData = (billNumber) => {
  getCreditInfo({ billNumber }).then(res => {
    let paymentMethod = res.paymentMethod ? JSON.parse(res.paymentMethod) :[]
    tabData.value = {...res,paymentMethod}
  })
}
function handleClose() {
  activeName.value =''
  emit('cancel')
}


</script>

<style lang="scss" scoped>
.title {
  border-left: 4px solid #2AD1B7;
  padding-left: 10px;
  margin-bottom: 15px;
}

.detail {
  overflow: auto;
}

.el-row {
  .el-col {
    margin-bottom: 15px;
  }
}
</style>