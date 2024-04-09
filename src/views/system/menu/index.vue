<template>
   <div class="app-container bg-f p-24">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
         <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="queryParams.menuName" placeholder="请输入菜单名称" clearable style="width: 200px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="菜单状态" clearable style="width: 200px">
               <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb-8">
         <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" >新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="info" plain icon="Sort" @click="toggleExpandAll">展开/折叠</el-button>
         </el-col>
         <!-- <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar> -->
      </el-row>

      <el-table v-if="refreshTable" v-loading="loading" :data="menuList" row-key="id" :default-expand-all="isExpandAll"
         :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
         <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="160"></el-table-column>
         <el-table-column prop="icon" label="图标" align="center" width="100">
            <template #default="scope">
               <svg-icon v-if="!scope.row.icon?.includes('http')" :icon-class="scope.row.icon" class="el-input__icon"
                                 style="height: 32px;width: 32px;" />
               <img v-else-if="scope.row.icon?.includes('http')" :src="scope.row.icon" style="height: 20px;width: 20px;">
            </template>
         </el-table-column>
         <el-table-column prop="orderNum" label="排序" width="60"></el-table-column>
         <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
         <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
         <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
               <!-- <dict-tag :options="sys_normal_disable" :value="scope.row.status" /> -->
               <span>{{ scope.row.status == 1 ? '正常' : '停用' }}</span>
            </template>
         </el-table-column>
         <el-table-column label="创建时间" align="center" width="160" prop="addTime">
            <!-- <template #default="scope">
               <span>{{ parseTime(scope.row.addTime) }}</span>
            </template> -->
         </el-table-column>
         <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
            <template #default="scope">
              <div class="d-flex">
               <el-link :underline="false" type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                 >修改</el-link>
               <el-link :underline="false" type="primary" icon="Plus" @click="handleAdd(scope.row)"
                  >新增</el-link>
               <el-link :underline="false" type="primary" icon="Delete" @click="handleDelete(scope.row)"
                 >删除</el-link>
              </div>
            </template>
         </el-table-column>
      </el-table>

      <!-- 添加或修改菜单对话框 -->
      <el-dialog :title="title" v-model="open" width="740px" append-to-body>
         <el-form ref="menuRef" :model="form" :rules="rules" label-width="120px">
            <el-row>
               <el-col :span="24">
                  <el-form-item label="上级菜单">
                     <el-tree-select v-model="form.parentId" :data="menuOptions"
                        :props="{ value: 'id', label: 'menuName', children: 'children' }" value-key="id"
                        placeholder="选择上级菜单" check-strictly />
                  </el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="菜单类型" prop="menuType">
                     <el-radio-group v-model="form.menuType">
                        <el-radio :label="1">目录</el-radio>
                        <el-radio :label="2">菜单</el-radio>
                        <el-radio :label="3">按钮</el-radio>
                     </el-radio-group>
                  </el-form-item>
               </el-col>
               <el-col :span="24" v-if="form.menuType != '2'">
                  <el-form-item label="菜单图标" prop="icon">
                     <div class="d-flex al-center">
                        <el-input v-model="form.icon" placeholder="请输入图标链接">
                           <template #prefix>
                              <svg-icon v-if="form.icon&&!form.icon.includes('http')" :icon-class="form.icon" class="el-input__icon"
                                 style="height: 32px;width: 16px;" />
                              <img v-else-if="form.icon?.includes('http')" :src="form.icon" style="height: 20px;width: 20px;">
                              <!-- <el-icon v-else style="height: 32px;width: 16px;">
                                 <search />
                              </el-icon> -->
                           </template>
                           <template #suffix><el-icon class="el-input__icon pointer" @click="form.icon = ''">
                                 <Close />
                              </el-icon></template>
                        </el-input>
                        <el-popover placement="bottom-start" :width="540" trigger="click">
                           <template #reference>
                              <el-button type="primary" @click="showSelectIcon" plain class="ml-20">选择icon</el-button>
                           </template>
                           <icon-select @selected="selected" :active-icon="form.icon" ref="iconSelectRef" />
                        </el-popover>
                     </div>

                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="菜单名称" prop="menuName">
                     <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="显示排序" prop="orderNum">
                     <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
                  </el-form-item>
               </el-col>
               <el-col :span="12" v-if="form.menuType != '3'">
                  <el-form-item>
                     <template #label>
                        <span>
                           <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                              <el-icon><question-filled /></el-icon>
                           </el-tooltip>是否外链
                        </span>
                     </template>
                     <el-radio-group v-model="form.isFrame">
                        <el-radio v-for="dict in sys_frame" :key="dict.value" :label="dict.value">{{ dict.label
                        }}</el-radio>
                     </el-radio-group>
                  </el-form-item>
               </el-col>
               <el-col :span="12" v-if="form.menuType != '3'">
                  <el-form-item prop="path">
                     <template #label>
                        <span>
                           <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                              <el-icon><question-filled /></el-icon>
                           </el-tooltip>
                           路由地址
                        </span>
                     </template>
                     <el-input v-model="form.path" placeholder="请输入路由地址" />
                  </el-form-item>
               </el-col>
               <el-col :span="12" v-if="form.menuType == '1'">
                  <el-form-item prop="redirect">
                     <template #label>
                        <span>
                           <el-tooltip content="默认打开的菜单" placement="top">
                              <el-icon><question-filled /></el-icon>
                           </el-tooltip>
                           激活菜单
                        </span>
                     </template>
                     <el-input v-model="form.redirect" placeholder="请输入激活菜单" style="width:200px" />
                  </el-form-item>
               </el-col>
               <el-col :span="12" v-if="form.menuType == '2'">
                  <el-form-item prop="component">
                     <template #label>
                        <span>
                           <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                              <el-icon><question-filled /></el-icon>
                           </el-tooltip>
                           组件路径
                        </span>
                     </template>
                     <el-input v-model="form.component" placeholder="请输入组件路径" />
                  </el-form-item>
               </el-col>
               <el-col :span="12" v-if="form.menuType != '1'">
                  <el-form-item>
                     <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
                     <template #label>
                        <span>
                           <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                              placement="top">
                              <el-icon><question-filled /></el-icon>
                           </el-tooltip>
                           权限字符
                        </span>
                     </template>
                  </el-form-item>
               </el-col>
               <el-col :span="12" v-if="form.menuType == '2'">
                  <el-form-item>
                     <el-input v-model="form.query" placeholder="请输入路由参数" maxlength="255" />
                     <template #label>
                        <span>
                           <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">
                              <el-icon><question-filled /></el-icon>
                           </el-tooltip>
                           路由参数
                        </span>
                     </template>
                  </el-form-item>
               </el-col>
               <el-col :span="12" v-if="form.menuType == '2'">
                  <el-form-item>
                     <template #label>
                        <span>
                           <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                              <el-icon><question-filled /></el-icon>
                           </el-tooltip>
                           是否缓存
                        </span>
                     </template>
                     <el-radio-group v-model="form.isCache">
                        <el-radio v-for="dict in sys_cache" :key="dict.value" :label="dict.value">{{ dict.label
                        }}</el-radio>
                     </el-radio-group>
                  </el-form-item>
               </el-col>

               <el-col :span="12" v-if="form.menuType != '3'">
                  <el-form-item>
                     <template #label>
                        <span>
                           <el-tooltip :content="`选择隐藏则路由将不会出现在${form.menuType == 1? '导航' : '侧边'}栏，但仍然可以访问`" placement="top">
                              <el-icon><question-filled /></el-icon>
                           </el-tooltip>
                           {{form.menuType == '1'?`导航栏展示`: `侧边栏展示`}}
                        </span>
                     </template>
                     <el-radio-group v-model="form.visible">
                        <el-radio v-for="dict in sys_show_hide" :key="dict.value" :label="dict.value">{{ dict.label
                        }}</el-radio>
                     </el-radio-group>
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item>
                     <template #label>
                        <span>
                           <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                              <el-icon><question-filled /></el-icon>
                           </el-tooltip>
                           菜单状态
                        </span>
                     </template>
                     <el-radio-group v-model="form.status">
                        <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label
                        }}</el-radio>
                     </el-radio-group>
                  </el-form-item>
               </el-col>

            </el-row>
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

