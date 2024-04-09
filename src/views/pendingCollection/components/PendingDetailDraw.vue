<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-03-04 17:26:59
 * @LastEditTime: 2024-03-15 14:53:58
 * @FilePath: /cbank-client/src/views/pendingCollection/components/PendingDetailDraw.vue
-->

<template>
  <el-drawer
    v-model="drawer"
    title="详情"
    direction="rtl"
    :show-close="false"
    destroy-on-close
    :before-close="handleClose"
    size="38%"
  >
    <div class="detail">
      <div class="title">挂账信息</div>
      <el-row class="el-row">
        <el-col :span="12">挂账时间： {{ dataSource.addTime }}</el-col>
        <el-col :span="12">开包时间：{{ dataSource.openRoomTime }}</el-col>
        <el-col :span="12">包厢名称：{{ dataSource.roomName  }}</el-col>
        <el-col :span="12">客人：{{ dataSource.custName }}</el-col>
        <el-col :span="12">挂账操作人：{{  dataSource.operationUserName  }}</el-col>
        <el-col :span="12">挂账：<span class="color-red">￥{{ fenToYuan(dataSource.creditAmount) }}</span></el-col>
        <el-col :span="12">挂账责任人：<span class="color-red">{{ dataSource.creditName }}</span></el-col>
      </el-row>
      <div class="title mt-30">账单信息</div>
      <el-row>
        <el-col :span="12">结账账单号：<span class="color-red">{{ dataSource.billNumber }}</span> </el-col>
        <el-col :span="12">应付金额：￥{{ fenToYuan(dataSource.payableAmount )}}</el-col>
        <el-col :span="12" v-for="item in paymentMethodList" :key="item.id">
          {{item.payName}}：¥{{ fenToYuan(item.amount) }}
        </el-col >
      </el-row>
     
    </div>
  </el-drawer>
</template>

<script setup>
import { fenToYuan } from '@/utils/index.js';
import { computed } from 'vue';

  const props = defineProps({
    drawer: {
      type: Boolean,
      require: true,
      default: false
    },
    dataSource: {
      type: Object,
      default: {},
    }
  })
const emit = defineEmits(['cancel', 'success']);
const {drawer,dataSource} = toRefs(props)

const paymentMethodList = computed(()=> dataSource.value.paymentMethod? JSON.parse(dataSource.value.paymentMethod):[])

  const tableList = ref([]);

function handleClose() {
  emit('cancel')
}
</script>

<style lang="scss" scoped>
  .title {
    border-left: 4px solid #2AD1B7;
    padding-left: 10px;
  }
  .el-row{
    .el-col{
      margin-top: 16px;
    }
  }
  .detail {
    > ul {
      margin-bottom: 30px;
      li {
        display: flex;
        margin: 15px 0;
        span {
          flex: 1;
          font-size: 16px;
        }
      }
    }
  }
</style>