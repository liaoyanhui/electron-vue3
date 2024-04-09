<!--
 * @Description: 
 * @Author: pgm
 * @Date: 2024-02-07 14:05:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-20 00:33:24
 * @FilePath: /cbank-client/src/components/EditAmountInput/index.vue
-->
<template>
  <div class="inline-flex al-center" v-loading="loading">
    <el-input-number ref="inputRef" v-show="edit" v-model="inputAmout" :max="formatMax" placeholder="请输入房台低消"
      style="width: 80px" :precision="2" :min="0" :step="0.01" controls-position="right" :controls="false"
      @blur="blurHandler" />
    <span v-show="!edit">{{ fenToYuan(value) }} </span>

    <span v-if="permissions.length>0" v-show="!edit" class="edit d-line ml-8" @click="editHandler" v-hasPermi="permissions"> </span>
    <span v-else v-show="!edit" class="edit d-line ml-8" @click="editHandler" > </span>
  </div>
</template>

<script setup>
import { fenToYuan, yuanTofen } from '@/utils'
import { computed, watchEffect, ref } from 'vue'
const attrs = useAttrs()
const props = defineProps({
  value: {
    type: [Number, String],
    default: 0
  },
  min: {
    type: [Number, String],
    default: 0
  },
  max: {
    type: [Number, String],
    default: 99999999
  },
  isValidator: {
    type: Boolean,
    default: false
  },
  permissions: {
    type: Array,
    default:[]
  }
})

const emit = defineEmits([
  'update:value',
  "validator"
])
const inputRef = ref();
const loading = ref(false)
const edit = ref(false)
const inputAmout = ref(0)
watchEffect(() => {
  inputAmout.value = fenToYuan(props.value) / 1
})
const editHandler = () => {
  edit.value = true
  const inputElement = inputRef.value;
  inputElement.focus();
};

const blurHandler = () => {
  const fen =  yuanTofen(inputAmout.value)
  if (!props.isValidator) {
    emit('update:value', fen)
    edit.value = false
  } else if (fen == props.value) {
    edit.value = false
  } else {
    loading.value = true
    emit("validator", {
      data: fen, fn: (result) => {
        if (result) {
          edit.value = false
        }
        loading.value = false
      }
    })
  }
}

const formatMax = computed(() => {
  return fenToYuan(props.max) / 1
})

</script>

<style scoped>
.edit {
  background: url('@/assets/img/edit-icon.png')no-repeat center center /100%;
  width: 16px;
  height: 16px;
}
</style>