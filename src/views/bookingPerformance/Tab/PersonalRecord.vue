<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-29 11:38:34
 * @LastEditTime: 2024-03-16 15:04:05
 * @FilePath: /cbank-client/src/views/bookingPerformance/Tab/PersonalRecord.vue
-->
<template>
  <div class="app-container">
    <div class="search">
      <div class="mr-8 mb-8">
        <span class="px-6">日期</span>
          <el-date-picker
            v-model="queryParams.year"
            type="year"
            placeholder="请选择年份"
            :clearable="false"
          />
      </div>
      <div class="mr-8 mb-8">
        <span class="px-6">艺名</span>
        <SelectPeople v-model:value="queryParams.id"  v-model:type="queryParams.type" placeholder="请选择" automatic-dropdown :typeFilter="[2,3]"
          style="width: 200px">
        </SelectPeople>
      </div>
      
      <el-button class="mb-8" type="primary" @click="handleQuery">查询</el-button>
      <el-button class="mb-8" @click="handleReset">重置</el-button>
      <el-button class="mb-8" @click="handleExport">导出</el-button>
    </div>
    <div>
      <el-table :data="tableList" 
        class="ml10 tbg" ref="tableRef">
        <el-table-column label="月份" align="center" prop="month" />
        <el-table-column label="艺名" align="center" prop="name" />
        <el-table-column label="自订房" align="center" prop="selfBookingRoom" />
        <el-table-column label="返房" align="center" prop="returnRoom" :show-overflow-tooltip="true"  />
        <el-table-column label="总订房" align="center" sortable prop="allSelfBookingRoom" :show-overflow-tooltip="true"  />
        <el-table-column label="提成" align="center" prop="commission" :show-overflow-tooltip="true" :formatter="(a,b,c,d) => fenToYuan(c)"  />
        <el-table-column label="业绩" align="center" prop="assessPerformance" :show-overflow-tooltip="true"  :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="挂账回收" align="center" prop="pendingAccountRecovery" :show-overflow-tooltip="true"  :formatter="(a,b,c,d) => fenToYuan(c)" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
  import { monthPersonPerformanceTotal, monthPersonPerformanceTotalExport } from '@/api/bookingPerformance';
  import dayjs from 'dayjs';
  import { blobToFile } from '@/utils/index.js'
  import { getCompanyRoomList } from "@/api/system/room-system";
  import SelectPeople from '@/components/SelectPeople/SelectPeople.vue';
  import { fenToYuan, yuanTofen } from '@/utils/index.js';
  import { productDishInfo } from '@/api/product';
  import useProduceStore from '@/store/produce';

  const { proxy } = getCurrentInstance();
  const produceStore = useProduceStore();

  const dataType = ref(null);
  const tableList = ref([{}]);

  function getCurrentMoment() {
    return dayjs().format('YYYY')
  }

  const initData = {
    year: getCurrentMoment(),
    id: undefined,
    type: undefined,
  };
  const data = reactive({
    queryParams: {
      ...initData,
    },
  });

  const { queryParams } = toRefs(data); 

  function getList() {
    const data = {
      ...queryParams.value
    };
    monthPersonPerformanceTotal(data).then(res => {
      if(res) {
        tableList.value = res;
      }
    })
  }


  function handleQuery() {
    getList();
  }
  function handleReset() {
    queryParams.value = { ...initData };
    getList();
  }
  function handleExport() {
    proxy.$modal.confirm('是否导出数据?').then(function () {
      const data = { ...queryParams.value }
      return monthPersonPerformanceTotalExport(data);
    }).then((res) => {
        blobToFile(res, '个人查询.xlsx')
        proxy.$modal.msgSuccess("导出成功");
      }).catch(function () {
    });
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