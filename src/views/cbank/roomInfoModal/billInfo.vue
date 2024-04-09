<!--
 * @Description: 
 * @Author: pgm
 * @Date: 2024-03-02 20:40:02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-15 22:27:55
 * @FilePath: /cbank-client/src/views/cbank/roomInfoModal/billInfo.vue
-->

<template>
    <div class="empty w100 text-center mt-50" v-if="!roomInfo.consumeHistoryId">
      <img src="../../../assets/img/cbank/empty/暂无账单信息@2x.png" />
      <div class="mt-16">暂无账单信息！</div>
    </div>
    <div v-else>
      <el-row class="row">
      <el-col :span="8"><span class="label">主账单号：</span>{{ infoData.billNumber || '-' }}</el-col>
      <el-col :span="8"><span class="label">开台时间：</span>{{ infoData.openTime || '-'}}</el-col>
      <el-col :span="8"><span class="label">计时：</span>{{ infoData.diffDate}}</el-col>
      <el-col :span="8"><span class="label">低消：</span>{{ formatAmount(infoData.minConsumption)}}</el-col>
      <el-col :span="8"><span class="label">差低消：</span>{{ formatAmount(infoData.lowConsumptionDifference)}}</el-col>
      <el-col :span="8"><span class="label">入低消：</span>{{ formatAmount(infoData.useLowConsumption )}}</el-col>
      <el-col :span="8"><span class="label">赠送金额：</span>{{ formatAmount(infoData.giftAmount)}}</el-col>
      <el-col :span="8"><span class="label">退单金额：</span>{{ formatAmount(infoData.refundAmount)}}</el-col>
      <el-col :span="8"><span class="label">合计金额：</span><span class="color-red">{{ formatAmount(infoData.settledAmount )}}</span></el-col>
    </el-row>
    <el-checkbox v-model="queryParams.isShowCheckout" :true-label="0" :false-label="1" label="隐藏已结账菜品" size="large"
      class="py-24" @change="() => { getOrderList(); getSettlementInfo() }" />
    <el-table :data="productList" :row-class-name="tableRowClassName" v-loading="tableLoaing" width="100%">
      <el-table-column label="" align="center" fixed="left" prop="addTime" width="40">
        <template #default="scope">
          <div class="radius-4 fs-14 span" :class="tableRowClassName(scope)">{{ statusDiv(scope.row) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="落单时间" align="center" fixed="left" prop="addTime" width="90" :formatter="formatTime"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="房台" v-if="queryParams.isMerge == 1" align="center" fixed="left" prop="roomName"
        :show-overflow-tooltip="true" />
      <el-table-column label="菜品名称" align="center" fixed="left" prop="goodsName" 
        :show-overflow-tooltip="true" />
      <el-table-column label="数量" align="center" fixed="left" prop="goodsNumber">

        <template #default="scope">
          <div>{{ scope.row.goodsNumber }} <span class="color-red" v-if="scope.row.backGoodsNum > 0">({{
        scope.row.backGoodsNum }})</span></div>
        </template>
      </el-table-column>
      <el-table-column label="单位" align="center" prop="goodsUnit" :show-overflow-tooltip="true" />
      <el-table-column label="单价(￥)" align="center" prop="goodsAmount"  :formatter="(row) => fenToYuan(row.goodsAmount)" />
      <el-table-column label="总金额(￥)" align="center" prop="sumAmount"
        :formatter="(row) => fenToYuan(row.sumAmount)" />
      <el-table-column label="点单人" aslign="center" prop="placeOrderUserName" />
      <el-table-column label="赠送人" align="center" prop="giveUserName" />
    </el-table>
    </div>


</template>

<script setup>
import { onMounted, ref } from 'vue'

import { settlementInfo, getPackageList, cancellationRoomCost, bindingPackage, backGoods, updateUnitPrice, completionMinConsume, completionMinConsumeCost, consumptionSummary, getMergePackageList } from '@/api/cbank'
import dayjs from 'dayjs'
import { fenToYuan } from '@/utils'
const props = defineProps({
  roomInfo: {
    type: Object,
    require: true,
  }
})
const infoData = ref({
  deductionAmount: 0,
  paymentAmount: 0,
  reservationCollectedAmount: 0
})
const queryParams = ref({
  isShowCheckout: 0,
  isMerge: 0
})
const productList = ref([])

const tableLoaing = ref(false)



watchEffect(() => {
  let targetTime = infoData.value.openTime
  if (targetTime) {
    const now = new Date();
    const diff = now.getTime() - new Date(targetTime).getTime()
    const diffInSecs = Math.floor(diff / 1000);
    const hours = Math.floor(diffInSecs / 3600);
    const minutes = hours * 60 + Math.floor((diffInSecs % 3600) / 60);
    infoData.value.diffDate = `${minutes}分钟`
  } else {
    infoData.value.diffDate = '-'
  }
  return {}
})


const tableRowClassName = ({
  row,
}) => {
  if (row.backGoodsNum > 0) {
    return 'red-row'
  } else {
    if (row.type == 1 || row.type == 2) {
      return 'warning-row'
    } else if (row.type == 3 || row.type == 8) {
      return 'green-row'
    }
  }
  return ''
}

const statusDiv = (row) => {
  if (row.backGoodsNum > 0) {
    return '退'
  } else {
    if (row.type == 1 || row.type == 2) {
      return '套'
    } else if (row.type == 3 || row.type == 8) {
      return '赠'
    }
  }
}

const formatTime = (row) => {
  let time = row?.addTime || row
  return dayjs(time).format('HH:mm')
}

const formatAmount = (amount) => {

  if (amount>=0) {
    return '￥' + fenToYuan(amount)
  } else {
    return '-'
  }
  
  
}

const getSettlementInfo = () => {
  let { roomId } = props.roomInfo
  return settlementInfo({ roomId, ...queryParams.value }).then(res => {
    infoData.value = res
    infoData.value.actualAmountReceived = res.payableAmount
  })
}

const getOrderList = () => {
  let { roomId, consumeHistoryId } = props.roomInfo
  tableLoaing.value = true
  let isMerge = queryParams.value.isMerge
  let func = getPackageList //isMerge =0： 消费明细列表 ；isMerge=1： 并台消费列表
  let params = { roomId, ...queryParams.value }
  if (isMerge == 1) {
    func = getMergePackageList
  }
  if (isMerge == 2) { //isMerge = 2： 消费汇总列表
    func = consumptionSummary
    params = { consumeHistoryId }
  }
  func(params).then(res => {
    productList.value = res.filter(item => item.id > 0)
  }).finally(() => {
    tableLoaing.value = false
  })
}

onMounted(()=>{
  if (props.roomInfo.consumeHistoryId) {
    getSettlementInfo()
    getOrderList()
  }
})


</script>

<style lang="scss" scoped>
.row {
  .el-col {
    margin-top: 15px;

    .label {
      color: #ADADAD;
    }
  }

}

:deep(.el-table) {
  .el-table__header-wrapper th,
  .el-table .el-table__fixed-header-wrapper th {
    background-color: var(--el-table-tr-bg-color) !important;
  }
  .red-row {
    --el-table-tr-bg-color: #49323C;
    --el-table-row-hover-bg-color: #49323C;
  }

  .green-row {
    --el-table-tr-bg-color: #2C3D41;
    --el-table-row-hover-bg-color: #2C3D41;
  }

  .warning-row {
    --el-table-tr-bg-color: #3C3733;
    --el-table-row-hover-bg-color: #3C3733;
  }
}

.span {
  width: 25px;

  &.red-row {
    background: #F33B3B;
  }

  &.green-row {
    background: #2AD1B7;
  }

  &.warning-row {
    background: #FF9905;
  }
}
</style>