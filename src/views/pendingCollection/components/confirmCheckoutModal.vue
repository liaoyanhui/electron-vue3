<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-03-04 15:26:54
 * @LastEditTime: 2024-03-11 17:05:42
 * @FilePath: /cbank-client/src/views/pendingCollection/components/confirmCheckoutModal.vue
-->

<template>
  <el-dialog title="确认收款"  width="550px" append-to-body destroy-on-close
    :before-close="cancel">
    <div class="fs-16">
      <div class="mt-6"><span class="label mb-4">实付金额: </span> <span class="color-red fs-18">￥{{ fenToYuan(amount|| 0) }}</span></div>
      <div class="mt-8"><span class="label">实收合计: </span><span class="color-red fs-18">￥{{ fenToYuan(receivedAmount || 0) }}</span></div>
      <div v-if="!isCheck" class="color-red mt-8 fs-12 ml-20">*预警提醒：实收合计与总实付金额不匹配</div>
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
import { computed } from 'vue';
import { fenToYuan,yuanTofen } from '@/utils';
const { proxy } = getCurrentInstance();
const props = defineProps({
  amount: {
    type: Number,
    require: true,
  },
  typeList: {
    type: Array,
    require: true,
    default : []
  }
})
const emit = defineEmits(['sure', 'cancel']);
const isCheck = ref(true)
const receivedAmount = computed(() => {
  const paymentTotal = props.typeList.reduce((total, item) => total + yuanTofen(item.amount) / 1, 0);
  isCheck.value = props.amount == paymentTotal
  return paymentTotal
})

function submitForm() {
    emit('sure')
}

function cancel() {
  emit('cancel')
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