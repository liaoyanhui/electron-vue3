<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-03-04 15:23:15
 * @LastEditTime: 2024-03-14 20:26:33
 * @FilePath: /cbank-client/src/views/pendingCollection/Tab/Recycled.vue
-->
<template>
  <div class="app-container recycled ">
    <div class="search">
      <div class="mr-8 mb-8">
        <span class="px-6">回收时间</span>
        <el-date-picker
          v-model="creditTime"
          type="daterange"
          format="YYYY-MM-DD"
          placeholder="请选择日期"
          :clearable="false"
        />
      </div>
      <div class="mr-8 mb-8">
        <span class="px-6">挂账时间</span>
        <el-date-picker
          v-model="pendingTime"
          type="daterange"
          format="YYYY-MM-DD"
          placeholder="请选择日期"
          clearable
        />
      </div>
      <div class="mr-8 mb-8">
        <span class="px-6">挂账责任人</span>
        <SelectPeople v-model:value="queryParams.creditId"  v-model:type="queryParams.creditType" :typeFilter="[2,3]"  placeholder="请选择订房人" automatic-dropdown
          style="width: 200px">
        </SelectPeople>
      </div>
      <el-button class="mb-8" type="primary" @click="handleQuery">查询</el-button>
      <el-button class="mb-8" @click="handleReset">重置</el-button>
    </div>
    <div class="pending-total"> 
        <span>
          合计挂账金额：<span class="color-red">￥{{ fenToYuan(sumCreditAmount) }}</span>
        </span>
        <span class="ml-20">
          合计回收实付金额：<span class="color-red">￥{{ fenToYuan(sumActualAmountReceived) }}</span>
        </span>
    </div>
    <div class="mt-10">
      <el-table :data="respList.list" class="ml10 tbg" ref="tableRef" v-loading="loading">
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="回收时间" align="center" prop="editTime" />
        <el-table-column label="回收账单号" align="center" prop="billNumber"/>
        <el-table-column label="结账单号" align="center" prop="checkoutNumber" >
          <template #default="scope">
            <div v-for="item in scope.row.checkoutNumber" :key="item.id">{{ item }}</div>
          </template>
        </el-table-column>
        <el-table-column label="挂账责任人" align="center" prop="creditUserName" :show-overflow-tooltip="true"  />
        <el-table-column label="挂账金额" align="center" prop="creditAmount" :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="回收实付金额" align="center" prop="actualAmountReceived" :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="操作" align="center" prop="companyDay">
          <template #default="scope">
            <el-link :underline="false" type="primary" @click="handleDetail(scope.row)">详情</el-link>
          </template>
        </el-table-column>
      </el-table>
      <pagination  v-show="respList.count > 0" :total="respList.count" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
      
    </div>
    <RecoveryDraw :drawer="drawer" :dataSource="dataSource" @cancel="handleCancelT"/>
  </div>
</template>

<script setup>
  import dayjs from 'dayjs';
  import { fenToYuan, yuanTofen } from '@/utils/index.js';
  import SelectPeople from '@/components/SelectPeople/SelectPeople.vue';
import RecoveryDraw from '../components/RecoveryDraw.vue';
import { recycledCreditBillList,recycledCreditBillInfo } from '@/api/pendingCollection'
import { computed, reactive, toRefs } from 'vue';

