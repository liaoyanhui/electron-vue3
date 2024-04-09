<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-29 11:38:34
 * @LastEditTime: 2024-03-22 01:27:34
 * @LastEditTime: 2024-03-15 18:05:42
 * @FilePath: /cbank-client/src/views/bookingPerformance/GroupBookingPerformance.vue
-->
<template>
  <div class="app-container content-box p-24">
    <div class="search">
      <el-row>
        <el-col :lg="10">
          <div class="mr-8 mb-8">
            <span class="px-6 label">日期</span>
              <el-date-picker
              v-model="queryParams.dateTime"
              type="daterange"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              placeholder="请选择日期"
              :clearable="false"
            />
          </div>
        </el-col>
        <el-col :lg="7">
          <div class="mr-8 mb-8">
            <span class="px-6 label">分组</span>
            <SelectPeople v-model:value="queryParams.organizationId" :typeFilter="[3]"  placeholder="请选择" automatic-dropdown
              style="width: 200px">
            </SelectPeople>
          </div>
        </el-col>
      </el-row>
      
      <el-button class="mb-8" type="primary" @click="handleQuery">查询</el-button>
      <el-button class="mb-8" @click="handleReset">重置</el-button>
      <el-button class="mb-8" @click="handleExport">导出</el-button>
    </div>
    <div>
      <el-table :data="tableList" 
        class="ml10 tbg" ref="tableRef">
        <el-table-column label="组名" align="center" prop="deptName" />
        <el-table-column label="自订房" align="center" prop="bookingRoom">
          <template #default="scope">
            <el-button link type="primary" @click="handleMore(scope.row.organizationId, 2)" class="more">{{ scope.row.bookingRoom }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="自定提成" align="center" prop="bookingRoomCommission" :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="返房" align="center" prop="returnRoom" :show-overflow-tooltip="true">
           <template #default="scope">
            <el-button link type="primary" @click="handleMore(scope.row.organizationId, 3)" class="more">{{ scope.row.returnRoom }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="返房提成" align="center" prop="returnRoomCommission" :formatter="(a,b,c,d) => fenToYuan(c)"  />
        <el-table-column label="总订房" align="center" sortable prop="allBooking" :show-overflow-tooltip="true">
           <template #default="scope">
            <el-button link type="primary" @click="handleMore(scope.row.organizationId, 1)" class="more">{{ scope.row.allBooking }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="总提成" align="center" prop="allBookingCommission" :show-overflow-tooltip="true" :formatter="(a,b,c,d) => fenToYuan(c)"  />
        <el-table-column label="业绩" align="center" prop="assessPerformance" :show-overflow-tooltip="true"  :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="挂账金额" align="center" prop="pendingAccount" :show-overflow-tooltip="true"  :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="挂账回收" align="center" prop="pendingAccountRecovery" :show-overflow-tooltip="true"  :formatter="(a,b,c,d) => fenToYuan(c)" />
        <!-- <el-table-column label="本月累计" align="center">
          <el-table-column label="房台数" align="center" prop="roomCount" :show-overflow-tooltip="true"  />
          <el-table-column label="提成" align="center" prop="monthCommission" :show-overflow-tooltip="true" :formatter="(a,b,c,d) => fenToYuan(c)" />
          <el-table-column label="业绩" align="center" prop="achievement" :show-overflow-tooltip="true" :formatter="(a,b,c,d) => fenToYuan(c)"  />
        </el-table-column> -->
      </el-table>
    </div>
    <GroupModal v-if="visible" :visible="visible" @cancel="handleCancel" @success="handleSuccess" :dataSource="dataSource"/>
  </div>
</template>

<script setup>
  import { deptBookingPerformance, deptBookingPerformanceExport } from '@/api/bookingPerformance';
  import dayjs from 'dayjs';
  import { blobToFile,getNowDay } from '@/utils/index.js'
  import { getCompanyRoomList } from "@/api/system/room-system";
  import SelectPeople from '@/components/SelectPeople/SelectPeople.vue';
  import { fenToYuan, yuanTofen } from '@/utils/index.js';
  import { productDishInfo } from '@/api/product';
  import useProduceStore from '@/store/produce';
  import GroupModal from './Modal/GroupModal.vue';

  const { proxy } = getCurrentInstance();
  const produceStore = useProduceStore();

  const visible = ref(false);
  const dataSource = ref(null);
  const tableList = ref([{}]);
  const initData = {
    dateTime: [getNowDay(),getNowDay()],
    organizationId: undefined,
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
    if(queryParams.value.dateTime && queryParams.value.dateTime.length > 1) {
      data.startTime = queryParams.value.dateTime[0];
      data.endTime = queryParams.value.dateTime[1];
    }
    deptBookingPerformance(data).then(res => {
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
      if(queryParams.value.dateTime && queryParams.value.dateTime.length > 1) {
        data.startTime = queryParams.value.dateTime[0];
        data.endTime = queryParams.value.dateTime[1];
      }
      return deptBookingPerformanceExport(data);
    }).then((res) => {
        blobToFile(res, '分组订房业绩.xlsx')
        proxy.$modal.msgSuccess("导出成功");
      }).catch(function () {
    });
  }

  function handleMore(id,type) {
    let data = {
      organizationId: id,
      bookingType: type
    }
    if(queryParams.value.dateTime && queryParams.value.dateTime.length > 1) {
      data.startTime = queryParams.value.dateTime[0];
      data.endTime = queryParams.value.dateTime[1];
    }
    dataSource.value = {
      ...data
    };
    visible.value = true;
  }

  function handleCancel() {
    visible.value = false;
    dataSource.value = null;
  }

  function handleSuccess() {
    visible.value = false;
    dataSource.value = null;
  }
  getList();
</script>

<style lang="scss" scoped>
.search {
  .label {
    display: inline-block;
    width: 100px;
  }
}
.content-box {
  border-radius: 10px;
  background: #323745;
}
.more {
  cursor: pointer;
}
</style>