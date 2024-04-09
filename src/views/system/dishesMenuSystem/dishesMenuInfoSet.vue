<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-01-23 17:26:52
 * @LastEditTime: 2024-03-12 14:00:15
 * @FilePath: /cbank-client/src/views/system/dishesMenuSystem/dishesMenuInfoSet.vue
-->
<template>
  <div class="app-container " >
    <div class="bg-black tag-box">
      <el-row :class="['bg-black', 'tag-header']">
        <el-col :span="12" class="p-8 col-left">
          <div>
            <span>口味库</span>
          </div>
        </el-col>
        <el-col :span="12" class="p-8 col-left">
          <div class="unit-library">
            <span>单位库</span>
            <el-icon :size="20" class="ic" @click="handleToTop">
              <ArrowUpBold v-if="showTop" />
              <ArrowDownBold v-else />
            </el-icon>
          </div>
        </el-col>
      </el-row>
      <el-collapse-transition>
        <el-row class="bg-black library-tag" v-show="showTop">
          <el-col :span="12" class="p-8 col-left">
            <el-tag
              v-for="item in flavourOfFoodTags"
              :key="item.id"
              size="large"
              class="mx-1 mr-8 my-8"
              closable
              :disable-transitions="false"
              @close="handleClose(item.id)"
            >
              {{ item.tag }}
            </el-tag>
            <el-input
              v-if="flavourOfFoodVisible"
              ref="flavourOfFoodRef"
              v-model="flavourOfFoodValue"
              class="ml-1 w-20 my-8"
              style="width: 100px"
              @keyup.enter="handleFlavourOfFoodConfirm"
              @blur="handleFlavourOfFoodConfirm"
            />
            <el-button  v-else class="button-new-tag ml-1 my-8" @click="showInputFood">
              + 新增口味
            </el-button>
          </el-col>
          <el-col :span="12" class="p-8 col-right">
            <el-tag
              v-for="item in unitTags"
              :key="item.id"
              size="large"
              class="mx-1 mr-8 my-8"
              closable
              :disable-transitions="false"
              @close="handleCloseUnit(item.id)"
            >
              {{ item.tag }}
            </el-tag>
            <el-input
              v-if="unitVisible"
              ref="unitRef"
              v-model="unitValue"
              class="ml-1 w-20 my-8"
              style="width: 100px"
              @keyup.enter="handleUnitConfirm"
              @blur="handleUnitConfirm"
            />
            <el-button v-else class="button-new-tag ml-1 my-8" @click="showInputUnit">
              + 新增单位
            </el-button>
          </el-col>
        </el-row>
      </el-collapse-transition>
    </div>
    
    <div class="mt-8 info-bottom">
      <div class="pr-6 h100 type-left" :style="{width: showLeft ? '250px' : '35px'}" v-loading="loading">
        <div class="bg-black h100" v-if="showLeft">
          <div class="product-title">
            <span>菜品分类</span>
            <el-icon class="arrow-left" @click="handleToLeft"><DArrowLeft /></el-icon>
          </div>
          <div class="btns my-2">
            <el-button type="primary" size="small" @click="handleAddType">新增</el-button>
            <el-button type="warning" size="small" @click="handleEditType">修改</el-button>
            <el-button type="danger" size="small" @click="handleDelType">删除</el-button>
          </div>
          <div class="bg-black tree-info">
            <el-tree 
              :data="deptOptions" 
              :current-node-key="currentKey"  
              :filter-node-method="filterNode" 
              ref="deptTreeRef" 
              node-key="id"
              highlight-current 
              default-expand-all 
              @node-click="handleNodeClick" />
          </div>
        </div>
        <div v-else class="small-left bg-black">
          <div>
            <el-icon class="arrow-right" :size="20" @click="handleToLeft"><DArrowRight /></el-icon>
          </div>
        </div>
      </div>
      <!--用户数据-->
      <div class="h100 bg-black type-right" :span="showLeft ? 19 : 23">
        <div class="bg-black py-8 handle-btn">
          <div class="mr-8">
            <span class="px-6 fs-12">菜品名称</span>
            <el-input v-model="queryParams.name" placeholder="请输入品名或拼音" style="width: 180px" clearable/>
          </div>
          <el-button type="primary" @click="handleQuery" class="my-2">查询</el-button>
          <el-button type="default" @click="handleReset" class="my-2 mr-12">重置</el-button>
          <el-button type="primary" @click="handleAdd" icon="Plus" class="my-2">新增</el-button>
          <el-button type="default" @click="handleEdit" class="my-2">修改</el-button>
          <el-button type="default" @click="handleBatchSet" class="my-2">批量设置出品部门</el-button>
          <el-button type="default" @click="handleBatchEnable(1)" class="my-2">批量启用</el-button>
          <el-button type="default" @click="handleBatchEnable(0)" class="my-2">批量停用</el-button>
          <el-button type="default" @click="handleBatchDel" class="my-2">批量删除</el-button>
          <el-button type="default" @click="handleExportTemplate" class="my-2">模板导出</el-button>
          <el-button type="default" @click="handleExport" class="my-2">批量导出</el-button>
          <el-upload
            v-loading="uploadLoading"
            class="pack-uploader ml-8"
            type="file"
            accept=".xlsx"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="httpRequest"
          >
            <el-button type="default">批量导入</el-button>
          </el-upload>
        </div>
        <el-table :data="userList" v-loading="tableLoading" class="ml10" ref="tableRef" @row-click="handleRowChick">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" key="id" prop="id" />
          <el-table-column label="品名" align="left" key="name" prop="name" :show-overflow-tooltip="true" />
          <el-table-column label="分类" align="left" key="dishTypeName" prop="dishTypeName" :show-overflow-tooltip="true" />
          <el-table-column label="售价" align="center" key="mealPrice" prop="mealPrice" :formatter="(a,b,c,d) => c/100 " :show-overflow-tooltip="true" />
          <el-table-column label="单位" align="center" key="dishUnitName" prop="dishUnitName" :show-overflow-tooltip="true" />
          <el-table-column label="默认出品部门" align="left" key="departmentName" prop="departmentName" :show-overflow-tooltip="true" />
          <el-table-column label="是否启用" align="center" key="status" prop="status" :formatter="(a,b,c,d) => c == 1 ? '是' : '否' " :show-overflow-tooltip="true" />
          <el-table-column label="是否入低消" align="center" key="inputLowConsumption" prop="inputLowConsumption" :formatter="(a,b,c,d) => c == 1 ? '是' : '否' " :show-overflow-tooltip="true" />
          <el-table-column label="是否可赠送" align="center" key="canGivenAsGift" prop="canGivenAsGift" :formatter="(a,b,c,d) => c == 1 ? '是' : '否' " :show-overflow-tooltip="true" />
          <el-table-column label="是否计入订房业绩" align="center" key="bookingPerformance" prop="bookingPerformance" :formatter="(a,b,c,d) => c == 1 ? '是' : '否' " :show-overflow-tooltip="true" />
          <el-table-column label="是否为赔偿品" align="center" key="compensationProducts" prop="compensationProducts" :formatter="(a,b,c,d) => c == 1 ? '是' : '否' " :show-overflow-tooltip="true" />
        </el-table>
        <div class="pg">
          <pagination class="bg-black" v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageRow" @pagination="getList" />
        </div>
      </div>
    </div>
    <DishTypeModal v-if="visible" :visible="visible" @cancel="handleCancel" @success="handleSuccess" :dataSource="treeData"/>
    <DishInfoModal v-if="visibleInfo" :visible="visibleInfo" @cancel="handleCancelInfo" @success="handleSuccessInfo" :dataSource="dishInfoData"/>
    <SetDepartmentModal v-if="visibleDepartment" :visible="visibleDepartment" @cancel="handleCancelDepartment" @success="handleSuccessDepartment" :dataSource="dishInfoIds" />
  </div>
