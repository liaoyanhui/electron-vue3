<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-20 21:20:08
 * @LastEditTime: 2024-02-20 21:45:21
 * @FilePath: /cbank-client/src/views/memberManagement/memberInfo/memberCardInformation/Modal/TurnCard.vue
-->

<template>
  <el-dialog title="转卡" :model-value="visible" width="790px" 
    destroy-on-close :before-close="handleBeforeClose"
    lock-scroll>
    <el-row>
      <el-col :span="10" class="bor">
        <div class="fw-500 mb-12">
          转出卡
        </div>
        <div class="out-card">
          <span>手机号：15223645124</span>
          <span>会员卡号：202402051751</span>
          <span>昵称：小溪</span>
          <span>充值余额：¥2000</span>
          <span>赠送余额：¥2000</span>
        </div>
      </el-col>
      <el-col :span="4"  class="exchange">
        <div>
         <img src="../../../../../assets/img/exchange.png" alt=""  width="50px" height="50px">
        </div>
      </el-col>
      <el-col :span="10" class="bor">
        <div class="fw-500 mb-12">转入卡</div>
        <el-form ref="turnRef" :model="form" :rules="rules" label-width="80px" label-position="left">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="会员卡">
            <el-select
              v-model="form.card"
              class="m-2"
              placeholder="请选择"
              multiple
            >
              <el-option
                v-for="item in cardList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="会员卡号">
            <span>12</span>
          </el-form-item>
          <el-form-item label="昵称">
            <span>12</span>
          </el-form-item>
          <el-form-item label="充值余额">
            <span>12</span>
          </el-form-item>
          <el-form-item label="赠送余额">
            <span>12</span>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    
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

  const cardList = ref([]);
  const props = defineProps({
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
  })
  const data = reactive({
    form: {
      phone: '',
      card: undefined,
    },
    rules: {
      phone: [{ required: true, message: "不能为空", trigger: "blur" }],
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
    proxy.$refs["turnRef"].validate(valid => {
    if (valid) {

    }})
  }
</script>


<style lang="scss" scoped>
  .tip {
    color: #ADADAD;
    font-size: 13px;
  }
  .exchange {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .bor {
    border-radius: 10px;
    border: 1px solid #ADADAD;
    padding: 24px;
  }
  .out-card {
    display: flex;
    flex-direction: column;
    > span {
      margin-bottom: 20px;
    }
  }
</style>