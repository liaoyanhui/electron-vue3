<!--
 * @Description: 页面（废弃）
 * @Author: pgm
 * @Date: 2024-01-29 04:51:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-02-21 14:24:21
 * @FilePath: /cbank-client/src/views/cbank/components/changeOrder.vue
-->
<template>
  <div class="w100 color-gray amount" v-loading="loading">

    <div class="color-black fw-500 title pt-8">账单信息</div>
    <el-row class="text-row">
      <el-col :span="7"><span>房台低消:</span><span>{{ formatAmount(infoData.minConsumption) }}</span></el-col>
      <el-col :span="8"><span>应付金额:</span><span>{{ formatAmount(infoData.payableAmount) }}</span></el-col>
    </el-row>
    <el-row class="text-row">
      <el-col :span="5"><span>赠送金额:</span><span>{{ formatAmount(infoData.giftAmount) }}</span></el-col>
      <el-col :span="5"><span>点单金额:</span><span>{{ formatAmount(infoData.orderAmount) }}</span></el-col>
      <el-col :span="5"><span>退单金额:</span><span>{{ formatAmount(infoData.refundAmount) }}</span></el-col>
      <el-col :span="5"><span>赔偿金额:</span><span>{{ formatAmount(infoData.compensationAmount) }}</span></el-col>
    </el-row>
    <!-- <el-col :span="8" class="">
          <el-button @click="cancelRoomAmount" :type="infoData.isRoomPrice == 0 ? 'primary' : ''" :disabled="infoData.isRoomPrice == 0" >取消收取房费</el-button>
          <el-button @click="addRoomAmount" :type="infoData.isRoomPrice == 1 ? 'primary' : ''"  :disabled="infoData.isRoomPrice == 1">收取房费</el-button>
        </el-col> -->

    <div class="color-black fw-500 title pt-8">菜品明细</div>
    <el-table :data="productList" ref="tableRef">
      <el-table-column label="落单时间" align="center" prop="addTime" :formatter="formatTime" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="菜品名称" align="center" prop="goodsName" :show-overflow-tooltip="true" />
      <el-table-column label="数量" align="center" prop="goodsNumber" :show-overflow-tooltip="true" />
      <el-table-column label="单位" align="center" prop="goodsUnit" :show-overflow-tooltip="true" />
      <el-table-column label="金额" align="center" prop="sumAmount" :formatter="formatAmount"
        :show-overflow-tooltip="true" />
      <el-table-column label="赠送人" align="center" prop="giveUserName" :show-overflow-tooltip="true" />
      <el-table-column label="点单人" align="center" prop="placeOrderUserName" :show-overflow-tooltip="true" />
      <el-table-column label="退单数量" align="center" prop="backGoodsNum" :show-overflow-tooltip="true" />
      <el-table-column label="结账状态" align="center" key="count" prop="count" :show-overflow-tooltip="true">
        <template #default="scope">
          <div  :style="`background: ${settleStatus(scope.row.settleStatus).background};color: ${settleStatus(scope.row.settleStatus).color}`">
            {{ settleStatus(scope.row.settleStatus).str }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" key="count" prop="count" :show-overflow-tooltip="true">
        <template #default="scope">
          <div class="color-red pointer" @click="chargeback(scope.row)" v-if="scope.row.settleStatus == 0">
            退单
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog title="退单" v-model="show" width="450px" append-to-body destroy-on-close>
    <el-form ref="dishTypeRef" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="点单数量">
            <div class="fw-500 text-center" style="width:80px"><span class="fs-16 ">{{ form.goodsNumber }}</span><span
                class="ml-4 fs-14">{{ form.goodsUnit }}</span></div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="已退单数量">
            <div class="fw-500 text-center" style="width:80px"><span class="fs-16">{{ form.wantbackNum }}</span><span
                class="ml-4 fs-14">{{ form.goodsUnit }}</span></div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="退单数量" prop="backGoodsNum">
        <el-input-number v-model="form.backGoodsNum" placeholder="请输入金额" :max="form.goodsNumber" style="width:80px" :precision="0" :step="1"
          controls-position="right" :controls="false" />
        <span class="ml-6 fw-500 fs-14">{{ form.goodsUnit }}</span>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="show = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>

import { settlementInfo, getPackageList, backGoods } from '@/api/cbank'
import dayjs from 'dayjs'
import { fenToYuan } from '@/utils'
import { useRoomSystemStore } from '@/store/system'

const { proxy } = getCurrentInstance();
const roomSystemStore = useRoomSystemStore()
const emit = defineEmits(["reset"])
const props = defineProps({
  roomInfo: {
    type: Object,
    require: true,
  },
})
const show = ref(false)
const infoData = ref({})
const productList = ref([])
const loading = ref(false)
const form = ref({
  goodsNumber: 0,
  backGoodsNum: 0,
  wantbackNum: 0,
  goodsUnit:''
})
//房间状态
const status = computed(() => {
  return roomSystemStore.roomSystemStatusColorList.filter(item => item.type == props.roomInfo.useStatus)[0] || []
})
const getSettlementInfo = () => {
  let { roomId } = props.roomInfo
  return settlementInfo({ roomId }).then(res => {
    infoData.value = res
  })
}
const orderList = () => {
  let { roomId } = props.roomInfo
  getPackageList({ roomId }).then(res => {
    productList.value = res
  })
}

const formatTime = (row) => {
  let time = row?.addTime || row
  return dayjs(time).format('HH:mm')
}

const formatAmount = (row) => {
  let amount = row?.sumAmount || row
  return '￥' + fenToYuan(amount)
}

const settleStatus = (status) => {
 
  let statusObj = {
    color: '#2AD1B7',
    background:" rgba(42, 209, 183, 0.1)",
    str:'未结算'
  }
  switch (status) {
    case 0:
      break;
    case 1:
      statusObj = {
        str: '结账',
        color: "#ADADAD",
        background:" rgba(173,173,173,0.1)"
      }
      break;
    case 2:
      statusObj = {
        str: '退单',
        color: "#F33B3B",
        background:"rgba(243,59,59,0.1)"
      }
      break;
  }
  return statusObj
}

const chargeback = (row) => {
  form.value.id = row.id
  form.value.goodsNumber = row.goodsNumber
  form.value.wantbackNum = row.backGoodsNum
  form.value.goodsUnit = row.goodsUnit
  show.value = true

}


const submitForm = () => {
  if (form.value.goodsNumber > 0) {
    let params = { ...form.value }
    backGoods(params).then(res => {
      orderList()
      proxy.$modal.msgSuccess("退单成功");
      show.value = false
    })
  }
}

onMounted(() => {
  orderList()
  getSettlementInfo()
})
</script>

<style scoped lang="scss">
.amount {
  line-height: 1;

  .title {
    padding-bottom: 14px;
  }

  .text-row {
    padding-bottom: 15px;
    font-size: 14px;
  }

}</style>