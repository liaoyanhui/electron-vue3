<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-29 11:38:34
 * @LastEditTime: 2024-03-22 01:27:46
 * @FilePath: /cbank-client/src/views/reportForms/comprehensiveStatistics/PendingAccountsDetails.vue
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
            <span class="px-6 label">订房人</span>
            <SelectPeople v-model:value="queryParams.bookingUserId" v-model:type="queryParams.bookingUserType" :typeFilter="[2,3]" placeholder="请选择" automatic-dropdown
              style="width: 200px">
            </SelectPeople>
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
        <el-col :lg="10">
          <div class="mr-8 mb-8">
            <span class="px-6 label">结账操作人</span>
            <SelectPeople v-model:value="queryParams.checkoutUserId" v-model:type="queryParams.checkoutUserType" :typeFilter="[1]" placeholder="请选择" automatic-dropdown
              style="width: 200px">
            </SelectPeople>
          </div>
        </el-col>
        <el-col :lg="10">
          <div class="mr-8 mb-8">
            <span class="px-6 label">是否回收</span>
            <el-select
              v-model="queryParams.recovery"
              class="m-2 mr-8"
              placeholder="请选择"
              style="width: 200px"
              clearable
              filterable>
              <el-option
                v-for="item in recoveryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
        </el-col>
      </el-row>
     
      <el-button class="mb-8" type="primary" @click="handleQuery">查询</el-button>
      <el-button class="mb-8" @click="handleReset">重置</el-button>
      <el-button class="mb-8" @click="handleExport">导出</el-button>
      <!-- <el-button class="mb-8" @click="handleTableRestoration">表格复原</el-button> -->
    </div>
    <div>
      <div class="mb-8">
        <span class="mr-8">结账汇总：￥{{ fenToYuan(totalAmount.allOrderPrice) }}</span>
        <span class="mr-8">挂账汇总：￥{{ fenToYuan(totalAmount.allPendingPrice) }}</span>
      </div>
      <el-table :data="tableList" class="ml10 tbg" ref="tableRef">
        <el-table-column label="序号" type="index" align="center" width="60" />
        <el-table-column label="日期" align="center" prop="companyDay" />
        <el-table-column label="房台" align="center" prop="roomName"   />
        <el-table-column label="包厢低消" align="center" prop="lowConsumption" :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="客源" align="center" prop="customerSource" :show-overflow-tooltip="true" />
        <el-table-column label="开台时间" align="center" prop="openTime" :show-overflow-tooltip="true"  />
        <el-table-column label="客离时间" align="center" prop="guestDepartureTime" :show-overflow-tooltip="true"  />
        <el-table-column label="主账单号" align="center" prop="orderNumber" :show-overflow-tooltip="true"  />
        <el-table-column label="订房人" align="center" prop="reservationNickName" :show-overflow-tooltip="true"  />
        <el-table-column label="结账金额" align="center" prop="checkoutPrice" :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="挂账金额" align="center" prop="pendingAccountPrice" :formatter="(a,b,c,d) => fenToYuan(c)"  />
        <el-table-column label="挂账责任人" align="center" prop="pendingAccountUser" :show-overflow-tooltip="true"  />
        <el-table-column label="挂账时间" align="center" prop="pendingAccountTime" :show-overflow-tooltip="true"  />
        <el-table-column label="挂账操作人" align="center" prop="addUserId" :show-overflow-tooltip="true"  />
        <el-table-column label="是否回收" align="center" prop="whetherToRecycle" :show-overflow-tooltip="true" >
           <template #default="scope">
            <span>{{ scope.row.whetherToRecycle == 1 ? '是': '否'}}</span>
           </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remarks" :show-overflow-tooltip="true"> </el-table-column>
      </el-table>
      <pagination  v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageRow" @pagination="getList" />
    </div>
  </div>
</template>

<script setup>
  import { detailsPendingAccounts, detailsPendingAccountsExport } from '@/api/synthesis';
  import dayjs from 'dayjs';
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
  const recoveryList = ref([
    { id: 1, name: '是'},
    { id: 0, name: '否'},
  ]);
  const tableList = ref([]);
  const total = ref(0);
  const totalAmount = ref({
    allOrderPrice: 0,
    allPendingPrice: 0,
  });


  const initData = {
    pageNum: 1,
    pageRow: 10,
    dateTime: [getNowDay(),getNowDay()],
    roomId: undefined,
    customerSource: undefined,
    orderNumber: undefined,
    bookingUserId: undefined,
    bookingUserType: undefined,
    pendingAccountUserId: undefined,
    pendingAccountUserType: undefined,
    checkoutUserId: undefined,
    checkoutUserType: undefined,
    recovery: undefined,
  };
  const data = reactive({
    queryParams: {
      ...initData,
    },
  });

  const { queryParams } = toRefs(data); 
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
    detailsPendingAccounts(data).then(res => {
      if(res) {
        total.value = res.count;
        tableList.value = res.list;
        totalAmount.value = {
          allOrderPrice: res.allOrderPrice,
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
      return detailsPendingAccountsExport(data);
    }).then((res) => {
        blobToFile(res, '挂账明细.xlsx')
        proxy.$modal.msgSuccess("导出成功");
      }).catch(function () {
    });
  }
  function handleTableRestoration() {}

  getRoomList();
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