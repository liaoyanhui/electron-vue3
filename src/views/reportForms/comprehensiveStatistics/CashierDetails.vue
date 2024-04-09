<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-29 11:38:34
 * @LastEditTime: 2024-03-15 17:48:58
 * @FilePath: /cbank-client/src/views/reportForms/comprehensiveStatistics/CashierDetails.vue
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
            <span class="px-6 label">房台</span>
            <el-select
              v-model="queryParams.roomId"
              class="m-2 mr-8"
              placeholder="请选择"
              style="width: 200px"
              clearable
              filterable
            >
              <el-option
                v-for="item in roomList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :lg="7">
          <div class="mr-8 mb-8">
            <span class="px-6 label">客源</span>
            <el-select
              v-model="queryParams.customerSource"
              class="m-2 mr-8"
              placeholder="请选择"
              style="width: 200px"
              clearable
              filterable>
              <el-option
                v-for="item in customerSourceList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :lg="10">
          <div class="mr-8 mb-8">
            <span class="px-6 label">主账单号</span>
            <el-input v-model="queryParams.orderNumber" clearable placeholder="请输入" style="width: 200px"/>
          </div>
        </el-col>
        <el-col :lg="7">
          <div class="mr-8 mb-8">
            <span class="px-6 label">包厢管理员</span>
            <SelectPeople v-model:value="queryParams.roomManagerUserId" v-model:type="queryParams.roomManagerUserType" :typeFilter="[2]" placeholder="请选择" automatic-dropdown
              style="width: 200px">
            </SelectPeople>
          </div>
        </el-col>
        <el-col :lg="7">
          <div class="mr-8 mb-8">
            <span class="px-6 label">收银账操作人</span>
            <SelectPeople v-model:value="queryParams.checkoutUserId" v-model:type="queryParams.checkoutUserType" :typeFilter="[1]" placeholder="请选择" automatic-dropdown
              style="width: 200px">
            </SelectPeople>
          </div>
        </el-col>
        <el-col :lg="10">
          <div class="mr-8 mb-8">
            <span class="px-6 label">付款方式</span>
            <el-select
              v-model="queryParams.payMethod"
              class="m-2 mr-8"
              placeholder="请选择"
              style="width: 200px"
              clearable
              filterable>
              <el-option
                v-for="item in payMethodList"
                :key="item.id"
                :label="item.payName"
                :value="item.id"
              />
            </el-select>
          </div>
        </el-col>
      </el-row>
      
      <el-button class="mb-8" type="primary" @click="handleQuery">查询</el-button>
      <el-button class="mb-8" @click="handleReset">重置</el-button>
      <el-button class="mb-8" @click="handleExport">导出</el-button>
    </div>
    <div>
      <div class="mb-8">
        <span class="mr-8">结账汇总：￥{{ fenToYuan(totalAmount.allOrderPrice) }}</span>
        <span class="mr-8">实付汇总：￥{{ fenToYuan(totalAmount.allActualPaymentPrice) }}</span>
        <span class="mr-8">挂账汇总：￥{{ fenToYuan(totalAmount.allPendingPrice) }}</span>
      </div>
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
  import { getPayMethodList } from '@/api/cashier';
  import { blobToFile,getNowDay } from '@/utils/index.js'
  import { getCompanyRoomList } from "@/api/system/room-system";
  import SelectPeople from '@/components/SelectPeople/SelectPeople.vue';
  import { fenToYuan, yuanTofen } from '@/utils/index.js';

  const { proxy } = getCurrentInstance();
  
  const roomList = ref([]);
  const customerSourceList = ref([
    { id: 1, name: '散客'},
    { id: 2, name: '公司'},
    { id: 3, name: '招待房'},
    { id: 4, name: '团购'},
    { id: 5, name: '任务房'},
  ]);
  const tableList = ref([]);
  const payMethodList = ref([]);
  const total = ref(0);
  const totalAmount = ref({
    allOrderPrice: 0,
    allActualPaymentPrice: 0,
    allPendingPrice: 0,
  });

  const initData = {
    pageNum: 1,
    pageRow: 10,
    dateTime: [getNowDay(),getNowDay()],
    roomId: undefined,
    customerSource: undefined,
    orderNumber: undefined,
    reservationId: undefined,
    returnUserId: undefined,
    withRoomUserId: undefined,
    rotateUserId: undefined,
    pendingAccountUserId: undefined,
    roomManagerUserId: undefined,
    checkoutUserId: undefined,
    checkoutUserType: undefined,
  };
  const data = reactive({
    queryParams: {
      ...initData,
    },
  });

  const { queryParams } = toRefs(data); 

  function getMethodList() {
    getPayMethodList().then(res => {
      payMethodList.value = res;
    })
  }
  // 动态表头
  function getHeader() {
    return [
      { label: '日期', prop: 'companyDay'},
      { label: '房台', prop: 'roomName'},
      { label: '客源', prop: 'customerSource'},
      { label: '开台时间', prop: 'openTime'},
      { label: '收款时间', prop: 'openTime'},
      { label: '主账单号', prop: 'orderNumber'},
      { label: '结账金额', prop: 'checkoutPrice', isPrice: true},
      { label: '调整金额', prop: 'checkoutPrice', isPrice: true},
      { label: '实付金额', prop: 'checkoutPrice', isPrice: true},
      { label: '记账金额', prop: 'checkoutPrice', isPrice: true},
      { label: '包厢管理员', prop: 'roomManager' },
      { label: '收款操作人', prop: 'roomManager' },
      { label: '是否异常操作', prop: 'roomManager' },
      { label: '备注', prop: 'remarks' },
      { label: '付款方式', prop: 'payMethod', children: [
        { label: '支付宝', prop: 'zfb' },
      ] },
    ]
  }
  // 房台名称列表
  function getRoomList() {
    getCompanyRoomList().then(res => {
      roomList.value = res;
    })
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
        totalAmount.value = {
          allOrderPrice: res.allOrderPrice,
          allActualPaymentPrice: res.allActualPaymentPrice,
          allPendingPrice: res.allPendingPrice,
        }
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
        blobToFile(res, '房台收银明细.xlsx')
        proxy.$modal.msgSuccess("导出成功");
      }).catch(function () {
    });
  }
  function handleTableRestoration() {}

  getRoomList();
  getList();
  getMethodList();
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  align-items: center;
  margin: 0 0 24px 0;
  flex-wrap: wrap;
  .label {
    display: inline-block;
    width: 110px;
  }
}
.content-box {
  border-radius: 10px;
  background: #323745;
}
</style>