</template>

<script setup>
import useLoading from '@/hooks/loading';
import { getDishTasteSelect, editDishTaste, 
  delDishTaste, getDishUnitSelect, delDishUnit, editDishUnit, getDishTypeSelect, delDishType, getDishInfo,
  enableDishInfo, delDishInfo, exportTemplate, exportInformation, checkOrAllExport } from '@/api/system/produce-system';
import DishTypeModal from './Modal/DishTypeModal.vue';
import DishInfoModal from './Modal/DishInfoModal.vue';
import SetDepartmentModal from './Modal/SetDepartmentModal.vue';
import { nextTick, onMounted, ref, watchEffect } from 'vue'
import { ElMessage } from 'element-plus'
import useProduceStore from '@/store/produce';
import useUploadStore from '@/store/upload';
import { blobToFile } from '@/utils/index.js'

const produceStore = useProduceStore();
const { proxy } = getCurrentInstance();
const uploadStore = useUploadStore();
const flavourOfFoodValue = ref('')
const unitValue = ref('')
const flavourOfFoodTags = ref([])
const unitTags = ref([])
const flavourOfFoodVisible = ref(false)
const unitVisible = ref(false)
const flavourOfFoodRef = ref()
const unitRef = ref()
const showTop = ref(true);
const showLeft = ref(true);
const { loading, setLoading} = useLoading(false);
const deptTreeRef = ref(null);
const visibleInfo = ref(false);
const visibleDepartment = ref(false);
const uploadLoading = ref(false);
const tableLoading = ref(false);

