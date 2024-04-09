<template>
   <div class="app-container bg-f p-24">
      <el-row :gutter="20">
         <!--用户数据-->
         <el-col :span="24" :xs="24">
            <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
               <el-form-item label="艺名" prop="nickname">
                  <el-input
                     v-model="queryParams.nickname"
                     placeholder="请输入艺名"
                     clearable
                     style="width: 240px"
                     @keyup.enter="handleQuery"
                  />
               </el-form-item>
               <el-form-item label="用户名称" prop="username">
                  <el-input
                     v-model="queryParams.username"
                     placeholder="请输入用户名称"
                     clearable
                     style="width: 240px"
                     @keyup.enter="handleQuery"
                  />
               </el-form-item>
               <el-form-item label="手机号码" prop="loginName">
                  <el-input
                     v-model="queryParams.loginName"
                     placeholder="请输入手机号码"
                     clearable
                     style="width: 240px"
                     @keyup.enter="handleQuery"
                  />
               </el-form-item>
               <!-- <el-form-item label="部门" prop="organizationId">
                <SelectPeople v-model:value="queryParams.deptId" :typeFilter="[3]" placeholder="请选择" automatic-dropdown  style="width: 240px">
                </SelectPeople>

               </el-form-item> -->
               <el-form-item label="角色" prop="roleId">
                  <el-select
                    v-model="queryParams.roleId"
                    placeholder="角色"
                    clearable
                    style="width: 240px"
                  >
                     <el-option
                        v-for="dict in roleList"
                        :key="dict.id"
                        :label="dict.roleName"
                        :value="dict.id"
                     />
                  </el-select>
               </el-form-item>
               <el-form-item label="等级" prop="levelId">
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
               </el-form-item>
               <el-form-item label="收银角色" prop="cashierRoleId">
                  <el-select
                    v-model="queryParams.cashierRoleId"
                    placeholder="收银角色"
                    clearable
                    style="width: 240px"
                  >
                     <el-option
                        v-for="dict in cashierRoleList"
                        :key="dict.id"
                        :label="dict.roleName"
                        :value="dict.id"
                     />
                  </el-select>
               </el-form-item>
               <el-form-item label="状态" prop="status">
                  <el-select
                    v-model="queryParams.status"
                    placeholder="状态"
                    clearable
                    style="width: 240px"
                  >
                     <el-option
                        v-for="dict in statusList"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                     />
                  </el-select>
               </el-form-item>
               <el-form-item label="入职时间" style="width: 308px;">
                  <el-date-picker
                     v-model="dateRange"
                     value-format="YYYY-MM-DD"
                     type="daterange"
                     range-separator="-"
                     start-placeholder="开始日期"
                     end-placeholder="结束日期"
                  ></el-date-picker>
               </el-form-item>
               <el-form-item>
                  <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                  <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                  <el-button type="primary" @click="handleBatchSet">批量设置收银角色</el-button>
                  <el-button type="primary" @click="handleBatchGive">批量授予赠送权限</el-button>
                  <el-button type="primary" @click="handleExport">批量导出</el-button>
               </el-form-item>
            </el-form>
         </el-col>
         <el-col :span="4" :xs="24" class="left-tree bg-black pt-20 radius-8">
            <div class="head-container">
               <el-input
                  v-model="deptName"
                  placeholder="请输入部门名称"
                  clearable
                  prefix-icon="Search"
                  style="margin-bottom: 20px"
               />
            </div>
            <div class="head-container">
               <el-tree
                  :data="deptOptions"
                  :props="{ label: 'name', children: 'children' }"
                  :expand-on-click-node="false"
                  :filter-node-method="filterNode"
                  ref="deptTreeRef"
                  node-key="id"
                  highlight-current
                  default-expand-all
                  @node-click="handleNodeClick"
               />
            </div>
         </el-col>
         <el-col :span="20" :xs="24">
            <el-table v-loading="loading"  ref="tableRef" :data="userList" @selection-change="handleSelectionChange" @row-click="handleRowChick">
               <el-table-column type="selection" width="50" align="center" />
               <el-table-column label="序号" align="center" type="index" width="50" />
               <el-table-column label="艺名" align="center" key="nickname" prop="nickname" :show-overflow-tooltip="true">
                  <template #default="scope">
                    <el-link :underline="false" type="primary" @click="handleMoreInfo(scope.row.userId, 1)">{{ scope.row.nickname }}</el-link>
                  </template>
               </el-table-column>
               <el-table-column label="姓名" align="center" key="username" prop="username" :show-overflow-tooltip="true" />
               <el-table-column label="手机号" align="center" key="loginName" prop="loginName" width="120" />
               <el-table-column label="部门" align="center" key="organizationName" prop="organizationName"  width="120" />
               <el-table-column label="角色" align="center" key="apiRoleName" prop="apiRoleName"  width="120" />
               <el-table-column label="等级" align="center" key="levelName" prop="levelName"  width="120" >
                <template #default="scope">
                  <el-link :underline="false"  type="primary" @click="handleMoreInfo(scope.row.userId, 2)">{{ scope.row.levelName }}</el-link>
                </template>
               </el-table-column>
               <el-table-column label="收银角色" align="center" key="sysRoleName" prop="sysRoleName"  width="120" >
                <template #default="scope">
                  <el-link  :underline="false"  type="primary" @click="handleMoreInfo(scope.row.userId, 3)">{{ scope.row.sysRoleName }}</el-link>
                </template>
               </el-table-column>
               <el-table-column label="人员状态" align="center" key="status">
                <template #default="scope">
                  <span v-if="scope.row.status == 0 || scope.row.status == 1">在职</span>
                  <span v-else>离职</span>
                </template>
               </el-table-column>
               <el-table-column label="入职时间" align="center" prop="creatDate" width="160">
               </el-table-column>
               <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
                  <template #default="scope">
                     <el-link :underline="false"  type="danger" @click="handleBindRole(scope.row)">配置收银角色</el-link>
                  </template>
               </el-table-column>
            </el-table>
            <pagination
               v-show="total > 0"
               :total="total"
               v-model:page="queryParams.pageNum"
               v-model:limit="queryParams.pageRow"
               @pagination="getList"
            />
         </el-col>
      </el-row>
      

      <!-- 添加或修改用户配置对话框 -->
      <el-dialog v-if="open" :title="title" v-model="open" width="380px" append-to-body>
         <el-form :model="form" :rules="rules" ref="userRef" label-width="100px">
            <el-form-item label="收银角色">
                <el-select v-model="form.id"  placeholder="请选择" clearable>
                  <el-option
                      v-for="item in cashierRoleList"
                      :key="item.id"
                      :label="item.roleName"
                      :value="item.id"
                  ></el-option>
                </el-select>
            </el-form-item>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitForm">确 定</el-button>
               <el-button @click="cancel">取 消</el-button>
            </div>
         </template>
      </el-dialog>

      <!-- 等级弹窗 -->
      <LevelModal v-if="visible" :visible="visible" @cancel="handleCancel" :userId="userId" :activeName="activeName" />

      <!-- 批量授予赠送权限 -->
      <GiftPermissionModal v-if="gitfVisible" :visible="gitfVisible" @cancel="handleCancelG" @success="handleSuccessG" :dataSource="selectIds"/>
   </div>
