<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-29 11:38:34
 * @LastEditTime: 2024-03-22 01:28:11
 * @FilePath: /cbank-client/src/views/reportForms/statisticalSummary/CashierSummary.vue
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
            <span class="px-6 label">收银员</span>
            <SelectPeople v-model:value="queryParams.pendingAccountUserId"  placeholder="请选择订房人" automatic-dropdown
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
        <el-table-column v-for="(item,index) in getHeader()" :key="index" :label="item.label" align="center" :prop="item.prop"
        :formatter="(a,b,c,d) => item.isPrice ? fenToYuan(c) : c">
          <template v-if="item.children">
            <el-table-column v-for="(child,childIndex) in item.children" :key="childIndex" :label="child.label" align="center" :prop="child.prop" :show-overflow-tooltip="true"  />
          </template>
        </el-table-column>
      </el-table>
      <pagination  v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageRow" @pagination="getList" />
    </div>
  </div>
</template>

<script setup>
  import { bookingSelect, bookingSelectExport } from '@/api/synthesis';
  import dayjs from 'dayjs';
  import { blobToFile,getNowDay } from '@/utils/index.js'
  import SelectPeople from '@/components/SelectPeople/SelectPeople.vue';
  import { fenToYuan, yuanTofen } from '@/utils/index.js';

  const { proxy } = getCurrentInstance();
  
  const roomList = ref([]);
  const tableList = ref([]);
  const total = ref(0);

  const initData = {
    pageNum: 1,
    pageRow: 10,
    dateTime: [getNowDay(),getNowDay()],
    pendingAccountUserId: undefined,
  };
  const data = reactive({
    queryParams: {
      ...initData,
    },
  });

  const { queryParams, form } = toRefs(data); 
  // 动态表头
  function getHeader() {
    return [
      { label: '日期', prop: 'companyDay'},
      { label: '收银员', prop: 'roomName'},
      { label: '开台数量', prop: 'customerSource'},
      { label: '结账金额', prop: 'checkoutPrice', isPrice: true},
      { label: '实付金额', prop: 'checkoutPrice', isPrice: true},
      { label: '挂账回收', prop: 'checkoutPrice', isPrice: true},
      { label: '付款方式', prop: 'payMethod', children: [
        { label: '支付宝', prop: 'zfb' },
      ] },
      { label: '明细汇总', prop: 'roomManager' },
    ]
  }
  function getList() {
    const data = {
      ...queryParams.value
    };
    if(queryParams.value.dateTime && queryParams.value.dateTime.length > 1) {
      data.startTime = queryParams.value.dateTime[0];
      data.endTime = queryParams.value.dateTime[1];
    }
    bookingSelect(data).then(res => {
      if(res) {
        total.value = res.count;
        tableList.value = res.list;
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
      return bookingSelectExport(data);
    }).then((res) => {
        blobToFile(res, '收银汇总.xlsx')
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