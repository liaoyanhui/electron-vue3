<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-22 14:02:11
 * @LastEditTime: 2024-03-11 20:38:30
 * @FilePath: /cbank-client/src/views/system/giftPermission/Modal/RechargeRecord.vue
-->

<template>
  <el-dialog title="充值记录" :model-value="visible" width="790px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <el-table v-loading="loading"  ref="tableRef" :data="rechargeList">
      <el-table-column label="艺名" align="center" key="nickname" prop="nickname" />
      <el-table-column label="充值金额" align="center" key="topupPrice" prop="topupPrice" :formatter="(a,b,c,d) => fenToYuan(c)"/>
      <el-table-column label="操作人" align="center" key="addUsername" prop="addUsername"  />
      <el-table-column label="充值时间" align="center" key="addTime" prop="addTime" />
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageRow"
      @pagination="getList"/>
  </el-dialog>
</template>

<script setup>
  import { getTopUpRecord } from '@/api/gift';
  import { fenToYuan, yuanTofen } from '@/utils'
  const { proxy } = getCurrentInstance();

  const loading = ref(false);
  const rechargeList = ref([])

  const total = ref(0);
  const props = defineProps({
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
    dataSource: {
      type: Array,
      require: true,
      default: null
    }
  })
  const data = reactive({
    queryParams: {
      pageNum: 1,
      pageRow: 10,
    },
  });


  const emit = defineEmits([ 'cancel', 'success']);
  const { visible, dataSource } = toRefs(props);
  const { queryParams } = toRefs(data);

  function getList() {
    loading.value = true;
    try {
      getTopUpRecord({ids: dataSource.value,...queryParams.value}).then(res => {
        if(res) {
          total.value = res.count;
          rechargeList.value = res.list;
        }
        loading.value = false;
      })
    } catch (error) {
      loading.value = false;
    }
  }

  function handleBeforeClose() {
    emit('cancel');
  }

  getList();
</script>
