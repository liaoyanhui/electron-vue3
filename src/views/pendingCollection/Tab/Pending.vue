<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-03-04 15:22:56
 * @LastEditTime: 2024-03-19 18:14:52
 * @FilePath: /cbank-client/src/views/pendingCollection/Tab/Pending.vue
-->

<template>
  <div class="today-control">
    <el-button   type="primary" @click="handleTodyCollection">今日回收</el-button>
  </div>
  <div class="pending w100">
    <div class="pending-left  " :class="{'has-right': multipleSelection.length>0}">
      <div class="pending-left-search border-r p-24">
        <el-date-picker  style="width: 320px;" v-model="selectTime" type="daterange" format="YYYY-MM-DD" 
            placeholder="请选择日期" :clearable="false"  />
        <div class="my-20">
          <SelectPeople v-model:value="pendingData.queryParams.creditId" v-model:type="pendingData.queryParams.creditType" :typeFilter="[2]" placeholder="请选择" automatic-dropdown>
          </SelectPeople>
        </div>
        <div class="btn-box mb-20">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>
        <div>
          <el-table :data="pendingData.respList.list" class="tbg" ref="tableRef" highlight-current-row @row-click="rowClickHandle" v-loading="pendingData.loading">
            <el-table-column label="挂账责任人" align="center" prop="creditUserName" />
            <el-table-column label="挂账金额" align="center" prop="sumCreditAmount" :formatter="(a, b, c, d) => fenToYuan(c)" />
            <el-table-column label="已回收金额" align="center" prop="recoveryAmount" :formatter="(a, b, c, d) => fenToYuan(c)" />
          </el-table>
          <div class="pending-total">
            合计：<span class="color-red">￥{{fenToYuan(pendingData.sumAmount)  }}</span>
          </div>
          <!-- <pagination  v-show="pendingData.respList.count > 0" :total="pendingData.respList.count" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" /> -->
        </div>
      </div>
      <div class="pending-left-detail p-24">
        <div class="pending-total mb-20">
          合计：<span class="color-red">￥{{ fenToYuan(pendingDetailList.sumAmount) }}</span>
        </div>
        <el-table :data="pendingDetailList.respList.list" ref="tableDetailRef"  @selection-change="handleSelectionChange"  v-loading="pendingDetailList.loading">
          <el-table-column type="selection" width="55" />
          <el-table-column label="挂账时间" align="center" prop="addTime" />
          <el-table-column label="结账单号" align="center" prop="billNumber" />
          <el-table-column label="房台" align="center" prop="roomName" />
          <el-table-column label="客人" align="center" prop="custName" />
          <el-table-column label="挂账责任人" align="center" prop="creditUserName" />
          <el-table-column label="挂账金额" align="center" prop="creditAmount" :formatter="(a, b, c) => fenToYuan(c)"/>
          <el-table-column label="操作" align="center" prop="companyDay">
            <template #default="scope">
            <el-link :underline="false" type="primary" @click="handleDetail(scope.row)">详情</el-link>
            </template>
          </el-table-column>
        </el-table>
         <pagination  v-show="pendingDetailList.respList.count > 0" :total="pendingDetailList.respList.count" v-model:page="pendingDetailList.queryParams.pageNum"
        v-model:limit="pendingDetailList.queryParams.pageSize" @pagination="getPendingTable" />
       
      </div>
    </div>
    <div class="pending-right ml-16" v-show="multipleSelection.length>0">
      <Pay :selectTotal="selectTotal" :selectIds="selectIds" @getList="getPendingTable"/>
    </div>
    <PendingDetailDraw :drawer="pendingDetailDrawer" :dataSource="dataSource" @cancel="handleCancelP" />
    <TodayRecoveryDraw :drawer="todayDrawer"  @getList="getList" @cancel="handleCancelT"/>
  </div>
</template>

<script setup>
import Pay from '../components/pay.vue';
import SelectPeople from '@/components/SelectPeople/SelectPeople.vue';
import TodayRecoveryDraw from '../components/TodayRecoveryDraw.vue';
import dayjs from 'dayjs';
import { getCreditPolymerizationList,getCreditInfoList,getCreditInfo } from '@/api/pendingCollection'
import { fenToYuan, yuanTofen } from '@/utils/index.js';
import PendingDetailDraw from '../components/PendingDetailDraw.vue';
import { computed, reactive } from 'vue';

