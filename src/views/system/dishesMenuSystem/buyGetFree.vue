<!--
 * @Description: 买几送几
 * @Author: 尚夏
 * @Date: 2024-02-04 14:12:04
 * @LastEditTime: 2024-03-14 17:17:51
 * @FilePath: /cbank-client/src/views/system/dishesMenuSystem/buyGetFree.vue
-->
<template>
  <div class="app-container">
    <div class="search">
      <div class="mr-8">
        <span class="px-6 fs-12">活动菜单名称</span>
        <el-input v-model="queryParams.activityName" clearable placeholder="请输入活动菜单名称" style="width: 180px"/>
      </div>
      <div class="mr-8">
        <span class="px-6 fs-12">赠送菜品名称</span>
        <el-input v-model="queryParams.sendName" clearable placeholder="请输入赠送菜品名称" style="width: 180px"/>
      </div>
      <el-button type="primary" @click="handleQuery">查询</el-button>
    </div>
    <div class="bg-f table-box">
      <div class="mb-24">
        <el-button type="primary" icon="Plus" @click="handleAddActive">新增</el-button>
      </div>
      <el-table :data="activityList" class="ml10" ref="tableRef">
        <el-table-column label="序号" type="index" width="50" />
        <el-table-column label="活动菜品" align="center" key="buyDishInfoName" prop="buyDishInfoName" />
        <el-table-column label="落单数量" align="center" key="buyDishInfoCount" prop="buyDishInfoCount" />
        <el-table-column label="赠送菜品" align="center" key="giftDishInfoName" prop="giftDishInfoName" />
        <el-table-column label="赠送数量" align="center" key="giftDishInfoCount" prop="giftDishInfoCount" />
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
             <div>
              <el-link :underline="false" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-link>
              <el-link :underline="false" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-link>
             </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination class="bg-f" v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageRow" @pagination="getList" />
    </div>
    <BuyGetFreeModal :visible="visible" @cancel="handleCancel" @success="handleSuccess" :dataSource="dataSource"/>
  </div>
</template>

<script setup>
import UnlimitedDrinkingModal from './Modal/UnlimitedDrinkingModal.vue';
import { getSendActivity, sendActivityEnable, sendActivityDelete } from '@/api/system/produce-system';
import { onMounted } from 'vue';
import BuyGetFreeModal from './Modal/BuyGetFreeModal.vue';

const { proxy } = getCurrentInstance();
const total = ref(0);
const data = reactive({
  queryParams: {
    activityName: undefined,
    sendName: undefined,
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
  getSendActivity(queryParams.value).then(res => {
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
    return sendActivityDelete(params);
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
    return sendActivityEnable(params);
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