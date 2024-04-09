<!--
 * @Description: 批量发设置默认出品部门
 * @Author: 尚夏
 * @Date: 2024-01-25 11:23:23
 * @LastEditTime: 2024-01-25 12:00:13
 * @FilePath: /cbank-client/src/views/system/dishesMenuSystem/Modal/SetDepartmentModal.vue
-->
<template>
  <el-dialog title="批量设置出品部门" :model-value="visible" width="350px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <el-form ref="departmentRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="默认出品部门" prop="typeName">
        <el-select
          v-model="form.makeDepartmentId"
          class="m-2"
          placeholder="请选择"
        >
          <el-option
            v-for="item in departments"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
 
  import { batchBindingDepartment } from '@/api/system/produce-system'
  import useProduceStore from '@/store/produce';
  
  const emit = defineEmits([ 'cancel', 'success']);
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
    form: {
      makeDepartmentId: null,
    },
    rules: {
      makeDepartmentId: [{ required: true, message: "不能为空", trigger: "blur" }],
    }
  })

  const { visible, dataSource } = toRefs(props);
  const { form, rules }  = toRefs(data);

  const departments = ref([]);
  // 获取部门
  function getDepartmentList() {
    produceStore.ajaxProductionDepartmentList().then(res => {
      if (res) {
        const arr = res.list.map(item => {
          return {
            value: item.id,
            label: item.departmentName,
          }
        })
        departments.value = arr;
      }
    })
  }

  onMounted(() => {
    getDepartmentList();
  })

  function submitForm() {
    if (dataSource.value) {
      const data = {
        dishIds: dataSource.value.ids,
        departmentId: form.value.makeDepartmentId,
      }
      batchBindingDepartment(data).then(res => {
        if(res) {
          proxy.$modal.msgSuccess("操作成功");
          emit('success')
        }
      })
    }
  }
  function cancel() {
    emit('cancel');
  }

  function handleBeforeClose() {
    emit('cancel');
  }
</script>