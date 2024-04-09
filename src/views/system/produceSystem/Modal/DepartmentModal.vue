<!--
 * @Description: 新增出品部门
 * @Author: 尚夏
 * @Date: 2024-01-23 10:59:27
 * @LastEditTime: 2024-02-26 20:44:36
 * @FilePath: /cbank-client/src/views/system/produceSystem/Modal/DepartmentModal.vue
-->
<template>
  <el-dialog :title="title" :model-value="visible" width="500px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <el-form ref="departmentRef" :model="form" :rules="rules" label-width="95px">
      <el-form-item label="出品部门" prop="department">
        <el-input v-model="form.department" placeholder="请输入出品部门" />
      </el-form-item>
      <el-form-item label="打印机" prop="printId">
        <el-select
          v-model="form.printId"
          class="m-2"
          size="large"
          style="width: 240px"
          placeholder="请选择打印机"
        >
          <el-option
            v-for="item in printList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="form.remarks" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="是否启用" prop="isEnable">
        <el-switch
          :model-value="form.isEnable == 1 ? true : false"
          @change="handleChange"
          class="ml-2"
        />     
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
  import useProduceStore from '@/store/produce';
  import { computed, watchEffect, watch } from 'vue';
  const { proxy } = getCurrentInstance();

  const produceStore = useProduceStore();

  const props = defineProps({
    visible: {
      type: Boolean,
      required: true,
      default: false,
    },
    editDepartmentId: {
      type: Number,
      default: null,
    },
    departmentInfo: {
      type: Object,
      default: {}
    }
  });

  const emit = defineEmits([ 'cancel', 'success']);

  const printList = ref([]);
  watchEffect( () => {
    produceStore.ajaxGetPrintList().then(res => {
      if (res) {
        printList.value = res;
      }
    }).catch()
  })
  const data = reactive({
    form: {},
    rules: {
      department: [{ required: true, message: "不能为空", trigger: "blur" }],
      printId: [{ required: true, message: "选择打印机", trigger: "blur" }],
    }
  });

  const { form, rules } = toRefs(data);
  const { visible, editDepartmentId, departmentInfo }  = toRefs(props);

  const title = computed(
    () => {
      if (editDepartmentId.value) {
        return '编辑出品部门';
      } else {
        return '新增出品部门';
      }
    },
  )

  watch(
    () => departmentInfo.value,
    ( val ) => {
      if (val) {
        console.log(val, 'vaa')
        form.value = {
          ...val  
        }
     }
    },
    { deep: true, immediate: true }
  )

  function handleChange(val) {
    form.value.isEnable = val ? 1 : 0;
  }

  async function submitForm() {
    proxy.$refs["departmentRef"].validate(valid => {
    if (valid) {
       let data = {
          departmentName: form.value.department,
          printId: form.value.printId,
          remarks: form.value.remarks,
          status: form.value.isEnable ? 1 : 0,
        };
        if(editDepartmentId.value) {
          data.id = editDepartmentId.value;
        } 
        produceStore.ajaxUpdateProductionDepartmentEdit(data).then(res => {
          if (res) {
            form.value = {};
            emit('success');
          }
        })
    }})
  };
  function cancel() {
    form.value = {};
    emit('cancel');
  };

  function handleBeforeClose() {
    emit('cancel');
  }
</script>