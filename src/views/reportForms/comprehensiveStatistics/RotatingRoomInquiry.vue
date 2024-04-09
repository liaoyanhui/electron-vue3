<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-29 11:38:34
 * @LastEditTime: 2024-03-22 01:28:05
 * @FilePath: /cbank-client/src/views/reportForms/comprehensiveStatistics/RotatingRoomInquiry.vue
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
            <span class="px-6 label">主账单号</span>
            <el-input v-model="queryParams.orderNumber" clearable placeholder="请输入" style="width: 200px"/>
          </div>
        </el-col>
        <el-col :lg="10">
          <div class="mr-8 mb-8">
            <span class="px-6 label">包厢管理员</span>
            <SelectPeople v-model:value="queryParams.roomManagerUserId"  v-model:type="queryParams.roomManagerUserType" :typeFilter="[2]"  placeholder="请选择" automatic-dropdown
              style="width: 200px">
            </SelectPeople>
          </div>
        </el-col>
        <el-col :lg="7">
          <div class="mr-8 mb-8">
            <span class="px-6 label">轮房人</span>
            <SelectPeople v-model:value="queryParams.rotateUserId" v-model:type="queryParams.rotateUserType" :typeFilter="[2,3]" placeholder="请选择" automatic-dropdown
              style="width: 200px">
            </SelectPeople>
          </div>
        </el-col>
        <el-col :lg="7">
          <div class="mr-8 mb-8">
            <span class="px-6 label">订房人</span>
            <SelectPeople v-model:value="queryParams.bookingUserId"  v-model:type="queryParams.bookingUserType" :typeFilter="[2,3]" placeholder="请选择" automatic-dropdown
              style="width: 200px">
            </SelectPeople>
          </div>
        </el-col>
        <el-col :lg="7">
          <div class="mr-8 mb-8">
            <span class="px-6 label">部门</span>
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
      <div class="mb-8">
        <span class="mr-8">轮房次数:{{ total }}</span>
      </div>
      <el-table :data="tableList" class="ml10 tbg" ref="tableRef">
        <el-table-column label="序号" type="index" align="center" width="60" />
        <el-table-column label="日期" align="center" prop="companyDay" />
        <el-table-column label="房台" align="center" prop="roomName"   />
        <el-table-column label="开台时间" align="center" prop="openTime" :show-overflow-tooltip="true"  />
        <el-table-column label="客离时间" align="center" prop="guestDepartureTime" :show-overflow-tooltip="true"  />
        <el-table-column label="轮房人" align="center">
          <el-table-column label="艺名" align="center" prop="rotateNickName" :show-overflow-tooltip="true"  />
          <el-table-column label="姓名" align="center" prop="rotateName" :show-overflow-tooltip="true"  />
          <el-table-column label="部门" align="center" prop="rotateDeptName" :show-overflow-tooltip="true"  />
        </el-table-column>
        <el-table-column label="订房人" align="center" prop="bookingNickName" :show-overflow-tooltip="true"  />
        <el-table-column label="包厢管理员" align="center" prop="roomManager" :show-overflow-tooltip="true"  />
      </el-table>
      <pagination  v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageRow" @pagination="getList" />
    </div>
  </div>
</template>

<script setup>
  import { rotateSelect, rotateSelectExport } from '@/api/synthesis';
  import dayjs from 'dayjs';
  import { blobToFile,getNowDay } from '@/utils/index.js'
  import { getCompanyRoomList } from "@/api/system/room-system";
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
    roomId: undefined,
    orderNumber: undefined,
    reservationId: undefined,
    rotateUserId: undefined,
    rotateUserType: undefined,
    roomManagerUserId: undefined,
    roomManagerUserType: undefined,
    bookingUserType: undefined,
    organizationId: undefined,
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
    rotateSelect(data).then(res => {
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
      return rotateSelectExport(data);
    }).then((res) => {
        blobToFile(res, '轮房查询.xlsx')
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