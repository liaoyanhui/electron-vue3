<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-29 11:38:34
 * @LastEditTime: 2024-03-07 19:08:01
 * @FilePath: /cbank-client/src/views/reportForms/statisticalSummary/DutySummary.vue
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
            <span class="px-6">包厢管理员</span>
            <SelectPeople v-model:value="queryParams.id"  v-model:type="queryParams.type" :typeFilter="[2]"  placeholder="请选择" automatic-dropdown
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
      <el-table :data="tableList" class="ml10 tbg" ref="tableRef">
        <el-table-column label="序号" type="index" align="center" width="60" />
        <el-table-column label="艺名" align="center" prop="month" />
        <el-table-column label="值班天数" align="center" prop="pendingUser"  />
        <el-table-column label="值班房台" align="center" prop="pendingAccount" />
        <el-table-column label="当月剩余可用" align="center" prop="recoveryAmount" :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="当月超额" align="center" prop="noRecoveryAmount" :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="当月充值" align="center" prop="noRecoveryAmount" :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="当月扣除" align="center" prop="noRecoveryAmount" :formatter="(a,b,c,d) => fenToYuan(c)" />
      </el-table>
      <pagination  v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageRow" @pagination="getList" />
    </div>
  </div>
</template>

<script setup>
  import { pendingAccount, pendingAccountExport } from '@/api/collect';
  import dayjs from 'dayjs';
  import { blobToFile } from '@/utils/index.js'
  import SelectPeople from '@/components/SelectPeople/SelectPeople.vue';
  import { fenToYuan,getNowDay } from '@/utils/index.js';

  const { proxy } = getCurrentInstance();
  
  const roomList = ref([]);
  const tableList = ref([]);
  const total = ref(0);

  const initData = {
    pageNum: 1,
    pageRow: 10,
    dateTime: [getNowDay(),getNowDay()],
    id: undefined,
    type: undefined,
  };
  const data = reactive({
    queryParams: {
      ...initData,
    },
  });

  const { queryParams, form } = toRefs(data); 
  function getList() {
    const data = {
      ...queryParams.value
    };
    if(queryParams.value.dateTime && queryParams.value.dateTime.length > 1) {
      data.startTime = queryParams.value.dateTime[0];
      data.endTime = queryParams.value.dateTime[1];
    }
    pendingAccount(data).then(res => {
      if(res) {
        // total.value = res.count;
        // tableList.value = res.list;
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
      return pendingAccountExport(data);
    }).then((res) => {
        blobToFile(res, '值班汇总.xlsx')
        proxy.$modal.msgSuccess("导出成功");
      }).catch(function () {
    });
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
</style>