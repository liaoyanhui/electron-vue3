<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-29 11:41:24
 * @LastEditTime: 2024-03-14 17:09:17
 * @FilePath: /cbank-client/src/views/bookingPerformance/PerformanceSet.vue
-->

<template>
  <div class="app-container content-box p-24">
    <div class="search">
      <el-row>
        <el-col :lg="8">
          <div class="mr-8 mb-8">
            <span class="px-6 label">方案名称</span>
            <el-input v-model="queryParams.name" style="width: 200px" placeholder="请输入"></el-input>
          </div>
        </el-col>
        <el-col :lg="8">
          <div class="mr-8 mb-8">
            <span class="px-6 label">适用对象</span>
            <SelectPeople v-model:value="queryParams.id" v-model:type="queryParams.type" :typeFilter="[3]"
              placeholder="请选择" automatic-dropdown style="width: 200px">
            </SelectPeople>
          </div>
        </el-col>
        <el-col :lg="8">
          <div class="mr-8 mb-8">
            <span class="px-6 label">状态</span>
            <el-select v-model="queryParams.status" class="m-2 mr-8" placeholder="请选择" style="width: 180px" clearable>
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </el-col>
      </el-row>

      <el-button class="mb-8" type="primary" @click="handleQuery">查询</el-button>
      <el-button class="mb-8" @click="handleReset">重置</el-button>
      <el-button class="mb-8" type="primary" @click="handleAdd">新增</el-button>
    </div>
    <div>
      <el-table :data="tableList" class="ml10 tbg" ref="tableRef">
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="方案名称" align="center" prop="optionName" />
        <el-table-column label="适用分组" align="center" prop="organizationNames" :show-overflow-tooltip="true" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
              @change="handleStatusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">

          <template #default="scope">
            <div class="d-flex ">
              <el-link :underline="false" type="primary" @click="handleEdit(scope.row)">编辑</el-link>
              <el-link :underline="false" type="primary" @click="handleRecord(scope.row)">修改记录</el-link>
            </div>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <UpdatePerformance v-if="performanceVisible" :visible="performanceVisible" @cancel="handleCancelU"
      @success="handleSuccessU" :dataSource="dataSource" />
    <UpdateRecord v-if="recordVisible" :visible="recordVisible" @cancel="handleCancelR" @success="handleSuccessR"
      :dataSource="recordData" />
  </div>
</template>

<script setup>
import { performanceList, performanceEnable } from '@/api/bookingPerformance'
import SelectPeople from '@/components/SelectPeople/SelectPeople.vue';
import UpdatePerformance from './Modal/UpdatePerformance.vue';
import UpdateRecord from './Modal/UpdateRecord.vue';
const { proxy } = getCurrentInstance();

const tableList = ref([]);
const dataSource = ref(null);
const recordData = ref({});
const performanceVisible = ref(false);
const recordVisible = ref(false);
const statusList = ref([
  { label: '正常', value: 1 },
  { label: '禁用', value: 0 },
])
const initData = {
  name: undefined,
  id: undefined,
  type: undefined,
  status: undefined,
};

const data = reactive({
  queryParams: {
    ...initData,
  },
});

const { queryParams } = toRefs(data);


function getList() {
  performanceList(queryParams.value).then(res => {
    if (res) {
      tableList.value = res;
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

function handleStatusChange(row) {
  let text = row.status == "0" ? "停用" : "启用";
  proxy.$modal.confirm('确认要"' + text + '""' + row.optionName + '"吗?').then(function () {
    return performanceEnable({
      id: row.id,
      status: row.status
    });
  }).then(() => {
    proxy.$modal.msgSuccess(text + "成功");
  }).catch(function () {
    row.status = row.status == "0" ? 1 : 0;
  });
}
function handleAdd() {
  performanceVisible.value = true;
}

function handleEdit(data) {
  performanceVisible.value = true;
  dataSource.value = data;
}
function handleRecord(data) {
  recordVisible.value = true;
  recordData.value = {
    id: data.id,
  }
}

function handleCancelU() {
  performanceVisible.value = false;
  dataSource.value = null;
}
function handleSuccessU() {
  performanceVisible.value = false;
  dataSource.value = null;
  getList();
}
function handleCancelR() {
  recordVisible.value = false;
  recordData.value = {}
}
function handleSuccessR() {
  recordVisible.value = false;
  recordData.value = {}
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