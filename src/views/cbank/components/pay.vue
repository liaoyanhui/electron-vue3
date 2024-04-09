<!--
 * @Description: 结账-支付模块
 * @Author: pgm
 * @Date: 2024-02-18 22:46:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-22 01:04:34
 * @FilePath: /cbank-client/src/views/cbank/components/pay.vue
-->
<template>
  <div class="d-flex al-center jc-between py-20 px-20">
    <div class="title">付款方式</div>
    <div class="d-flex al-center color-green pointer" @click="modalShow = 'billModal'"><img class="mr-6"
        src="../../../assets/img/pay/bill-full.png" width="20px" height="25px" mode="scaleToFill" />结账记录</div>
  </div>
  <div class="d-flex al-center pay-select-box">
    <div v-for="item in payTypeList" :key="item.id" class="pay-icon-box text-center">
      <div class="text-center pay-icon-item" :class="{ active: item.checked }" @click="selctPayType(item.id)">
        <img :src="item.payImage" alt="" width="50px" height="50px">
        <div class="pt-12">{{ item.payName }}</div>
      </div>
    </div>
  </div>
  <div class="pay-box">
    <el-form ref="payFormRef" :model="formData" :inline="true" label-width="80">
      <el-row>
        <template v-for="item in payList" :key="item.type">
          <el-col :span="12" v-if="item.type != 5">
            <el-form-item :label="item.payName">
              <el-input-number v-model="item.amount"  placeholder="请输入金额" style="width: 100px" :precision="2" :step="0.01"
                controls-position="right" :min="0" :controls="false" />
            </el-form-item>
          </el-col>
          <el-row :span="24" v-else>
            <el-col :span="10">
              <el-form-item :label="item.payName">
                <el-input-number v-model="item.amount" placeholder="请输入金额" style="width: 100px" :precision="2"
                  :step="0.01" :min="0.01" controls-position="right" :controls="false" />
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="担保人" prop="securityName" :rules="[
                { required: true, message: '请选择担保人' },
              ]">
                <SelectPeople v-model:value="item.securityId" :typeFilter="[2]" v-model:label="formData.securityName"
                  v-model:type="item.securityType" placeholder="请选择担保人" automatic-dropdown style="width: 150px">
                </SelectPeople>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-row>

    </el-form>
  </div>
  <div class="pl-20">
    <el-row class="d-flex al-center" id="printArea">
      <el-col :xl="10" :span="24" class="mt-10">
        <div class="mr-20">应付金额: {{ payableAmountModify > 0 ? formatAmount(payableAmountModify) :
        formatAmount(infoData.payableAmount) }} </div>
      </el-col>
      <el-col :xl="12" :span="24" v-if="mergeType != 2 && infoData.payableAmount>0" class="mt-10 ">
        <el-button size="small"  v-hasPermi="['cbank:moling']"
          :type="(amountModifyType > 0 && amountModifyType != 1 || infoData.deductionAmount > 0) ? 'info' : 'primary'"
          :disable="amountModifyType > 0 || infoData.deductionAmount > 0" class="py-6" @click="modifyAmountHandle(1)">{{
            amountModifyType == 1 ? `撤回` : `抹零` }}</el-button>
        <el-button size="small" v-hasPermi="['cbank:jingshi']"
          :type="(amountModifyType > 0 && amountModifyType != 2 || infoData.deductionAmount > 0) ? 'info' : 'primary'"
          :disable="amountModifyType > 0 || infoData.deductionAmount > 0" class="py-6" @click="modifyAmountHandle(2)">{{
            amountModifyType == 2 ? `撤回` : `进十` }}</el-button>
        <el-button size="small" v-hasPermi="['cbank:sishewuru']"
          :type="(amountModifyType > 0 && amountModifyType != 3 || infoData.deductionAmount > 0) ? 'info' : 'primary'"
          :disable="amountModifyType > 0 || infoData.deductionAmount > 0" class="py-6" @click="modifyAmountHandle(3)">{{
            amountModifyType == 3 ? `撤回` : `四舍五入` }}</el-button>
      </el-col>
    </el-row>
    <div class="d-flex al-center mt-24">
      <div class="flex-1">
        调整金额:
        <span v-if="amountModifyType > 0 || mergeType == 2"> 0.00 </span>
        <EditAmountInput v-else v-model:value="infoData.deductionAmount" :max="infoData.payableAmount" :permissions="['cbank:tiaozhengjine']"></EditAmountInput>
      </div>
      <!-- <div class="flex-1 ">预付金额:
        <EditAmountInput v-model:value="infoData.paymentAmount"></EditAmountInput>
      </div> -->

    </div>
    <div class="d-flex al-center mt-24">
      <div class="flex-1"><span>实付金额: </span><span class="color-red fs-22 fw-500">{{ formatAmount(actualAmountReceived)
      }}</span></div>
    </div>
    <div class="d-flex al-center mt-24">
      <div class="flex-1">已结金额: {{ formatAmount(infoData.actualAmountReceivedSum) }} </div>
      <div class="flex-1 ">已付金额: {{ formatAmount(infoData.payableAmountSum) }}</div>
    </div>
  </div>

  <el-row class="text-center pt-24 d-flex jc-center mt-30">
    <el-button type="primary" @click="printHandle()" class="btn" :loading="printLoading">打印账单</el-button>
    <!-- 主房台 非清洁状态-->
    <template v-if="mergeType == 1 & infoData.useStatus != 7">
      <el-button v-if="infoData.isCollectionComplete == 1" @click="surePay(1)"
      type="warning" class="btn">确认结账</el-button>
      <el-button v-else @click="pay(1)" type="warning"
         class="btn">并台结账</el-button>
    </template>

    <!-- 次房台 -->
    <template v-if="mergeType == 2">
      <el-button @click="action" type="warning" 
        class="btn">并主房台</el-button>
    </template>
    
    <!-- 未并台 非清洁状态-->
    <template v-if="mergeType == 0 && infoData.useStatus != 7">
      <el-button v-if="infoData.isCollectionComplete == 1" @click="surePay(2)" type="warning"
        class="btn">确认结账</el-button>
      <el-button v-else @click="pay(2)" type="warning"  class="btn">结账</el-button>
    </template>
   

  </el-row>
  <el-form-item label="备注" class="ml-24 mr-40 mt-24">
      <el-input v-model="formData.remarks" placeholder="请输入">
      </el-input>
    </el-form-item>
  <BillModal :mergeType="mergeType" v-model:value="modalShow" :roomId="roomId" :consumeHistoryId="consumeHistoryId"
    @pageInit="emit('update:pageInit')"></BillModal>
  <confirmCheckoutModal :data="confirmCheckoutData" v-model:value="modalShow" :roomId="roomId" :mergeType="mergeType"
    :consumeHistoryId="consumeHistoryId" @pageInit="emit('update:pageInit')"></confirmCheckoutModal>
