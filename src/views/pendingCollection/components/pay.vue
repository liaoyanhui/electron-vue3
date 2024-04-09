<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-03-04 15:26:04
 * @LastEditTime: 2024-03-20 00:47:24
 * @FilePath: /cbank-client/src/views/pendingCollection/components/pay.vue
-->

<template>
  <div class="d-flex al-center jc-between py-20 px-20">
    <div class="title">付款方式</div>
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
          <el-col :span="24" v-if="item.type == 4">
            <el-form-item label="会员卡" label-width="200">
              <el-input-number v-model="item.amount" placeholder="请输入金额" style="width: 150px" :precision="2" :step="1" :min="0"
                controls-position="right" :controls="false" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-else>
            <el-form-item :label="item.payName">
              <el-input-number v-model="item.amount" placeholder="请输入金额" style="width: 100px" :precision="2"
                :step="0.01" :min="0" controls-position="right" :controls="false" />
            </el-form-item>
          </el-col>

        </template>
      </el-row>

    </el-form>
  </div>
  <div class="pl-20">
    <el-row class="d-flex al-center">

      <el-col :xl="10" :span="24" class="mt-10">
        <div class="mr-20">挂账金额: {{ payableAmountModify > 0 ? formatAmount(payableAmountModify) :
      formatAmount(selectTotal) }} </div>
      </el-col>
      <el-col :xl="12" :span="24" class="mt-10 ">
        <el-button size="small" v-hasPermi="['cbank:moling']"
          :type="(amountModifyType > 0 && amountModifyType != 1 || deductionAmount > 0) ? 'info' : 'primary'"
          :disable="amountModifyType > 0 || deductionAmount > 0" class="py-6" @click="modifyAmountHandle(1)">{{
      amountModifyType == 1 ? `撤回` : `抹零` }}</el-button>
        <el-button size="small" v-hasPermi="['cbank:jingshi']"
          :type="(amountModifyType > 0 && amountModifyType != 2 || deductionAmount > 0) ? 'info' : 'primary'"
          :disable="amountModifyType > 0 || deductionAmount > 0" class="py-6" @click="modifyAmountHandle(2)">{{
      amountModifyType == 2 ? `撤回` : `进十` }}</el-button>
        <el-button size="small" v-hasPermi="['cbank:sishewuru']"
          :type="(amountModifyType > 0 && amountModifyType != 3 || deductionAmount > 0) ? 'info' : 'primary'"
          :disable="amountModifyType > 0 || deductionAmount > 0" class="py-6" @click="modifyAmountHandle(3)">{{
      amountModifyType == 3 ? `撤回` : `四舍五入` }}</el-button>
      </el-col>
    </el-row>

    <div class="d-flex al-center mt-24">
      <div class="flex-1">
        调整金额:
        <span v-if="amountModifyType > 0"> 0.00 </span>
        <EditAmountInput v-else v-model:value="deductionAmount" :permissions="['cbank:tiaozhengjine']">
        </EditAmountInput>
      </div>
    </div>
    <div class="d-flex al-center mt-24">
      <div class="flex-1"><span>实付金额: </span><span class="color-red fs-22 fw-500">{{ formatAmount(actualAmountReceived)
          }}</span></div>
    </div>
  </div>

  <el-row class="text-center d-flex jc-center mt-30">
    <el-button @click="pay" type="primary" class="btn">确认收款</el-button>
  </el-row>
  <el-form-item label="备注" class="mx-24 mt-24">
    <el-input v-model="formData.remarks" placeholder="请输入">
    </el-input>
  </el-form-item>
  <confirmCheckoutModal v-model="sureModalShow" :typeList="payTypeList" :amount="actualAmountReceived"
    @cancel="sureModalShow = false" @sure="surePay"></confirmCheckoutModal>
</template>

<script setup>
import { creditCollection } from '@/api/pendingCollection'
import { getPayMethodList } from '@/api/cashier';
import { fenToYuan, yuanTofen } from '@/utils'
import EditAmountInput from '@/components/EditAmountInput'
import SelectPeople from '@/components/SelectPeople/SelectPeople.vue';
import { computed, onMounted, watchEffect } from 'vue';
import confirmCheckoutModal from './confirmCheckoutModal.vue';
const { proxy } = getCurrentInstance();
const props = defineProps({
  selectTotal: {
    default: Number,
    default: 0
  },
  selectIds: {
    default: String,
    default: ''
  }
})
const emit = defineEmits(['getList', 'reset'])
const payFormRef = ref()
const payTypeList = ref([])
const formData = ref({
  remarks: ''
})

// const memberMoney = ref();
const sureModalShow = ref(false)
const payList = computed(() => payTypeList.value.filter(item => item.checked))

const amountModifyType = ref(null) //金额扣除方式 1、抹零 2、进十 3、四舍五入
const payableAmountModify = ref(0) //抹零、进十、四舍五入后的应付金额
const deductionAmount = ref(0) //调整金额

//实付金额
const actualAmountReceived = computed(() => {
  let amount = props.selectTotal
  if (payableAmountModify.value > 0) {
    amount = payableAmountModify.value
  }
  if (deductionAmount.value > 0) {
    amount -= deductionAmount.value
  }
  return amount
})


watch(() => props.selectTotal, () => {
  payableAmountModify.value = 0
  amountModifyType.value = 0
  deductionAmount.value =0
  payTypeList.value.forEach((item,index) => {
    if (index == 0) {
        item.amount = fenToYuan(actualAmountReceived.value)/1
        item.checked = true
    } else {
      item.amount = 0
      item.checked = false
    }
  })
})




const modifyAmountHandle = (type) => {
  if (deductionAmount.value > 0) {
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
    payableAmountModify.value = Math.floor(props.selectTotal / 1000) * 1000;
  }
  if (type == 2) {
    payableAmountModify.value = Math.ceil(props.selectTotal / 1000) * 1000;
  }
  if (type == 3) {
    payableAmountModify.value = Math.round(props.selectTotal / 1000) * 1000;
  }
}

//获取付款方式列表
function getMethodList() {
  getPayMethodList({ pageRow: 6, isPendingAccount: 1 }).then(res => {
    payTypeList.value = res.map((item, index) => {
      let { payName, id, payImage, type } = item
      let obj = {
        payName,
        id,
        payImage,
        type,
        amount: 0
      }
      if (index == 0) {
        // obj.amount = fenToYuan(actualAmountReceived.value)/1
        obj.checked = true
      }
      return obj
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
}

const pay = () => {
  sureModalShow.value = true
}

//结账
const surePay = () => {
  let typeList = payTypeList.value.filter(item => item.checked)
  let paymentInfo = JSON.stringify(typeList.map(item => {
    let { type, payName, id, amount } = item
    let obj = {
      type,
      payName,
      id,
      amount: yuanTofen(amount)
    }
    return obj
  }))
  let payableAmount = props.selectTotal
  if (payableAmountModify.value > 0) {
    payableAmount = payableAmountModify.value
  }
  let actualAmountReceived = payableAmount - deductionAmount.value

  let params = {
    paymentInfo,
    actualAmountReceived,
    deductionAmount: deductionAmount.value,
    creditAmount: payableAmount,
    creditIds: props.selectIds,
    remarks: formData.value.remarks
  }
  proxy.$modal.loading()
  creditCollection(params).then(res => {
    proxy.$modal.msgSuccess("支付成功");
    sureModalShow.value = false
    emit('getList')
  }).finally(() => {
    proxy.$modal.closeLoading()
  })
}

const formatAmount = (row) => {
  let amount = row?.sumAmount || row
  return '￥' + fenToYuan(amount)
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