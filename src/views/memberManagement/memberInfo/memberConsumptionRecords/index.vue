<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-19 14:32:29
 * @LastEditTime: 2024-03-19 17:24:48
 * @FilePath: /cbank-client/src/views/memberManagement/memberInfo/memberConsumptionRecords/index.vue
-->
<template>
  <div class="app-container content-box p-24">
    <div class="search">
      <el-row>
        <el-col :lg="10">
          <div class="mr-8 mb-8">
            <span class="px-6 label">昵称</span>
            <el-input v-model="queryParams.memberName"  placeholder="请输入昵称" style="width: 200px" clearable/>
          </div>
        </el-col>
        <el-col :lg="7">
          <div class="mr-8 mb-8">
            <span class="px-6 label">手机号</span>
            <el-input v-model="queryParams.memberMobile"  placeholder="请输入手机号" style="width: 200px" clearable/>
          </div>
        </el-col>
        <el-col :lg="7">
          <div class="mr-8 mb-8">
            <span class="px-6 label">流水号</span>
            <el-input v-model="queryParams.runningNumber"  placeholder="请输入流水号" style="width: 200px" clearable/>
          </div>
        </el-col>
        <el-col :lg="10">
          <div class="mr-8 mb-8">
            <span class="px-6 label">时间</span>
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
      </el-row>
     
      <el-button class="mb-8" type="primary" @click="handleQuery">查询</el-button>
      <el-button class="mb-8" @click="handleReset">重置</el-button>
    </div>
    <el-table :data="tableList" class="ml10 tbg" ref="tableRef">
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="客人昵称" align="center" prop="memberName" :show-overflow-tooltip="true"  />
      <el-table-column label="手机号" align="center" prop="memberMobile"  />
      <el-table-column label="会员卡号" align="center" prop="accountCardNumber" :show-overflow-tooltip="true"  />
      <el-table-column label="会员卡类型" align="center" prop="accountTypeName" :show-overflow-tooltip="true" />
      <el-table-column label="房台" align="center" prop="roomName" :show-overflow-tooltip="true" />
      <el-table-column label="订房人" align="center" prop="reservationName" :show-overflow-tooltip="true"  />
      <el-table-column label="流水号" align="center" prop="billNumber" :show-overflow-tooltip="true"  />
      <el-table-column label="消费金额" align="center" prop="billAmount" :show-overflow-tooltip="true" />
      <el-table-column label="充值金额" align="center"  prop="billRechargeAmount" :show-overflow-tooltip="true" />
      <el-table-column label="赠送消费" align="center"  prop="billDonateAmount" :show-overflow-tooltip="true"  />
      <el-table-column label="金额类型" align="center" prop="billTypeName"  />
      <!-- <el-table-column label="详情" align="center" prop="billDescription" :show-overflow-tooltip="true"  /> -->
      <el-table-column label="操作人" align="center" prop="opUser" :show-overflow-tooltip="true"  />
      <el-table-column label="时间" align="center" prop="createTime" :show-overflow-tooltip="true"  />
    </el-table>
    <pagination  v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageRow" @pagination="getList" />
  </div>
</template>

<script setup>
  import { getConsumeDetails } from '@/api/member';

  const { proxy } = getCurrentInstance();
  const tableList = ref([]);
  const total = ref(0);
  const initData = {
    pageNum: 1,
    pageRow: 10,
    memberName: undefined,
    memberMobile: undefined,
    runningNumber: undefined,
    dateTime: undefined,
  };
  const data = reactive({
    queryParams: {
      ...initData,
    },
  });
  const { queryParams } = toRefs(data); 

  function getList() {
    const data = {
      ...queryParams.value
    };
    if(queryParams.value.dateTime && queryParams.value.dateTime.length > 1) {
      data.startDay = queryParams.value.dateTime[0];
      data.endDay = queryParams.value.dateTime[1];
    }
    getConsumeDetails(data).then(res => {
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
    queryParams.value = {
      ...initData,
    }
    getList();
  }

  getList();
  
</script>

<style lang="scss" scoped>
.search {
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