<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-29 11:38:34
 * @LastEditTime: 2024-03-22 01:31:14
 * @FilePath: /cbank-client/src/views/reportForms/comprehensiveStatistics/OnStageDetails.vue
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
            <span class="px-6 label">艺名</span>
            <SelectPeople v-model:value="queryParams.id" v-model:type="queryParams.type"  placeholder="请选择" automatic-dropdown
              style="width: 200px">
            </SelectPeople>
          </div>
        </el-col>
        <el-col :lg="7">
          <div class="mr-8 mb-8">
            <span class="px-6 label">领队</span>
            <SelectPeople v-model:value="queryParams.teamLeaderId" v-model:type="queryParams.teamLeaderType"  placeholder="请选择" automatic-dropdown
              style="width: 200px">
            </SelectPeople>
          </div>
        </el-col>
        <el-col :lg="10">
           <div class="mr-8 mb-8">
            <span class="px-6 label">等级</span>
            <el-select
              v-model="queryParams.levelId"
              placeholder="等级"
              clearable
              style="width: 240px"
            >
                <el-option
                  v-for="dict in levelList"
                  :key="dict.id"
                  :label="dict.name"
                  :value="dict.id"
                />
            </el-select>
          </div>
        </el-col>
        <el-col :lg="10">
          <div class="mr-8 mb-8">
            <span class="px-6 label">是否撤销上台</span>
            <el-select
              v-model="queryParams.isRevoke"
              placeholder="是否撤销上台"
              clearable
              style="width: 200px"
            >
                <el-option
                  v-for="dict in revokeList"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
            </el-select>
          </div>
        </el-col>
      </el-row>
      
      <el-button class="mb-8" type="primary" @click="handleQuery">查询</el-button>
      <el-button class="mb-8" @click="handleReset">重置</el-button>
      <el-button class="mb-8" @click="handleExport">导出</el-button>
    </div>
    <div>
      <el-table :data="tableList" class="ml10 tbg" ref="tableRef">
        <el-table-column label="序号" type="index" align="center" width="60" />
        <el-table-column label="日期" align="center" prop="companyDay" />
        <el-table-column label="姓名" align="center" prop="username" :show-overflow-tooltip="true"  />
        <el-table-column label="部门" align="center" prop="deptName" :show-overflow-tooltip="true"  />
        <el-table-column label="等级" align="center" prop="levelName" :show-overflow-tooltip="true"  />
        <el-table-column label="领队" align="center" prop="saleLeaderUserName" :show-overflow-tooltip="true"  />
        <el-table-column label="房台名称" align="center" prop="roomName" :show-overflow-tooltip="true"  />
        <el-table-column label="上台时间" align="center" prop="goOnStageTime" :show-overflow-tooltip="true"  />
        <el-table-column label="入场券" align="center" prop="ticketName" :show-overflow-tooltip="true"  />
        <el-table-column label="入场券价格" align="center" prop="ticketPrice" :formatter="(a,b,c,d) => fenToYuan(c) " />
        <el-table-column label="包厢管理员" align="center" prop="roomMangerName" :show-overflow-tooltip="true"  />
        <el-table-column label="是否撤销" align="center" prop="isRevoke" :show-overflow-tooltip="true" >
          <template #default="scope">
            <div>{{ scope.row.isRevoke == 1 ? '是' : '否'}}</div>
          </template>
        </el-table-column>
      </el-table>
      <pagination  v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageRow" @pagination="getList" />
    </div>
  </div>
</template>

<script setup>
  import { goOnStageDetail, goOnStageDetailExport } from '@/api/synthesis';
  import { apiLevel } from "@/api/system/user";
  import { blobToFile } from '@/utils/index.js'
  import SelectPeople from '@/components/SelectPeople/SelectPeople.vue';
  import { getCompanyRoomList } from "@/api/system/room-system";
  import { fenToYuan, getNowDay } from '@/utils/index.js';

  const { proxy } = getCurrentInstance();
  
  const roomList = ref([]);
  const tableList = ref([]);
  const levelList = ref([]);
  const revokeList = ref([
    { label: '是', value: 1},
    { label: '否', value: 0},
  ]);
  const total = ref(0);
  const initData = {
    pageNum: 1,
    pageRow: 10,
    dateTime: [getNowDay(),getNowDay()],
    roomId: undefined,
    id: undefined,
    type: undefined,
    teamLeaderId: undefined,
    levelId: undefined,
    teamLeaderType: undefined,
  };
  const data = reactive({
    queryParams: {
      ...initData,
    },
  });

  const { queryParams, form } = toRefs(data); 
  function getList() {
    const data = {
      ...queryParams.value
    };
    if(queryParams.value.dateTime && queryParams.value.dateTime.length > 1) {
      data.startTime = queryParams.value.dateTime[0];
      data.endTime = queryParams.value.dateTime[1];
    }
    goOnStageDetail(data).then(res => {
      if(res) {
        total.value = res.count;
        tableList.value = res.list;
      }
    })
  }

  function getLevelList() {
    apiLevel().then(res => {
      levelList.value = res;
    })
  }

   // 房台名称列表
  function getRoomList() {
    getCompanyRoomList().then(res => {
      roomList.value = res;
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
      return goOnStageDetailExport(data);
    }).then((res) => {
        blobToFile(res, '上台明细.xlsx')
        proxy.$modal.msgSuccess("导出成功");
      }).catch(function () {
    });
  }

  getList();
  getRoomList();
  getLevelList();
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  align-items: center;
  margin: 0 0 24px 0;
  flex-wrap: wrap;
  .label {
    display: inline-block;
    width: 110px;
  }
}
.content-box {
  border-radius: 10px;
  background: #323745;
}
</style>