<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-03-02 21:17:27
 * @LastEditTime: 2024-03-15 17:58:21
 * @FilePath: /cbank-client/src/views/bookingPerformance/Modal/GroupModal.vue
-->
<template>
  <el-dialog title="订房明细" :model-value="visible" width="950px" append-to-body destroy-on-close :before-close="handleBeforeClose" lock-scroll>
    <div class="search">
      <div class="mr-8 mb-8">
        <span class="px-6">订房人</span>
        <SelectPeople v-model:value="queryParams.id" v-model:type="queryParams.type" placeholder="请选择订房人" automatic-dropdown
          style="width: 200px">
        </SelectPeople>
      </div>
      <el-button class="mb-8" type="primary" @click="handleQuery">查询</el-button>
      <el-button class="mb-8" @click="handleReset">重置</el-button>
    </div>
    <el-table :data="tableList" class="mt-40" ref="table2Ref">
      <el-table-column label="日期" align="center" prop="companyDay" :show-overflow-tooltip="true" />
      <el-table-column label="房台" align="center" prop="roomName" :show-overflow-tooltip="true" />
      <el-table-column label="主单" align="center" prop="orderNumber" :show-overflow-tooltip="true" />
      <el-table-column label="开台" align="center" prop="openTime" :show-overflow-tooltip="true" />
      <el-table-column label="关台" align="center" prop="closeTime" :show-overflow-tooltip="true" />
      <el-table-column label="提成业绩" align="center" prop="assessPerformance" :show-overflow-tooltip="true" :formatter="(a,b,c,d) => fenToYuan(c)" />
      <el-table-column label="提成" align="center" prop="commission" :show-overflow-tooltip="true" :formatter="(a,b,c,d) => fenToYuan(c)" />
      <el-table-column label="订房人" align="center" prop="bookingUserName" :show-overflow-tooltip="true" />
      <el-table-column label="返房人" align="center" prop="returnUserName" :show-overflow-tooltip="true" />
      <el-table-column label="带房人" align="center" prop="housekeeperUserName" :show-overflow-tooltip="true" />
      <el-table-column label="房台低消" align="center" prop="lowConsumption" :show-overflow-tooltip="true" :formatter="(a,b,c,d) => fenToYuan(c)"/>
      <el-table-column label="实收金额" align="center" prop="actualAmountReceived" :show-overflow-tooltip="true" :formatter="(a,b,c,d) => fenToYuan(c)"/>
    </el-table>
    <pagination  v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageRow" @pagination="getList" />
  </el-dialog>
</template>

<script setup>
  import { deptBookingPerformanceDetail } from '@/api/bookingPerformance';
  import SelectPeople from '@/components/SelectPeople/SelectPeople.vue';
  import { fenToYuan, yuanTofen } from '@/utils/index.js';
  // organizationId
  const tableList = ref([]);
  const total = ref(0);
  const props = defineProps({
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
    dataSource: {
      type: Object,
      default: null
    }
  })
  const data = reactive({
    queryParams: {
      pageNum: 1,
      pageRow: 10,
      id: undefined,
      type: undefined,
    },
  });

  const { queryParams, rules } = toRefs(data);
  const emit = defineEmits([ 'cancel', 'success']);
  const { visible, dataSource } = toRefs(props);

  function handleBeforeClose() {
    emit('cancel');
  }

  function handleQuery() {
    getList();
  }
  
  function handleReset() {
    queryParams.value = {
      ...queryParams.value,
      pageNum:1,
      pageRow: 10,
    }
    getList();
  }

  function getList() {
    if(dataSource.value) {
      const data = {
        ...queryParams.value,
        ...dataSource.value,
      };
      deptBookingPerformanceDetail(data).then(res => {
        if(res) {
          tableList.value = res.list;
          total.value = res.count;
        }
      })
    }
  }
 
  getList();
</script>



<style lang="scss" scoped>
.search {
  display: flex;
  align-items: center;
  margin: 0 0 24px 0;
  flex-wrap: wrap;
}
</style>