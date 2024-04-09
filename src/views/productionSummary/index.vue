<!--
 * @Description: 出品汇总
 * @Author: 尚夏
 * @Date: 2024-02-04 19:03:14
 * @LastEditTime: 2024-03-22 01:30:22
 * @FilePath: /cbank-client/src/views/productionSummary/index.vue
-->
<template>
  <div class="app-container">
    <div class="search">
        <div class="mr-8 mb-8">
          <span class="px-6">菜品分类</span>
          <el-tree-select
            v-model="queryParams.dishTypeId"
            :data="goodsTypeList"
            :render-after-expand="false"
            :props="{ value: 'id', label: 'name', children: 'children' }"
            check-strictly
            placeholder="请选择分类"
            style="width: 180px"
            clearable
          />
        </div>
        <div class="mr-8 mb-8">
          <span class="px-6">菜品名称</span>
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
        <div class="mr-8 mb-8">
          <span class="px-6">房台名称</span>
          <el-select
            v-model="queryParams.roomId"
            class="m-2 mr-8"
            placeholder="请选择"
            style="width: 180px"
            filterable
            clearable
          >
            <el-option
              v-for="item in roomList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="mr-8 mb-8">
          <span class="px-6">出品状态</span>
          <el-select
            v-model="queryParams.productType"
            class="m-2 mr-8"
            placeholder="请选择"
            style="width: 180px"
            clearable
          >
            <el-option
              v-for="item in productTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="mr-8 mb-8">
          <span class="px-6">出品部门</span>
          <el-select
            v-model="queryParams.makeDepartmentId"
            class="m-2 mr-8"
            placeholder="请选择"
            style="width: 180px"
            multiple
            clearable
            @change="handleChangeDemartment"
          >
            <el-option
              v-for="item in makeDepartmentList"
              :key="item.id"
              :label="item.departmentName"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="mr-8 mb-8">
          <span class="px-6">点单人</span>
          <el-select
            v-model="queryParams.orderUserId"
            class="m-2 mr-8"
            placeholder="请选择"
            style="width: 180px"
            clearable
          >
            <el-option
              v-for="item in orderPersonList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="mr-8 mb-8">
          <span class="px-6">日期</span>
           <el-date-picker
            v-model="queryParams.dateTime"
            type="daterange"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="请选择日期"
            :clearable="false"
          />
         </div>
        <el-button class="mb-8" type="primary" @click="handleQuery">查询</el-button>
        <el-button class="mb-8" @click="handleReset">重置</el-button>
        <el-button class="mb-8" @click="handleExport">批量导出</el-button>
      </div>
      <div>
        <el-table :data="productList" class="ml10 tbg" ref="tableRef">
          <el-table-column label="下单时间" align="center" key="companyDay" prop="companyDay" :show-overflow-tooltip="true"  />
          <el-table-column label="菜品名称" align="center" key="dishName" prop="dishName"  />
          <el-table-column label="单位" align="center" key="dishUnitName" prop="dishUnitName" :show-overflow-tooltip="true"  />
          <el-table-column label="菜品类型" align="center" key="dishTypeName" prop="dishTypeName" :show-overflow-tooltip="true" />
          <el-table-column label="下单数量" align="center" key="orderQuantity" prop="orderQuantity" :show-overflow-tooltip="true" />
          <el-table-column label="出品退单数量" align="center" key="chargebackCount" prop="chargebackCount" :show-overflow-tooltip="true"  />
          <el-table-column label="合计出品" align="center" key="totalOutput" prop="totalOutput" :show-overflow-tooltip="true"  />
        </el-table>
        <pagination  v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageRow" @pagination="getList" />
      </div>
  </div>
</template>