const todayDrawer = ref(false);
const pendingDetailDrawer = ref(false);
const dataSource = ref(null);

const initData = {
  creditId: undefined,
  creditType: undefined,
  pageNum: 1,
  pageSize: 10 
};

const pendingData = reactive({
  sumAmount: 0,
  respList: {
    sumAmount: 0,
    list: [],
    count: 0
  },
  loading: false,
  queryParams: {
    ...initData,
    startTime: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    endTime: dayjs().format('YYYY-MM-DD'),
  },
  selectPeople: null
})

const pendingDetailList = reactive({
  sumAmount: 0,
  respList: {
    sumAmount: 0,
    list: [],
    count: 0
  },
  loading: false,
  queryParams: {
    ...initData,
  },
})
const multipleSelection = ref([])
const selectIds = ref([])
const timePicker = ref([dayjs().subtract(7, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')])
const selectTime = computed({
  get() {
    return timePicker.value
    },
    set(val) {
      if (val?.length > 0) {
        pendingData.queryParams.startTime = dayjs(val[0]).format('YYYY-MM-DD')
        pendingData.queryParams.endTime = dayjs(val[1]).format('YYYY-MM-DD')
      } else {
        pendingData.queryParams.startTime = ''
        pendingData.queryParams.endTime=''
      }
      timePicker.value =val
    }
  })
const selectTotal = computed(() => {
  selectIds.value =multipleSelection.value.map(item=> item.id).join()
  return multipleSelection.value.reduce((acc, currentValue) => {
      return acc + currentValue.creditAmount;
   }, 0);
})

const handleSelectionChange = (val) => {
 
  multipleSelection.value = val
  // console.log('val',val,multipleSelection.value)
}

function handleTodyCollection() {
    todayDrawer.value = true;
  }

  function handleCancelT() {
    todayDrawer.value = false;
  }

function handleSearch() {
  getList()
}

//获取左侧挂账人员员列表
function getList() {
  pendingData.loading = true
  getCreditPolymerizationList({ ...pendingData.queryParams }).then(res => {
    let { respList, sumAmount } = res
    respList.value =respList
    pendingData.sumAmount = sumAmount
    pendingData.respList = respList
    pendingDetailList.respList.list = []
    pendingDetailList.sumAmount = 0
    pendingDetailList.respList.count =0
    pendingDetailList.respList.sumAmount =0
    multipleSelection.value = []
  }).finally(() => {
    pendingData.loading = false
  })
}


function rowClickHandle(row) {
  let { creditId } = row
  pendingData.selectPeople =creditId
  getPendingTable()
}

//获取单个用户的挂账信息
function getPendingTable() {
  let creditId = pendingData.selectPeople
  pendingDetailList.loading = true
  getCreditInfoList({ creditId }).then(res => {
    let { respList, sumAmount } = res
    respList.value =respList
    pendingDetailList.sumAmount = sumAmount
    pendingDetailList.respList = respList
    multipleSelection.value = []
  }).finally(() => {
    pendingDetailList.loading = false
  })
}

function handleDetail(data) {
  let { id, billNumber } = data
  getCreditInfo({ id}).then(res => {
    dataSource.value = res;
    pendingDetailDrawer.value = true;
  })
}



function handleCancelP() {
  pendingDetailDrawer.value = false;
  dataSource.value = {};
}

handleSearch()



</script>

<style lang="scss" scoped>
.today-control{
  height: 58px;
  display: flex;
  flex-direction: row-reverse;
  padding-right: 24px;
}
.pending {
  display: flex;
  justify-content: space-between;
  height: calc(100% - 82px);
  &-left {
    width: 100%;
    &.has-right{
        width: calc(100% - 510px);
    }
    background-color: #323745;
    border-radius: 20px;
    display: flex;
    &-search {
      width: 370px;
      .btn-box {
        display: flex;
        justify-content: center;
      }
    }

    &-detail {
      width: calc(100% - 370px);
    }

    .pending-total {
      text-align: right;
      margin-top: 15px;
    }
  }

  &-right {
    width: 510px;
    background-color: #323745;
    border-radius: 20px;
    padding: 12px 0;
  }
}
</style>

<style>
.pending .el-drawer__header {
  margin-left: 0 !important;
  color: #fff;
  padding-bottom: 0 !important;
  height: 50px;
  line-height: 50px;
  padding: 0 24px;
}

.pending .el-drawer__body {
  padding: 20px 24px !important;
}
</style>