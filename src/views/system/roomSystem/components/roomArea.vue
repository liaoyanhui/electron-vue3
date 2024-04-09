<template>
    <el-row :gutter="15"  class="m-8">
      <el-col :span="1.5"  class="color-fff fs-14">房台区域:</el-col>
      <el-col :span="20">
        <el-tag v-for="typeItem in roomSystemAreaMap" :key="typeItem.areaName"  @close="handleDelete(typeItem)" class="mr-10" closable
          >
          {{ typeItem.areaName }}
        </el-tag>
        <el-button class="button-new-tag ml-1" size="small"  @click="handleAdd">
          + 新增区域
        </el-button>
      </el-col>
    </el-row>
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="configRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="区域名称" prop="areaName">
          <el-input v-model="form.areaName" placeholder="请输入区域名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
</template>

<script setup name="Config">
import { addCompanyArea, updateCompanyArea } from "@/api/system/room-system";
import {useRoomSystemStore} from '@/store/system'
const roomSystemStore = useRoomSystemStore()
const { proxy } = getCurrentInstance();
const open = ref(false);
const loading = ref(true);
const title = ref("");
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    areaName: undefined,
    status: ' '
  },
  rules: {
    areaName: [{ required: true, message: "区域名称不能为空", trigger: "blur" }],
  }
});

const { queryParams, form, rules } = toRefs(data);

const roomSystemAreaMap = computed(() => roomSystemStore.roomSystemAreaMap)
/** 查询参数列表 */
function getList() {
  loading.value = true;
  roomSystemStore.ajaxRoomSystemAreaMap(queryParams.value).then(res => {
    loading.value = false;
  })
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
    areaName: undefined,
  };
  proxy.resetForm("configRef");
}


/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加区域";
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["configRef"].validate(valid => {
    if (valid) {
      if (form.value.id != undefined) {
        updateCompanyArea(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCompanyArea(form.value).then(response => {
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
  const id = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除？').then(function () {
    return updateCompanyArea({
      id,
      isDelete: 1,
    });
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}
// getList();
</script>
