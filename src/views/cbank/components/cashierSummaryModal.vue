<!--
 * @Description: 收银汇总弹窗
 * @Author: pgm
 * @Date: 2024-02-27 14:17:12
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-19 17:27:56
 * @FilePath: /cbank-client/src/views/cbank/components/cashierSummaryModal.vue
-->

<template>
  <el-drawer v-model="show" class="cashierSummaryModal" size="701" append-to-body :before-close="cancel"
    destroy-on-close :with-header="false">
    <div class="container">
     <div class="d-flex jc-between border-b">
      <div class="text-center fs-18 fw-500 mb-24">收银汇总</div>
      <div>营业日期：{{ cashierData.tradeDate }}</div>
     </div>
      <el-row class="my-14 d-flex  text-center">
        <el-col :span="4" >
          <div  class="d-flex flex-column al-center">
            <div>开台数量</div>
            <div class="fs-20 color-red mt-10">{{ cashierData.openRoomNumber }}</div>
          </div>
        </el-col>
        <el-col :span="4"  :offset="4">
          <div>营业总额：</div>
          <div class="fs-20 color-red mt-10">￥{{ fenToYuan(cashierData.tradeSumAmount) }}</div>
        </el-col>
      </el-row>
      <el-row class="mb-14 mt-30 text-center">
        <el-col :span="4" >
          <div>退单金额</div>
          <div class="mt-10">￥{{ fenToYuan(cashierData.backReservationAmount) }}</div>
        </el-col>
        <el-col :span="4" :offset="4" >
          <div>折扣总额</div>
          <div class="mt-10">￥{{ fenToYuan(cashierData.discountAmount) }}</div>
        </el-col>
        <el-col :span="4"  :offset="4" >
          <div>降销差额</div>
          <div class="mt-10">￥{{ fenToYuan(cashierData.minConsumptionDifferenceAmount) }}</div>
        </el-col>
      </el-row>
      <el-row class="mb-14 mt-30 text-center">
        <el-col :span="4">
          <div>赔偿总额</div>
          <div class="mt-10">￥{{ fenToYuan(cashierData.damagesAmount)  }}</div>
        </el-col>
        <el-col :span="4"  :offset="4">
          <div>菜品收入</div>
          <div class=" mt-10">￥{{ fenToYuan(cashierData.dishAmount) }}</div>
        </el-col>
        <el-col :span="4" :offset="4" >
          <div>其他收入</div>
          <div class=" mt-10">￥{{ fenToYuan(cashierData.otherAmount) }}</div>
        </el-col>
      </el-row>
      <div class="border-t my-30"></div>
      <div class="business-modal-2">
        <div class="d-flex al-center w100 ">
          <div class="mx-20 pointer flex-1 text-center" v-for="item in tableTypeMap" :key="item.type"
            @click="tableChange(item.type)">
            <div class="tab-border" :class="tableType == item.type ? 'isactive' : ''"> {{ item.name }}</div>
          </div>
        </div>
      </div>
      <div v-if="[1,2].includes(tableType) && tabList?.length == 0 || tableType == 3&&pendingData.respList?.length == 0 || tableType == 4&& tabList?.length == 0&&pendingData.respList?.length == 0" class="empty w100 d-flex tablecontent flex-column al-center jc-center">
        <img src="../../../assets/img/cbank/empty/暂无账单信息@2x.png" alt="" width="">
        <div class="mt-20">暂无记录</div>
      </div>
      <div v-else-if="tableType == 1 " class="bg-fff06 p-24 radius-8  ">
        <el-row>
          <el-col :span="12" v-for="item in tabList" :key="item.type" class="mb-30">
            <div class="d-flex al-center">
              <img :src="item.payTypeImg" width="50" height="50" />
              <div class="mx-24">{{ item.payName }}</div>
              <div> ￥{{ fenToYuan(item.amount) }}</div>
            </div>
          </el-col>
        </el-row>
        <div class="total  pr-50" v-if="total > 0">{{tableType == 4?'房台':''}}总计：<span class="color-red fw-500 fs-20">￥{{ fenToYuan(total) }}</span></div>
      </div>
      <div v-else-if="tableType == 2" class="tablecontent">
        <el-table :data="tabList" class="border-1 " height="100%" v-loading="tableLoaing">
          <el-table-column label="菜品名称" align="center" prop="dishName" :show-overflow-tooltip="true" />
          <el-table-column label="数量" align="center" prop="dishNumber" />
          <el-table-column label="金额" align="center" prop="dishAmount">
            <template #default="scope">
              <div>{{ fenToYuan(scope.row.dishAmount) }} </div>
            </template>
          </el-table-column>
          <el-table-column label="占比" align="center" prop="percentage" />
        </el-table>
      </div>
      <div class="bg-fff06 p-24 radius-8  mt-20" v-else-if="tableType == 3">
        <el-row>
          <el-col :span="12" v-for="item in pendingData.respList" :key="item.type" class="mb-30">
            <div class="d-flex al-center">
              <img :src="item.payImage" width="50" height="50" />
              <div class="mx-24">{{ item.payName }}</div>
              <div> ￥{{ fenToYuan(item.amount) }}</div>
            </div>
          </el-col>
        </el-row>
        <div class="total  pr-50" v-if="total>0">挂账回收总计：<span class="color-red fw-500 fs-20">￥{{ fenToYuan(pendingData.total) }}</span></div>
      </div>
      <div v-else-if="tableType == 4">
        <div  class="bg-fff06 p-24 radius-8" >
        <el-row>
          <el-col :span="12" v-for="item in tabList" :key="item.type" class="mb-30">
            <div class="d-flex al-center">
              <img :src="item.payTypeImg" width="50" height="50" />
              <div class="mx-24">{{ item.payName }}</div>
              <div> ￥{{ fenToYuan(item.amount) }}</div>
            </div>
          </el-col>
        </el-row>
        <div  v-if="total>0" class="total  pr-50">{{tableType == 4?'房台':''}}总计：<span class="color-red fw-500 fs-20">￥{{ fenToYuan(total) }}</span></div>
      </div>
      <div class="bg-fff06 p-24 radius-8  mt-20" v-if="pendingData.respList.length>0">
        <el-row>
            <el-col :span="12" v-for="item in pendingData.respList" :key="item.type" class="mb-30">
              <div class="d-flex al-center">
                <img :src="item.payImage" width="50" height="50" />
                <div class="mx-24">{{ item.payName }}</div>
                <div> ￥{{ fenToYuan(item.amount) }}</div>
              </div>
            </el-col>
          </el-row>
          <div class="total  pr-50" v-if="pendingData.total>0">挂账回收总计：<span class="color-red fw-500 fs-20">￥{{ fenToYuan(pendingData.total) }}</span></div>
        </div>
      </div>
     
     
    </div>
  </el-drawer>