<script setup name="Menu">
import { addMenu, delMenu, listMenu } from "@/api/system/menu";
import SvgIcon from "@/components/SvgIcon";
// import IconSelect from "@/components/IconSelect";

const { proxy } = getCurrentInstance();
// const { sys_normal_disable, sys_show_hide} = proxy.useDict("sys_normal_disable","sys_show_hide");
const sys_show_hide = ref([
   { label: '隐藏', value: 1, },
   { label: '显示', value: 0, }
]);
const sys_normal_disable = ref([
   { label: '正常', value: 1, },
   { label: '停用', value: 0, }
]);

const sys_cache = ref([
   { label: '缓存', value: 0, },
   { label: '不缓存', value: 1, }
])
const sys_frame = ref([
   { label: '是', value: 1, },
   { label: '否', value: 0, }
])
const menuList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const title = ref("");
const menuOptions = ref([]);
const isExpandAll = ref(false);
const refreshTable = ref(true);
const iconSelectRef = ref(null);

const data = reactive({
   form: {
   },
   queryParams: {
      menuName: undefined,
      visible: undefined
   },
   rules: {
      menuName: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
      orderNum: [{ required: true, message: "菜单顺序不能为空", trigger: "blur" }],
      path: [{ required: true, message: "路由地址不能为空", trigger: "blur" }]
   },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询菜单列表 */
function getList() {
   loading.value = true;
   listMenu(queryParams.value).then(response => {
      menuList.value = proxy.handleTree(response, "id");
      console.log('menuList===>', menuList)
      loading.value = false;
   });
}
/** 查询菜单下拉树结构 */
function getTreeselect() {
   menuOptions.value = [];
   listMenu().then(response => {
      const menu = { id: 0, menuName: "主类目", children: [] };
      menu.children = proxy.handleTree(response, "id");
      menuOptions.value.push(menu);
   });
}
/** 取消按钮 */
function cancel() {
   open.value = false;
   reset();
}
/** 表单重置 */
function reset() {
   form.value = {
      id: undefined,
      parentId: 0,
      menuName: undefined,
      icon: undefined,
      menuType: 1,
      orderNum: undefined,
      isFrame: 0,
      isCache: 1,
      visible: 0,
      status: 1
   };
   proxy.resetForm("menuRef");
}
/** 展示下拉图标 */
function showSelectIcon() {
   iconSelectRef.value.reset();
}
/** 选择图标 */
function selected(name) {
   form.value.icon = name;
}
/** 搜索按钮操作 */
function handleQuery() {
   getList();
}
/** 重置按钮操作 */
function resetQuery() {
   proxy.resetForm("queryRef");
   handleQuery();
}
/** 新增按钮操作 */
function handleAdd(row) {
   reset();
   getTreeselect();
   if (row != null && row.id) {
      form.value.parentId = row.id;
   } else {
      form.value.parentId = 0;
   }
   open.value = true;
   title.value = "添加菜单";
}
/** 展开/折叠操作 */
function toggleExpandAll() {
   refreshTable.value = false;
   isExpandAll.value = !isExpandAll.value;
   nextTick(() => {
      refreshTable.value = true;
   });
}
/** 修改按钮操作 */
async function handleUpdate(row) {
   reset();
   await getTreeselect();
   console.log('row', row)
   form.value = { ...row };
   open.value = true;
   title.value = "修改菜单";
   // });
}
/** 提交按钮 */
function submitForm() {
   proxy.$refs["menuRef"].validate(valid => {
      if (valid) {
         let menuType = form.value.menuType
         // if (menuType == 3) {
         //    form.value.component=''
         //    form.value.path=''
         //    form.value.component=''
         // }

         if (form.value.id != undefined) {
            addMenu(form.value).then(response => {
               proxy.$modal.msgSuccess("修改成功");
               open.value = false;
               getList();
            });
         } else {
            addMenu(form.value).then(response => {
               proxy.$modal.msgSuccess("新增成功");
               open.value = false;
               getList();
            });
         }
      }
   });
}
/** 删除按钮操作 */
function handleDelete(row) {
   proxy.$modal.confirm('是否确认删除名称为"' + row.menuName + '"的数据项?').then(function () {
      return delMenu({
         id: row.id
      });
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
   }).catch(() => { });
}

getList();
</script>

<style lang="scss" scoped>
.app-container {
   border-radius: 10px;
}
</style>