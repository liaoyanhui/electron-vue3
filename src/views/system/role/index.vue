<template>
   <div class="app-container bg-f p-24">
      <el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true" label-width="68px">
         <el-form-item label="角色名称" prop="roleName">
            <el-input
               v-model="queryParams.roleName"
               placeholder="请输入角色名称"
               clearable
               style="width: 240px"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <!-- <el-form-item label="权限字符" prop="roleCode">
            <el-input
               v-model="queryParams.roleCode"
               placeholder="请输入权限字符"
               clearable
               style="width: 240px"
               @keyup.enter="handleQuery"
            />
         </el-form-item> -->
         <el-form-item label="状态" prop="status">
            <el-select
               v-model="queryParams.status"
               placeholder="角色状态"
               clearable
               style="width: 240px"
            >
               <el-option
                  v-for="dict in sys_normal_disable"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               />
            </el-select>
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb-8">
         <el-col :span="1.5">
            <el-button
               type="primary"
               plain
               icon="Plus"
               @click="handleAdd"
               v-hasPermi="['personnel:role:add']"
            >新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="success"
               plain
               icon="Edit"
               :disabled="single"
               @click="handleUpdate"
               v-hasPermi="['personnel:role:edit']"
            >修改</el-button>
         </el-col>
         <!-- <el-col :span="1.5">
            <el-button
               type="warning"
               plain
               icon="Download"
               @click="handleExport"
               v-hasPermi="['system:role:export']"
            >导出</el-button>
         </el-col> -->
         <!-- <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar> -->
      </el-row>

      <!-- 表格数据 -->
      <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="角色编号" prop="id" width="120" />
         <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" width="150" />
         <!-- <el-table-column label="权限字符" prop="roleCode" :show-overflow-tooltip="true" width="150" /> -->
         <el-table-column label="状态" align="center" width="100">
            <template #default="scope">
               <el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="0"
                  @change="handleStatusChange(scope.row)"
               ></el-switch>
            </template>
         </el-table-column>
         <el-table-column label="创建时间" align="center" prop="addTime">
         </el-table-column>
         <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
            <template #default="scope">
             <div class="d-flex">
              <el-tooltip content="修改" placement="top">
                <el-link :underline="false" type="primary" icon="Edit" @click="handleUpdate(scope.row)" ></el-link>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-link :underline="false" type="primary" icon="Delete" @click="handleDelete(scope.row)"></el-link>
              </el-tooltip>
             </div>
              <!-- <el-tooltip content="分配用户" placement="top" v-if="scope.row.id !== 1">
                <el-link :underline="false" type="primary" icon="User" @click="handleAuthUser(scope.row)" v-hasPermi="['system:role:edit']"></el-button>
              </el-tooltip> -->
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

      <!-- 添加或修改角色配置对话框 -->
      <el-dialog :title="title" v-model="open" width="500px" append-to-body>
         <el-form ref="roleRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="角色名称" prop="roleName">
               <el-input v-model="form.roleName" placeholder="请输入角色名称" />
            </el-form-item>
            <!-- <el-form-item prop="roleCode">
               <template #label>
                  <span>
                     <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)" placement="top">
                        <el-icon><question-filled /></el-icon>
                     </el-tooltip>
                     权限字符
                  </span>
               </template>
               <el-input v-model="form.roleCode" placeholder="请输入权限字符" />
            </el-form-item> -->
            <el-form-item label="状态">
               <el-radio-group v-model="form.status">
                  <el-radio
                     v-for="dict in sys_normal_disable"
                     :key="Number(dict.value)"
                     :label="Number(dict.value)"
                  >{{ dict.label }}</el-radio>
               </el-radio-group>
            </el-form-item>
            <el-form-item label="菜单权限">
               <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
               <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
               <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
               <el-tree
                  class="tree-border"
                  :data="menuOptions"
                  show-checkbox
                  ref="menuRef"
                  node-key="id"
                  :check-strictly="!form.menuCheckStrictly"
                  empty-text="加载中，请稍候"
                  :props="{ label: 'menuName', children: 'children' }"
               ></el-tree>
            </el-form-item>
             <el-form-item label="出品部门">
               <el-select
                  v-model="form.makeDepartmentIds"
                  class="m-2 mr-8"
                  placeholder="请选择"
                  style="width: 180px"
                  multiple
                  clearable
                >
                  <el-option
                    v-for="item in makeDepartmentList"
                    :key="item.id"
                    :label="item.departmentName"
                    :value="item.id"
                  />
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


   </div>
