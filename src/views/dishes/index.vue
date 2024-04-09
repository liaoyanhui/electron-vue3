
<template>
  <div class="w100 d-flex flex-column">
    <div class="d-flex al-center jc-between color-fff py-12 px-24 border-b">
      <div class="d-flex al-center">
        <div>{{ isOpenGift?title.replace('收银点单','赠送'):title }}</div>
        <el-button  v-hasPermi="['cbank:zengsong']" type="primary" class="mx-30" @click="isOpenGiftHandle" v-if="giftUsersList.length>0">
          {{isOpenGift?`切换为点单`:`切换赠送模式`}}
        </el-button>
        <div v-if="isOpenGift">赠送人：</div>
        <GiftUserselect  v-hasPermi="['cbank:zengsong']" v-if="isOpenGift" v-model="queryParams.sendUserGiftId"  :peoplelist="giftUsersList"
              placeholder="请选择订房人" automatic-dropdown
            style="width: 120px">
          </GiftUserselect>
      </div>
      <div class="d-flex al-center">
        <div class="d-flex al-center mr-30">
          <div class="mr-30">房台低消： ￥{{ fenToYuan(sInfo.minConsumption) }}</div>
          <div class="mr-30">房台落单： ￥{{ fenToYuan(sInfo.settledAmount) }}</div>
          <div class="mr-30">低消差额 ￥{{ fenToYuan(sInfo.lowConsumptionDifference) }}</div>
        </div>
        <el-button type="primary" @click="emit('reset')">
          返回收银台
        </el-button>
      </div>
    </div>
    <div class="w100 height flex-1 d-flex flex-column p-r">
      <!-- 容器 -->
      <el-row class="container px-20">
        <!-- 左侧 -->
        <el-col :span="9" :xs="24" class="border-r h100">
          <!-- 搜索框 -->
          <div class="search-box pr-50 mt-20">
            <el-input v-model="queryParams.name" placeholder="请输入菜品名称" clearable prefix-icon="Search" class="mr-30" />
          </div>

          <el-row class="mt-20 left">
            <!-- 分类树 -->
            <el-col :span="10" :xs="24" class="h100 over-scorll border-r">
              <el-tree ref="dishesTreeRef" :data="deptOptions" :props="{ label: 'name', children: 'children' }" :expand-on-click-node="false"
                :current-node-key="currentKey" node-key="id" highlight-current default-expand-all
                @node-click="handleNodeClick" />
            </el-col>
            <!-- 菜品列表 -->
            <el-col :span="14" :xs="24" v-loading="productLoading" class="h100 over-scorll " v-infinite-scroll="loadMore"
              infinite-scroll-distance="50">
              <div  v-if="productList.length ==0" class="h100 d-flex jc-center al-center" >暂无商品</div>
              <div v-else class="d-flex al-center product-item border-b" v-for="(item, index) in productList" :key="index"
                @click="addShopCart(item,1)">
                <img width="54px" height="54px"
                  :src="item.pic || 'https://image.hzxyle.com/cbank/system-img/default-produce.png'" class="image" />
                <div class="d-flex flex-column ml-10 flex-1">
                  <div class="fs-16 fw-500 d-flex">
                    <div class="flex-1 el-1 ">{{ item.name }}</div>
                      <el-popover placement="bottom" :width="240" trigger="hover" v-if="item.existActivity">
                        <template #reference>
                          <el-tag   round effect="dark" :type="item.existActivity == 2?'success':'warning'">买送</el-tag>
                        </template>
                        <div>{{`买${item.dishActivityResp.buyDishInfoCount}${item.dishActivityResp.buyDishInfoUnit}`}}<span class="color-warning">{{`${item.dishActivityResp.buyDishInfoName}`}}</span>送{{`${item.dishActivityResp.giftDishInfoCount}${item.dishActivityResp.giftDishInfoUnit}`}}<span class="color-green">{{`${item.dishActivityResp.giftDishInfoName}` }}</span></div>
                      </el-popover>
                  </div>
                  <div class="fs-14 mt-10">￥{{ fenToYuan(item.mealPrice) }}</div>
                </div>
              </div>
              
            </el-col>
          </el-row>
        </el-col>
        <!-- 购物车 -->
        <el-col :span="15" :xs="24" class="h100 pl-10">
          <div class="d-flex al-center jc-center tab-head">
            <div class="pointer mx-20 py-18" :class="tableType == 1 ? 'border-2-b-green color-green' : ''" @click="tableType = 1">
              下单
            </div>
            <div class="pointer mx-20 py-18" :class="tableType == 2 ? 'border-2-b-green color-green ': ''" @click="tableType = 2">
              点单记录
            </div>
          </div>
          <div class="tab-content">
            <Cart v-if="tableType === 1" v-model:cartList="cartList" v-model:cartSelected="cartSelected"></Cart>
            <OrderList v-if="tableType === 2" :roomId="roomInfo.roomId" @addShopCart="addShopCart" :sendUserGiftId="queryParams.sendUserGiftId"></OrderList>
          </div>
        </el-col>
      </el-row>
      <div class="dialog-footer" style="left:0;bottom:0;">
        <div class="mr-40" v-if="totalPirce > 0">小计：¥{{ fenToYuan(totalPirce) }}</div>
        <el-button @click="delCart">移除</el-button>
        <el-button type="primary" @click="submitForm" :disabled="cartList.length == 0">下单</el-button>
      </div>
    </div>
  </div>
  <!-- 底部 -->
