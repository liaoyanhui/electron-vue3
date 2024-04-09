<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-20 20:41:41
 * @LastEditTime: 2024-02-20 21:13:13
 * @FilePath: /cbank-client/src/views/memberManagement/memberInfo/memberCardInformation/Modal/MakingCard.vue
-->
<template>
  <el-dialog title="制卡" :model-value="visible" width="504px" 
    destroy-on-close :before-close="handleBeforeClose"
    lock-scroll>
    <el-form ref="makingRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="会员卡号">
        <span>123123</span>
      </el-form-item>
      <el-form-item label="会员卡ID" prop="cardId">
        <el-input v-model="form.cardId" placeholder="请输入(读卡器读取)" />
        <div class="tip">实体会员卡的ID，若无实体卡，则无需填写</div>
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
  const { proxy } = getCurrentInstance();
  const emit = defineEmits([ 'cancel', 'success']);

  const props = defineProps({
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
  })
  const data = reactive({
    form: {
      cardId: '',
    },
    rules: {
      cardId: [{ required: true, message: "不能为空", trigger: "blur" }],
    }
  })
  const { visible } = toRefs(props);
  const { form, rules }  = toRefs(data);

  function handleBeforeClose() {
    emit('cancel');
    form.value = {};
  }

  function cancel() {
    emit('cancel');
  }

  function submitForm() {
    proxy.$refs["makingRef"].validate(valid => {
    if (valid) {

    }})
  }
</script>


<style lang="scss" scoped>
  .tip {
    color: #ADADAD;
    font-size: 13px;
  }
</style>