function getDishTastes() {
  getDishTasteSelect().then(res => {
    if(res) {
      const arr = res.map(item => {
        return {
          id: item.id,
          tag: item.tasteName
        };
      })
      flavourOfFoodTags.value = [...arr];
    }
  })
}
function getDishUnits() {
  getDishUnitSelect().then(res => {
    if(res && res.list) {
      const arr = res.list.map(item => {
        return {
          id: item.id,
          tag: item.unitName
        };
      })
      unitTags.value = [...arr];
    }
  })
}

/** 查询菜品分类树结构 */
function getDeptTree() {
  setLoading(true)
  produceStore.ajaxGetDishTypeSelect().then(res => {
    setLoading(false)
    deptOptions.value = res;
  }).catch(e => {
    setLoading(false)
  })
};

const total = ref(0);
const data = reactive({
  form: {},
  queryParams: {
    // status: 1,
    pageNum: 1,
    pageRow: 10,
    // total: 0,
    name: undefined,
    typeId: null
  },
});

// tree 节点
const treeData = ref(null);

const { queryParams, form } = toRefs(data);

function getList() {
  tableLoading.value = true;
  getDishInfo(queryParams.value).then(res => {
    if(res) {
      userList.value = res.list;
      total.value = res.count;
    }
 
  }).finally(() => {
    tableLoading.value = false;
  })
}

onMounted(() => {
  // 查询口味库
  getDishTastes();
  // 查询单位库
  getDishUnits();
  // 查询菜品分类 左侧
  getDeptTree();
  // 菜品列表
  getList();
})

function handleToTop() {
  showTop.value = !showTop.value;
}