</template>

<script setup name="User">
import GiftUserselect from './components/giftUserselect.vue'
import Cart from './components/cart'
import OrderList from './components/orderList.vue'
import { debounce, fenToYuan, throttle } from '@/utils/index'
import { getDishTypeSelect, getDishInfoSelect, createOrder, getDishInfoSelectOne, getGiftUsers } from '@/api/dishes/index'
import { settlementInfo } from '@/api/cbank'
import { useDishesSystemStore } from '@/store/system'

import { onMounted, watchEffect } from 'vue'
const props = defineProps({
  roomInfo: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['reset'])
const { proxy } = getCurrentInstance();
const dishesTreeRef = ref(null)
const dishesSystemSote = useDishesSystemStore()
const isOpenGift = ref(false) //是否开启赠送模式
const cartList = ref([])
const cartSelected = ref([])
const productList = ref([]);
const tableType = ref(1)
const deptOptions = ref();
const currentKey = ref(0)
const productLoading = ref(false)
const data = reactive({
  queryParams: {
    status: 1,
    pageNum: 1,
    pageRow: 10,
    name: '',
    id: null,
    sendUserGiftId:null,
    type: 0
  },
});
const sInfo = ref({
  minConsumption: 0,
  settledAmount: 0,
  lowConsumptionDifference: 0
})

const totalPirce = ref(0)
const isCanLoadMore = ref(true)
const { queryParams} = toRefs(data);
const giftUsersList = ref([])
console.log('props.roomInfo',props.roomInfo.useStatus)
watch(() => props.roomInfo.useStatus, (val) => {
  console.log('props.val',val)
})
watch(() => queryParams.value.name, debounce((val) => {
  handleQuery()
}, 500))

watchEffect(() => {
  let list = cartList.value
  let total = 0
  list.forEach(item => {
    total += item.mealPrice * item.dishInfoCount
  })
  totalPirce.value = total
  return {}
})


const isOpenGiftHandle = () => {
  if (isOpenGift.value) {
    isOpenGift.value = false
    queryParams.value.sendUserGiftId = null
  } else {
    isOpenGift.value = true
    let  id  = giftUsersList.value[0]?.id || ''
    queryParams.value.sendUserGiftId = id
  }
}

watch(() => queryParams.value.sendUserGiftId, (val,old) => {
  console.log('val',val,old)
  if (val != old) {
    isCanLoadMore.value = true
    productList.value=[]
    cartList.value = []
    queryParams.value.id = null
    queryParams.value.name = ''
    queryParams.value.type = 0
    queryParams.value.sendUserGiftId= val
    proxy.$refs['dishesTreeRef'].setCurrentKey(null);
    handleQuery()
  }
 
})



/** 查询菜品分类树结构 */
function getDeptTree() {
  // setLoading(true)
  deptOptions.value=[]
  const { roomId, consumeHistoryId: roomConsumeHistoryId } = props.roomInfo
  const params = { roomId, roomConsumeHistoryId}
  getDishTypeSelect(params).then(res => {
    // setLoading(false)
    deptOptions.value = res
  }).catch(e => {
    // setLoading(false)
  })
};
/** 查询菜品分类详情 */
function getDishInfoList() {
  productLoading.value = true
  const { roomId } = props.roomInfo
  let params = {
    roomId,
    roomConsumeHistoryId:props.roomInfo.consumeHistoryId,
    ...queryParams.value,
  }
  getDishInfoSelect(params).then(res => {
    // currentKey.value = res.list[0]?.dishTypeId || ''
    let list = []
    if (queryParams.value.pageNum == 1) {
      list = res.list
    } else {
      list = productList.value.concat(res.list)
    }
    console.log('list.length ',list.length ,res.count)
    if (list.length < res.count) {
      queryParams.value.pageNum++
      isCanLoadMore.value = true
    } else {
      isCanLoadMore.value = false
    }
    productList.value = list
  }).catch(e => {
    // setLoading(false)
  }).finally(() => {

    productLoading.value = false
  })
};

/** 分类树单击事件 */
function handleNodeClick(data) {
  queryParams.value.id = data.id;
  queryParams.value.type = data.type
  handleQuery();
};

//菜品列表加载更多
function loadMore() {
  console.log('aaa',)
  if (isCanLoadMore.value && !productLoading.value) {
    getDishInfoList();
  }
}
/** 搜索 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  isCanLoadMore.value = true
  getDishInfoList();
};

/**菜品添加购物车*/
function addShopCart(item, tableIndex) {
  if (tableIndex) {
    tableType.value = tableIndex
  }
  let { id, type } = item
  proxy.$modal.loading()
  getDishInfoSelectOne({ id, type, historyConsumeId: props.roomInfo.consumeHistoryId }).then(res => {
    proxy.$modal.closeLoading()
    let { id, name, price: mealPrice, departmentId: makeDepartmentId, type, unitName, dishInfoCount = 1,isOrderExist, bindType = 1, bindTypeId, dishTasteId = 0, remarks = '', childDishes = [], existActivity,dishActivityResp} = res
    const carItem = { id, name, mealPrice, makeDepartmentId, type, unitName, dishInfoCount, dishTasteId, remarks, childDishes, bindType, bindTypeId,existActivity,dishActivityResp }
    const hasProduct = cartList.value.filter(item => item.id == id)
    const len = hasProduct.length
    if (len == 0 && isOrderExist == null) {
      cartList.value.push(carItem)
    } else if (isOrderExist == 1 || type == 4) {
      proxy.$modal.msgWarning('畅饮套餐不能重复添加')
    } else {
      hasProduct[0].dishInfoCount = hasProduct[0].dishInfoCount + dishInfoCount
      // dishTasteId===0 ? hasProduct[0].dishTasteId = dishTasteId
    }
    // tableType.value = 1
  }).catch(() => {
    proxy.$modal.closeLoading()
  })
}

//从购物车里删除
function delCart() {
  const list = cartList.value.filter(item => !cartSelected.value.includes(item.id))
  cartList.value = list
}

// 暴露给父组件的方法
const submitForm = (model = false) => {
 
  let { roomId, consumeHistoryId: roomConsumeHistoryId, useStatus: roomStatus } = props.roomInfo
  let produceSaveReqList = cartList.value.map(item => {
    let { id, name, mealPrice, makeDepartmentId, type, dishInfoCount, dishTasteId, remarks, bindTypeId, bindType } = item
    return {
      id, name, mealPrice, makeDepartmentId, type, dishInfoCount, dishTasteId, remarks, bindTypeId, bindType
    }
  })
  let list = JSON.stringify(produceSaveReqList)
  let params = {
    roomId,
    roomConsumeHistoryId,
    produceSaveReqs: list,
    // roomStatus,
    roomAdminId: 1, //TODO
    sendUserGiftId: queryParams.value.sendUserGiftId
  }
  proxy.$modal.loading()
  return createOrder(params).then(() => {
    proxy.$modal.closeLoading()
    cartList.value = []
    proxy.$modal.msgSuccess("下单成功");
    // model & emit('reset')
  }).catch(() => {
    proxy.$modal.closeLoading()
  })
};
const getSettlementInfo = () => {
  let { roomId } = props.roomInfo
  return settlementInfo({ roomId }).then(res => {
    sInfo.value = res
  })
}

//获取赠送用户

const getGiftUsersList = () => {
  getGiftUsers().then(res => {
    console.log('res', res)
    giftUsersList.value= res
  })
}


// defineExpose({
//   submitForm
// })

onMounted(() => {
  getDeptTree();
  getDishInfoList();
  dishesSystemSote.getDishTastes()
  getSettlementInfo()
  getGiftUsersList()
})
</script>
<style lang="scss" scoped>
.product-item {
  overflow: hidden;
  padding: 23px 15px;
}

.container {
  overflow: hidden;
  height: calc(100% - 80px);
  .left {
    height: calc(100% - 72px);
  }
}

.dialog-footer {
  // bottom:0;
  // right:0;
  // width: calc(100% - 90px);
  height: 70px;
  width: 100%;
  box-shadow: 0px -2px 6px 0px rgba(0, 0, 0, 0.27);
  z-index: 2000;
  display: flex;
  justify-content: end;
  align-items: center;
  padding-right: 50px;
}



.height {
  height: calc(100% - 70px);
}

.tab-head {
  height: 60px;
}

.tab-content {
  height: calc(100% - 75px);
}
</style>  
