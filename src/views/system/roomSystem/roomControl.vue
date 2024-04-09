<template>
  <div class="app-container overflow">
    <room-area-view></room-area-view>
    <room-type-view></room-type-view>
    <el-row class="my-20">
      <el-col :span="1.5">
        <el-button type="primary" icon="Plus" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col class="ml-20" :span="15">
        <el-input v-model.trim="queryParams.name" placeholder="请输入房台名称" clearable style="width: 240px"
              @change="handleQuery" />
      </el-col>
    </el-row>

    <div class="roomList flex-1 over-scorll-y">
      <RoomItem :item="roomItem" v-for="(roomItem, index) in roomList" :key="roomItem.id" :index="index + 1"
        @update:edit='handleUpdate' @update:delete="handleDelete" @update:status="handleStatusChange"></RoomItem>
    </div>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" v-model="open" width="550px" append-to-body>
      <el-form ref="configRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="房台名称" prop="name">
          <el-input v-model="form.name" :disabled="form.isThirdRoom == 1"  placeholder="请输入房台名称" maxlength="10" />
        </el-form-item>

        <el-form-item label="显示排序" prop="orderNum">
          <el-input-number v-model="form.sort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="房台类型" prop="roomTypeId">
          <el-select v-model="form.roomTypeId" placeholder="房台类型" style="width: 200px">
            <el-option v-for="item in roomSystemTypeMap" :key="item.id" :label="item.typeName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="房台区域" prop="areaId">
          <el-select v-model="form.areaId" placeholder="房台区域" style="width: 200px">
            <el-option v-for="item in roomSystemAreaMap" :key="item.id" :label="item.areaName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="房台价格" prop="price" style="width: 300px">
          <span>￥</span><el-input-number style="width: 160px;" v-model="form.price" placeholder="请输入房台价格" :precision="0" :min="0"
            :step="1" controls-position="right" :controls="false" />
        </el-form-item>
        <el-form-item label="房台低消" prop="minConsumption" style="width: 300px">
          <span>￥</span><el-input-number style="width: 160px" v-model="form.minConsumption" placeholder="请输入房台低消"
            :precision="0" :step="1" :min="0" controls-position="right" :controls="false" />
        </el-form-item>
        <el-form-item label="开台套餐" prop="packageId" v-if="form.roomTypeId">
          <el-select v-model="form.packageId" placeholder="房台类型" style="width: 200px">
            <el-option v-for="item in openPlatformPackageList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer d-flex jc-between">
          <div> <el-checkbox v-if="!form.id" v-model="isContinuous" label="连续新建" size="large" /></div>
          <div>
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>

          </div>

        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Config">
import roomTypeView from './components/roomType'
import roomAreaView from './components/roomArea'
import RoomItem from './components/roomItem'
import { companyRoomSimplifyList, addCompanyRoom, updateCompanyRoom } from "@/api/system/room-system";
import { useRoomSystemStore } from '@/store/system/index'
import { fenToYuan, yuanTofen } from '@/utils'
import { useDishesSystemStore } from '@/store/system'
const dishesSystemSote = useDishesSystemStore()
import { nextTick, watchEffect } from 'vue';
const roomSystemStore = useRoomSystemStore()
const { proxy } = getCurrentInstance();
const roomList = ref([]);
const open = ref(false);
const loading = ref(true);
const ids = ref([]);
const total = ref(0);
const title = ref("");
const isContinuous = ref(false)
const openPlatformPackageList = ref([])
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    typeName: undefined,
    status: ' ',

  },
  rules: {
    name: [{ required: true, message: "房台不能为空", trigger: "blur" }],
    areaId: [{ required: true, message: "请选择房台区域", trigger: "change" }],
    roomTypeId: [{ required: true, message: "请选择房台类型", trigger: "change" }],
    minConsumption: [{ required: true, message: "请输入最低消费", trigger: "blur" }],
    price: [{ required: true, message: "请输入房台价格", trigger: "blur" }],
    packageId: [{ required: true, message: "请选择房台套餐", trigger: "change" }]
  }
});

const { queryParams, form, rules } = toRefs(data);

const roomSystemTypeMap = computed(() => roomSystemStore.roomSystemTypeMap)
const roomSystemAreaMap = computed(() => roomSystemStore.roomSystemAreaMap)
/** 查询参数列表 */
function getList() {
  loading.value = true;
  let params = {
    ...queryParams.value
  }
  companyRoomSimplifyList(params).then(result => {
    roomList.value = result;
    total.value = result.length;
    loading.value = false;
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
    typeName: undefined,
    isThirdRoom:0
  };
  proxy.resetForm("configRef");
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}


/** 新增按钮操作 */
function handleAdd() {
  reset();
  form.value.sort = total.value
  open.value = true;
  
  title.value = "创建房台";
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  let { minConsumption, price, areaId, roomTypeId } = row
  form.value = {
    ...row,
    minConsumption: fenToYuan(minConsumption, 0) / 1,
    price: fenToYuan(price, 0) / 1,
    areaId: areaId || null,
    roomTypeId: roomTypeId|| null
  }

  open.value = true;
  title.value = "修改房台";
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["configRef"].validate(valid => {
    if (valid) {
      let { minConsumption, price } = form.value
      let params = {
        ...form.value,
        minConsumption: yuanTofen(minConsumption),
        price: yuanTofen(price)
      }
      if (form.value.id != undefined) {
        updateCompanyRoom(params).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          getList();
          open.value = false;
        });
      } else {
        addCompanyRoom(params).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          getList();
          if (isContinuous.value) {
            reset();
            nextTick(() => {
              form.value.sort = total.value
            })
          } else {
            open.value = false;
          }
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  console.log('ropw', row)
  const id = row.id || ids.value;
  proxy.$modal.confirm(`是否确认删除房台${row.name}？`).then(function () {
    return updateCompanyRoom({
      id,
      isDelete: 1,
    });
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 用户状态修改  */
function handleStatusChange(row) {
  let text = row.status === 0 ? "停用" : "启用";
  let status = row.status === 0 ? 1 : 0
  let params = {
    id: row.id,
    status: status
  }
  updateCompanyRoom(params).then(() => {
    proxy.$modal.msgSuccess(text + "成功");
    getList();
  })
};

watchEffect(() => {
  let { roomTypeId } = form.value
  if (roomTypeId) {
    dishesSystemSote.getOpenRoomPackageList({ roomType: roomTypeId }).then(res => {
      openPlatformPackageList.value = res
      let packageId = form.value.packageId
      if (res.length > 0) {
        if (packageId) {
          form.value.packageId = res.filter(item => item.id == packageId)[0]?.id ? packageId : res[0].id
        } else {
          form.value.packageId = res[0].id
        }
      }

    })
  }
  return {}
})




onMounted(() => {
  getList();
  roomSystemStore.ajaxRoomSystemTypeMap()
  roomSystemStore.ajaxRoomSystemAreaMap()
})
</script>
<style scoped lang="scss">
.roomList {
  width: 100%;
  display: flex;
  align-items: start;
  flex-wrap: wrap;
}
</style>