<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-29 11:38:34
 * @LastEditTime: 2024-03-06 20:47:10
 * @FilePath: /cbank-client/src/views/reportForms/statisticalSummary/GiftSummary.vue
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
              :disabled-date="disabledDate"
              @calendar-change="calendarChange"
            />
          </div>
        </el-col>
        <el-col :lg="7">
          <div class="mr-8 mb-8">
            <span class="px-6 label">艺名</span>
            <SelectPeople v-model:value="queryParams.id"  v-model:type="queryParams.type"  placeholder="请选择" automatic-dropdown
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
        <el-table-column label="艺名" align="center" prop="nickname" />
        <el-table-column label="赠送金额" align="center" prop="allGiftPrice" :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="当月赠送金额" align="center" prop="monthGiftPrice" :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="当月剩余可用" align="center" prop="monthRemainingAvailable" :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="当月超额" align="center" prop="monthExcess" :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="当月充值" align="center" prop="monthRecharge" :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="当月扣除" align="center" prop="monthDeduction" :formatter="(a,b,c,d) => fenToYuan(c)" />
      </el-table>
      <pagination  v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageRow" @pagination="getList" />
    </div>
  </div>
</template>

<script setup>
  import { giftTotal, giftTotalExport } from '@/api/collect';
  import dayjs from 'dayjs';
  import { blobToFile } from '@/utils/index.js'
  import SelectPeople from '@/components/SelectPeople/SelectPeople.vue';
  import { fenToYuan, getNowDay } from '@/utils/index.js';

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
    giftTotal(data).then(res => {
      if(res) {
        total.value = res.count;
        tableList.value = res.list;
      }
    })
  }

  const firstChooseDate = ref();
  const calendarChange = (val) => {
    firstChooseDate.value = val[0].getTime(); //点击第一次选中日期
    if (val[1]) firstChooseDate.value = ""; // 选中后清空
  };

  const disabledDate= (time) => {
    if (firstChooseDate.value) {
      const lastTime = dayjs(firstChooseDate.value).endOf("month").valueOf() ; // 选中日期当月最后一天
      const firstTime = dayjs(firstChooseDate.value).startOf("month").valueOf();// 选中日期当月第一天
      return time.getTime() > lastTime || time.getTime() < firstTime;
    }
  };

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
      return giftTotalExport(data);
    }).then((res) => {
        blobToFile(res, '赠送汇总.xlsx')
        proxy.$modal.msgSuccess("导出成功");
      }).catch(function () {
    });
  }

  getList();
</script>

<style lang="scss" scoped>
.search {
  // display: flex;
  // align-items: center;
  // margin: 0 0 24px 0;
  // flex-wrap: wrap;
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