function handleToLeft() {
  showLeft.value = !showLeft.value;
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
const handleClose = (tagId) => {
  delDishTaste({ id: tagId}).then(res => {
    if(res) {
      getDishTastes();
    }
  })
}
const handleCloseUnit = (tagId) => {
   delDishUnit({ ids: [tagId]}).then(res => {
    if(res) {
      getDishUnits();
    }
  })
}

const showInputFood = () => {
  flavourOfFoodVisible.value = true
  nextTick(() => {
    flavourOfFoodRef.value.input.focus()
  })
}
const showInputUnit = () => {
  unitVisible.value = true
  nextTick(() => {
    unitRef.value.input.focus()
  })
}

const handleFlavourOfFoodConfirm = () => {
  if (flavourOfFoodValue.value) {
    editDishTaste({ tasteName: flavourOfFoodValue.value}).then(res => {
      getDishTastes();
      flavourOfFoodVisible.value = false
      flavourOfFoodValue.value = ''
    })
  } else {
    flavourOfFoodVisible.value = false
    flavourOfFoodValue.value = ''
  }
  
}
const handleUnitConfirm = () => {
  if (unitValue.value) {
    editDishUnit({ name: unitValue.value}).then(res => {
      getDishUnits();
      unitVisible.value = false
      unitValue.value = ''
    })
  }
  unitVisible.value = false
  unitValue.value = ''
}

const deptOptions = ref();
const currentKey = ref(null)
const userList = ref([]);
const name = ref('');

const dishTypeList = ref([]);
const dishType = ref(null);

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.typeName.indexOf(value) !== -1;
};

/** 分类树单击事件 */
function handleNodeClick(data) {
  // 如果已经选中那么清楚
  if(treeData.value) {
    let typeId = null;
    if(treeData.value.value == data.value) {
      treeData.value = null;
      // currentKey.value = null;
      deptTreeRef.value && deptTreeRef.value.setCurrentKey(null)

    } else {
      treeData.value = data;
      typeId = data.value;
    }
    queryParams.value = {
      pageNum: 1,
      pageRow: 10,
      name: undefined,
      typeId: typeId,
    }
    getList();
    return;
  } 
  treeData.value = data;
  queryParams.value = {
    pageNum: 1,
    pageRow: 10,
    name: undefined,
    typeId: data.value,
  }
  getList();
};