</template>
<script setup>
import { settlementRoom, addSettlementMergeBill, allAmountStatistics, allMergeAmountStatistics,orderPrintSettlement } from '@/api/cbank'
import { getPayMethodList } from '@/api/cashier';
import { fenToYuan, yuanTofen } from '@/utils'
import EditAmountInput from '@/components/EditAmountInput'
import SelectPeople from '@/components/SelectPeople/SelectPeople.vue';
import { computed, onMounted, reactive, watchEffect } from 'vue';
import BillModal from './billModal.vue';
import confirmCheckoutModal from './confirmCheckoutModal.vue';
const { proxy } = getCurrentInstance();
const props = defineProps({
  infoData: {
    type: Object,
    require: true,
  },
  consumeHistoryId: {
    type: Number,
    require: true
  },
  roomId: {
    type: Number,
    require: true
  },
  query: {
    type: Object,
    default: {}
  }
})
const printLoading = ref(false)
const emit = defineEmits(['update:pageInit', 'reset'])
const payFormRef = ref()
const payTypeList = ref([])
const formData = ref({
  securityName: undefined,
  remarks: ''
})




const confirmCheckoutData = ref({})
const modalShow = ref('')
const payList = computed(() => payTypeList.value.filter(item => item.checked))
//抹零、进十、四舍五入后的应付金额
const payableAmountModify = ref(0)
const amountModifyType = ref(null)
//实付金额
const actualAmountReceived = computed(() => {
  let amount = 0;
  let { deductionAmount = 0, payableAmount } = props.infoData
  if (payableAmountModify.value > 0) {
    amount = payableAmountModify.value - deductionAmount
  } else {
    amount = payableAmount - deductionAmount
  }
  let selectObj = payTypeList.value.filter(item => item.checked)
  if (selectObj.length == 1) {
    selectObj[0].amount = fenToYuan(amount)/1
  }
  return amount
})

const mergeType = computed(() => { // 0普通房间 1主房台 2次房台
  let isMerge = props.infoData.isMerge  //是否并房 0.否 1.是
  let isMergeCheckout = props.infoData.isMergeCheckout //是否主房台 0.不是 1.是
  if (isMerge == 1) {
    return isMergeCheckout == 1? 1: 2
  } else {
    return 0
  }
})

watch(() => props.infoData.payableAmount, (val) => {
  payableAmountModify.value = 0
  amountModifyType.value = 0 
})

watch(() => props.infoData.remarks, (val) => {
  formData.value.remarks = val
})


const printHandle = (settlementBillId) => {
  printLoading.value =true
  let isSettlement = settlementBillId ? 1 : 0
  let { roomId, consumeHistoryId, query: { isMerge = 0, isShowCheckout = 0 } } = props
  orderPrintSettlement({ roomId, consumeHistoryId, settlementId: settlementBillId, isSettlement, isShowCheckout: settlementBillId ? 1 : isShowCheckout }).then(res => {
    const printInfo = {
      htmlText:res,
      deviceName: '',
      isShow: false,
      width:500,
      devTool:false
    }
    window.mainApi?.ipcRenderer.send('handle_print', printInfo)
  }).catch(res => {
    proxy.$modal.msgWarning('服务异常，打印失败')
  }).finally(() => {
    printLoading.value =false
  })
}






