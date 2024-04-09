<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-22 15:22:08
 * @LastEditTime: 2024-03-15 15:21:53
 * @FilePath: /cbank-client/src/views/system/giftScheme/Modal/SchemeModal.vue
-->
<template>
  <el-dialog :title="title" :model-value="visible" width="1350px" append-to-body destroy-on-close :before-close="handleBeforeClose" lock-scroll>
    <el-form :model="form" :rules="rules" ref="schemeRef" label-width="110px">
      <el-form-item label="赠送方案名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入" style="width: 280px"></el-input>
      </el-form-item>
    </el-form>
    <div style="height: 62vh">
      <el-scrollbar>
        <el-row>
          <el-col :span="11">
            <div class="pr-8">
              <div class="mr-8 mb-4">
                <el-input v-model="queryParams.name" placeholder="请输入品名或拼音" class="mr-8" style="width: 180px"/>
                <el-tree-select
                  v-model="queryParams.typeId"
                  :data="deptOptions"
                  :render-after-expand="false"
                  check-strictly
                  clearable
                  placeholder="请选择分类"
                  style="width: 180px"
                />
                <el-button type="primary" @click="handleQuery" class="my-2 ml-8">查询</el-button>
              </div>
              <el-table :data="dishList" class="ml10" ref="tableRef"
                @selection-change="handleSelectionChange"
                @row-click="handleRowChick">
                <el-table-column type="selection" width="40" :selectable="handleDisable" />
                <el-table-column label="序号" align="center" type="index" width="50" />
                <!-- <el-table-column label="序号" align="center" key="id" prop="id" /> -->
                <el-table-column label="品名" align="center" key="name" prop="name" :show-overflow-tooltip="true" />
                <el-table-column label="分类" align="center" key="dishTypeName" prop="dishTypeName" :show-overflow-tooltip="true" />
                <el-table-column label="售价" align="center" key="mealPrice" prop="mealPrice" :show-overflow-tooltip="true" :formatter="(a,b,c,d) => c/100 " />
                <el-table-column label="单位" align="center" key="dishUnitName" prop="dishUnitName" :show-overflow-tooltip="true" />
                <el-table-column label="默认出品部门" align="center" key="departmentName" prop="departmentName" :show-overflow-tooltip="true" />
                <el-table-column label="是否可赠送" align="center" prop="canGivenAsGift">
                  <template #default="scope">
                    <span>{{ scope.row.canGivenAsGift == 1 ? '是' : '否' }}</span>
                  </template>      
                </el-table-column>
              </el-table>
              <pagination small v-show="total > 0" :pagerCount="5" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageRow" @pagination="getList" />
            </div>
          </el-col>
          <el-col :span="2" class="handle">
            <el-button @click="handleAdd">添加</el-button>
            <el-button @click="handleRemove">移除</el-button>
          </el-col>
          <el-col :span="11">
            <el-table :data="selectList" class="mt-40" ref="table2Ref"
              @selection-change="handleSelectionChangeSelect"
              @row-click="handleRowChickSelect">
              <el-table-column type="selection" width="40" />
              <el-table-column label="序号" align="center" type="index" width="50" />
              <!-- <el-table-column label="序号" align="center" key="id" prop="id" /> -->
              <el-table-column label="品名" align="center" key="name" prop="name" :show-overflow-tooltip="true" />
              <el-table-column label="分类" align="center" key="dishTypeName" prop="dishTypeName" :show-overflow-tooltip="true" />
              <el-table-column label="售价" align="center" key="mealPrice" prop="mealPrice" :show-overflow-tooltip="true" :formatter="(a,b,c,d) => c/100 " />
              <el-table-column label="单位" align="center" key="dishUnitName" prop="dishUnitName" :show-overflow-tooltip="true" />
              <el-table-column label="默认出品部门" align="center" key="departmentName" prop="departmentName" :show-overflow-tooltip="true" />
              <el-table-column label="是否可赠送" align="center" prop="canGivenAsGift">
                <template #default="scope">
                  <span>{{ scope.row.canGivenAsGift == 1 ? '是' : '否' }}</span>
                </template>      
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
     <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
  </el-dialog>
</template>

