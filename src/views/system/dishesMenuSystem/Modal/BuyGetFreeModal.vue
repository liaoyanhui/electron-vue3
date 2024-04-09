<!--
 * @Description: 买几送几弹窗
 * @Author: 尚夏
 * @Date: 2024-02-04 14:26:53
 * @LastEditTime: 2024-02-27 10:28:04
 * @FilePath: /cbank-client/src/views/system/dishesMenuSystem/Modal/BuyGetFreeModal.vue
-->
<template>
  <el-dialog :title="title" :model-value="visible" width="1000px" 
    destroy-on-close :before-close="handleBeforeClose"
    lock-scroll>
    <el-form ref="buyGetFreeRef" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="6">
           <el-form-item label="活动菜品:" prop="buyDishInfoId">
             <span>{{ currentItem.activityItem && currentItem.activityItem.name }}</span>
            </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="落单数量" prop="buyDishInfoCount">
            <el-input v-model.number="form.buyDishInfoCount" placeholder="请输入" >
              <template #append>{{ currentItem.activityItem && currentItem.activityItem.dishUnitName}}</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :push="1">
          <el-form-item label="赠送菜品:" prop="giftDishInfoId">
            <span>{{ currentItem.freeItem && currentItem.freeItem.name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="落单数量" prop="giftDishInfoCount">
            <el-input v-model.number="form.giftDishInfoCount" placeholder="请输入">
              <template #append>{{ currentItem.freeItem && currentItem.freeItem.dishUnitName}}</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="是否开启" prop="status" label-width="80px">
            <el-switch v-model="form.status" />
            <span class="color-999 ml-6">默认开启</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider />
    <div style="height: 46vh">
      <el-scrollbar>
        <div class="pr-8">
          <div class="mr-8 mb-8">
            <el-input v-model="queryParams.name" clearable placeholder="请输入品名或拼音" class="mr-8" style="width: 180px"/>
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
          <el-table :data="dishList" class="ml10" ref="tableRef">
            <el-table-column label="品名" align="center" key="name" prop="name" :show-overflow-tooltip="true" />
            <el-table-column label="分类" align="center" key="dishTypeName" prop="dishTypeName" :show-overflow-tooltip="true" />
            <el-table-column label="售价" align="center" key="mealPrice" prop="mealPrice" :show-overflow-tooltip="true" :formatter="(a,b,c,d) => c/100 " />
            <el-table-column label="单位" align="center" key="dishUnitName" prop="dishUnitName" :show-overflow-tooltip="true" />
            <!-- <el-table-column label="默认出品部门" align="center" key="departmentName" prop="departmentName" :show-overflow-tooltip="true" /> -->
            <el-table-column label="操作" align="center" width="230px">
              <template #default="scope">
                <el-button 
                  type="warning" @click="handleSetActivity(scope.row)" 
                  :disabled="scope.row.id == currentItem.activityItem?.id"
                  size="small">
                  设为活动菜品
                </el-button>
                <el-button 
                  type="primary" @click="handleSetFree(scope.row)" size="small"
                  :disabled="scope.row.id == currentItem.freeItem?.id">
                  设为赠送菜品
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageRow" @pagination="getList" />
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
  import useProduceStore from '@/store/produce';
  import useLoading from '@/hooks/loading';
  import { sendActivityEdit } from '@/api/system/produce-system';
  import { getDishInfo } from '@/api/system/produce-system';
  
  const { proxy } = getCurrentInstance();
  const produceStore = useProduceStore();
  const emit = defineEmits([ 'cancel', 'success']);
  const title = ref('新增买一送一');
  const total = ref(0);
  const props = defineProps({
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
    dataSource: {
      type: Object,
      default: null,
    },
  })

  const data = reactive({
    form: {
      buyDishInfoCount: undefined,
      giftDishInfoCount: undefined,
      status: true,
    },
    queryParams: {
      pageNum: 1,
      pageRow: 10,
      name: undefined,
      typeId: null,
      status: 1, // 查询菜品默认启用
    },
    rules: {
      buyDishInfoCount: [
        { required: true, message: "不能为空", trigger: "blur" },
        { validator: (rule, value, callback) => {
          if( value < 0) {
            return callback(new Error('数量不能为负数'))
          }
          callback()
        }, trigger: "blur" },
      ],
      giftDishInfoCount: [
        { required: true, message: "不能为空", trigger: "blur" },
        { validator: (rule, value, callback) => {
          if( value < 0) {
            return callback(new Error('数量不能为负数'))
          }
          callback()
        }, trigger: "blur" },
      ],
    },
    currentItem: {
      activityItem: null,
      freeItem: null
    }
  })

  const { visible, dataSource } = toRefs(props);
  const { form, rules, queryParams, currentItem }  = toRefs(data);
  const { loading, setLoading } = useLoading(false);

  const dishList = ref([]);
  const deptOptions = ref([]);

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

  function getList() {
    getDishInfo(queryParams.value).then(res => {
      if(res) {
        dishList.value = res.list;
        total.value = res.count;
      }
    })
  }

  function handleQuery() {
    queryParams.value.pageNum = 1;
    getList()
  }

  onMounted(() => {
    getDeptTree();
    getList();
  })

   watch(
    () => dataSource.value,
    val => {
      if(val) {
        form.value = {
          buyDishInfoCount: val.buyDishInfoCount,
          giftDishInfoCount: val.giftDishInfoCount,
          status: val.status == 1 ? true : false,
        };
        currentItem.value = {
          activityItem: {
            id: val.buyDishInfoId,
            name: val.buyDishInfoName,
            dishUnitName: val.buyDishInfoUnit,
          },
          freeItem: {
            id: val.giftDishInfoId,
            name: val.giftDishInfoName,
            dishUnitName: val.giftDishInfoUnit,
          }
        }
        title.value = '编辑买一送一';
      }
    },
    { deep: true, immediate: true }
  )


  function handleSetActivity(item) {
    currentItem.value.activityItem = item;
  }
  function handleSetFree(item) {
    currentItem.value.freeItem = item;
  }

  function handleBeforeClose() {
    emit('cancel');
    form.value = {
      buyDishInfoCount: undefined,
      giftDishInfoCount: undefined,
      status: true,
    };
    currentItem.value =  {
      activityItem: null,
      freeItem: null
    }
  }
  function cancel() {
    emit('cancel');
    form.value = {
      buyDishInfoCount: undefined,
      giftDishInfoCount: undefined,
      status: true,
    };
    currentItem.value =  {
      activityItem: null,
      freeItem: null
    }
  }

  function submitForm() {
    if(!currentItem.value.activityItem || !currentItem.value.freeItem) {
      proxy.$modal.msgWarning("请选择菜品");
      return;
    }
    proxy.$refs["buyGetFreeRef"].validate(valid => {
      if (valid) {
        const d = unref(form);
        const data = {
          buyDishInfoCount: d.buyDishInfoCount,
          giftDishInfoCount: d.giftDishInfoCount,
          status: d.status ? 1 : 0,
          buyDishInfoId: currentItem.value.activityItem.id,
          giftDishInfoId: currentItem.value.freeItem.id,
        }
        if (dataSource.value) {
          data.id = dataSource.value.id;
        }
        sendActivityEdit(data).then(res => {
          if(res) {
            emit('success');
            form.value = {
              buyDishInfoCount: undefined,
              giftDishInfoCount: undefined,
              status: true,
            };
            currentItem.value =  {
              activityItem: null,
              freeItem: null
            }
          }
        })
    }})
  }
  
  
</script>
