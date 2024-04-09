<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-19 16:07:18
 * @LastEditTime: 2024-03-18 16:47:08
 * @FilePath: /cbank-client/src/views/memberManagement/memberInfo/memberInformation/Modal/CardInfoModal.vue
-->

<template>
  <el-dialog title="会员卡信息" :model-value="visible" width="508px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <el-table el-table :data="tableList" class="ml10" ref="tableRef">
      <el-table-column label="序号" align="center" type="index" width="60" />
      <el-table-column label="卡号" align="center" prop="accountCardNumber" :show-overflow-tooltip="true" />
      <el-table-column label="充值余额" align="center" prop="accountBalanceRecharge" />
      <el-table-column label="赠送余额" align="center" prop="accountBalanceDonate" />
    </el-table>
  </el-dialog>
</template>

<script setup>
  import { getMemberCardListById } from '@/api/member';
  import { fenToYuan, yuanTofen } from '@/utils/index.js';

  const { proxy } = getCurrentInstance();
  const total = ref(0);
  const tableList = ref([]);
  const props = defineProps({
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
    dataSource: {
      type: Number,
      default: null,
    },
  })

  const data = reactive({
    queryParams: {
    
    },
  })

  const emit = defineEmits([ 'cancel' ]);

  const { visible, dataSource } = toRefs(props);
  const { queryParams } = toRefs(data);

  watch(
    () => dataSource.value,
    val => {
      if(val) {
        queryParams.value.memberId = val;
        getCardTypeList();
      }
    },
    { deep: true, immediate: true }
  )
  function handleBeforeClose() {
    cancel();
  }

  function cancel() {
    emit('cancel');
    queryParams.value = {
      
    };
  }

  function getCardTypeList() {
    getMemberCardListById(queryParams.value).then(res => {
      if(res) {
        tableList.value = res;
      }
    })
  }
</script>

<style lang="scss" scoped>
</style>