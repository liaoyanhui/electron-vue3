<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-29 11:38:34
 * @LastEditTime: 2024-03-22 01:31:33
 * @FilePath: /cbank-client/src/views/reportForms/comprehensiveStatistics/PendingAccountRecoveryDetails.vue
-->
<template>
  <div class="app-container content-box p-24">
    <div class="search">
      <el-row>
        <el-col :lg="10">
          <div class="mr-8 mb-8">
            <span class="px-6 label">回收时间</span>
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
        <el-col :lg="10">
          <div class="mr-8 mb-8">
            <span class="px-6 label">挂账时间</span>
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
            <span class="px-6 label">挂账责任人</span>
            <SelectPeople v-model:value="queryParams.pendingAccountUserId" v-model:type="queryParams.pendingAccountUserType" :typeFilter="[2,3]" placeholder="请选择" automatic-dropdown
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
        <el-table-column label="序号" type="index" width="60" />
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
  import { bookingPerformance, bookingPerformanceExport } from '@/api/synthesis';
  import SelectPeople from '@/components/SelectPeople/SelectPeople.vue';
  import { fenToYuan,blobToFile, getNowDay } from '@/utils/index.js';

  const { proxy } = getCurrentInstance();
  

  const tableList = ref([]);
  const total = ref(0);
  const initData = {
    pageNum: 1,
    pageRow: 10,
     dateTime: [getNowDay(),getNowDay()],
    pendingAccountUserId: undefined,
    pendingAccountUserType: undefined,
  };
  const data = reactive({
    queryParams: {
      ...initData,
    },
  });

  const { queryParams } = toRefs(data); 

  // 动态表头
  function getHeader() {
    return [
      { label: '日期', prop: 'companyDay'},
      { label: '回收时间', prop: 'roomName'},
      { label: '挂账时间', prop: 'customerSource'},
      { label: '回收账单号', prop: 'openTime'},
      { label: '结账单号', prop: 'openTime'},
      { label: '房台', prop: 'orderNumber'},
      { label: '客人', prop: 'orderNumber'},
      { label: '挂账责任人', prop: 'orderNumber'},
      { label: '挂账金额', prop: 'checkoutPrice', isPrice: true},
      { label: '回收实付金额', prop: 'checkoutPrice', isPrice: true},
      { label: '回收操作人', prop: 'roomManager' },
      { label: '是否异常操作', prop: 'roomManager' },
      { label: '备注', prop: 'remarks' },
      { label: '付款方式', prop: 'payMethod', children: [
        { label: '支付宝', prop: 'zfb' },
      ] },
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
    bookingPerformance(data).then(res => {
      if(res) {
        total.value = res.count;
        tableList.value = res.list;
        // totalAmount.value = {
        //   allOrderPrice: res.allOrderPrice,
        //   allActualPaymentPrice: res.allActualPaymentPrice,
        //   allPendingPrice: res.allPendingPrice,
        // }
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
      return bookingPerformanceExport(data);
    }).then((res) => {
        blobToFile(res, '挂账回收明细.xlsx')
        proxy.$modal.msgSuccess("导出成功");
      }).catch(function () {
    });
  }
  function handleTableRestoration() {}

  getList();
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  align-items: center;
  margin: 0 0 24px 0;
  flex-wrap: wrap;
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