</template>

<script setup name="Role">
import {  changeStatus, listRole, updateRole,delRole } from "@/api/system/role";
import { roleMenuTreeselect, treeselect as menuTreeselect } from "@/api/system/menu";
import useProduceStore from "@/store/produce";
import { productionDepartmentGet } from '@/api/system/produce-system';

const produceStore = useProduceStore();
const router = useRouter();
const { proxy } = getCurrentInstance();
// const { sys_normal_disable } = proxy.useDict("sys_normal_disable");
const sys_normal_disable = ref([
  { label: '正常', value: 1,},
  { label: '停用', value: 0,}
]);

const roleList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const currentRoleItem = ref(null);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const menuOptions = ref([]);
const menuExpand = ref(false);
const menuNodeAll = ref(false);
const deptExpand = ref(true);
const deptNodeAll = ref(false);
const deptOptions = ref([]);
const openDataScope = ref(false);
const menuRef = ref(null);
const deptRef = ref(null);

/** 数据范围选项*/
const dataScopeOptions = ref([
  { value: "1", label: "全部数据权限" },
  { value: "2", label: "自定数据权限" },
  { value: "3", label: "本部门数据权限" },
  { value: "4", label: "本部门及以下数据权限" },
  { value: "5", label: "仅本人数据权限" }
]);

