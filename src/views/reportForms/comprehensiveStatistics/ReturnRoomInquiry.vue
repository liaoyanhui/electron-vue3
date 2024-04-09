<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-29 11:38:34
 * @LastEditTime: 2024-03-22 01:27:59
 * @FilePath: /cbank-client/src/views/reportForms/comprehensiveStatistics/ReturnRoomInquiry.vue
-->
<template>
  <div class="app-container  content-box p-24">
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
            <span class="px-6 label">返房人</span>
            <SelectPeople v-model:value="queryParams.returnUserId" :typeFilter="[2,3]" v-model:type="queryParams.returnUserType" placeholder="请选择" automatic-dropdown
              style="width: 200px">
            </SelectPeople>
          </div>
        </el-col>
        <el-col :lg="10">
          <div class="mr-8 mb-8">
            <span class="px-6 label">预定操作人</span>
            <SelectPeople v-model:value="queryParams.operatorUserId" :typeFilter="[1]" placeholder="请选择" automatic-dropdown
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
        <span class="mr-8">返房数量：{{ total }}</span>
      </div>
      <el-table :data="tableList" class="ml10 tbg" ref="tableRef">
        <el-table-column label="序号" type="index" align="center" width="60" />
        <el-table-column label="日期" align="center" prop="companyDay" />
        <el-table-column label="房台" align="center" prop="roomName"   />
        <el-table-column label="预订时间" align="center" prop="bookingTime" :show-overflow-tooltip="true"  />
        <el-table-column label="预抵时间" align="center" prop="arrivalsTime" :show-overflow-tooltip="true"  />
        <el-table-column label="返房人" align="center">
          <el-table-column label="艺名" align="center" prop="returnNickName" :show-overflow-tooltip="true"  />
          <el-table-column label="姓名" align="center" prop="returnName" :show-overflow-tooltip="true"  />
          <el-table-column label="部门" align="center" prop="returnDeptName" :show-overflow-tooltip="true"  />
        </el-table-column>
        <el-table-column label="订房人" align="center" prop="bookingName" :show-overflow-tooltip="true"  />
        <el-table-column label="客人称呼" align="center" prop="guestName" :show-overflow-tooltip="true"  />
        <el-table-column label="开台时间" align="center" prop="openingTime" :show-overflow-tooltip="true"  />
        <el-table-column label="预定操作人" align="center" prop="bookingOperator" :show-overflow-tooltip="true"  />
        <el-table-column label="转台记录" align="center" prop="turntableRecord" >
          <template #default="scope">
            <div v-for="(item,index) in scope.row.turntableRecord" :key="index">{{ item }}</div>
          </template>
        </el-table-column>
      </el-table>
      <pagination  v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageRow" @pagination="getList" />
    </div>
  </div>
</template>

<script setup>
  import { returnRoom, returnRoomExport } from '@/api/synthesis';
  import dayjs from 'dayjs';
  import { blobToFile,getNowDay } from '@/utils/index.js'
  import { getCompanyRoomList } from "@/api/system/room-system";
  import SelectPeople from '@/components/SelectPeople/SelectPeople.vue';
  import { fenToYuan, yuanTofen } from '@/utils/index.js';
  import { productDishInfo } from '@/api/product';
  import useProduceStore from '@/store/produce';

  const { proxy } = getCurrentInstance();
  const produceStore = useProduceStore();
  
  const roomList = ref([]);
  const tableList = ref([]);

  const total = ref(0);



  const initData = {
    pageNum: 1,
    pageRow: 10,
    dateTime: [getNowDay(),getNowDay()],
    roomId: undefined,
    orderNumber: undefined,
    operatorUserId: undefined,
    returnUserId: undefined,
    returnUserType: undefined,
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
  // 获取菜品列表
  function getProductNameList(data) {
    productDishInfo(data).then(res => {
      productNameList.value = res;
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
    returnRoom(data).then(res => {
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
      return returnRoomExport(data);
    }).then((res) => {
        blobToFile(res, '返房查询.xlsx')
        proxy.$modal.msgSuccess("导出成功");
      }).catch(function () {
    });
  }

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