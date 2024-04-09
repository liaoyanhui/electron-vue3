<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-22 14:21:16
 * @LastEditTime: 2024-02-23 11:57:58
 * @FilePath: /cbank-client/src/views/system/giftPermission/Modal/BatchDeduction.vue
-->
<template>
  <el-dialog title="批量扣款" :model-value="visible" width="388px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <el-form :model="form" :rules="rules" ref="deductionRef" label-width="100px">
      <el-form-item label="扣款金额" prop="usableAccount">
        <el-input type="numbber" v-model="form.usableAccount" placeholder="请输入">
          <template #append>
            <div>元</div>
          </template>
        </el-input>
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
  import { batchDeductions } from '@/api/gift';
  import { fenToYuan, yuanTofen } from '@/utils'

  const { proxy } = getCurrentInstance();
  const props = defineProps({
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
    dataSource: {
      type: Array,
      require: true,
      default: null
    }
  })
  
  const data = reactive({
    form: {
      usableAccount: 0,
    },
    rules: {
      usableAccount: [{ required: true, message: "不能为空", trigger: "blur" }],
    }
  });
  const emit = defineEmits([ 'cancel', 'success']);
  const { visible, dataSource } = toRefs(props);
  const { form, rules } = toRefs(data);

  function handleBeforeClose() {
    emit('cancel');
  }
  function submitForm() {
    proxy.$refs["deductionRef"].validate(valid => {
    if (valid) {
      if(dataSource.value) {
        const data = {
          ids: dataSource.value,
          usableAccount: yuanTofen(form.value.usableAccount)
        }
        batchDeductions(data).then(res => {
        if(res) {
          form.value = {
            usableAccount: 0
          }
          emit('success');
        }
      })
      }
      
    }
  });
  }
  function cancel() {
    emit('cancel');
  }
</script>