const data = reactive({
  form: {
    id: undefined,
    roleName: undefined,
    roleCode: undefined,
    status: 0,
    menuIds: [],
    deptIds: [],
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    makeDepartmentIds: []
  },
  queryParams: {
    pageNum: 1,
    pageRow: 10,
    roleName: undefined,
    roleCode: undefined,
    status: undefined
  },
  rules: {
    roleName: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
    // roleCode: [{ required: true, message: "权限字符不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);
const makeDepartmentList = ref([]);
// 获取出品部门列表 
function getDepartmentList() {
  productionDepartmentGet().then(res => {
    if (res) {
      makeDepartmentList.value = res;
    }
  })
}
/** 查询角色列表 */
function getList() {
  loading.value = true;
  listRole(proxy.addDateRange(queryParams.value)).then(response => {
    roleList.value = response.list;
    total.value = response.count;
    loading.value = false;
  });
}
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
/** 删除按钮操作 */
function handleDelete(row) {
  const roleIds = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除角色编号为"' + roleIds + '"的数据项?').then(function () {
    console.log('aaa')
    return delRole({id: roleIds});
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download("system/role/export", {
    ...queryParams.value,
  }, `role_${new Date().getTime()}.xlsx`);
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  currentRoleItem.value = selection;
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 角色状态修改 */
function handleStatusChange(row) {
  let text = row.status == "0" ? "停用" : "启用";
  proxy.$modal.confirm('确认要"' + text + '""' + row.roleName + '"角色吗?').then(function () {
    return changeStatus({
      id: row.id,
      status: row.status
    });
  }).then(() => {
    proxy.$modal.msgSuccess(text + "成功");
  }).catch(function () {
    row.status = row.status == "0" ? 1 : 0;
  });
}
/** 分配用户 */
function handleAuthUser(row) {
  router.push("/old-system/role-auth/user/" + row.id);
}
/** 查询菜单树结构 */
function getMenuTreeselect() {
  menuTreeselect().then(response => {
    menuOptions.value = response;
  });
}
/** 所有部门节点数据 */
function getDeptAllCheckedKeys() {
  // 目前被选中的部门节点
  let checkedKeys = deptRef.value.getCheckedKeys();
  // 半选中的部门节点
  let halfCheckedKeys = deptRef.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}
/** 重置新增的表单以及其他数据  */
function reset() {
  if (menuRef.value != undefined) {
    menuRef.value.setCheckedKeys([]);
  }
  menuExpand.value = false;
  menuNodeAll.value = false;
  deptExpand.value = true;
  deptNodeAll.value = false;
  form.value = {
    id: undefined,
    roleName: undefined,
    roleCode: undefined,
    status: 0,
    menuIds: [],
    deptIds: [],
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    // remark: undefined
  };
  proxy.resetForm("roleRef");
}
/** 添加角色 */
function handleAdd() {
  reset();
  getMenuTreeselect();
  open.value = true;
  title.value = "添加角色";
}
/** 修改角色 */
async function handleUpdate(row) {
  reset();
  getMenuTreeselect();
  const id = row.id || ids.value[0];
  const item = row.id ? row : currentRoleItem.value[0];
  const roleMenu = getRoleMenuTreeselect(id);
  form.value = {
    ...form.value,
    ...item
  };
  if(form.value.makeDepartmentIds) {
    form.value.makeDepartmentIds = form.value.makeDepartmentIds.split(',').map(item => Number(item));
  }
  open.value = true;
  roleMenu.then((res) => {
    let checkedKeys = res.map(i => {
      return i.id;
    });
    checkedKeys && checkedKeys.forEach((v) => {
      nextTick(() => {
        menuRef.value.setChecked(v, true, false);
      });
    });
  });
  title.value = "修改角色";
}

/** 根据角色ID查询菜单树结构 */
function getRoleMenuTreeselect(id) {
  return roleMenuTreeselect({id}).then(response => {
    // menuOptions.value = response;
    return response;
  });
}
// /** 根据角色ID查询部门树结构 */
// function getDeptTree(id) {
//   return deptTreeSelect(id).then(response => {
//     deptOptions.value = response.depts;
//     return response;
//   });
// }
/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value, type) {
  if (type == "menu") {
    let treeList = menuOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      menuRef.value.store.nodesMap[treeList[i].id].expanded = value;
    }
  } else if (type == "dept") {
    let treeList = deptOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      deptRef.value.store.nodesMap[treeList[i].id].expanded = value;
    }
  }
}
/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value, type) {
  if (type == "menu") {
    menuRef.value.setCheckedNodes(value ? menuOptions.value : []);
  } else if (type == "dept") {
    deptRef.value.setCheckedNodes(value ? deptOptions.value : []);
  }
}
/** 树权限（父子联动） */
function handleCheckedTreeConnect(value, type) {
  if (type == "menu") {
    form.value.menuCheckStrictly = value ? true : false;
  } else if (type == "dept") {
    form.value.deptCheckStrictly = value ? true : false;
  }
}
/** 所有菜单节点数据 */
function getMenuAllCheckedKeys() {
  // 目前被选中的菜单节点
  let checkedKeys = menuRef.value.getCheckedKeys();
  // 半选中的菜单节点
  let halfCheckedKeys = menuRef.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["roleRef"].validate(valid => {
    if (valid) {
      if (form.value.id != undefined) {
        form.value.menuIds = getMenuAllCheckedKeys()
        if(form.value.makeDepartmentIds) {
          form.value.departmentIds = form.value.makeDepartmentIds.join(',')
        };
        updateRole(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        form.value.menuIds = getMenuAllCheckedKeys();
        if(form.value.makeDepartmentIds) {
          form.value.departmentIds = form.value.makeDepartmentIds.join(',')
        };
        updateRole(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}


getDepartmentList();
getList();
</script>

<style lang="scss" scoped>
  .app-container {
    border-radius: 10px;
  }
</style>