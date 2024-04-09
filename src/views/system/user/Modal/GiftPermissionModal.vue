<!--
 * @Description: 赠送权限
 * @Author: 尚夏
 * @Date: 2024-02-22 10:01:09
 * @LastEditTime: 2024-03-11 17:58:18
 * @FilePath: /cbank-client/src/views/system/user/Modal/GiftPermissionModal.vue
-->
<template>
  <el-dialog title="批量授予赠送权限" :model-value="visible" width="388px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <el-form :model="form" :rules="rules" ref="priceRef" label-width="100px">
      <el-form-item label="初始金额" prop="initialAccount">
        <el-input-number v-model="form.initialAccount" placeholder="请输入金额" style="width: 100px" 
          :precision="0"  :step="1" :min="1" :max="9999999" controls-position="right" :controls="false" />
        <!-- <el-input v-model="form.initialAccount" placeholder="请输入初始金额"></el-input> -->
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
  import { batchBindUserGift } from '@/api/gift';
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
      initialAccount: 0,
    },
    rules: {
      initialAccount: [{ required: true, message: "不能为空", trigger: "blur" }],
    }
  });
  const emit = defineEmits([ 'cancel', 'success']);
  const { visible, dataSource } = toRefs(props);
  const { form, rules } = toRefs(data);

  function handleBeforeClose() {
    emit('cancel');
  }
  function submitForm() {
    proxy.$refs["priceRef"].validate(valid => {
    if (valid) {
      const data = {
        initialAccount: yuanTofen(form.value.initialAccount),
        userIds: dataSource.value,
      }
      batchBindUserGift(data).then(res => {
        if(res) {
          form.value = {
            initialAccount: 0
          }
          proxy.$modal.msgSuccess("修改成功");
          emit('success');
        }
      })
    }
  });
  }
  function cancel() {
    emit('cancel');
  }
</script>
