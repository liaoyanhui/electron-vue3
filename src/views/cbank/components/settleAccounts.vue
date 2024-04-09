<!--
 * @Description: 结账模块
 * @Author: pgm
 * @Date: 2024-01-27 17:53:55
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-22 00:37:24
 * @FilePath: /cbank-client/src/views/cbank/components/settleAccounts.vue
-->

<template>
  <div class="w100 d-flex flex-column">
    <div class="d-flex al-center jc-between color-fff py-12 px-24 border-b">
      <div>{{ title }}</div>
      <el-button type="primary" @click="emit('reset')">
        返回收银台
      </el-button>
    </div>
    <el-row class="w100 amount flex-1" v-loading="loading">
      <!-- 房台信息 -->
      <el-col :span="16" class="info border-r flex-column">
        <div>
          <el-row class="text-row mt-24 pl-24">
            <el-col :span="5"><span>状态: </span><span>{{ status.typeName }}</span></el-col>
            <el-col :span="4"><span>客人数: </span><span>{{ infoData.custNum }}</span></el-col>
            <el-col :span="4"><span>开台时间: </span><span>{{ formatTime(infoData.openTime) }}</span></el-col>
            <el-col :span="4"><span>计时: </span><span>{{ infoData.diffDate }}</span></el-col>
            <el-col :span="7"><span>账单号: </span><span>{{ infoData.billNumber }}</span></el-col>
          </el-row>
          <el-row class="text-row border-b pl-24">
            <el-col :span="5"><span>客人手机号: </span><span>{{ infoData.custMobile }}</span></el-col>
            <el-col :span="4"><span>会员类型: </span><span>{{ infoData.memberType == 1 ? '会员' : '散客' }}</span></el-col>
          </el-row>
        </div>

        <el-row class="flex-1 ">
          <el-col :span="5" class="border-r px-24 fs-14">
            <div class="pb-14 pt-24"><span>房台低消: </span><span>{{ formatAmount(infoData.minConsumption) }}</span></div>
            <div class="pb-14"><span>入低消额: </span><span>{{ formatAmount(infoData.useLowConsumption) }}</span></div>
            <div class="pb-14"><span>低消差额: </span><span>{{ formatAmount(infoData.lowConsumptionDifference) }}</span></div>
            <div class="pb-14"><span>预收余额: </span><span>{{ reservationCollectedAmount }}</span></div>
            <div class="pb-14"><span>预定录入: </span><span>{{ infoData.reservationOpenUserName }}</span></div>
            <div class="pb-14"><span>预定时间: </span><span>{{ formatTime(infoData.reservationTime) }}</span></div>
            <div class="pb-14"><span>开台人: </span><span>{{ infoData.openRoomUserName }}</span></div>
            <div class="pb-14"><span>订房人: </span><span>{{ infoData.reservationName }}</span></div>
            <div class="pb-14"><span>返房人: </span><span>{{ infoData.giveRoomName }}</span></div>
            <div class="pb-14"><span>带房人: </span><span>{{ infoData.belongName }}</span></div>
            <div class="pb-14"><span>轮房人: </span><span>{{ infoData.turnRoomName }}</span></div>
            <div class="pb-14"><span>上台数量: </span><span>{{ infoData.onStageNum }}</span></div>
            <div class="pb-14"><span>值班少爷: </span><span>{{ infoData.dutyRoomManager }}</span></div>
          </el-col>
          <el-col :span="19" class="p-r">
            <div class="d-flex al-center ">
              <div class="py-20 mx-20 pointer " :class="queryParams.isMerge == 0 ? 'border-2-b isactive' : ''"
                @click="tabChange(0)">
                消费明细
              </div>
              <div class="py-20 mx-20 pointer " :class="queryParams.isMerge == 2 ? 'border-2-b isactive' : ''"
                @click="tabChange(2)">
                消费汇总
              </div>
              <div class="py-20 mx-20 pointer" v-if="infoData.isMergeCheckout == 1 && infoData.isMerge == 1"
                :class="queryParams.isMerge == 1 ? 'border-2-b isactive' : ''" @click="tabChange(1)">
                并台消费
              </div>
            </div>
            <div class="tab-conent mx-10 border-1"  id="printTest">
              <el-table :data="productList" v-if="queryParams.isMerge == 2" :row-class-name="tableRowClassName"
                height="100%" v-loading="tableLoaing">
                <el-table-column label="序号" type="index" width="50" />
                <el-table-column label="菜品名称" align="center" prop="goodsName" :show-overflow-tooltip="true" />
                <el-table-column label="数量" align="center" prop="goodsNumber">
                  <template #default="scope">
                    <div>{{ scope.row.goodsNumber }} <span class="color-red" v-if="scope.row.backGoodsNum > 0">({{
                      scope.row.backGoodsNum }})</span></div>
                  </template>
                </el-table-column>
                <el-table-column label="单位" align="center" prop="goodsUnit" :show-overflow-tooltip="true" width="80" />
                <el-table-column label="总金额(￥)" align="center" prop="sumAmount"
                  :formatter="(row) => fenToYuan(row.sumAmount)" />
                <el-table-column label="赠送人" align="center" prop="giveUserName" />
                <el-table-column label="退单数量" align="center" prop="backGoodsNum">
                  <template #default="scope">
                    <div class="color-red">{{ scope.row.backGoodsNum }}</div>
                  </template>
                </el-table-column>
              </el-table>
              <el-table :data="productList" v-else :row-class-name="tableRowClassName" height="100%"
                v-loading="tableLoaing">
                <el-table-column label="" align="center" fixed="left" prop="addTime" width="40">
                  <template #default="scope">
                    <div class="radius-4 fs-14 span" :class="tableRowClassName(scope)">{{ statusDiv(scope.row) }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="时间" align="center" fixed="left" prop="addTime" width="70"
                  :formatter="formatTime" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="房台" v-if="queryParams.isMerge == 1" align="center" fixed="left" prop="roomName"
                  width="100" :show-overflow-tooltip="true" />
                <el-table-column label="菜品名称" align="center" fixed="left" prop="goodsName" width="115"
                  :show-overflow-tooltip="true" />
                <el-table-column label="数量" align="center" fixed="left" prop="goodsNumber" width="75">
                  <template #default="scope">
                    <div>{{ scope.row.goodsNumber }} <span class="color-red" v-if="scope.row.backGoodsNum > 0">({{
                      scope.row.backGoodsNum }})</span></div>
                  </template>
                </el-table-column>
                <el-table-column label="单位" align="center" prop="goodsUnit" width="55" :show-overflow-tooltip="true" />
                <el-table-column label="单价(￥)" align="center" prop="goodsAmount" width="100">
                  <template #default="scope">
                    <div v-if="scope.row.settleStatus == 1 || scope.row.type == 7 || scope.row.giveUserId">{{ fenToYuan(scope.row.goodsAmount) }}</div>
                    <EditAmountInput  v-else v-model:value="scope.row.goodsAmount" isValidator
                      @validator="updatePrice($event, scope.row.id)" :permissions="['cbank:xiugaidanjia']"></EditAmountInput>
                  </template>
                </el-table-column>
                <el-table-column label="总金额(￥)" align="center" prop="sumAmount" width="115"
                  :formatter="(row) => fenToYuan(row.sumAmount)" />
                <el-table-column label="点单人" aslign="center" prop="placeOrderUserName" width="140" >
                  <template #default="scope">
                    <EditPeopleInput  :filterType="[2]" v-if="scope.row.id>0" v-model:value="scope.row.placeOrderUserCompanyId" key="id" label="name" isValidator  @validator="updatePeople($event, scope.row.id)" ></EditPeopleInput>
                  </template>

                </el-table-column>
                <el-table-column label="赠送人" align="center" prop="giveUserName" width="80" />
                  

                
                <el-table-column label="操作" align="center" fixed="right" key="count" width="80" prop="count" >
                  <template #default="scope">
                    <div v-if="scope.row.type != 7" >
                      <div v-if="scope.row.settleStatus == 1">
                        已结账
                      </div>
                      <el-button v-else-if="scope.row.type != 5" @click="chargeback(scope.row)" v-hasPermi="['cbank:tuidan']" size="small" type="primary"
                        class="py-6 noprint">退单</el-button>
                    </div>

                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div class="p-a w100" style="bottom:0;left: 0;">
              <el-row class="py-20 pl-30 bg-fff06">
                <div>赠送金额:<span class="mr-40">{{ formatAmount(infoData.giftAmount) }}</span></div>
                <div>赔偿金额:<span class="mr-40">{{ formatAmount(infoData.compensationAmount) }}</span></div>
                <div>退单合计:<span class="mr-40">{{ formatAmount(infoData.refundAmount) }}</span></div>
                <div>落单合计:<span class="mr-40">{{ formatAmount(infoData.settledAmount) }}</span></div>
              </el-row>
              <el-row class="py-6">
                <el-col :span="12" class="d-flex al-center">
                  <div v-for="item in statusMap" :key="item.type" class="d-flex al-center fs-14"><span
                      class="d-line color p-8 radius-4 ml-30 mr-8 fs-14" :style="`background: ${item.color} `">{{
                        item.name.slice(0, 1) }}</span>{{ item.name
  }}</div>
                </el-col>
                <el-col :span="12" class="d-flex jc-end al-center">
                  <!-- <el-button @click="addCompletionMinConsume" v-if="infoData.isCompletionMinConsume == 0" type="primary"
                  class="py-6">自动补低消</el-button>
                <el-button @click="cancelCompletionMinConsume" v-if="infoData.isCompletionMinConsume == 1" type="primary"
                  class="py-6">取消补低消</el-button> -->
                  <el-button @click="cancelRoomAmount" v-if="infoData.isRoomPrice == 1"  v-hasPermi="['cbank:shouqufangfei']"  type="primary"
                    class="py-6">取消房费</el-button>
                  <el-button @click="addRoomAmount" v-if="infoData.isRoomPrice == 0" v-hasPermi="['cbank:shouqufangfei']" type="primary"
                    class="py-6">收取房费</el-button>
                  <el-checkbox v-model="queryParams.isShowCheckout" :true-label="0" :false-label="1" label="隐藏已结账菜品"
                    size="large" class="px-24" @change="() => { getOrderList(); getSettlementInfo() }" />
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

      </el-col>
      <!-- 支付方式 -->
      <el-col :span="8">
        <Pay v-model:infoData="infoData" :consumeHistoryId="roomInfo.consumeHistoryId" :roomId="roomInfo.roomId" :query="queryParams"
          @update:pageInit="pageInit" @reset="emit('reset')"></Pay>
      </el-col>
    </el-row>
  </div>
  <!-- 退单弹窗 -->
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
        <el-input-number v-model="form.backGoodsNum" placeholder="请输入金额" style="width:80px" :precision="0" :min="0"
          :max="maxBackNum" :step="1" controls-position="right" :controls="false" />
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

import { settlementInfo, getPackageList, cancellationRoomCost, bindingPackage, backGoods, updateUnitPrice, completionMinConsume, completionMinConsumeCost, consumptionSummary, getMergePackageList } from '@/api/cbank'
import dayjs from 'dayjs'
import { fenToYuan } from '@/utils'
import { useRoomSystemStore } from '@/store/system'
import { computed, watchEffect } from 'vue';
import EditAmountInput from '@/components/EditAmountInput'
import EditPeopleInput from '@/components/EditPeopleInput'
// import SelectPeople from '@/components/SelectPeople/SelectPeople.vue';
import Pay from './pay'
const { proxy } = getCurrentInstance();
const roomSystemStore = useRoomSystemStore()
const emit = defineEmits(["reset"])
const props = defineProps({
  roomInfo: {
    type: Object,
    require: true,
  },
  title: {
    type: String,
    default: ''
  }
})
const tableLoaing = ref(false)
const show = ref(false)
const infoData = ref({
  deductionAmount: 0,
  paymentAmount: 0,
  reservationCollectedAmount: 0
})
const productList = ref([])
const loading = ref(false)
const statusMap = ref([{
  color: "#F33B3B",
  name: '退单',
  type: 2
},
{
  color: '#2AD1B7',
  name: '赠送',
  type: 8
},
{
  color: "#FF9905",
  name: '套餐',
  type: 1
}])


const queryParams = ref({
  isShowCheckout: 0,
  isMerge: 0
})
const form = ref({
  goodsNumber: 0,
  backGoodsNum: 0,
  wantbackNum: 0,
  goodsUnit: ''
})


const maxBackNum = computed({
  get() {
    return form.value.goodsNumber - form.value.wantbackNum
  }
})



//预收余额
const reservationCollectedAmount = computed(() => {
  let paymentAmount = infoData.value.paymentAmount ? infoData.value.paymentAmount / 1 : 0
  let amount = infoData.value.reservationCollectedAmount + paymentAmount
  return formatAmount(amount)
})

//房间状态
const status = computed(() => {
  return roomSystemStore.roomSystemStatusColorList.filter(item => item.type == props.roomInfo.useStatus)[0] || []
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


const getSettlementInfo = () => {
  let { roomId } = props.roomInfo
  return settlementInfo({ roomId, ...queryParams.value }).then(res => {
    console.log('res',res.remarks)
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
    productList.value = res.filter(item => item.type !=7)
  }).finally(() => {
    tableLoaing.value = false
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

const chargeback = (row) => {
  form.value.id = row.id
  form.value.goodsNumber = row.goodsNumber / 1
  form.value.wantbackNum = row.backGoodsNum / 1
  form.value.goodsUnit = row.goodsUnit
  form.value.backGoodsNum = 1
  show.value = true
}

//修改赠送人
const updatePeople = ({ data, fn }, id) => {
    console.log('data',data)
  updateUnitPrice({ placeOrderUserCompanyId: data, id }).then(res => {
    if (res === '修改成功') {
      getOrderList()
      fn(true)
    } else {
      fn(false)
    }
  }).catch(() => {
    fn(false)
  })
}

//修改订单单价
const updatePrice = ({ data, fn }, id) => {
  updateUnitPrice({ goodsAmount: data, id }).then(res => {
    if (res === '修改成功') {
      pageInit()
      fn(true)
    } else {
      fn(false)
    }
  }).catch(() => {
    fn(false)
  })
}

//提交退单
const submitForm = () => {
  if (form.value.backGoodsNum > 0) {
    let params = { ...form.value }
    backGoods(params).then(res => {
      pageInit()
      proxy.$modal.msgSuccess("退单成功");
      show.value = false
    })
  } else {
    proxy.$modal.msgError("退单数量不能小于0");
  }
}

//取消房费
const cancelRoomAmount = () => {
  loading.value = true
  let { roomId, consumeHistoryId } = props.roomInfo
  let params = { roomId, consumeHistoryId }
  cancellationRoomCost(params).then(() => {
    pageInit()
  }).finally(() => {
    loading.value = false
  })
}

//收取房费
const addRoomAmount = () => {
  loading.value = true
  let { roomId, consumeHistoryId } = props.roomInfo
  let params = { roomId, consumeHistoryId }
  bindingPackage(params).then(() => {
    pageInit()
    loading.value = false
  }).finally(() => {
    loading.value = false
  })
}

// TODO自动补低消
const addCompletionMinConsume = () => {
  loading.value = true
  let { roomId, consumeHistoryId } = props.roomInfo
  let params = { roomId, consumeHistoryId }
  completionMinConsume(params).then(() => {
    pageInit()
    loading.value = false
  }).finally(() => {
    loading.value = false
  })
}

// TODO取消低消
const cancelCompletionMinConsume = () => {
  loading.value = true
  let { roomId, consumeHistoryId } = props.roomInfo
  let params = { roomId, consumeHistoryId }
  completionMinConsumeCost(params).then(() => {
    pageInit()
    loading.value = false
  }).finally(() => {
    loading.value = false
  })
}

const tabChange = (index) => {
  queryParams.value.isMerge = index;
  productList.value = []
  getOrderList()
}

const pageInit = () => {
  getOrderList()
  getSettlementInfo()
}

pageInit()

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

  .info {
    display: flex;
  }

}

.amount-tip {
  margin-top: 40px;

  div {
    flex: 0 0 50%;
    font-weight: 500;
  }
}







.tab-conent {
  height: calc(100% - 185px);
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

<!-- <style media="print" lang="scss">
@page {
    size: auto;
    margin: 0mm;
  }
@media  print {
  html{
    color:#000!important;
  }  
}
</style> -->