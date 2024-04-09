<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-29 11:38:34
 * @LastEditTime: 2024-03-22 01:31:24
 * @FilePath: /cbank-client/src/views/reportForms/comprehensiveStatistics/OrderDetails.vue
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
            <SelectPeople v-model:value="queryParams.roomManagerUserId" v-model:type="queryParams.roomManagerUserType" :typeFilter="[2]" placeholder="请选择" automatic-dropdown
              style="width: 200px">
            </SelectPeople>
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
            <span class="px-6 label">菜品名称</span>
            <el-select
              v-model="queryParams.dishInfoId"
              class="m-2 mr-8"
              placeholder="请选择"
              style="width: 200px"
              clearable
              filterable
              :filter-method="filterMethod"
            >
              <el-option
                v-for="item in filterProductNameList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :lg="10">
          <div class="mr-8 mb-8">
            <span class="px-6 label">出品位置</span>
            <el-select
              v-model="queryParams.makeDepartmentId"
              class="m-2"
              style="width: 200px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in departmentList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :lg="7">
          <div class="mr-8 mb-8">
            <span class="px-6 label">点单人</span>
            <SelectPeople v-model:value="queryParams.orderUserId" :typeFilter="[1]"  placeholder="请选择" automatic-dropdown
              style="width: 200px">
            </SelectPeople>
          </div>
        </el-col>
        <el-col :lg="7">
          <div class="mr-8 mb-8">
            <span class="px-6 label">退单人</span>
            <SelectPeople v-model:value="queryParams.chargebackId" :typeFilter="[1]" placeholder="请选择" automatic-dropdown
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
        <span class="mr-8">总出品数量：{{ totalAmount.allMakeDepartmentCount }}</span>
        <span class="mr-8">退单数量：{{ totalAmount.refundsCount }}</span>
        <span class="mr-8">总落单金额：￥{{ fenToYuan(totalAmount.orderPrice) }}</span>
        <span class="mr-8">总退单金额：￥{{ fenToYuan(totalAmount.refundsPrice) }}</span>
        <span class="mr-8">总赠送金额：￥{{ fenToYuan(totalAmount.allGiftPrice) }}</span>
      </div>
      <el-table :data="tableList" class="ml10 tbg" ref="tableRef">
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="日期" align="center" prop="companyDay" />
        <el-table-column label="房台" align="center" prop="roomName"   />
        <el-table-column label="菜品名称" align="center" prop="dishName" />
        <el-table-column label="菜品类别" align="center" prop="dishTypeName" :show-overflow-tooltip="true" />
        <el-table-column label="主账单号" align="center" prop="orderNumber" :show-overflow-tooltip="true"  />
        <el-table-column label="订房人" align="center">
          <el-table-column label="艺名" align="center" prop="bookingNickName" :show-overflow-tooltip="true"  />
          <el-table-column label="姓名" align="center" prop="bookingName" :show-overflow-tooltip="true"  />
          <el-table-column label="部门" align="center" prop="bookingDeptName" :show-overflow-tooltip="true"  />
        </el-table-column>
        <el-table-column label="单价" align="center" prop="mealPrice" :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="数量" align="center">
          <template #default="scope">
            {{ scope.row.dishInfoCount }}({{scope.row.chargebackCount}})
          </template>
        </el-table-column>
        <el-table-column label="单位" align="center" prop="dishTasteName"   />
        <el-table-column label="落单金额" align="center" prop="orderPrice" :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="赠送金额" align="center" prop="giftPrice" :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="出品" align="center">
          <el-table-column label="单号" align="center" prop="number" :show-overflow-tooltip="true"  />
          <el-table-column label="时间" align="center" prop="orderTime" :show-overflow-tooltip="true"  />
          <el-table-column label="位置" align="center" prop="makeDepartment" :show-overflow-tooltip="true"  />
        </el-table-column>
        <el-table-column label="赠送人" align="center" prop="giftUserName" :show-overflow-tooltip="true"  />
        <el-table-column label="点单人" align="center" prop="orderUserName" :show-overflow-tooltip="true"  />
        <el-table-column label="改价人" align="center" prop="updatePriceUser" :show-overflow-tooltip="true"  />
        <el-table-column label="退单人" align="center" prop="checkoutUser" :show-overflow-tooltip="true"  />
      </el-table>
      <pagination  v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageRow" @pagination="getList" />
    </div>
  </div>
</template>

<script setup>
  import { placeOrderDetail, placeOrderDetailExport } from '@/api/synthesis';
  import dayjs from 'dayjs';
  import { blobToFile } from '@/utils/index.js'
  import { getCompanyRoomList } from "@/api/system/room-system";
  import SelectPeople from '@/components/SelectPeople/SelectPeople.vue';
  import { fenToYuan, getNowDay } from '@/utils/index.js';
  import { productDishInfo } from '@/api/product';
  import useProduceStore from '@/store/produce';

  const { proxy } = getCurrentInstance();
  const produceStore = useProduceStore();
  
  const roomList = ref([]);
  const tableList = ref([]);
  const filterProductNameList = ref([]);
  const departmentList = ref([]);

  const total = ref(0);
  const totalAmount = ref({
    allMakeDepartmentCount: 0,
    refundsCount: 0,
    orderPrice: 0,
    refundsPrice: 0,
    allGiftPrice: 0,
  });

  // 获取部门
  function getDepartmentList() {
    produceStore.ajaxProductionDepartmentList().then(res => {
      if (res) {
        const arr = res.list.map(item => {
          return {
            value: item.id,
            label: item.departmentName,
          }
        })
        departmentList.value = arr;
      }
    })
  }

  const initData = {
    pageNum: 1,
    pageRow: 10,
    dateTime: [getNowDay(),getNowDay()],
    roomId: undefined,
    orderNumber: undefined,
    bookingUserId: undefined,
    bookingUserType: undefined,
    roomManagerUserId: undefined,
    roomManagerUserType: undefined,
    dishInfoId: undefined,
    makeDepartmentId: undefined,
    orderUserId: undefined,
    chargebackId: undefined,
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

  // 自定义搜索菜品列表
  function filterMethod(val) {
    if(val) {
      const newArr = productNameList.value.filter(item => {
        if(item.name && item.name.indexOf(val) > -1) {
          return true;
        }
        if(item.englishName && item.englishName.indexOf(val) > -1) {
          return true;
        }
        if(item.nameInitial && item.nameInitial.indexOf(val) > -1) {
          return true;
        }
        return false;
      })
      filterProductNameList.value = newArr;
    } else {
      filterProductNameList.value = productNameList.value;
    }
  }
  function getList() {
    const data = {
      ...queryParams.value
    };
    if(queryParams.value.dateTime && queryParams.value.dateTime.length > 1) {
      data.startTime = queryParams.value.dateTime[0];
      data.endTime = queryParams.value.dateTime[1];
    }
    placeOrderDetail(data).then(res => {
      if(res) {
        total.value = res.count;
        tableList.value = res.list;
        totalAmount.value = {
          allMakeDepartmentCount: res.data && res.data.allMakeDepartmentCount,
          refundsCount: res.data && res.data.refundsCount,
          orderPrice: res.data && res.data.orderPrice,
          refundsPrice: res.data && res.data.refundsPrice,
          allGiftPrice: res.data && res.data.allGiftPrice,
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
      return placeOrderDetailExport(data);
    }).then((res) => {
        blobToFile(res, '落单明细.xlsx')
        proxy.$modal.msgSuccess("导出成功");
      }).catch(function () {
    });
  }

  getRoomList();
  getList();
  getDepartmentList();
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