const modifyAmountHandle = (type) => {
  if (props.infoData.deductionAmount > 0) {
    return
  }
  if (payableAmountModify.value != 0 && type == amountModifyType.value) {
    payableAmountModify.value = 0
    amountModifyType.value = 0
    return
  } else if (payableAmountModify.value != 0) {
    return
  }

  amountModifyType.value = type
  if (type == 1) {
    payableAmountModify.value = Math.floor(props.infoData.payableAmount / 1000) * 1000;
  }
  if (type == 2) {
    payableAmountModify.value = Math.ceil(props.infoData.payableAmount / 1000) * 1000;
  }
  if (type == 3) {
    payableAmountModify.value = Math.round(props.infoData.payableAmount / 1000) * 1000;
  }
}

//获取付款方式列表
function getMethodList() {
  getPayMethodList({ pageRow: 6 }).then(res => {
    let list = res.map(item => {
      let { payName, id, payImage, type } = item
      return {
        payName,
        id,
        payImage,
        type,
        amount: 0
      }
    })
    payTypeList.value = list.map((item, index) => {
      if (index == 0) {
        item.checked = true
        // item.amount = fenToYuan(actualAmountReceived.value)/1

      }
      return item
    })
  })
}

//选择支付方式
const selctPayType = (id) => {
  payTypeList.value = payTypeList.value.map(item => {
    if (item.id === id) {
      item.checked = !item.checked
    }
    if (!item.checked) {
      item.amount = 0
    }
    return item
  })
  let selectObj = payTypeList.value.filter(item => item.checked)
  if (selectObj.length == 1) {
    selectObj[0].amount = fenToYuan(props.infoData.payableAmount)/1
  }
}

//结账
const pay = (type) => {
  let typeList = payTypeList.value.filter(item => item.checked)
  // if (typeList.length === 0) {
  //   proxy.$modal.msgWarning("请选择支付方式！");
  //   return
  // }

  proxy.$refs['payFormRef'].validate((valid) => {
    if (valid) {
      let func = type == 1 ? addSettlementMergeBill : settlementRoom
      let paymentMethod = JSON.stringify(typeList.map(item => {
        let { type, payName, id, amount } = item
        let obj = {
          type,
          payName,
          id,
          amount: yuanTofen(amount)
        }
        if (type == 5) {
          obj.securityId = item.securityId
          obj.securityType = item.securityType
          obj.securityName = formData.value.securityName
        }
        return obj
      }))
      let { roomId, consumeHistoryId, infoData: { deductionAmount = 0, idList, billNumber, payableAmount, giftAmount, orderAmount, refundAmount, compensationAmount, paymentAmount } } = props
      if (payableAmountModify.value > 0) {
        payableAmount = payableAmountModify.value
      }
      let actualAmountReceived = payableAmount - deductionAmount
      let params = {
        roomId,
        consumeHistoryId,
        remarks:formData.value.remarks,
        idList, billNumber, payableAmount, giftAmount, orderAmount, refundAmount, compensationAmount, paymentMethod, deductionAmount,
        actualAmountReceived, paymentAmount
      }
      proxy.$modal.loading()
      func(params).then(res => {
        
        proxy.$modal.msgSuccess("支付成功");
        let { settlementBillId } = res
        emit('update:pageInit')
        if (settlementBillId) {
           printHandle(settlementBillId)
        }
       
      }).finally(() => {
        proxy.$modal.closeLoading()
      })
    }
  })
}


//确认收款
const surePay = (type) => {
  let { roomId, consumeHistoryId } = props
  proxy.$modal.loading()
  const func = mergeType.value ==0 ? allAmountStatistics: allMergeAmountStatistics 
  //获取账单
  func({ roomId, consumeHistoryId }).then(res => {
    proxy.$modal.closeLoading()
    console.log('res')
    if (res) {
      confirmCheckoutData.value = res
    } else {
      confirmCheckoutData.value = {
        actualAmount: 0,
        billIds: '',
        paymentMethodRespList: [],
        receivedAmount: 0,
        securityRespList: []
      }
    }
    modalShow.value = 'confirmCheckoutModal'
  }).catch(() => {
    proxy.$modal.closeLoading()
  })
}

const formatAmount = (row) => {
  let amount = row?.sumAmount || row
  return '￥' + fenToYuan(amount)
}
const action = () => {
  proxy.$modal.msgWarning(`请回到主房台(${props.infoData.mainRoomName})结账`)
}

onMounted(() => {
  getMethodList()
})

</script>

<style scoped lang="scss">
.pay-select-box {
  flex-wrap: wrap;

  .pay-icon-box {
    flex: 0 0 33.3%;
    margin-bottom: 20px;

    .pay-icon-item {
      padding: 15px 4px 10px;
      max-width: 110px;
      box-sizing: border-box;
      margin: 0 auto;

      &.active {
        background: rgba(42, 209, 183, 0.1);
        border-radius: 6px;
        border: 1px solid #2AD1B7;
      }
    }
  }

}

.btn {
  width: 120px;
  height: 40px;
}
</style>

<style lang="scss">
@page {
    size: auto;
    margin: 0mm;
  }
@media  print {
  html{
    color:#000!important;
  }  
}
</style>