const drawer = ref(false);
const loading = ref(false)
const tableData = reactive({
    respList: {
      list: [],
      count: 0
    },
    sumActualAmountReceived: 0,
    sumCreditAmount:0
  })

  const dataSource = ref(null);
  const initData = {
    pageNum: 1,
    pageRow: 10,
    dateTime1:[],
    creditId: undefined,
    creditType:undefined,
    creditStartTime: dayjs().subtract(1, 'month').startOf('day').set('hour', 12).format('YYYY-MM-DD HH:mm:ss'),
    creditEndTime: dayjs().add(1, 'day').startOf('day').set('hour', 11).set('minute', 59).set('second', 59).format('YYYY-MM-DD HH:mm:ss'),
    pendingStartTime:'',
    pendingEndTime:'',
  };
  const infoTime = [dayjs().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss'),dayjs().format('YYYY-MM-DD HH:mm:ss')]
  const creditTimePicker = ref(infoTime)
  const pendingTimePicker = ref('')
  const data = reactive({
    queryParams: {
      ...initData,
    },
  });
  const {respList,sumActualAmountReceived,sumCreditAmount} = toRefs(tableData)
  const { queryParams } = toRefs(data); 
  const creditTime = computed({
    get() {
      return creditTimePicker.value
    },
    set(val) {
      if (val?.length > 0) {
        queryParams.value.creditStartTime = dayjs(val[0]).startOf('day').set('hour', 12).format('YYYY-MM-DD HH:mm:ss');
        queryParams.value.creditEndTime = dayjs(val[1]).add(1, 'day').startOf('day').set('hour', 11).set('minute', 59).set('second', 59).format('YYYY-MM-DD HH:mm:ss');
      } else {
        queryParams.value.creditStartTime = ''
        queryParams.value.creditStartTime=''
      }
      creditTimePicker.value = val
    }
  })
  const pendingTime = computed({
    get() {
      return pendingTimePicker.value
    },
    set(val) {
      if (val?.length > 0) {
        queryParams.value.pendingStartTime = dayjs(val[0]).startOf('day').set('hour', 12).format('YYYY-MM-DD HH:mm:ss');
        queryParams.value.pendingEndTime = dayjs(val[1]).add(1, 'day').startOf('day').set('hour', 11).set('minute', 59).set('second', 59).format('YYYY-MM-DD HH:mm:ss');
      } else {
        queryParams.value.pendingStartTime = ''
        queryParams.value.pendingEndTime=''
      }
      pendingTimePicker.value =val
    }
  })
  
  function handleQuery() {
    getList();
  }
function handleReset() {
    creditTimePicker.value = infoTime
  pendingTimePicker.value = ''
  queryParams.creditId= undefined,
  queryParams.creditType=undefined,
    queryParams.value = { ...initData };
    getList();
  }
const getList = () => {
  loading.value = true
  console.log(queryParams.value )
  // pendingData.queryParams.startTime =  pendingData.queryParams.dateTime[0]
  // pendingData.queryParams.endTime = pendingData.queryParams.dateTime[1]
    recycledCreditBillList({ ...queryParams.value }).then(res => {
      respList.value = res.respList
      sumActualAmountReceived.value = res.sumActualAmountReceived
      sumCreditAmount.value = res.sumCreditAmount
    }).finally(() => {
      loading.value = false
    })
  }

function handleDetail(data) {
  let { id } = data
  recycledCreditBillInfo({ id }).then(res => {
    let { paymentInfo = null } = res
    if (paymentInfo) {
      res.paymentInfo = JSON.parse(paymentInfo)
    }
    dataSource.value = res;
    drawer.value = true;
  })
    // drawer.value = true;

    // dataSource.value = data;
  }

  function handleCancelT() {
    drawer.value = false;
  }

  handleQuery()
</script>


<style lang="scss" scoped>
.app-container{
  margin-top:58px ;
  height: calc(100% - 58px);
}
.search {
  display: flex;
  align-items: center;
  margin: 0 ;
  flex-wrap: wrap;
}
.recycled {
  background-color: #323745;
  padding: 26px 24px 0;
  border-radius: 20px;
}
.pending-total {
  text-align: right;
  margin-top: 15px;
}
</style>

<style>
/* recycled */
.recycled .el-drawer__header {
  margin-left: 0 !important;
  color: #fff;
  padding-bottom: 0 !important;
  height: 50px;
  line-height: 50px;
  padding: 0 24px;
}
.recycled .el-drawer__body {
  padding: 20px 24px !important;
}
</style>