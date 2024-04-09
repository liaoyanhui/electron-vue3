<!--
 * @Description: 场所列表（需要超级管理员权限 roles=['admin']）
 * @Author: pgm
 * @Date: 2024-03-19 16:08:19
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-20 01:06:00
 * @FilePath: /cbank-client/src/views/system/company/list.vue
-->

<template>
  <div class="app-container bg-f p-24">
    <div class="d-flex ">

      <el-form-item label="场所名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入角色名称" clearable style="width: 240px"
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item class="ml-30">
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </div>


    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="companyList">
      <el-table-column type="index" label='序号' align="center" width="150" />
      <el-table-column label="场所id" prop="id" align="center" />
      <el-table-column label="场所" prop="name" align="center" :show-overflow-tooltip="true" />
      <el-table-column label="场所简称" prop="nickname" align="center" :show-overflow-tooltip="true" />
      <el-table-column label="场所logo" align="center" >
        <template #default="scope">
          <img v-if="scope.row.logoPic" :src="scope.row.logoPic" width="40px" height="40px">
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template #default="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
            :before-change="() => { handleStatusChange(scope.row) }"></el-switch>
        </template>
      </el-table-column>
     
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template #default="scope">
          <div class="d-flex fs-14">
            <el-link :underline="false" type="primary" @click="handleUpdate(scope.row)">配置菜单</el-link>
            <el-link :underline="false" type="primary" @click="handleConfig(scope.row)">场所设置</el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageRow"
      @pagination="getList" />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="roleRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="配置菜单">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.menuCheckStrictly"
            @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
          <el-tree class="tree-border" :data="menuOptions" show-checkbox ref="menuRef" node-key="id"
            :check-strictly="!form.menuCheckStrictly" empty-text="加载中，请稍候"
            :props="{ label: 'menuName', children: 'children' }"></el-tree>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm" :loading="loading">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <config :visible="companyData.show" :dataSource="companyData.data" @cancel="configClose" @getList="handleQuery"></config>



  </div>
</template>

<script setup>
import config from './config.vue'
import { changeStatus } from "@/api/system/role";
import { getCompanyList, getCompanyMenu, bindingCompanyMenu, listDistribution, updateCompanyInfo } from '@/api/common/common';
const { proxy } = getCurrentInstance();

const sys_normal_disable = ref([
  { label: '正常', value: 1, },
  { label: '停用', value: 0, }
]);

const companyList = ref([]);
const open = ref(false);
const configShow = ref(false)
const loading = ref(true);
const total = ref(0);
const title = ref("");
const menuOptions = ref([]);
const menuExpand = ref(false);
const menuNodeAll = ref(false);
const deptExpand = ref(true);
const deptNodeAll = ref(false);
const deptOptions = ref([]);
const menuRef = ref(null);
const deptRef = ref(null);
const companyData = reactive({
  show: false,
  data: null
})
/** 数据范围选项*/


const data = reactive({
  form: {
    id: undefined,
    status: 0,
    menuIds: [],
    menuCheckStrictly: true,
    deptCheckStrictly: true,
  },
  queryParams: {
    pageNum: 1,
    pageRow: 10,
    name: undefined,
    status: undefined
  },
  rules: {

    // roleCode: [{ required: true, message: "权限字符不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);
/** 获取场所列表 */
function getList() {
  loading.value = true;
  getCompanyList(proxy.addDateRange(queryParams.value)).then(response => {
    //  companyList.value = response.list;
    //  total.value = response.count;
    companyList.value = response
    total.value = response.length
    loading.value = false;
  });
}
/** 搜索按钮操作 */
function handleQuery() {
  configClose()
  queryParams.value.pageNum = 1;
  getList();
}


/** 重置按钮操作 */
function resetQuery() {
  queryParams.value = {
    pageNum: 1,
    pageRow: 10,
    name: undefined,
    status: undefined
  }
  handleQuery();
}



/** 角色状态修改 */
async function handleStatusChange(row) {
  let text = row.status === 1 ? "停用" : "启用";
  let status = row.status === 0 ? 1 : 0
  const isTrue = await proxy.$modal.confirm('确认要"' + text + '""' + row.nickname + '"该场所吗?')
  console.log(isTrue)
  if (isTrue) {
    return updateCompanyInfo({
        currentCompanyId: row.id,
        status: status
      }).then(res => {
      proxy.$modal.msgSuccess(text + "成功");
      handleQuery()
    });
  } else {
    return false
  }
  
}

//
function handleConfig(row) {
  companyData.show = true
  companyData.data = {
    ...row
  }
}
function configClose() {
  companyData.show = false
  companyData.data = {}
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
    status: 0,
    menuIds: [],
    menuCheckStrictly: true,
    deptCheckStrictly: true,
  };
  proxy.resetForm("roleRef");
}

/** 修改角色 */
async function handleUpdate(row) {
  reset();
  const id = row.id
  form.value = {
    ...form.value,
    currentCompanyId: id
  };
  let response = await listDistribution()
  menuOptions.value = response;
  open.value = true;
  nextTick(() => {
    getRoleMenuTreeselect(id);
  })
  title.value = `修改${row.name}菜单`;
}

/** 根据角色ID查询菜单树结构 */
function getRoleMenuTreeselect(currentCompanyId) {
  getCompanyMenu({ currentCompanyId }).then(res => {
    res.forEach((item) => {
      menuRef.value.setChecked(item.tempId, true, false);
    });
  })
}

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
  return checkedKeys.join(',');
}
/** 提交按钮 */
function submitForm() {
  loading.value = true
  proxy.$refs["roleRef"].validate(valid => {
    if (valid) {
      form.value.menus = getMenuAllCheckedKeys()
      bindingCompanyMenu(form.value).then(response => {
        proxy.$modal.msgSuccess("修改成功");
        open.value = false;
        getList();
      }).finally(() => {
        loading.value = false
      });
    }
  });
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}


getList();

</script>

<style lang="scss" scoped>
.app-container {
  border-radius: 10px;
}
</style>