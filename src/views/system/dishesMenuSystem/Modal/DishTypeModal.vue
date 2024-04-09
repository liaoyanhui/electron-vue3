<!--
 * @Description: 新增/编辑 菜品分类
 * @Author: 尚夏
 * @Date: 2024-01-24 11:00:17
 * @LastEditTime: 2024-02-21 14:39:31
 * @FilePath: /cbank-client/src/views/system/dishesMenuSystem/Modal/DishTypeModal.vue
-->

<template>
  <el-dialog :title="title" :model-value="visible" width="350px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <el-form ref="dishTypeRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="上级分类" prop="parentType">
        <el-tree-select
          :disabled="dataSource ? true : false"
          v-model="form.parentId"
          :data="dishTypeList"
          :render-after-expand="false"
          check-strictly
          placeholder="请选择上级分类"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="分类名称" prop="typeName">
        <el-input v-model="form.typeName" placeholder="请输入分类名称" />
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

<script setup>
import { reactive, toRefs, unref, watchEffect, watch } from "vue";
import { updateDishType } from '@/api/system/produce-system';
import useProduceStore from "@/store/produce";
const { proxy } = getCurrentInstance();
const produceStore = useProduceStore();

const props = defineProps({
  visible: {
    type: Boolean,
    require: true,
    default: false
  },
  dataSource: {
    type: Object,
    default: null,
  }
})

const data = reactive({
  form: {},
  rules: {
    typeName: [{ required: true, message: "分类不能为空", trigger: "blur" }],
  }
})

const emit = defineEmits([ 'cancel', 'success']);

const dishTypeList = ref([]);

const { visible, dataSource } = toRefs(props);
const { form, rules }  = toRefs(data);
const title = ref('新建分类');

watch(
  () => dataSource.value,
  ( val ) => {
    if(val) {
      form.value.parentId = val.parentId || null;
      form.value.typeName = val.typeName;
      title.value = '编辑分类';
    }
  },
  { deep: true, immediate: true }
)
// 获取所有分类
function fetchAllType() {
  produceStore.ajaxGetDishTypeSelect().then(res => {
    if(res) {
      dishTypeList.value = res;
    }
  })
}

watchEffect(() => {
  fetchAllType();
})
function handleBeforeClose() {
  emit('cancel');
}

function submitForm() {
  proxy.$refs["dishTypeRef"].validate(valid => {
  if (valid) {
    const data = {
      parentId: unref(form.value).parentId || 0,
      name: form.value.typeName,
    }
    if (dataSource.value) {
      data.id = dataSource.value.value;
    }
    updateDishType(data).then(res => {
      if(res) {
        emit('success');
        form.value = {};
      }
    })
  }})
 
}
function cancel() {
  emit('cancel');
  form.value = {};
}

function handleChange() {}

</script>