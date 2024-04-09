<!--
 * @Description: 407 359
 * @Author: 尚夏
 * @Date: 2024-02-22 10:19:46
 * @LastEditTime: 2024-03-19 16:01:26
 * @FilePath: /cbank-client/src/views/system/giftScheme/index.vue
-->

<template>

    <el-row class="h100">
      <el-col :span="8">
        <div class="search">
          <div class="mr-8 mb-4">
            <span class="px-6 fs-12">方案名称</span>
            <el-input v-model="queryParams.name" clearable placeholder="请输入" style="width: 120px" />
            <el-button class="ml-6" type="primary" @click="handleQuery">查询</el-button>
            <el-button type="primary" @click="handleAddScheme" class="my-2">新建赠品方案</el-button>
          </div>
        </div>
        <el-table :data="schemeList" v-loading="loading" class="ml10" ref="schemeRef" @row-click="handleRowChick">
          <el-table-column label="序号" type="index" align="center" width="60" />
          <el-table-column label="方案名称" align="left" key="name" prop="name" :show-overflow-tooltip="true" />
          <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
            <template #default="scope">
              <div class="d-flex">
                <el-link :underline="false" type="primary" @click.stop="handleEdit(scope.row)">修改</el-link>
                <el-link :underline="false" type="danger" @click.stop="handleDelete(scope.row)">删除</el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="15" class="ml-30 pt-40 h100" >
        <el-table :data="dishesList" v-loading="loading2" ref="tableRef" style="height: calc(100% - 55px)">
          <el-table-column label="序号" type="index" align="center" width="60" />
          <el-table-column label="品名" align="left" key="name" prop="name" :show-overflow-tooltip="true" />
          <el-table-column label="分类" align="left" key="dishTypeName" prop="dishTypeName"
            :show-overflow-tooltip="true" />
          <el-table-column label="售价" align="center" key="mealPrice" prop="mealPrice" :formatter="(a, b, c, d) => c / 100"
            :show-overflow-tooltip="true" />
          <el-table-column label="单位" align="center" key="dishUnitName" prop="dishUnitName"
            :show-overflow-tooltip="true" />
          <el-table-column label="默认出品部门" align="left" key="departmentName" prop="departmentName"
            :show-overflow-tooltip="true" />
          <el-table-column label="是否启用" align="center" key="status" prop="status"
            :formatter="(a, b, c, d) => c == 1 ? '是' : '否'" :show-overflow-tooltip="true" />
          <el-table-column label="是否入低消" align="center" key="inputLowConsumption" prop="inputLowConsumption"
            :formatter="(a, b, c, d) => c == 1 ? '是' : '否'" :show-overflow-tooltip="true" />
          <el-table-column label="是否可赠送" align="center" key="canGivenAsGift" prop="canGivenAsGift"
            :formatter="(a, b, c, d) => c == 1 ? '是' : '否'" :show-overflow-tooltip="true" />
          <el-table-column label="是否计入订房业绩" align="center" key="weatherIncludePerformace"
            prop="weatherIncludePerformace" :formatter="(a, b, c, d) => c == 1 ? '是' : '否'"
            :show-overflow-tooltip="true" />
          <el-table-column label="是否为赔偿品" align="center" key="compensationProducts" prop="compensationProducts"
            :formatter="(a, b, c, d) => c == 1 ? '是' : '否'" :show-overflow-tooltip="true" />
        </el-table>
          <pagination class="bg-f" v-show="total > 0" :total="total" v-model:page="queryParams2.pageNum"
            v-model:limit="queryParams2.pageRow" @pagination="getList2" />
      </el-col>
    </el-row>
    <SchemeModal v-if="visible" :visible="visible" @cancel="handleCancel" @success="handleSuccess"
      :dataSource="dataSource" />

</template>

<script setup>
import { giftPackageSelect, giftPackageSelectInfo, giftPackageDelete } from '@/api/gift';
import SchemeModal from './Modal/SchemeModal.vue';
const { proxy } = getCurrentInstance();

const loading = ref(false);
const loading2 = ref(false);
const schemeList = ref([]);
const dishesList = ref([]);
const visible = ref(false);

const total = ref(0);
const data = reactive({
  queryParams: {
    schemeName: '',
  },
  queryParams2: {
    id: undefined,
    pageNum: 1,
    pageRow: 10
  },
});

const { queryParams, queryParams2 } = toRefs(data);

function handleAddScheme() {
  visible.value = true;
}

// 点击某行控制复选框选中与否
const currentId = ref(null);
const handleRowChick = (row) => {
  loading2.value = true;
  try {
    queryParams2.value.id = row.id;
    giftPackageSelectInfo({ id: row.id }).then(res => {
      if (res) {
        dishesList.value = res.list;
        total.value = res.count;
        loading2.value = false;
        currentId.value = row.id;
      }
    })
  } catch (error) {
    loading2.value = false;
  }
}
const dataSource = ref(null);
function handleEdit(v) {
  dataSource.value = v;
  visible.value = true;
}
function handleDelete(v) {
  proxy.$modal.confirm('是否删除该套餐?').then(function () {
    let params = {
      id: v.id,
    }
    return giftPackageDelete(params);
  }).then(() => {
    proxy.$modal.msgSuccess("操作成功");
    getList();
    if (currentId.value == v.id) {
      dishesList.value = [];
    }
  }).catch(function () {
  });
}

function getList() {
  loading.value = true;
  try {
    giftPackageSelect(queryParams.value).then(res => {
      schemeList.value = res;
      loading.value = false;
    })
  } catch (error) {
    loading.value = false;
  }
}
function getList2() {
  loading2.value = true;
  try {
    giftPackageSelectInfo(queryParams2.value).then(res => {
      dishesList.value = res.list;
      total.value = res.count;
      loading2.value = false;
    })
  } catch (error) {
    loading2.value = false;
  }
}

function handleQuery() {
  getList();
}

function handleCancel() {
  visible.value = false;
  dataSource.value = null;
}
function handleSuccess() {
  visible.value = false;
  dataSource.value = null;
  getList();
}

getList();
</script>
