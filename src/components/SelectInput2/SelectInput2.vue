<template>
  <el-select-v2 v-bind="$attrs" :allow-create="allowCreate" v-model="selectVal"  :reserve-keyword="false" remote filterable
    placeholder="请输入手机号" :remote-method="handleQuery" :loading="loading" :options="options">
    <template #header>
      <slot name="header" v-if="$slots.header"> </slot>
      <el-radio-group v-model:model-value="radioVal" v-else>
        <el-radio :label="item.value" size="small" v-for="item in selectPeoPleType" :key="item.value">{{ item.label
        }}</el-radio>
      </el-radio-group>
    </template>
    <template #empty>
      <slot name="header" v-if="$slots.header"> </slot>
      <div class="px-6" v-else>
        <el-radio-group v-model:model-value="radioVal">
          <el-radio :label="item.value" size="small" v-for="item in selectPeoPleType" :key="item.value">{{ item.label
          }}</el-radio>
        </el-radio-group>
        <slot name="header"> </slot>
        <div class="py-4">暂无数据</div>
      </div>
    </template>
    <template #default="{ item }">
      <span style="margin-right: 8px">{{ item.label }}</span>
    </template>
  </el-select-v2>
</template>

<script setup>
import { getCompanyList, getOrganizationList, getUserCompanyList } from '@/api/common/common'
import { debounce } from '@/utils/index'
import { onMounted } from 'vue'
const props = defineProps({
  value: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: [String, Number],
    default: 1
  },
  label: {
    type: String,
    default: ''
  }
})

const allowCreate =ref(true)
const loading = ref(false)
const nowVal = ref('')
const emit = defineEmits()
const options = ref([])
const selectPeoPleType = ref([
  { label: "公司", value: 1 },
  { label: "部门", value: 2 },
  { label: "人员", value: 3 },
])

const selectVal = computed({
  get() {
    return props.value || ''
  },
  set(val) {
    const label = options.value.filter((item)=>item.value == val)[0]?.label || ''
    emit('update:label',label)
    emit('update:type',radioVal.value)
    emit('update:value', val)
  }
})

const radioVal = computed({
  get() {
    return props.type || 1
  },
  set(val) {
    options.value = []
    emit('update:type', val)
    emit('update:value', '')
    nextTick(() => {
      handleQuery(nowVal.value)
    })
  }
})

watch(() => props.label, (val) => {
  const value = options.value.filter((item) => item.label == val)[0]?.value  || ''
  if (val&&!value) {
    options.value = [{
      label: val,
      value: props.value
    }]
  }
})

const handleQuery =
  (val = '') => {
    loading.value = true
    console.log('val', val, radioVal.value)
    nowVal.value = val
    let func = null
    switch (radioVal.value) {
      case 1:
        func = getCompanyList
        break;
      case 2:
        func = getOrganizationList
        break;
      case 3:
        func = getUserCompanyList
        break;
    }

    func({ name: val }).then(res => {
      loading.value = false
      allowCreate.value = false
      let list = res.map((item) => {
        return {
          label: item.name,
          value: item.id
        }
      })
      options.value = list
    }).catch(() => {
      loading.value = false
    })
  }


// , 500)
</script>

<style></style>