<script setup>
  import useLoading from '@/hooks/loading';
  import useProduceStore from '@/store/produce';
  import { getDishInfo } from '@/api/system/produce-system';
  import { editGiftPackage, giftPackageSelectInfo } from '@/api/gift';
  import { nextTick, onMounted, ref, watchEffect } from 'vue'
  
  const produceStore = useProduceStore();
  const { proxy } = getCurrentInstance();

  const { loading, setLoading} = useLoading(false);
  const title = ref('新增赠送方案');
  const deptOptions = ref();
  const total = ref(0);
  const dishList = ref([]);
  const selectList = ref([]);
  const tableLoading = ref(false);
  const multipleSelection = ref([])
  const tableRef = ref(null);
  const table2Ref = ref(null);

  const props = defineProps({
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
    dataSource: {
      type: Object,
      default: null
    }
  })
  const data = reactive({
    form: {},
    queryParams: {
      // status: 1,
      pageNum: 1,
      pageRow: 10,
      // total: 0,
      name: undefined,
      typeId: null,
      status: 1,
      canGivenAsGift: 1,
    },
    rules: {
      name: [{ required: true, message: "不能为空", trigger: "blur" }],
    }
  });

  const { queryParams, form, rules } = toRefs(data);
  const emit = defineEmits([ 'cancel', 'success']);
  const { visible, dataSource } = toRefs(props);

  watch(
    () => [dataSource.value,dishList.value],
    (val) => {
      if(val[0]) {
        form.value = {
          name: val[0].name,
        }
        giftPackageSelectInfo({id: val[0].id, pageRow: 999}).then(res => {
          selectList.value = res.list;
        })
      }
      if(val[1]) {
        val[1].forEach(item => {
          const Index =  selectList.value.findIndex(i => i.id == item.id);
          if(Index > -1) {
             nextTick(() => {
              tableRef.value.toggleRowSelection(item, true)
            })
          }
        })
      }
    },{ deep: true, immediate: true }
  )

  function handleBeforeClose() {
    emit('cancel');
  }

  const handleSelectionChange = (val) => {
    multipleSelection.value = val
  }

  const multipleSelection2 = ref([]);
  const handleSelectionChangeSelect = (val) => {
    multipleSelection2.value = val
  }

  // 点击某行控制复选框选中与否
  const handleRowChick = (row) => {
    const Index = selectList.value.findIndex(i => i.id == row.id);
    if(Index > -1) {
      return;
    }
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
  // 点击某行控制复选框选中与否
  const handleRowChickSelect = (row) => {
    const selected = multipleSelection2.value.some((item) => item.id === row.id)
    if (!selected) {
      multipleSelection2.value.push(row)
      table2Ref.value.toggleRowSelection(row)
    } else {
      const finArr = multipleSelection2.value.filter((item) => {
        return item.id !== row.id
      })
      multipleSelection2.value = finArr
      table2Ref.value.toggleRowSelection(row, false)
    }
  }
  function getList() {
    tableLoading.value = true;
    getDishInfo(queryParams.value).then(res => {
      if(res) {
        dishList.value = res.list;
        total.value = res.count;
      }
    tableLoading.value = false;
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

  /** 搜索 */
  function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
  };

  function handleDisable(row) {
    const Index = selectList.value.findIndex(i => i.id == row.id);
    if (Index == -1) {
      return true;
    } else {
      return false;
    }
  }
  function handleRemove() {
    const list = unref(multipleSelection2);
    if(list && list.length > 0) {
      const newList = selectList.value.filter(i => {
      const Index = list.findIndex(item => item.id == i.id);
        if(Index > -1 ) {
          return false
        }
        return true;
      })
      selectList.value = [...newList];
      return
    }
    proxy.$modal.msgWarning('请先选择');
  }
  function handleAdd() {
    const list = unref(multipleSelection);
    if(list && list.length > 0) {
      list.forEach(i => {
        const Index = selectList.value.findIndex(item => item.id == i.id);
        if(Index == -1){
          selectList.value.push(i);
        }
      })
      return;
    }
    proxy.$modal.msgWarning('请先选择');
  }

  function submitForm() {
    proxy.$refs["schemeRef"].validate(valid => {
      if (valid) {
        const list = unref(selectList); 
        // if(list && list.length > 0) {
          const ids = list.map(item => item.id);
          const data = {
            name: form.value.name,
            dishIds: ids.join(),
          }
          if(dataSource.value && dataSource.value.id) {
            data.id = dataSource.value.id;
          }
          editGiftPackage(data).then(res => {
            if(res) {
              emit('success')
            }
          })
        // }
      }
    });
  }
  function cancel() {
    emit('cancel');
    selectList.value = [];
  }

  getList();
  getDeptTree();
</script>

<style lang="scss" scoped>
  .handle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .el-button {
      margin: 0;
      margin-top: 10px;
    }
  }
</style>