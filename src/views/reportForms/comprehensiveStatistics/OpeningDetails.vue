<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-29 11:38:34
 * @LastEditTime: 2024-03-22 01:21:03
 * @FilePath: /cbank-client/src/views/reportForms/comprehensiveStatistics/OpeningDetails.vue
-->
<template>
  <div class="app-container content-box p-24">
    <div class="search">
      <el-row>
        <el-col :lg="10" >
          <div class="mb-8">
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
          <div class="mb-8">
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
          <div class="mb-8">
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
          <div class="mb-8">
            <span class="px-6 label">主账单号</span>
            <el-input v-model="queryParams.orderNumber" clearable placeholder="请输入" style="width: 200px"/>
          </div>
        </el-col>
        <el-col :lg="7">
          <div class="mb-8">
            <span class="px-6 label">订房人</span>
            <SelectPeople v-model:value="queryParams.bookingUserId" v-model:type="queryParams.bookingUserType" :typeFilter="[2,3]" placeholder="请选择" automatic-dropdown
              style="width: 200px">
            </SelectPeople>
          </div>
        </el-col>
        <el-col :lg="7">
          <div class="mb-8">
            <span class="px-6 label">返房人</span>
            <SelectPeople v-model:value="queryParams.returnUserId" v-model:type="queryParams.returnUserType" :typeFilter="[2,3]" placeholder="请选择" automatic-dropdown
              style="width: 200px">
            </SelectPeople>
          </div>
        </el-col>
        <el-col :lg="10">
          <div class="mb-8">
            <span class="px-6 label">带房人</span>
            <SelectPeople v-model:value="queryParams.withRoomUserId" v-model:type="queryParams.withRoomUserType" :typeFilter="[2,3]" placeholder="请选择" automatic-dropdown
              style="width: 200px">
            </SelectPeople>
          </div>
        </el-col>
        <el-col :lg="7">
          <div class="mb-8">
            <span class="px-6 label">轮房人</span>
            <SelectPeople v-model:value="queryParams.rotateUserId" v-model:type="queryParams.rotateUserType" :typeFilter="[2,3]" placeholder="请选择" automatic-dropdown
              style="width: 200px">
            </SelectPeople>
          </div>
        </el-col>
        <el-col :lg="7">
          <div class="mb-8">
            <span class="px-6 label">挂账责任人</span>
            <SelectPeople v-model:value="queryParams.pendingAccountUserId" v-model:type="queryParams.pendingAccountUserType" :typeFilter="[2,3]" placeholder="请选择" automatic-dropdown
              style="width: 200px">
            </SelectPeople>
          </div>
        </el-col>
        <el-col :lg="10">
         <div class="mb-8">
          <span class="px-6 label">包厢管理员</span>
          <SelectPeople v-model:value="queryParams.roomManagerUserId" v-model:type="queryParams.roomManagerUserType" :typeFilter="[2]"  placeholder="请选择" automatic-dropdown
            style="width: 200px">
          </SelectPeople>
        </div>
        </el-col>
        <el-col :lg="7">
          <div class="mb-8">
            <span class="px-6 label">结账操作人</span>
            <SelectPeople v-model:value="queryParams.checkoutUserId"  v-model:type="queryParams.checkoutUserType"  :typeFilter="[2]" placeholder="请选择" automatic-dropdown
              style="width: 200px">
            </SelectPeople>
          </div>
        </el-col>
      </el-row>
      <el-button class="mb-8" type="primary" @click="handleQuery">查询</el-button>
      <el-button class="mb-8" @click="handleReset">重置</el-button>
      <el-button class="mb-8" @click="handleExport">导出</el-button>
      <!-- <el-button class="mb-8" @click="handleTableRestoration">表格复原</el-button> -->
    </div>
    <div>
      <div class="mb-8 btn-all">
        <span class="mr-20">结账汇总：￥{{ fenToYuan(totalAmount.allOrderPrice) }}</span>
        <span class="mr-20">调整汇总：￥{{ fenToYuan(totalAmount.allAdjustPrice) }}</span>
        <span class="mr-20">实付汇总：￥{{ fenToYuan(totalAmount.allActualPaymentPrice) }}</span>
        <span class="mr-20">挂账汇总：￥{{ fenToYuan(totalAmount.allPendingPrice) }}</span>
        <el-dropdown>
          <span class="el-dropdown-link">
            明细汇总：￥{{ fenToYuan(totalAmount.allDetailPrice) }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(item,index) in detailList" :key="index">{{ item }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <el-table :data="tableList" class="ml10 tbg" ref="tableRef">
        <el-table-column label="日期" align="center" prop="companyDay" />
        <el-table-column label="房台" align="center" prop="roomName"   />
        <el-table-column label="包厢低消" align="center" prop="lowConsumption" :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="客源" align="center" prop="customerSource" :show-overflow-tooltip="true" />
        <el-table-column label="开台时间" align="center" prop="openTime" :show-overflow-tooltip="true"  />
        <el-table-column label="客离时间" align="center" prop="guestDepartureTime" :show-overflow-tooltip="true"  />
        <el-table-column label="主账单号" align="center" prop="orderNumber" :show-overflow-tooltip="true"  />
        <el-table-column label="订房人" align="center">
          <el-table-column label="艺名" align="center" prop="bookingNickName" :show-overflow-tooltip="true"  />
          <el-table-column label="姓名" align="center" prop="bookingName" :show-overflow-tooltip="true"  />
          <el-table-column label="部门" align="center" prop="bookingDeptName" :show-overflow-tooltip="true"  />
        </el-table-column>
        <el-table-column label="返房人" align="center" >
          <el-table-column label="艺名" align="center" prop="returnNickName" :show-overflow-tooltip="true"  />
          <el-table-column label="姓名" align="center" prop="returnName" :show-overflow-tooltip="true"  />
          <el-table-column label="部门" align="center" prop="returnDeptName" :show-overflow-tooltip="true"  />
        </el-table-column>
        <el-table-column label="带房人" align="center">
          <el-table-column label="艺名" align="center" prop="withRoomNickName" :show-overflow-tooltip="true"  />
          <el-table-column label="姓名" align="center" prop="withRoomName" :show-overflow-tooltip="true"  />
          <el-table-column label="部门" align="center" prop="withRoomDeptName" :show-overflow-tooltip="true"  />
        </el-table-column>
        <el-table-column label="轮房人" align="center">
          <el-table-column label="艺名" align="center" prop="rotateNickName" :show-overflow-tooltip="true"  />
          <el-table-column label="姓名" align="center" prop="rotateName" :show-overflow-tooltip="true"  />
          <el-table-column label="部门" align="center" prop="rotateDeptName" :show-overflow-tooltip="true"  />
        </el-table-column>
        <el-table-column label="结账金额" align="center" prop="checkoutPrice" :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="调整金额" align="center" prop="adjustPrice" :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="实付金额" align="center" prop="actualPaymentPrice" :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="挂账金额" align="center" prop="pendingAccountPrice" :formatter="(a,b,c,d) => fenToYuan(c)"  />
        <el-table-column label="支付明细" align="center" prop="payMethodDetail">
          <el-table-column v-for="(item,index) in payMethodList" :key="index" :label="item.payName">
            <template #default="scope">
              <div>{{ scope.row.payMethodDetail && scope.row.payMethodDetail.find(v => v.id == item.id) ? fenToYuan(scope.row.payMethodDetail.find(v => v.id == item.id).amount)  : '0.00' }}</div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="赠送金额" align="center" prop="givePrice" :formatter="(a,b,c,d) => fenToYuan(c)"  />
        <el-table-column label="挂账责任人" align="center" prop="pendingAccountUser" :show-overflow-tooltip="true"  />
        <el-table-column label="包厢管理员" align="center" prop="roomManager" :show-overflow-tooltip="true"  />
        <el-table-column label="结账操作人" align="center" prop="checkoutUser" :show-overflow-tooltip="true"  />
        <el-table-column label="并台明细" align="center" prop="parallelPlatformDetails" :show-overflow-tooltip="true"  />
        <el-table-column label="上台数量" align="center" prop="goOnStageCount" :show-overflow-tooltip="true"  />
        <el-table-column label="上台明细" align="center" prop="goOnStageDetails">
          <template #default="scope">
            <el-popover
              v-if="scope.row.goOnStageDetails"
              placement="top"
              :width="200"
              trigger="click"
              content="this is content, this is content, this is content"
            >
              <template #reference>
                <span>{{scope.row.goOnStageDetails[0]}}</span>
              </template>
              <template #default>
                <div v-for="(item,index) in scope.row.goOnStageDetails" :key="index">{{ item }}</div>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remarks" :show-overflow-tooltip="true"  />
      </el-table>
      <pagination  v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageRow" @pagination="getList" />
    </div>
  </div>
</template>

<script setup>
  import { bookingPerformance, bookingPerformanceExport } from '@/api/synthesis';
  import dayjs from 'dayjs';
  import { blobToFile } from '@/utils/index.js'
  import { getCompanyRoomList } from "@/api/system/room-system";
  import SelectPeople from '@/components/SelectPeople/SelectPeople.vue';
  import { fenToYuan, yuanTofen,getNowDay } from '@/utils/index.js';
  import { getPayMethodList } from '@/api/cashier';

  const { proxy } = getCurrentInstance();
  const payMethodList = ref([]);
  
  const roomList = ref([]);
  const customerSourceList = ref([
    { id: 1, name: '散客'},
    { id: 2, name: '公司'},
    { id: 3, name: '招待房'},
    { id: 4, name: '团购'},
    { id: 5, name: '任务房'},
  ]);
  const tableList = ref([]);
  const total = ref(0);
  const totalAmount = ref({
    allOrderPrice: 0,
    allActualPaymentPrice: 0,
    allPendingPrice: 0,
    allDetailPrice: 0,
    allAdjustPrice: 0,
  });
  const detailList = ref([]);
  const initData = {
    pageNum: 1,
    pageRow: 10,
    dateTime: [getNowDay(),getNowDay()],
    roomId: undefined,
    customerSource: undefined,
    orderNumber: undefined,
    bookingUserId: undefined,
    bookingUserType: undefined,
    returnUserId: undefined,
    returnUserType: undefined,
    withRoomUserId: undefined,
    withRoomUserType: undefined,
    rotateUserId: undefined,
    pendingAccountUserId: undefined,
    pendingAccountUserType: undefined,
    roomManagerUserId: undefined,
    roomManagerUserType: undefined,
    checkoutUserId: undefined,
    checkoutUserType: undefined,
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
    bookingPerformance(data).then(res => {
      if(res) {
        total.value = res.count;
        tableList.value = res.list;
        totalAmount.value = {
          allOrderPrice: res.data && res.data.allOrderPrice,
          allActualPaymentPrice: res.data && res.data.allActualPaymentPrice,
          allPendingPrice: res.data && res.data.allPendingPrice,
          allDetailPrice: res.data && res.data.allDetailPrice,
          allAdjustPrice: res.data && res.data.allAdjustPrice,
        }
        detailList.value = res.data.payMethodPrice;
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
        blobToFile(res)
        proxy.$modal.msgSuccess("导出成功");
      }).catch(function () {
    });
  }
  function handleTableRestoration() {}

  function getMethodList() {
    getPayMethodList({ isPendingAccount: 1 }).then(res => {
      payMethodList.value = res;
    })
  }
  getMethodList();
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
.btn-all {
  display: flex;
  align-items: center;
  .el-dropdown-link  {
    color: #fff;
  }
}
</style>