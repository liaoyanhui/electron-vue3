<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-19 14:28:38
 * @LastEditTime: 2024-03-22 16:00:06
 * @FilePath: /cbank-client/src/views/memberManagement/memberBasic/memberCardType/index.vue
-->
<template>
  <div class="app-container content-box p-24">
    <div class="mb-12">
      <el-button type="primary" icon="Plus" @click="handleAddCardType">新增</el-button>
      <el-button @click="handleEdit">修改</el-button>
      <el-button @click="handleDel">删除</el-button>
    </div>
    <el-table :data="cardTypeList" class="ml10 tbg" ref="tableRef" highlight-current-row @current-change="handleCurrentChange">
      <el-table-column label="序号"  align="center" type="index" width="60" />
      <el-table-column label="会员卡类型" align="center" prop="typeName" :show-overflow-tooltip="true"  />
      <el-table-column label="会员折扣(%)" align="center" prop="discount"  />
      <el-table-column label="人数" align="center" prop="memberCount" :show-overflow-tooltip="true"  />
      <el-table-column label="状态" align="center" prop="isEnable" :show-overflow-tooltip="true">
        <template #default="scope">
          <span>{{ scope.row.isEnable == 1 ? '启用' : '停用 '}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" :show-overflow-tooltip="true" />
      <el-table-column label="修改时间" align="center" prop="updateTime" :show-overflow-tooltip="true"  />
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true"  />
    </el-table>
   
    <CardType v-if="visible" :visible="visible" @cancel="handleCancel" @success="handleSuccess" :dataSource="currentRow"/>
  </div>
</template>

<script setup>
  import { getMemberCardTypes, delMemberCardTypes } from '@/api/member';
  import CardType from './Modal/CardType.vue';

  const { proxy } = getCurrentInstance();
  const currentRow = ref(null)
  const total = ref(0);
  const data = reactive({
    queryParams: {
      searchSource: 1
    },
  });
  const { queryParams } = toRefs(data);

  const visible = ref(false);
  const cardTypeList = ref([]);
  function handleCurrentChange(val) {
     currentRow.value = val
  }
  function handleAddCardType() {
    currentRow.value = null;
    visible.value = true;
  }
  function handleEdit() {
    if(!currentRow.value) {
      proxy.$modal.msgWarning("请选择要修改的会员卡类型");
      return 
    }
    visible.value = true;
  }
  function handleDel() {
    if(!currentRow.value) {
      proxy.$modal.msgWarning("请选择要删除的会员卡类型");
      return 
    }
    // const roleIds = row.id || ids.value;
    proxy.$modal.confirm('是否确认删除' + currentRow.value.typeName + '?').then(function () {
      return delMemberCardTypes({id: currentRow.value.id});
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }
  function getList() {
    getMemberCardTypes(queryParams.value).then(res => {
      if(res) {
        cardTypeList.value = res;
      }
    })
  }

  function handleCancel() {
    visible.value = false;
    currentRow.value = null;
  }
  function handleSuccess() {
    visible.value = false;
    currentRow.value = null;
    getList();
  }

  getList();
</script>

<style lang="scss" scoped>
.content-box {
  border-radius: 10px;
  background: #323745;
}
</style>