</template>

<script setup>
import { fenToYuan } from '@/utils'
import { cashierSummary, revenueCollectionInfo, dishStatistics, pendingRecoveryInfo } from '@/api/cbank'
import { reactive } from 'vue';
const emit = defineEmits(["update:value"])
const props = defineProps({
  value: {
    type: String,
    require: true,
    default: ''
  },

})
const tableLoaing = ref(false)
const queryParams = ref({
  type: 1
})

const tableTypeMap = ref([
  { type: 1, name: '营业收款明细' },
  { type: 2, name: '菜品统计' },
  { type: 3, name: '挂账回收明细' },
  { type: 4, name: '当前收款' }
])

const tableType = ref(1)
const tabList = ref(null)
let pendingData = reactive({
  list: null,
  total:0
})
const cashierData = ref({})
//弹窗控制
const show = computed(() => {
  if (props.value == 'cashierSummaryModal') {
    init()
  }
  return props.value == 'cashierSummaryModal'
})

/** tab切换 */
function handleQuery() {
  // queryParams.value.pageNum = 1;
  // getList();
}
//获取收银汇总
const getcashierSummary = () => {
  cashierSummary().then(res => {
    cashierData.value = res
  })
}

//营业收款明细
const getRevenueCollectionInfo = (type) => {
  let params = {}
  if (type == 4) {
    params.isNowUser = 1
  }
  revenueCollectionInfo(params).then(res => {
    tabList.value = res
  })
}

const total = computed(() => {
  if (tableType.value != 2) {
    let amount = 0
    tabList.value?.forEach(item => {
      amount += item.amount
    })
    return amount
  } else {
    return 0
  }
})

//获取菜品统计
const getDishStatistics = () => {

  dishStatistics().then(res => {
    tabList.value = res
  })
}

//获取挂账回收明细
const getPendingRecoveryInfo = (isNowUser=0) => {
  pendingRecoveryInfo({isNowUser}).then(res => {
    pendingData.respList = res.respList
    pendingData.total = res.sumAmount
    // payTypeImg
    // pendingData.list = res.respList.map(item => {
    //   item.payTypeImg = item.payImage
    //   return item
    // })
  })
}


const init = () => {
  getcashierSummary()
  getRevenueCollectionInfo(1)
}
const tableChange = (index) => {
  tabList.value = null
  pendingData.respList = null
  pendingData.total = 0
  if (index == 1) {
    getRevenueCollectionInfo(index)
  }
  if (index == 2) {
    getDishStatistics()
  }
  
  if (index == 3) {
    getPendingRecoveryInfo()
  }
  if (index == 4) {
    getRevenueCollectionInfo(index)
    getPendingRecoveryInfo(1)
  }
  tableType.value = index
}


//弹框重置
function cancel() {
  tableType.value = 1
  emit('update:value', '')
  // form.value={}
  // selectRoomInfo.value = {};
}
</script>

<style lang="scss" scoped>
.business-modal-1 {
  line-height: 1.2;

  .el-row {
    .el-col {
      padding: 24px;
      padding-bottom: 12px;

      &>div {
        padding-bottom: 12px;
      }
    }
  }
}

.container {
  padding: 30px 22px 55px;
  height: 100%;
  box-sizing: border-box;

}

.business-modal-2 {

  .tab-border {
    &:after {
      content: "";
      display: block;
      width: 26px;
      height: 2px;
      background: transparent;
      margin: 15px auto 0;
    }

    &.isactive:after {
      content: "";
      display: block;
      width: 26px;
      height: 2px;
      background: var(--el-color-primary);
      margin: 15px auto 0;
    }
  }

}

.tablecontent {
  height: calc(100% - 250px);
}
</style>