/** 搜索 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
};

const tableRef = ref(null);
const dishInfoData = ref(null);
function handleReset() {
  queryParams.value = {
    pageNum: 1,
    pageRow: 10,
    name: undefined,
    typeId: null
  }
  getList();
}
function handleAdd() {
  visibleInfo.value = true;
  dishInfoData.value = null;
}
function handleEdit() {
  const rows = tableRef.value.getSelectionRows();
  if(!rows || rows.length == 0) {
    proxy.$modal.msgWarning("请选择菜品");
  } else if(rows.length > 1) {
    proxy.$modal.msgWarning("一次只能修改一个菜品");
  } else {
    dishInfoData.value = rows[0];
    visibleInfo.value = true;
  }
}

const dishInfoIds = ref(null);
function handleBatchSet() {
  const rows = tableRef.value.getSelectionRows();
  if(!rows || rows.length == 0) {
    proxy.$modal.msgWarning("请选择菜品");
    return ;
  } 
  const ids = rows.map(i => i.id);
  dishInfoIds.value = { ids };
  visibleDepartment.value = true;
}
function handleBatchEnable(status) {
  const rows = tableRef.value.getSelectionRows();
  if(!rows || rows.length == 0) {
    proxy.$modal.msgWarning("请选择菜品");
    return ;
  } 
  const ids = rows.map(i => i.id);
  const data = {
    status,
    ids,
  }
  enableDishInfo(data).then(res => {
    if(res) {
      proxy.$modal.msgSuccess("操作成功");
      getList()
    }
  })
}

function handleBatchDel() {
   const rows = tableRef.value.getSelectionRows();
    if(!rows || rows.length == 0) {
      proxy.$modal.msgWarning("请选择菜品");
      return ;
    } 
   
    proxy.$modal.confirm('是否批量删除?').then(function () {
      const ids = rows.map(i => i.id);
      const data = {
        ids,
      }
      return delDishInfo(data)
    }).then(() => {
       proxy.$modal.msgSuccess("操作成功");
        getList()
      }).catch(function () {
    });
}


// 分类弹窗
const visible = ref(false);

function handleSuccess() {
  visible.value = false;
  getDeptTree();
}

function handleCancel() {
  visible.value = false;
}

function handleAddType() {
  // 清除当前选中的tree
  deptTreeRef.value && deptTreeRef.value.setCurrentKey(null)
  treeData.value = null;
  visible.value = true;
}
function handleEditType() {
  if(treeData.value) {
    visible.value = true;
    return;
  }
  proxy.$modal.msgWarning("请先选中分类");
}

function handleDelType() {
  if(treeData.value) {
    proxy.$modal.confirm('是否删除'+ treeData.value.label +'?').then(function () {
      let params = {
        id: treeData.value.value,
      }
      return delDishType(params);
    }).then(() => {
        proxy.$modal.msgSuccess("操作成功");
        getDeptTree();
      }).catch(function () {
    });
    return;
  }
  proxy.$modal.msgWarning("请先选中分类");
}

function handleCancelInfo() {
  visibleInfo.value = false;
}
function handleSuccessInfo(data) {
  if (!data) {
    visibleInfo.value = false;
  }
  getList()
}

function handleCancelDepartment() {
  visibleDepartment.value = false;
}
function handleSuccessDepartment() {
  visibleDepartment.value = false;
  getList()
}
// 模板导出
function handleExportTemplate() {
  exportTemplate().then(res => {
    blobToFile(res, '菜品数据导入模板.xlsx')
  })
}

// 批量导出
function handleExport() {
  const rows = tableRef.value.getSelectionRows();
  if(!rows || rows.length == 0) {
    proxy.$modal.confirm('是否导出全部数据?').then(function () {
      return checkOrAllExport()
    }).then((res) => {
        blobToFile(res, '菜品数据.xlsx');
        proxy.$modal.msgSuccess("导出成功");
      }).catch(function () {
    });
  } else {
    proxy.$modal.confirm('是否导出所选数据?').then(function () {
      const ids = rows.map(i => i.id);
      const data = {
        ids,
      }
      return checkOrAllExport(data);
    }).then((res) => {
        blobToFile(res, '菜品数据.xlsx')
        proxy.$modal.msgSuccess("导出成功");
      }).catch(function () {
    });
  }
}

const beforeAvatarUpload = (rawFile) => {
  return true
}

// 手动上传
function httpRequest(File) {
  try {
    const data = {
      file: File.file
    }
    uploadLoading.value = true;
    exportInformation(data).then(res => {
      if(res) {
        proxy.$modal.msgSuccess("导入成功");
        getList()
      }
      uploadLoading.value = false;
    }).catch(err => {
      uploadLoading.value = false;
    })
  } catch (error) {
    uploadLoading.value = false;
  }
}

</script>
<style lang="scss" scoped>
.app-container {
  min-height: calc(100vh - 113px);
  display: flex;
  flex-direction: column;
}
.min-height {
  height: calc(100vh - 142px)
}
.library-tag {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  // height: 135px;
  overflow-y: auto;
}
.ic {
  cursor: pointer;
}

.tag-box {
  border-radius: 10px;
}
.tag-header {
  border-radius: 10px;
  .unit-library {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.product-title {
  height: 40px;
   margin: 12px 18px 12px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .arrow-left {
    cursor: pointer;
    color: #2ad1b7;
  }
}
.arrow-right {
  cursor: pointer;
  margin: 6px 0;
}
.btns {
  display: flex;
  align-items: center;
  padding-left: 12px;
}
.handle-btn {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.pg {
  position: relative;
  .pagination-container  {
    height: 50px !important;
    margin-top: 0 !important;
  }
}

.info-bottom {
  display: flex;
  flex: 1;
}

.type-right {
  height: auto;
  border-radius: 10px;
  overflow: hidden;
  flex: 1;
}
.type-left {
  height: auto;
  border-radius: 10px;
  overflow: hidden;
  // width: 250px;
  flex-shrink: 0;
  > div {
    border-radius: 10px;
    overflow: hidden;
  }
  .small-left {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 30px;
    height: 30px;
    color: #2ad1b7;
    border-radius: 50%;
  }
}

.tree-info :deep(.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content){
  background-color: #2ad1b7;
}

</style>
             