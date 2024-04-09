<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-20 21:11:16
 * @LastEditTime: 2024-02-20 21:50:31
 * @FilePath: /cbank-client/src/views/memberManagement/memberInfo/memberCardInformation/Modal/ExchangeCard.vue
-->
<template>
  <el-dialog title="换卡" :model-value="visible" width="504px" 
    destroy-on-close :before-close="handleBeforeClose"
    lock-scroll>
    <el-form ref="exchangeRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="会员卡类型">
        <el-select
          v-model="form.cardType"
          class="m-2"
          placeholder="请选择"
          multiple
        >
          <el-option
            v-for="item in cardTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="会员卡号" prop="cardNum">
        <el-input v-model="form.cardNum" placeholder="选择会员卡类型并新增后，按照规则自动生成，不可填写" />
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

  const cardTypeList = ref([]);
  const props = defineProps({
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
  })
  const data = reactive({
    form: {
      cardType: undefined,
      cardNum: '',
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
    proxy.$refs["exchangeRef"].validate(valid => {
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