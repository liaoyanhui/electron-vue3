<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-23 11:46:51
 * @LastEditTime: 2024-02-23 11:48:15
 * @FilePath: /cbank-client/src/views/system/giftPermission/Modal/BatchRecharge.vue
-->
<template>
  <el-dialog title="批量充值" :model-value="visible" width="388px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <el-form :model="form" :rules="rules" ref="rechargeRef" label-width="100px">
      <el-form-item label="充值金额" prop="usableAccount">
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
  import { batchUsableAccount } from '@/api/gift';
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
    proxy.$refs["rechargeRef"].validate(valid => {
    if (valid) {
      if(dataSource.value) {
        const data = {
          ids: dataSource.value,
          usableAccount: yuanTofen(form.value.usableAccount)
        }
        batchUsableAccount(data).then(res => {
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