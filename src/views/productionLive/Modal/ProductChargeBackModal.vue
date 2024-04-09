<!--
 * @Description: 退单
 * @Author: 尚夏
 * @Date: 2024-01-26 15:59:53
 * @LastEditTime: 2024-02-19 15:45:33
 * @FilePath: /cbank-client/src/views/productionLive/Modal/ProductChargeBackModal.vue
-->
<template>
  <el-dialog title="退单" :model-value="visible" width="350px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <el-form ref="backRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="点单数量" prop="dishInfoCount">
        <span>{{ dataSource.dishInfoCount }} {{ dataSource.dishUnitName }}</span>
      </el-form-item>
      <el-form-item label="退单数量" prop="backCount">
        <el-input v-model="form.backCount" placeholder="请输入退单数量" style="width: 100px"/>
        <span>{{ dataSource.dishUnitName }}</span>
      </el-form-item>
    </el-form>
    <div class="tip"> *退单数量不可大于该记录的点单数量 </div>
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
import { productChargeback } from '@/api/product';
const { proxy } = getCurrentInstance();

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
    backCount: undefined,
  },
  rules: {
    backCount: [{ required: true, message: "数据不能为空", trigger: "blur" }],
  }
})

const backRef = ref(null);
const emit = defineEmits([ 'cancel', 'success']);

const { visible, dataSource } = toRefs(props);
const { form, rules }  = toRefs(data);


watchEffect(() => {
})

function handleBeforeClose() {
  emit('cancel');
}

async function submitForm() {
  if (!backRef.value) return;
  await backRef.value.validate((valid, fields) => {
     if(valid) {
      let count = form.value.backCount;
      if(count > dataSource.value.dishInfoCount) {
        proxy.$modal.msgWarning('退单数量不可大于点单数量');
        return;
      }
      const data = {
        recordId: dataSource.value.id,
        chargebackCount: count,
      };
      productChargeback(data).then(res => {
        if(res) {
          emit('success');
          form.value = {};
        }
      })
     }
  })
}
function cancel() {
  emit('cancel');
  form.value = {};
}

</script>

<style lang="scss" scoped>
 .tip {
  color: red;
 }
</style>