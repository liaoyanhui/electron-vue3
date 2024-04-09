<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-22 10:21:47
 * @LastEditTime: 2024-03-14 17:16:45
 * @FilePath: /cbank-client/src/views/system/giftPermission/index.vue
-->

<template>
  <div class="app-container bg-f p-24">
    <div class="d-flex">
      <el-form-item label="艺名" prop="nickname">
          <el-input
              v-model="queryParams.nickname"
              placeholder="请输入艺名"
              clearable
              style="width: 200px"
              @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item class="ml-30">
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
    </div>
   
   
      <el-row :gutter="10" class="mb-8">
        <el-col>
          <el-button type="primary" plain icon="Plus" class="mr-8" @click="handleAdd">新增虚拟用户</el-button>
          <el-button plain class="mr-8" @click="handleRechargeRecord">充值记录</el-button>
          <el-button plain class="mr-8" @click="handleBatchEdit">批量编辑</el-button>
          <el-button plain class="mr-8" @click="handleBatchDeduction">批量扣款</el-button>
          <el-button plain class="mr-8" @click="handleBatchRecharge">批量充值</el-button>
          <el-button plain class="mr-8" @click="handleBatchEnable(1)">批量启用</el-button>
          <el-button plain class="mr-8" @click="handleBatchEnable(0)">批量停用</el-button>
          <el-button plain class="mr-8" @click="handleBatchDel">批量删除</el-button>
        </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="permissionList"
      row-key="id"
      ref="tableRef"
      @selection-change="handleSelectionChange"
      @row-click="handleRowChick"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="艺名" prop="virtualUserName" width="60"></el-table-column>
      <el-table-column label="用户属性" prop="type" :show-overflow-tooltip="true"  :formatter="(a,b,c,d) => c == 2 ? '虚拟用户' : '真实用户' "></el-table-column>
      <el-table-column label="初始金额" prop="initialAccount" :show-overflow-tooltip="true" :formatter="(a,b,c,d) => fenToYuan(c)"></el-table-column>
      <el-table-column label="可用余额" prop="usableAccount" :show-overflow-tooltip="true" :formatter="(a,b,c,d) => fenToYuan(c)"></el-table-column>
      <el-table-column label="累积赠送" prop="totalAccount" :show-overflow-tooltip="true" :formatter="(a,b,c,d) => fenToYuan(c)"></el-table-column>
      <el-table-column label="日赠送限额" prop="todayQuota" :show-overflow-tooltip="true">
        <template #default="scope">
          <span>{{ scope.row.todayQuota == -1 ? '无限' : fenToYuan(scope.row.todayQuota) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="月赠送限额" prop="monthQuota" :show-overflow-tooltip="true">
        <template #default="scope">
          <span>{{ scope.row.monthQuota == -1 ? '无限' : fenToYuan(scope.row.todayQuota) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日赠送次数限制" prop="todayGiftQuotaCount" :show-overflow-tooltip="true">
        <template #default="scope">
          <span>{{ scope.row.todayGiftQuotaCount == -1 ? '无限' : scope.row.todayGiftQuotaCount }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="日赠送次数" prop="todaySendCount" :show-overflow-tooltip="true"></el-table-column> -->
      <!-- <el-table-column label="月赠送次数" prop="monthSendCount" :show-overflow-tooltip="true"></el-table-column> -->
      <el-table-column label="已赠送次数" prop="alreadySendCount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="单次赠送限额" prop="singleGiftLimit" :show-overflow-tooltip="true">
         <template #default="scope">
          <span>{{ scope.row.singleGiftLimit == -1 ? '无限' : fenToYuan(scope.row.singleGiftLimit) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="赠送菜品方案" prop="giftPackageName" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="是否启用" align="center" width="100">
        <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="是否可收银赠送" align="center" width="100">
        <template #default="scope">
            <el-switch
              v-model="scope.row.bankShow"
              :active-value="1"
              :inactive-value="0"
              @change="handleBankShowChange(scope.row)"
            ></el-switch>
        </template>
      </el-table-column>
      <!-- <el-table-column label="余额初始化时间" align="center" prop="addTime"></el-table-column> -->
      <el-table-column label="最近修改时间" align="center" prop="addTime"></el-table-column>
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template #default="scope">
           <div class="d-flex">
              <el-link :underline="false" type="primary" @click="handleEdit(scope.row)" >修改</el-link>
              <el-link :underline="false" type="primary" @click="handleDelete(scope.row)">删除</el-link>
           </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageRow"
      @pagination="getList"/>
    <EditPermission v-if="editVisible" :visible="editVisible" @cancel="handleCancelE" @success="handleSuccessE" :dataSource="editData"/>
    <BatchEditPermission v-if="batchEditVisible" :visible="batchEditVisible" @cancel="handleCancelBE" @success="handleSuccessBE" :dataSource="selectIds"/>
    <AddVirtuallyUser v-if="addVisible" :visible="addVisible" @cancel="handleCancelA" @success="handleSuccessA"/>
    <RechargeRecord v-if="rechargeRecordVisible" :visible="rechargeRecordVisible" @cancel="handleCancelRR" @success="handleSuccessRR" :dataSource="selectIds"/>
    <BatchDeduction v-if="deductionVisible" :visible="deductionVisible" @cancel="handleCancelD" @success="handleSuccessD" :dataSource="selectIds"/>
    <BatchRecharge v-if="rechargeVisible" :visible="rechargeVisible" @cancel="handleCancelR" @success="handleSuccessR" :dataSource="selectIds"/>
  </div>
</template>

<script setup>
  import { giftPermission, deleteGift, enable, editGiftEnableBank } from '@/api/gift';
  import EditPermission from './Modal/EditPermission.vue';
  import AddVirtuallyUser from './Modal/AddVirtuallyUser.vue';
  import RechargeRecord from './Modal/RechargeRecord.vue';
  import BatchDeduction from './Modal/BatchDeduction.vue';
  import BatchEditPermission from './Modal/BatchEditPermission.vue';
  import BatchRecharge from './Modal/BatchRecharge.vue';
  import { fenToYuan, yuanTofen } from '@/utils'

  const { proxy } = getCurrentInstance();

  const data = reactive({
    queryParams: {
      pageNum: 1,
      pageRow: 10,
      nickName: undefined,
    },
    rules: {
    },
  });

  const { queryParams, rules } = toRefs(data);

  const total = ref(0);
  const loading = ref(false);
  const permissionList = ref([]);
  const tableRef = ref(null);

  const editVisible = ref(false);
  const editData = ref(null);
  const addVisible = ref(false);
  const rechargeRecordVisible = ref(false);
  const multipleSelection = ref([])
  const deductionVisible = ref(false);
  const batchEditVisible = ref(false);
  const rechargeVisible = ref(false);
  const selectIds = ref(null);
  /** 搜索按钮操作 */
  function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
  }
  /** 重置按钮操作 */
  function resetQuery() {
    proxy.resetForm("queryRef");
    handleQuery();
  }

  function handleStatusChange(row) {
    let text = row.status == "0" ? "停用" : "启用";
    proxy.$modal.confirm('确认要' + text + '"' + row.virtualUserName + '"吗?').then(function () {
      return enable({
        ids: [row.id],
        status: row.status
      });
    }).then(() => {
      proxy.$modal.msgSuccess(text + "成功");
      getList();
    }).catch(function () {
      row.status = row.status == "0" ? 1 : 0;
    });
  }
  function handleBankShowChange(row) {
    let text = row.bankShow == "0" ? "停用" : "启用";
    proxy.$modal.confirm('确认要' + text + '收银台获取用户?').then(function () {
      return editGiftEnableBank({
        id: row.id,
        bankShow: row.bankShow
      });
    }).then(() => {
      proxy.$modal.msgSuccess(text + "成功");
      getList();
    }).catch(function () {
      row.status = row.status == "0" ? 1 : 0;
    });
  }
  function getList() {
    giftPermission(queryParams.value).then(res => {
      if(res) {
        total.value = res.count;
        permissionList.value = res.list;
      }
    })
  }

  const handleSelectionChange = (val) => {
    multipleSelection.value = val
  }

  // 点击某行控制复选框选中与否
  const handleRowChick = (row) => {
    const selected = multipleSelection.value.some((item) => item.id === row.id)
    if (!selected) {
      multipleSelection.value.push(row)
      tableRef.value.toggleRowSelection(row)
    } else {
      const finArr = multipleSelection.value.filter((item) => {
        return item.id !== row.id
      })
      multipleSelection.value = finArr
      tableRef.value.toggleRowSelection(row, false)
    }
  }

  function handleAdd() {
    addVisible.value = true;
  }
  function handleRechargeRecord() {
    const list = tableRef.value.getSelectionRows();
    if(list && list.length > 0) {
      selectIds.value = list.map(i => i.id);
    } else {
      selectIds.value = null;
    }
    rechargeRecordVisible.value = true;

  }
  function handleBatchEdit() {
    const list = tableRef.value.getSelectionRows();
    if(list && list.length > 0) {
      selectIds.value = list.map(i => i.id);
      batchEditVisible.value = true;
      return;
    }
    proxy.$modal.msgWarning('请先选择');
  }
  function handleBatchDeduction() {
    const list = tableRef.value.getSelectionRows();
    if(list && list.length > 0) {
      selectIds.value = list.map(i => i.id);
      deductionVisible.value = true;
      return;
    }
    proxy.$modal.msgWarning('请先选择');
  }
  function handleBatchRecharge() {
    const list = tableRef.value.getSelectionRows();
    if(list && list.length > 0) {
      selectIds.value = list.map(i => i.id);
      rechargeVisible.value = true;
      return;
    }
    proxy.$modal.msgWarning('请先选择');
  }
  function handleBatchEnable(status) {
    const list = tableRef.value.getSelectionRows();
    if(list && list.length > 0) {
      const ids = list.map(i => i.id);
      let text = status == "0" ? "停用" : "启用";
      proxy.$modal.confirm('确认要批量' + text + '?').then(function () {
        return enable({
          ids,
          status
        });
      }).then(() => {
        proxy.$modal.msgSuccess(text + "成功");
        getList()
      }).catch(function () {
      });
      return;
    }
    proxy.$modal.msgWarning('请先选择');
    
  }
  function handleBatchDel() {
    const list = tableRef.value.getSelectionRows();
    if(list && list.length > 0) {
      proxy.$modal.confirm('是否批量删除?').then(function () {
        const ids = list.map(i => i.id);
        let params = {
          ids,
        }
        return deleteGift(params);
      }).then(() => {
          proxy.$modal.msgSuccess("操作成功");
          getList();
        }).catch(function () {
      });
    } 
  }

  function handleEdit(v) {
    editVisible.value = true;
    editData.value = v;
  }
  function handleDelete(v) {
    proxy.$modal.confirm('是否删除?').then(function () {
      let params = {
        ids: [v.id],
      }
      return deleteGift(params);
    }).then(() => {
        proxy.$modal.msgSuccess("操作成功");
        getList();
      }).catch(function () {
    });
  }

  function handleCancelE() {
    editVisible.value = false;
    editData.value = null;
  }
  function handleSuccessE() {
    editVisible.value = false;
    editData.value = null;
    getList();
  }
  function handleCancelA() {
    addVisible.value = false;
  }
  function handleSuccessA() {
    addVisible.value = false;
    getList();
  }
  function handleCancelRR() {
    rechargeRecordVisible.value = false;
  }
  function handleSuccessRR() {
    rechargeRecordVisible.value = false;
    getList();
  }
  function handleCancelD() {
    deductionVisible.value = false;
  }
  function handleSuccessD() {
    deductionVisible.value = false;
    selectIds.value = [];
    getList();
  }
  function handleCancelBE() {
    batchEditVisible.value = false;
  }
  function handleSuccessBE() {
    batchEditVisible.value = false;
    selectIds.value = [];
    getList();
  }
  function handleCancelR() {
    rechargeVisible.value = false;
  }
  function handleSuccessR() {
    rechargeVisible.value = false;
    selectIds.value = [];
    getList();
  }

  getList();
</script>
