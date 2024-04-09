<!--
 * @Description: 结账记录弹窗
 * @Author: pgm
 * @Date: 2024-02-19 15:37:01
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-14 15:08:12
 * @FilePath: /cbank-client/src/views/cbank/components/billModal.vue
-->
<template>
  <el-dialog title="结账记录" v-bind="$attrs" v-model="show" width="500px" append-to-body destroy-on-close
    :before-close="handleBeforeClose" class="bill-modal">
    <template v-if="hasBill">
      <div class="list-content over-scorll-y">
        <div class="border-1 radius-8 p-24 mb-20 item bg-fff06" v-for="(item) in  billList" :key="item.id">
          <div class="fw-500">房台名称: {{ item.roomName }}</div>
          <el-row class=" mt-6">
            <el-col :span="12">账单号: {{ item.billNumber }}</el-col>
            <el-col :span="12">结账时间: {{ dayjs(item.editTime).format('YYYY/MM/DD HH:mm') }}</el-col>
          </el-row>
          <el-row class=" mt-8">
            <el-col :span="12">实付金额: ￥{{ fenToYuan(item.actualAmountReceived) }}</el-col>
            <el-col :span="12">应付金额: ￥{{ fenToYuan(item.payableAmount) }}</el-col>
          </el-row>
          <el-row class=" mt-8">
            <el-col :span="12">调整金额: ￥{{ fenToYuan(item.deductionAmount) }}</el-col>
          </el-row>
          <div v-if="item?.billRespList?.length>0">
            <div class="mt-8 fw-500">并台子单:</div>
            <div class="d-flex al-center mt-8" v-for="(bill) in  item.billRespList" :key="bill.id">
              <div class='ml-8 label el-1'>{{ bill.roomName }} :</div>
              <div class=''>{{ bill.billNumber }}</div>
            </div>
          </div>
          <el-row class="mt-8 d-flex al-center">
            <el-col :span="12" class="color-green " >
              <div class="d-flex al-center pointer" v-if="item.paymentMethod?.length > 0" @click="item.isCollapse = !item.isCollapse">付款明细 <el-icon color="#2ad1b7" class="ml-8">
                  <ArrowDownBold v-if="!item.isCollapse" />
                  <ArrowUpBold v-if="item.isCollapse" />
                </el-icon>
              </div>
            </el-col>
            <el-col :span="12" class="text-right">
              <div v-if="item.isBackBill == 1">已反结账</div>
              <el-button v-else-if="mergeType !=2" @click="backBillHandle(item)" type="primary" size="small" class="btn">反结账</el-button>
            </el-col>
          </el-row>
          <el-row class="text-left fs-14" v-show="item.isCollapse">
            <template v-for="(item, index) in item.paymentMethod" :key="index">
              <el-col :span="24" v-if="item.type == 5">
                <el-row class="mt-8">
                  <el-col :span="12" v-if="item.amount > 0">挂账: ￥{{ fenToYuan(item.amount) }}</el-col>
                  <el-col :span="12" v-if="item.amount > 0">挂账责任人: {{ item.securityName }}</el-col>
                </el-row>
              </el-col>
              <el-col :span="12" class="mt-8" v-else>{{ item.payName }}: ￥{{ fenToYuan(item.amount) }}</el-col>
            </template>
          </el-row>
        </div>
      </div>
    </template>
    <div class="empty" v-else>
      <div class="img"></div>
      <div>暂无结账记录！</div>
    </div>
    <template #footer v-if="hasBill && (billTotal?.paymentMethodRespList?.length > 0)">
      <el-row class="footer">
        <el-col :span="5" class="mt-4 text-left">付款总计： </el-col>
        <el-col :span="19">
          <el-row class="text-left fs-14">
            <template v-for="(item, index) in billTotal.paymentMethodRespList" :key="index">
              <el-col class="mt-4" :span="8">{{ item.payName }}: {{ fenToYuan(item.amount) }}</el-col>
            </template>
          </el-row>
          <el-row v-for="(item, index) in billTotal.securityRespList" :key="index" class="text-left fs-14 mt-4">
            <el-col :span="7"><span >挂账<span v-if="billTotal.securityRespList?.length>1">{{ index + 1 }}</span>: </span><span>{{ fenToYuan(item.amount)
            }}</span></el-col>
            <el-col :span="12"><span class="mr-6">挂账担保人: </span><span>{{ item.securityName }}</span></el-col>
          </el-row>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script setup>
import { cancellationList,cancellationMergeList, allAmountStatistics,allMergeAmountStatistics,backMergeBill, backBill } from '@/api/cbank'
import { computed } from 'vue';
import { fenToYuan } from '@/utils';
import dayjs from 'dayjs'
const { proxy } = getCurrentInstance();


const props = defineProps({
  roomId: {
    type: [String, Number],
    require: true
  },
  consumeHistoryId: {
    type: [String, Number],
    require: true
  },
  value: {
    type: String,
    require: true,
    default: ''
  },
  mergeType: { //并台类型：0：未并台, 1 :主并台 2：次并台
    type: Number,
    require:true
  }

})
const selectRoomInfo = ref({})

const data = reactive({
  form: {},
  rules: {
    typeName: [{ required: true, message: "分类不能为空", trigger: "blur" }],
  },
  queryParams: {
    id: ''
  }
})
const emit = defineEmits(['update:value', 'pageInit']);
const show = computed(() => {
  if (props.value == 'billModal') {
    init()
  } 
  return props.value == 'billModal'
})


const billList = ref([])
const billTotal = ref({})
const hasBill = ref(true)

/** 获取结账记录(结账列表) */
function getList() {
  let { roomId, consumeHistoryId } = props
  let params = {
    roomId,
    consumeHistoryId
  }
  const func =props.mergeType == 1  ?cancellationMergeList:cancellationList
  func(params).then(result => {
    billList.value = result.map(item => {
      let { paymentMethod } = item
      item.paymentMethod = JSON.parse(paymentMethod)
      item.isCollapse = false
      return item
    });
    hasBill.value = result.length > 0
  }).catch(() => {
    hasBill.value = false
  });
}

//结账时统计账单
function getTotal() {
  let { roomId, consumeHistoryId } = props
  let params = {
    roomId,
    consumeHistoryId
  }

  const func =props.mergeType == 1 ? allMergeAmountStatistics: allAmountStatistics
  func(params).then(res => {
    billTotal.value = res;
  });
}

//反结账
function backBillHandle(row) {
  const func = props.mergeType == 1  ? backMergeBill : backBill
  let { id } = row
  func({ id }).then(res => {
    getTotal()
    getList()
    emit('pageInit')
    proxy.$modal.msgSuccess("操作成功");
  })

}

function handleBeforeClose() {
  cancel()
}

function submitForm() {
  proxy.$modal.msgSuccess("修改成功");
}

function cancel() {
  emit('update:value', '')
  selectRoomInfo.value = {};
}

const init = () => {
  getList()
  getTotal()
}
</script>
<style>
:deep(.bill-modal .el-dialog__body) {
  padding-top: 10px;
}
</style>
<style lang="scss" scoped>
.list-content {
  max-height: 60vh;

  .item:last-child {
    margin-bottom: 0;
  }
}
.label{
  width: 110px;
}
.empty {
  padding: 51px 0 51px;
  text-align: center;

  .img {
    background: url('@/assets/img/pay/bill-empty.png')no-repeat center center /100%;
    width: 106px;
    height: 99px;
    margin: 0 auto 32px;
  }
}
</style>