<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-21 10:07:00
 * @LastEditTime: 2024-03-19 16:15:07
 * @FilePath: /cbank-client/src/views/memberManagement/memberInfo/memberCardInformation/Modal/TransactionDetails.vue
-->
<template>
  <el-dialog title="交易明细" :model-value="visible" width="1100px" 
    destroy-on-close :before-close="handleBeforeClose"
    lock-scroll>
    <div class="search">
      <div class="mr-8 mb-8">
        <span class="px-6">交易类型</span>
        <el-select
          v-model="queryParams.transType"
          class="m-2 mr-8"
          placeholder="请选择"
          style="width: 200px"
          clearable
          filterable
        >
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="mr-8 mb-8">
        <span class="px-6">时间</span>
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
    </div>
    <el-divider></el-divider>
    <div class="fw-500 mb-24 header">
      <div>
        <span class="mr-24">会员昵称: {{ dataSource && dataSource.memberName }}</span>
        <span class="mr-24">会员手机号:  {{ dataSource && dataSource.memberMobile }}</span>
        <span class="mr-24">会员卡号:  {{ dataSource && dataSource.accountCardNumber }}</span>
        <span>会员卡类型:  {{ dataSource && dataSource.accountTypeName }}</span>
      </div>
      <div>
        <span class="mr-24">充值余额：¥{{ dataSource && dataSource.accountBalanceRecharge}}</span>
        <span>赠送余额：¥{{ dataSource && dataSource.accountBalanceDonate}}</span>
      </div>
    </div>
    <el-table :data="detailList" class="ml10" ref="tableRef">
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="会员卡号" align="center"  prop="accountCardNumber" :show-overflow-tooltip="true" />
      <el-table-column label="交易类型" align="center" prop="transTypeName" :show-overflow-tooltip="true" />
      <el-table-column label="流水号" align="center" prop="transNo" :show-overflow-tooltip="true" />
      <el-table-column label="金额" align="center" prop="amount"  />
      <el-table-column label="详情" align="center" prop="runningDescription" :show-overflow-tooltip="true" />
      <!-- <el-table-column label="房台" align="center" prop="editTime" :show-overflow-tooltip="true" /> -->
      <!-- <el-table-column label="推荐人" align="center" prop="editTime" :show-overflow-tooltip="true" /> -->
      <el-table-column label="操作人" align="center" prop="opUser" :show-overflow-tooltip="true" />
      <el-table-column label="流水时间" align="center" prop="runningTime" :show-overflow-tooltip="true" />
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
    </el-table>
    <pagination  v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageRow" @pagination="getList" />
  </el-dialog>
</template>

<script setup>
  import { getMemberCardTrans } from '@/api/member';
  import { fenToYuan, yuanTofen } from '@/utils/index.js';
  
  const { proxy } = getCurrentInstance();
  const props = defineProps({
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
    dataSource: {
      type: Object,
      default: null,
    },
  })

  const initData = {
    pageNum: 1,
    pageRow: 10,
    transType: undefined,
    dateTime: null,
    accountId: null,
  };
  const data = reactive({
    queryParams: {
      ...initData
    },
  })

  const { visible, dataSource } = toRefs(props);
  const { queryParams }  = toRefs(data);
  const emit = defineEmits([ 'cancel', 'success']);
  const total = ref(0);
  const typeList = ref([
    {id: 0, name: '充值'}, { id: 1, name: '交易'}
  ]);
  const detailList = ref([]);

  watch(
    () => dataSource.value,
    val => {
      if(val) {
        queryParams.value.accountId = val.id;
        getList();
      }
    },
    { deep: true, immediate: true }
  )
  function handleBeforeClose() {
    emit('cancel');
  }

  function handleQuery() {
    getList();
  }
  function handleReset() {
    queryParams.value = {
      ...initData
    }
    getList();
  }

  function getList() {
    const data = {
      ...queryParams.value,
    };
    if(queryParams.value.dateTime && queryParams.value.dateTime.length > 1) {
      data.startDay = queryParams.value.dateTime[0];
      data.endDay = queryParams.value.dateTime[1];
    }
    getMemberCardTrans(data).then(res => {
      if(res) {
        detailList.value = res.list;
        total.value = res.count;
      }
    })
  }

</script>


<style lang="scss" scoped>
.search {
  display: flex;
  align-items: center;
  margin: 0 0 24px 0;
  flex-wrap: wrap;
}
.header {
  display: flex;
  justify-content: space-between;
}
</style>