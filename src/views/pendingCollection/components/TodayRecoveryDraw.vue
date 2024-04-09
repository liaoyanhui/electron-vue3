<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-03-04 17:26:59
 * @LastEditTime: 2024-03-19 20:12:19
 * @FilePath: /cbank-client/src/views/pendingCollection/components/TodayRecoveryDraw.vue
-->

<template>
  <el-drawer v-model="show" title="今日回收" direction="rtl" :show-close="false" destroy-on-close
    :before-close="handleClose" size="38%">
    <div v-if="dataSource?.length == 0" class="empty w100 text-center mt-50">
      <img src="../../../assets/img/cbank/empty/暂无今日回收@2x.png" alt="" width="">
      <div class="mt-20">暂无记录</div>
    </div>
    <div v-else class="detail" v-for="item in dataSource" :key="item.id">
      <el-row class="el-row">
        <el-col :span="12">挂账责任人： {{ item.creditUserName }}</el-col>
        <el-col :span="12">收款时间：{{ item.editTime }}</el-col>
        <el-col :span="12">回收操作人：{{ item.creditUpdateUserName }}</el-col>
        <el-col :span="12">回收账单号：<span class="color-red">{{ item.billNumber  }}</span></el-col>
        <el-col :span="12">挂账金额：￥{{ fenToYuan(item.creditAmount)   }}</el-col>
        <el-col :span="12">实付金额：￥{{  fenToYuan(item.actualAmountReceived)  }}</el-col>
        <el-col :span="12">调整金额：￥{{ fenToYuan(item.deductionAmount) }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8" v-for="item in item.paymentInfo" :key="item.id">
          {{item.payName}}：¥{{ fenToYuan(item.amount) }}
        </el-col >
      </el-row>
      <div class="btn" > 
        <el-button type="primary" @click="handleReturn(item)" v-if="item.status == 2">返回收</el-button> 
        <div v-else-if="item.status == 1">已返回收</div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { computed, reactive } from 'vue';
import { todayRecoveryList,backCredit } from '@/api/pendingCollection'
import { fenToYuan } from '@/utils';
const { proxy } = getCurrentInstance();
const props = defineProps({
  drawer: {
    type: Boolean,
    require: true,
    default: false
  },
 
})
const emit = defineEmits(['cancel', 'success','getList']);
const dataSource = ref([])

const show = computed(() => {
  if (props.drawer) {
    getTodayRecoveryList()
    return true
  } else {
    return false
  }
 
})

function handleClose() {
  emit('cancel')
}

function handleReturn(item) { 
  let {id} = item
  backCredit({ id }).then(res => {
    proxy.$modal.msgSuccess("反回收成功");
    getTodayRecoveryList()
    emit('getList')
  })
}

function getTodayRecoveryList() {
  todayRecoveryList().then(res => {
    res.map(item => {
      item.paymentInfo = JSON.parse(item.paymentInfo)
      return item
    })
    dataSource.value = res
  })
}

</script>

<style lang="scss" scoped>
.title {
  border-left: 4px solid #2AD1B7;
  padding-left: 10px;
}

.detail {

    margin-bottom: 30px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 10px;
    padding: 26px 24px;

    .el-row{
      .el-col{
        margin-bottom: 15px;
      }
    }
}

.btn {
  display: flex;
  justify-content: flex-end;
}
</style>