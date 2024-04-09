<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-03-07 21:20:18
 * @LastEditTime: 2024-03-07 21:20:19
 * @FilePath: /cbank-client/src/views/memberManagement/memberInfo/memberInformation/Modal/CardInfoModal copy.vue
-->
<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-19 16:07:18
 * @LastEditTime: 2024-02-21 11:43:59
 * @FilePath: /cbank-client/src/views/memberManagement/memberInfo/memberInformation/Modal/CardInfoModal.vue
-->

<template>
  <el-dialog title="会员卡信息" :model-value="visible" width="480px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <ul class="card">
      <li class="mb-20">
        <div class="fw-500">卡号：V01022402041521</div>
        <div>
          <span>充值金额：¥2000</span>
          <span>赠送金额：¥1000</span>
        </div>
      </li>
      <li class="mb-20">
        <div class="fw-500">卡号：V01022402041521</div>
        <div>
          <span>充值金额：¥2000</span>
          <span>赠送金额：¥1000</span>
        </div>
      </li>
    </ul>
  </el-dialog>
</template>

<script setup>
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
    },
  })

  const data = reactive({
    form: {
     
    },
  })

  const emit = defineEmits([ 'cancel' ]);

  const { visible, dataSource } = toRefs(props);
  const { form } = toRefs(data);

  function handleBeforeClose() {
    emit('cancel');
    form.value = {};
  }

  function cancel() {
    emit('cancel');
    form.value = {};
  }
</script>

<style lang="scss" scoped>
  .card {
    li {
      width: 431px;
      height: 108px;
      border-radius: 10px;
      border: 1px solid #D9D9D9;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 24px;
      > div {
        display: flex;
        justify-content: space-between;
        margin: 11px 0;
      }
    }
  }
</style>