</template>

<script setup name="User">
import { getToken2 } from "@/utils/auth";
import {  listUser,  apiroleList, apiLevel, listExport} from "@/api/system/user";
import { deptTreeSelect } from '@/api/system/dept';
import { userRoleList, roleBindingUser } from '@/api/system/role';
import { blobToFile } from '@/utils/index.js'
import LevelModal from './Modal/LevelModal.vue';
import GiftPermissionModal from './Modal/GiftPermissionModal.vue';
const router = useRouter();
const { proxy } = getCurrentInstance();
// const { sys_normal_disable, sys_user_sex } = proxy.useDict("sys_normal_disable", "sys_user_sex");

const tableRef = ref(null);
const userList = ref([]);
const open = ref(false);
const gitfVisible = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("收银角色配置");
const dateRange = ref([]);
const deptName = ref("");
const deptOptions = ref(undefined);
const initPassword = ref(undefined);
const postOptions = ref([]);
const roleOptions = ref([]);
const selectIds = ref([]);
const visible = ref(false);

const roleList = ref([]);
const levelList = ref([]);
const cashierRoleList = ref([]);
const statusList = ref([{ label: '在职', value: 1}, { label: '离职', value: 2}]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageRow: 10,
    username: undefined,
    loginName: undefined,
    status: undefined,
    deptId: undefined
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

function getRoleList() {
  apiroleList().then(res => {
    roleList.value = res;
  })
}
function getLevelList() {
  apiLevel().then(res => {
    console.log('apiLevel===',res)
    levelList.value = res;
  })
}
function getUserRoleList() {
  userRoleList().then(res => { 
    console.log(res, 'reeee')    
    cashierRoleList.value = res;
  })
}

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.name.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watch(deptName, val => {
  proxy.$refs["deptTreeRef"].filter(val);
});
/** 查询部门下拉树结构 */
function getDeptTree() {
  deptTreeSelect().then(response => {
    deptOptions.value = response;
  });
};
/** 查询用户列表 */
function getList() {
  loading.value = true;
  const data = {
    ...queryParams.value
  }
  if(dateRange.value && dateRange.value.length > 1) {
    data.startTime = dateRange.value[0] + ' 00:00:00';
    data.endTime = dateRange.value[1] + ' 23:59:59';
  }
  listUser(data).then(res => {
    userList.value = res.list;
    total.value = res.count;
  }).finally(() => {
    loading.value = false;
  })
};
/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.deptId = data.id;
  handleQuery();
};
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
};
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  queryParams.value.deptId = undefined;
  proxy.$refs.deptTreeRef.setCurrentKey(null);
  handleQuery();
};

