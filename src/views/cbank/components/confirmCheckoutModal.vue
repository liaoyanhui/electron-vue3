<!--
 * @Description: 确认收款弹框
 * @Author: pgm
 * @Date: 2024-02-20 15:39:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-15 14:56:34
 * @FilePath: /cbank-client/src/views/cbank/components/confirmCheckoutModal.vue
-->

<template>
  <el-dialog title="确认收款" v-model="show" width="550px" append-to-body destroy-on-close
    :before-close="handleBeforeClose">
    <div class="fs-16">
      <div class="mt-6"><span class="label mb-4">实付金额: </span> <span class="color-red fs-18">￥{{ fenToYuan(data.actualAmount|| 0) }}</span></div>
      <el-row>
        <el-col class="item" :span="10"  v-for="(item,index) in data.paymentMethodRespList" :key="index">
          <span class="label">{{ item.payName }}: </span>
          <EditAmountInput v-model:value="item.amount"></EditAmountInput>
        </el-col>
      </el-row>
      <el-row   v-for="(item,index) in data.securityRespList" :key="index" class="mt-10 mb-14">
        <el-col :span="10"><span class="label">挂账<span v-if="data.securityRespList.length>1">{{ index+1 }}</span>: </span><span>{{ fenToYuan(item.amount) }}</span></el-col>
        <el-col :span="12"><span class="label mr-6">挂账担保人: </span><span>{{ item.securityName }}</span></el-col>
      </el-row>
      <div class="mt-8"><span class="label">实收合计: </span><span class="color-red fs-18">￥{{ fenToYuan(receivedAmount || 0) }}</span></div>
      <div v-if="!isCheck" class="color-red mt-8 fs-12">*预警提醒：实收合计与总实付金额不匹配</div>
    </div>
    <template #footer>
      <div class="dialog-footer ">
        <el-button @click="cancel" size="large">取 消</el-button>
        <el-button v-if="isCheck" type="primary" size="large" class="submit" @click="submitForm">{{`确定`}}</el-button>
        <el-button v-else type="primary" size="large" class="submit" @click="submitForm">{{`继续确认收款` }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { affirmRoom,affirmMergeRoom } from '@/api/cbank'
import { computed } from 'vue';
import EditAmountInput from '@/components/EditAmountInput'
import { fenToYuan } from '@/utils';
const { proxy } = getCurrentInstance();
const props = defineProps({
  roomId: {
    type: [String,Number],
    require: true
  },
  consumeHistoryId: {
    type: [String,Number],
    require: true
  },
  value: {
    type: String,
    require: true,
  },
  data: {
    type: Object,
    require: true,
  },
  mergeType: { //并台类型：0：未并台, 1 :主并台 2：次并台
    type: Number,
    require:true
  }
})
const emit = defineEmits(['update:value', 'pageInit']);
const isCheck = ref(true)
const selectRoomInfo = ref({})

// const {actualAmount,paymentMethodRespList,securityRespList,billIds} = toRefs(props.data || {
//         actualAmount: 0,
//         billIds: '',
//         paymentMethodRespList: [],
//         receivedAmount: 0,
//         securityRespList: []
//       })
const show = computed(() => {
  if (props.value == 'confirmCheckoutModal') {

  } 
  return props.value == 'confirmCheckoutModal'
})
const receivedAmount = computed(() => {
  const {actualAmount,paymentMethodRespList,securityRespList}  = props.data
  const paymentTotal = paymentMethodRespList.reduce((total, item) => total + item.amount/1, 0);
  const securityTotal = securityRespList.reduce((total, item) => total + item.amount/1, 0) ;
  let total = paymentTotal + securityTotal
  // if (receivedAmount.value == totoal) {
  //   isCheck.value = true
  // }
  let isTrue = actualAmount == total
  if (!isCheck.value) {
    isCheck.value = isTrue
  }
  return total
})


function handleBeforeClose() {
  cancel()
}

function submitForm() {
  const {actualAmount,paymentMethodRespList,securityRespList,billIds}  = props.data
  let { roomId } = props
  if (isCheck.value) {
    let isTrue = receivedAmount.value == actualAmount
  
    isCheck.value = isTrue
    console.log('isTrue',isCheck.value)
    if (!isTrue) {
      return
    }
  }
  let params = {
    roomId,
    isCheck: isCheck.value ? 0 : 1,
    actualAmount,
    receivedAmount: receivedAmount.value,
    billIds,
    paymentInfo: JSON.stringify(paymentMethodRespList),
    securityInfo: JSON.stringify(securityRespList)
  }
  proxy.$modal.loading()
  let func = props.mergeType != 0 ? affirmMergeRoom: affirmRoom
  func(params).then(res => {
    emit('pageInit')
    cancel()
    proxy.$modal.msgSuccess("操作成功");
  }).finally(() => {
    proxy.$modal.closeLoading()
  })

  // affirmRoom({ roomId, consumeHistoryId }).then((res) => {
  //   emit('reset')
  // })
  


}

function cancel() {
  emit('update:value', '')
  selectRoomInfo.value = {};
}
</script>

<style lang="scss" scoped>
.label{
  display: inline-block;
  width: 90px;
  text-align: right;
  margin-right: 10px ;
}
.item{
  height: 45px;
  display: flex;
  align-items: center;
}
.dialog-footer{
  button{
    width: 120px;
  }
  .submit{
    margin-left:40px
  }
}
</style>