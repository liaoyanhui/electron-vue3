<!--
 * @Description: 无限畅饮
 * @Author: 尚夏
 * @Date: 2024-01-30 13:59:42
 * @LastEditTime: 2024-03-14 17:17:27
 * @FilePath: /cbank-client/src/views/system/dishesMenuSystem/unlimitedDrinking.vue
-->
<template>
  <div class="app-container">
    <div class="search">
      <div class="mr-8">
        <span class="px-6 fs-12">畅饮名称</span>
        <el-input v-model="queryParams.name" clearable placeholder="请输入畅饮名称" style="width: 180px"/>
      </div>
      <el-button type="primary" @click="handleQuery">查询</el-button>
    </div>
    <div class="bg-f table-box">
      <div class="mb-24">
        <el-button type="primary" icon="Plus" @click="handleAddActive">新增</el-button>
      </div>
      <el-table :data="activityList" class="ml10" ref="tableRef">
        <el-table-column label="图片" align="center" key="drinkPic" prop="drinkPic">
          <template #default="scope">
            <div style="display: flex; align-items: center">
                <el-image :src="scope.row.drinkPic" style="width: 100px; height: 100px" fit="cover"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="畅饮名称" align="center" key="drinkName" prop="drinkName" />
        <el-table-column label="畅饮酒水" align="center" key="dishInfoNames" prop="dishInfoNames" />
        <el-table-column label="畅饮价格" align="center" key="drinkPrice" prop="drinkPrice" :formatter="(a,b,c,d) => fenToYuan(c)"/>
        <el-table-column label="畅饮最低价" align="center" key="drinkLowPrice" prop="drinkLowPrice" :formatter="(a,b,c,d) => fenToYuan(c)" />
        <el-table-column label="出品数量" align="center" key="defaultProduceCount" prop="defaultProduceCount" />
        <el-table-column label="入低消" align="center" key="inputLowConsumption" prop="inputLowConsumption" :formatter="(a,b,c,d) => c == 1 ? '是' : '否' " :show-overflow-tooltip="true" />
        <el-table-column label="是否启用" align="center">
          <template #default="scope">
            <el-switch
                :model-value="scope.row.status == 1 ? true : false"
                @change="(e) => handleChange(scope.row.id, e)"
                class="ml-2"
                style="--el-switch-on-color: #13ce66;"
              />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160px">
          <template #default="scope">
            <div class="d-flex">
              <el-link :underline="false" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-link>
              <el-link :underline="false" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination class="bg-f" v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageRow" @pagination="getList" />
    </div>
    <UnlimitedDrinkingModal :visible="visible" @cancel="handleCancel" @success="handleSuccess" :dataSource="dataSource"/>
  </div>
</template>

<script setup>
import UnlimitedDrinkingModal from './Modal/UnlimitedDrinkingModal.vue';
import { getUnlimitedDrinkingActivity, unlimitedDrinkingActivityDelete, unlimitedDrinkingActivityEnable } from '@/api/system/produce-system';
import { onMounted } from 'vue';
import { fenToYuan, yuanTofen } from '@/utils/index.js';

const { proxy } = getCurrentInstance();
const total = ref(0);
const data = reactive({
  queryParams: {
    name: undefined,
    pageNum: 1,
    pageRow: 10,
  },
});
const { queryParams } = toRefs(data);

const dataSource = ref(null);
const visible = ref(false);
const activityList = ref([]);

function handleQuery() {
  getList();
}

function getList() {
  getUnlimitedDrinkingActivity(queryParams.value).then(res => {
   if(res) {
    total.value = res.count;
    activityList.value = res.list;
   }
  })
}
onMounted(() => {
  getList();
})

function handleAddActive() {
  visible.value = true;
}

function handleEdit(index, item) {
  dataSource.value = item;
  visible.value = true;
}
function handleDel(index, item) {
  proxy.$modal.confirm('是否删除该活动?').then(function () {
    let params = {
      id: item.id,
    }
    return unlimitedDrinkingActivityDelete(params);
  }).then(() => {
    proxy.$modal.msgSuccess("操作成功");
    getList();
  }).catch(function () {
  });
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

// 是否启用
function handleChange(id, val) {
  let text = val ? "启用" : "停用";
  proxy.$modal.confirm('是否确认' + text + '该活动?').then(function () {
    let params = {
      id,
      status: val ? 1 : 0
    }
    return unlimitedDrinkingActivityEnable(params);
  }).then(() => {
    proxy.$modal.msgSuccess(text + "成功");
    getList();
  }).catch(function () {
  });
}
</script>

<style lang="scss" scoped>
  .app-container {
    .search {
      display: flex;
      color: #fff;
      align-items: center;
      margin-bottom: 24px;
      > div {
        display: flex;
        align-items: center;
      }
    }
  }
  .table-box {
    min-height: calc(100vh - 130px - 40px);
    // border-radius: 10px;
    overflow: hidden;
    // padding: 24px;
  }
</style>