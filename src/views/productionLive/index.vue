<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-01-26 10:29:45
 * @LastEditTime: 2024-03-22 01:30:11
 * @FilePath: /cbank-client/src/views/productionLive/index.vue
-->
<template>
  <div class="production-live">
    <div :class="['production-live-left']">
      <div class="btns px-8">
        <el-radio-group :model-value="currentProductType" @change="handleProduceStatus">
          <el-radio-button label="1">已下单</el-radio-button>
          <el-radio-button label="2">已出品</el-radio-button>
        </el-radio-group>
      </div>
      <div 
        :class="[transition && 'card-transition']">
        <el-card 
          :class="['box-card', item.isNew && 'my-move']" 
          :style="[ item.isDelete && { 'right': movePx }, { 'top': index * 274 + 32 + 20 + 'px'} ]" 
          v-for="(item,index) in liveCard" :key="item.id"
          @dblclick="handleDoubleClick(item)">
          <div class="room-food">
            <div class="box">
              <p class="room-food-header fs-18 fw-500 mb-20">
                <span>{{ item.roomName }}</span>
                <span>No.{{item.number}}{{ item.orderUserName }}</span>
                <span>{{item.createTime}}</span>
              </p>
              <div class="room-food-content" v-for="(packageItem, packageIndex) in item.dishInfoResps" :key="packageIndex" >
                <div class="room-food-content-title fw-500">
                  <span>
                    {{ packageItem.name }}
                    <span v-if="packageItem.dishTasteName" class="fs-12" style="color: #D9001B">({{ packageItem.dishTasteName}})</span>
                  </span>
                  <span>{{ packageItem.dishCount}} {{ packageItem.unitName }}</span>
                </div>
                <div v-if="packageItem.children">
                  <div class="room-food-content-content fs-14" v-for="(childenItem, childrenIndex) in packageItem.children"
                  :key="childrenIndex">
                    <span style="color: rgba(255,255,255,0.65)">
                      {{ childenItem.name }}
                      <span v-if="childenItem.dishTasteName" class="fs-12" style="color: #D9001B">({{ childenItem.dishTasteName}})</span>
                    </span>
                    <span style="color: rgba(255,255,255,0.65)">{{ childenItem.dishCount}} {{ childenItem.unitName }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="make-department-name">{{ item.makeDepartmentName }}</div>
          </div>
        </el-card>
      </div>
    </div>
    <div class="production-live-right">
      <div class="search">
        <div class="mr-8 mb-8">
          <span class="px-6">菜品分类</span>
          <el-tree-select
            v-model="queryParams.dishTypeId"
            :data="goodsTypeList"
            :render-after-expand="false"
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
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="请选择日期"
            :clearable="false"
          />
         </div>
        <el-button class="mb-8" type="primary" @click="handleQuery">查询</el-button>
        <el-button class="mb-8" @click="handleReset">重置</el-button>
        <el-button class="mb-8" type="primary" @click="handleBatchProduce('1')">批量已出品</el-button>
        <el-button class="mb-8"  type="primary" @click="handleBatchProduce('2')">批量转为已下单</el-button>
      </div>
      <div>
        <el-table :data="productList" class="tbg" ref="tableRef" @row-click="handleRowChick">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="下单时间" align="center" key="orderTime" prop="orderTime" :show-overflow-tooltip="true"  />
          <el-table-column label="包厢名称" align="center" key="roomName" prop="roomName" :show-overflow-tooltip="true"  />
          <el-table-column label="菜品名称" align="center" key="dishName" prop="dishName"  />
          <el-table-column label="菜品类型" align="center" key="dishTypeName" prop="dishTypeName" :show-overflow-tooltip="true" />
          <el-table-column label="数量" align="center" key="count" prop="count" :show-overflow-tooltip="true" >
            <template #default="scope">
              <div>
                <span>{{ scope.row.dishInfoCount }}</span>
                <span v-if="scope.row.chargebackCount > 0" class="color-red">({{ scope.row.chargebackCount }})</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单位" align="center" key="dishUnitName" prop="dishUnitName" :show-overflow-tooltip="true"  />
          <el-table-column label="口味" align="center" key="dishTasteName" prop="dishTasteName" :show-overflow-tooltip="true"  />
          <el-table-column label="出品状态" align="center" key="produceStatus" prop="produceStatus" :show-overflow-tooltip="true" >
            <template #default="scope">
              <span v-if="scope.row.produceStatus">{{ productTypeList.find(i => i.value == scope.row.produceStatus).label || '/'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="点单人" align="center" key="addUsername" prop="addUsername" :show-overflow-tooltip="true"  />
          <el-table-column label="出品部门" align="center" key="makeDepartmentName" prop="makeDepartmentName" :show-overflow-tooltip="true"  />
          <el-table-column label="操作" align="center"  width="150px" >
            <template #default="scope">
              <div class="handle-btn d-flex">
                <el-link :underline="false" type="primary" @click="handleRepetOrder(scope.$index, scope.row)">重打单</el-link>
                <el-link :underline="false" type="danger" @click="handleQuitOrder(scope.$index, scope.row)" v-hasPermi="['production-live:tuidan']">退单</el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination  v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageRow" @pagination="getList" />
      </div>
    </div> 
    <ProductChargeBackModal v-if="visible" :visible="visible" @cancel="handleCancel" @success="handleSuccess" :dataSource="record"/>
  </div>
</template>

<script setup>
  import { onBeforeUnmount, onMounted } from "vue";
  import {sseService} from '@/utils/eventsource'
  import { productDishInfo, getUserCompanyList, cancelOrders, oneClickProduction } from '@/api/product';
  import useProduceStore from "@/store/produce";
  import useProductStore from '@/store/product';
  import { getCompanyRoomList } from "@/api/system/room-system";
  import ProductChargeBackModal from './Modal/ProductChargeBackModal.vue';
  import {getNowDay} from '@/utils'

  const { proxy } = getCurrentInstance();
  const produceStore = useProduceStore();
  const productStore = useProductStore();
  const liveCard = ref([]);
  const visible = ref(false);
  const transition = ref(false);
  const goodsTypeList = ref([]);
  const productTypeList = ref([
    { label: '已下单', value: '1'},
    { label: '已出品', value: '2'},
    // { label: '已送达', value: '3'},
    { label: '退单', value: '4'},
    { label: '部分退单', value: '5'},
  ]);
  const productNameList = ref([]);
  const filterProductNameList = ref([]);
  const roomList = ref([]);
  const orderPersonList = ref([]);
  const makeDepartmentList = ref([]);
  const tableRef = ref(null);
  const total = ref(0);


  const data = reactive({
    queryParams: {
      pageNum: 1,
      pageRow: 10,
      dishTypeId: undefined,
      dishInfoId: undefined,
      roomId: undefined,
      productType: undefined,
      orderUserId: undefined,
      dateTime: getNowDay(),
      makeDepartmentId: [],
    },
  });

  const { queryParams } = toRefs(data); 
  const productList = ref([]);
  
  // 双击移动距离 下单右移动 出品左移动
  const movePx = ref('-350px');
  const currentProductType = ref('1');
  // 菜品分类列表
  function getProductTypeList() {
    produceStore.ajaxGetDishTypeSelect().then(res => {
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

  // 出品单列表 右侧
  function getList() {
    productStore.ajaxGetProductRecord(queryParams.value).then(res => {
      if(res) {
        productList.value = res.list;
        total.value = res.count;
      }
    })
  }

  // 出品类型切换
  function handleProduceStatus(productType) {
    getCardRecordData(productType)
    movePx.value = productType == 1 ? '-350px' : '350px';
    currentProductType.value = productType;
  }
  
  // 左侧卡片列表初始化获取
  function getCardRecordData(productType) {
    const data = {
      productType,
      makeDepartmentId: queryParams.value.makeDepartmentId,
    }
    productStore.ajaxGetProductDataRecord(data).then(res => {
      liveCard.value = res.list;
    })
  }

  const handleScroll = (event) => {
    // 只有已出品才接受推送的数据
    if(currentProductType.value == '1') {
      const data = event.data;
      if(data) {
        const d = JSON.parse(data);
        d.isNew = true;
        liveCard.value.unshift(d);
      }
    }
  }

  onMounted(() => {
    getDepartmentList();
    getCardRecordData(currentProductType.value);
    getProductTypeList();
    getOrderList();
    getRoomList();
    getProductNameList();
    getList();
    sseService.connect({eventList:[{"refreshLiveOutput":handleScroll}]})
  })

  function handleDoubleClick(data) {
    cancelOrders({produceDataId: data.id}).then(res => {
      if(res) {
        liveCard.value = liveCard.value.map(item => {
          if(item.id == data.id) {
            item.isDelete = true;
          }
          return item;
        })
        setTimeout(() => {
          liveCard.value = liveCard.value.filter(i => !i.isDelete );
          getList();
        }, 600)
      }
    })
  }
  function handleQuery() {
    let dl = queryParams.value.makeDepartmentId;
    if(dl && dl.length == 1 && dl[0] == 0) {
      queryParams.value.makeDepartmentId = [];
    }
    queryParams.value.pageNum = 1;
    getList();
    getCardRecordData(currentProductType.value);
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
      dateTime: getNowDay(),
      makeDepartmentId: '',
    };
    getList();
  }

  // 重打单
  function handleRepetOrder(index, item) {
    productStore.ajaxProductReissue({
      productRecordIds: [item.id]
    }).then(res => {
      if(res) {
        proxy.$modal.msgSuccess("打单成功");
      }
    });
  }
  const record = ref(null);

  function handleQuitOrder(index, item) {
    record.value = item;
    visible.value = true;
  }

  function handleCancel() {
    visible.value = false;
    record.value = null;
  }
  function handleSuccess() {
    visible.value = false;
    record.value = null;
    getList();
  }

  onBeforeUnmount(() => {
    sseService.removeEvent([{"refreshLiveOutput":handleScroll}])
  })
  
  // 批量已出品
  function handleBatchProduce(produceStatus) {
    const rows = tableRef.value.getSelectionRows();
    if(!rows || rows.length == 0) {
      proxy.$modal.msgWarning('请选择');
      return;
    } else {
      const produceRecordIds = rows.map(item => item.id);
      proxy.$modal.confirm(`是否转为${produceStatus == 1 ? "已出品" : '已下单'}`).then(function () {
        return oneClickProduction({
          produceRecordIds,
          produceStatus,
        })
      }).then((res) => {
          proxy.$modal.msgSuccess("操作成功");
          getList()
        }).catch(function () {
      });
    }
  }

  const multipleSelection = ref([]);
  // 点击某行控制复选框选中与否
  const handleRowChick = (row) => {
    const selected = multipleSelection.value.some((item) => item.id === row.id)
    if (!selected) {
      multipleSelection.value.push(row)
      tableRef.value.toggleRowSelection(row)
    } else {
      const finArr = multipleSelection.value.filter((item) => {
        return item.id !== row.id
      })
      multipleSelection.value = finArr
      tableRef.value.toggleRowSelection(row, false)
    }
  }
</script>
<style lang="scss" scoped>
  @keyframes mymove 
  {
    from {top:-250px;}
    to {top: 52px;}
  }
  /*Safari and Chrome*/
  @-webkit-keyframes mymove
   {
    from {top:-250px;}
    to {top: 52px;}
  }
  .my-move {
    animation:mymove 1s infinite;
    -webkit-animation:mymove 1s infinite;
    animation-iteration-count:1;
  }
  .production-live {
    display: flex;
    &-left {
      width: 335px;
      flex-shrink:0;
      margin-right: 24px;
      height: calc(100vh - 105px);
      overflow-y: auto;
      position: relative;
      .box-card {
        width: 330px;
        height: 250px;
        border-radius: 10px;
        // margin-bottom: 24px;
        border-left: 5px solid #2AD1B7;
        overflow-y: auto;
        position: absolute;
        right: 0;
        transition: all .8s;
      }
      .box-card:last-child {
        margin-bottom: 0;
      }
      .card-transition {
        transition: all 1s;
      }
      .btns {
        position: absolute;
        top: 0;
        z-index: 1;
        height: 32px;
        left: 13%;
        // transform: translateX(-50%);
        & :deep(.el-radio-button__inner) {
          width: 100px;
        }
      }
    }
    &-right {
      width: calc(100% - 359px);
      // flex-shrink:0;
      border-radius: 10px;
      // min-height: calc(100vh - 105px);

      // overflow-y: auto;
      .search {
        display: flex;
        align-items: center;
        margin: 0 0 24px 0;
        flex-wrap: wrap;
      }
    }
  }

  .room-food {
    &-header {
      display: flex;
      justify-content: space-between;
    }
    &-content {
      &-title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      &-content {
        color: #545F6A;
        display: flex;
        justify-content: space-between;
        margin-bottom: 2px;
      }
    }
  }
  .box {
    height: 200px;
    overflow: auto;
  }
  .tbg {
    max-height: calc(100vh - 105px - 210px);
    overflow: auto;
  }
  .handle-btn {
    button {
      padding: 0;
    }
  }
  .make-department-name {
    position: absolute;
    // bottom: 5px;
    right: 20px;
  }
</style>

<style scoped>
  ::-webkit-scrollbar {
    width: 5px;/*竖向滚动条的宽度*/
    height: 5px;/*横向滚动条的高度*/
  }
  /*滚动条轨道的样式*/
  ::-webkit-scrollbar-track {
    -webkit-border-radius: 10px;
    border-radius: 10px;
    background-color: transparent !important;
  }
  ::-webkit-scrollbar-thumb { 
    background-color: transparent; /* 设置滚动条为透明 */ 
  } 
</style>