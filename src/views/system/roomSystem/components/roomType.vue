<template>
   <el-row :gutter="15" class="m-10">
      <el-col :span="1.5" class="color-fff fs-14">房台类型:</el-col>
        <el-col :span="20">
         <el-tag
            v-for="typeItem in roomSystemTypeMap"
            :key="typeItem.typeName"
            @close="handleDelete(typeItem)"
            class="mr-10"
            closable
           
         >
            {{ typeItem.typeName}}
         </el-tag>
         <el-button class="button-new-tag ml-1" size="small" @click="handleAdd">
          + 新增类型
        </el-button>
         </el-col>
      </el-row>
   
     <el-dialog :title="title" v-model="open" width="500px" append-to-body>
        <el-form ref="configRef" :model="form" :rules="rules" label-width="80px">
           <el-form-item label="房台类型" prop="typeName">
              <el-input v-model="form.typeName" placeholder="请输入房台类型" />
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

import { getCompanyRoomTypeList,addCompanyRoomType,updateCompanyRoomTypeList } from "@/api/system/room-system";
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
   typeName: undefined,
   status:' '
 },
 rules: {
  typeName: [{ required: true, message: "参数名称不能为空", trigger: "blur" }],
 }
});

const { queryParams, form, rules } = toRefs(data);


const roomSystemTypeMap = computed(() => roomSystemStore.roomSystemTypeMap)

/** 查询参数列表 */
function getList() {
  loading.value = true;
   roomSystemStore.ajaxRoomSystemTypeMap(queryParams.value).then(() => {
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
   typeName: undefined,
 };
 proxy.resetForm("configRef");
}


/** 新增按钮操作 */
function handleAdd() {
 reset();
 open.value = true;
 title.value = "添加房台类型";
}

/** 提交按钮 */
function submitForm() {
 proxy.$refs["configRef"].validate(valid => {
   if (valid) {
     if (form.value.id != undefined) {
      updateCompanyRoomTypeList(form.value).then(response => {
         proxy.$modal.msgSuccess("修改成功");
         open.value = false;
         getList();
       });
     } else {
      addCompanyRoomType(form.value).then(response => {
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
   return updateCompanyRoomTypeList({
     id,
     isDelete: 1,
   });
 }).then(() => {
   getList();
   proxy.$modal.msgSuccess("删除成功");
 }).catch(() => {});
}
// getList();
</script>