/** 选择条数  */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.userId);
  // single.value = selection.length != 1;
  multiple.value = !selection.length;
};

function handleBindRole(item) {
  open.value = true;
  form.value.id = item.sysRoleId
  ids.value = [item.userId];
}

function handleBatchSet(item) {
  if(!ids.value || ids.value == 0) {
    proxy.$modal.msgWarning("请先选择用户");
    return;
  }
  open.value = true;
}

const multipleSelection = ref([]);
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

/** 重置操作表单 */
function reset() {
  form.value = {
    id: undefined
  };
  proxy.resetForm("userRef");
};
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
};
/** 提交按钮 */
function submitForm() {
  proxy.$refs["userRef"].validate(valid => {
    if (valid) {
      roleBindingUser({
        ...form.value,
        userIds: ids.value
      }).then(response => {
        proxy.$modal.msgSuccess("修改成功");
        open.value = false;
        ids.value = [];
        getList();
      })
    }
  });
};

// 批量导出
function handleExport() {
  proxy.$modal.confirm('是否导出数据?').then(function () {
    const data = {
        userIds:ids.value.join(),
        ...queryParams.value
      }
      if(dateRange.value && dateRange.value.length > 1) {
        data.startTime = dateRange.value[0] + ' 00:00:00';
        data.endTime = dateRange.value[0] + ' 23:59:59';
      }
      return listExport(data);
    }).then((res) => {
        blobToFile(res, '用户列表.xlsx')
        proxy.$modal.msgSuccess("导出成功");
      }).catch(function () {
    });
}

const userId = ref(null);
const activeName = ref(null);
function handleMoreInfo(id, type) {
  userId.value = id;
  visible.value = true;
  activeName.value = type;
}

function handleCancel() {
  visible.value = false;
  userId.value = null;
  activeName.value = null;
}

function handleBatchGive() {
  const list = tableRef.value.getSelectionRows();
  if(list && list.length > 0) {
    selectIds.value = list.map(i => i.userId);
    gitfVisible.value = true;
    return;
  }
  proxy.$modal.msgWarning('请先选择');
}
function handleSuccessG() {
  gitfVisible.value = false;
  selectIds.value = [];
  getList();
}
function handleCancelG() {
  gitfVisible.value = false;
}

getDeptTree();
getList();
getRoleList();
getLevelList();
getUserRoleList();
</script>

<style lang="scss" scoped>
  .app-container {
    border-radius: 10px;
  }
  .left-tree >.head-container:nth-child(2)  {
    .el-tree {
      min-height: calc(100vh - 270px);
    } 
  }
</style>