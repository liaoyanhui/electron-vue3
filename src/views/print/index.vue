<!--
 * @Description: 
 * @Author: pgm
 * @Date: 2024-03-12 23:25:56
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-13 23:26:38
 * @FilePath: /cbank-client/src/views/print/index.vue
-->

<template>
  <div class="print-page">
    <div class="content">
      <div class="title text-center color-333 fw-500 fs-20">皇家公馆</div>
      <div class="my-4 px-30">V01 转V10</div>
      <el-row class="border-b pb-12 px-30 fs-12">
        <el-col :span="12"> <span>房台号：</span>{{ roomInfo.roomName }} </el-col>
        <el-col :span="12"><span>账单号：</span><span>{{ infoData.billNumber }}</span></el-col>
        <el-col :span="12"><span>房台类型：</span><span>{{ roomInfo.typeName }}</span></el-col>
        <el-col :span="12"><span>包厢管理员：</span><span>{{ roomInfo.manageUserName }}</span></el-col>
        <el-col :span="12"><span>最低消费：</span><span>{{ roomInfo.minConsumption }}</span></el-col>
        <el-col :span="12"><span>房差：</span><span>{{ infoData.lowConsumptionDifference }}</span></el-col>
        <el-col :span="24"><span>开台时间：</span><span>{{ infoData.openTime }}</span></el-col>
        <el-col :span="24"><span>打单时间：</span><span>{{ dayjs().format('YYYY/MM/DD HH:mm') }}</span></el-col>
        <el-col :span="12"><span>开台时长：</span><span>{{ infoData.diffDate }}</span></el-col>
        <el-col :span="12"><span>收银员：</span><span>{{ roomInfo.nickname }}</span></el-col>
        <!-- <el-col :span="12"><span>担保人：</span><span>Todo{{ status.typeName }}</span></el-col> -->
        <el-col :span="12"><span>订房人：</span><span>{{ infoData.reservationName }}</span></el-col>
        <el-col :span="12"><span>客户名称： </span><span>{{ roomInfo.custName }}</span></el-col>
      </el-row>
      <div class="text-center py-10 fs-14 line-1">商品消费信息</div>
      <el-table :data="productList">
        <el-table-column label="品名" align="center" prop="goodsName"  />
        <el-table-column label="单位" align="center" prop="goodsUnit" width="50" />
        <el-table-column label="数量" align="center" prop="goodsNumber" width="50">
          <template #default="scope">
            <div>{{ scope.row.goodsNumber - scope.row.backGoodsNum }}</div>
          </template>
        </el-table-column>
        <el-table-column label="单价(￥)" align="center" prop="goodsAmount" width="70"
          :formatter="(row) => fenToYuan(row.sumAmount)" />
        <el-table-column label="总金额(￥)" align="center" prop="sumAmount" width="80"
          :formatter="(row) => fenToYuan(row.sumAmount)">
          <template #default="scope">
            <div>{{ fenToYuan((scope.row.goodsNumber - scope.row.backGoodsNum) * scope.row.goodsAmount) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="-" align="center" prop="giveUserName" width="70">

          <template #default="scope">
            <div>{{ scope.row.giveUserName  || '暂无'}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="border-b mt-12"></div>
      <div class="d-flex jc-between w100 px-30 fs-12 al-center pt-10">
        <div>
          <div><span class="label">落单金额：</span>￥{{ fenToYuan(infoData.settledAmount) }}</div>
          <div><span class="label">赠送：</span>￥{{ fenToYuan(infoData.giftAmount) }}</div>
          <div><span class="label">应收：</span>￥{{ fenToYuan(infoData.payableAmount) }}</div>
        </div>
        <div class="fs-16">实收：￥{{ fenToYuan(infoData.settledAmount-infoData.giftAmount)}}</div>
      </div>
    </div>

    <!-- <div>{{ roomId }}{{ consumeHistoryId }}{{isMerge  }}{{isShowCheckout  }}</div> -->

  </div>
</template>

<script setup>
import {ref,computed,watchEffect} from 'vue'
import { useRoute } from 'vue-router';
import { settlementInfo, getPackageList, consumptionSummary, getRoomReserveInfo,getMergePackageList } from '@/api/cbank'
import { useRoomSystemStore } from '@/store/system'
import dayjs from 'dayjs'
import { fenToYuan } from '@/utils'
import { lGet } from '@/utils/storage';
const roomSystemStore = useRoomSystemStore()
const route = useRoute()
const roomInfo = ref({})
const infoData = ref({})
const productList = ref([])
let { roomId, consumeHistoryId, isMerge = 0, isShowCheckout = 0 } = route.query
console.log('roomId', "consumeHistoryId", roomId, consumeHistoryId, isMerge, isShowCheckout)

//房间状态
const status = computed(() => {
  let obj = roomSystemStore.roomSystemStatusColorList.find(item => item.type == infoData.value.useStatus)
  return obj || {}
})

watchEffect(() => {
  let targetTime = infoData.value.openTime
  if (targetTime) {
    const now = new Date();
    const diff = now.getTime() - new Date(targetTime).getTime()
    const diffInSecs = Math.floor(diff / 1000);
    const hours = Math.floor(diffInSecs / 3600);
    const minutes = hours * 60 + Math.floor((diffInSecs % 3600) / 60);
    infoData.value.diffDate = `${minutes}分钟`
  }
  return {}
})
const getRoomInfo = () => {
  let nickname = lGet('nickname')
  getRoomReserveInfo({ roomId }).then(res => {
    roomInfo.value = res
    roomInfo.value.nickname = nickname
  }) 
}

const getSettlementInfo = () => {
  return settlementInfo({ roomId, isMerge, isShowCheckout }).then(res => {
    infoData.value = res
    infoData.value.actualAmountReceived = res.payableAmount
  })
}
const getOrderList = () => {
  let func = getPackageList //isMerge =0： 消费明细列表 ；isMerge=1： 并台消费列表
  let params = { roomId, isMerge,isShowCheckout }
  if (isMerge == 1) {
    func = getMergePackageList
  }
  if (isMerge == 2) { //isMerge = 2： 消费汇总列表
    func = consumptionSummary
    params = { consumeHistoryId }
  }
  func(params).then(res => {
    productList.value = res
  })
}
onBeforeMount( () => {
  init()
})

const init = async () => {
  let res1 = getSettlementInfo()
  let res2 = getOrderList()
  let res3 = getRoomInfo()
  let res4 = roomSystemStore.ajaxRoomSystemStatusColorList()
  try {
    
    await Promise.all([res1, res2, res3, res4])
    // setTimeout(() => {
    //   console.log('aaa', window.mainApi?.ipcRenderer)
    // },2000)

  } catch (e) {

  }
}





</script>

<style lang="scss">
.print-page {
  width: 400px;
  background: #fff;
  color: #000 !important;
  line-height: 1.8;
  font-size: 12px;s
  .border-b {
    border-bottom-style: dashed !important;
  }

  .content {
   
    margin: 0 auto;
    padding: 15px 0;
  }

  .el-table {
    background: #fff;
    background-color: #fff;
    .cell{
      padding:0 0;
    }
    .el-table__header-wrapper th,
    .el-table .el-table__fixed-header-wrapper th {
      background-color: #fff !important;
      color: #000;
    }

    .el-table__cell {
      background-color: #fff !important;
      color: #000;
      border-bottom: none !important;
      font-size:12px;
      padding: 0;
    }

    .el-table__inner-wrapper::before {
      display: none;
    }
    .el-table__header-wrapper th{
      height:30px!important;
    }
  }
}
</style>