<script setup>
  import { productDishInfo, getUserCompanyList, cancelOrders, oneClickProduction, summaryExport } from '@/api/product';
  import { getDishTypeSelect } from '@/api/dishes/index'
  import useProduceStore from "@/store/produce";
  import useProductStore from '@/store/product';
  import { getCompanyRoomList } from "@/api/system/room-system";
  import { blobToFile,getNowDay } from '@/utils/index.js'

  const { proxy } = getCurrentInstance();
  const produceStore = useProduceStore();
  const productStore = useProductStore();

  const productTypeList = ref([
    { label: '已下单', value: '1'},
    { label: '已出品', value: '2'},
    // { label: '已送达', value: '3'},
    { label: '退单', value: '4'},
    { label: '部分退单', value: '5'},
  ]);
  const productList = ref([]);
  const productNameList = ref([]);
  const filterProductNameList = ref([]);
  const roomList = ref([]);
  const orderPersonList = ref([]);
  const visible = ref(false);
  const goodsTypeList = ref([]);
  const total = ref(0);
  const makeDepartmentList = ref([]);
  const data = reactive({
    queryParams: {
      pageNum: 1,
      pageRow: 10,
      dishTypeId: undefined,
      dishInfoId: undefined,
      roomId: undefined,
      productType: undefined,
      orderUserId: undefined,
      dateTime: [getNowDay(),getNowDay()],
      makeDepartmentId: []
    },
  });

  const { queryParams } = toRefs(data); 

  // 菜品分类列表
  function getProductTypeList() {
    getDishTypeSelect().then(res => {
      if(res) {
        goodsTypeList.value = res;
      }
    })
  }
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
 
  // 订单人
  function getOrderList() {
    getUserCompanyList().then(res => {
      orderPersonList.value = res;
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

  // 出品单列表 右侧
  function getList() {
    const data = {
      ...queryParams.value
    };
    if(queryParams.value.dateTime && queryParams.value.dateTime.length > 1) {
      data.startTime = queryParams.value.dateTime[0];
      data.endTime = queryParams.value.dateTime[1];
    }
    productStore.ajaxGetSummaryList({
      ...data
    }).then(res => {
      if(res) {
        productList.value = res.list;
        total.value = res.count;
      }
    })
  }

    // 获取出品部门列表 
  function getDepartmentList() {
    produceStore.ajaxGetDepartmentBuyUser().then(res => {
      if (res) {
        makeDepartmentList.value = res;
      }
    })
  }

  // 选择部门
  function handleChangeDemartment(e) {
    const Index = e.findIndex(i => i == 0);
    if(Index > -1) {
      if(e[e.length -1] == 0) {
        queryParams.value.makeDepartmentId = [0]
      } else {
        const newArr = e.filter(item => item != 0);
        queryParams.value.makeDepartmentId = newArr;
      }
    }
  }

  onMounted(() => {
    getDepartmentList();
    getProductTypeList();
    getOrderList();
    getRoomList();
    getProductNameList();
    getList();
  })

  function handleQuery() {
    let dl = queryParams.value.makeDepartmentId;
    if(dl && dl.length == 1 && dl[0] == 0) {
      queryParams.value.makeDepartmentId = [];
    }
    queryParams.value.pageNum = 1;
    getList();
  }
  
  function handleReset() {
    queryParams.value = {
      pageNum: 1,
      pageRow: 10,
      dishTypeId: undefined,
      dishInfoId: undefined,
      roomId: undefined,
      productType: undefined,
      orderUserId: undefined,
      dateTime: [getNowDay(),getNowDay()],
    };
    getList();
  }

  // 导出
  function handleExport() {
    proxy.$modal.confirm('是否导出数据?').then(function () {
      const data = { ...queryParams.value }
      if(queryParams.value.dateTime && queryParams.value.dateTime.length > 1) {
        data.startTime = queryParams.value.dateTime[0];
        data.endTime = queryParams.value.dateTime[1];
      }
      return summaryExport(data);
    }).then((res) => {
        blobToFile(res, '出品汇总.xlsx')
        proxy.$modal.msgSuccess("导出成功");
      }).catch(function () {
    });
  }
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  align-items: center;
  margin: 0 0 24px 0;
  flex-wrap: wrap;
}
</style>