<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-06 13:43:40
 * @LastEditTime: 2024-03-07 18:11:57
 * @FilePath: /cbank-client/src/components/SelectPeople/SelectPeople.vue
-->
<!-- 下拉选择人员组件 -->
<template>
  <el-select-v2 ref="selectPeopleRef" v-bind="$attrs" :allow-create="allowCreate" v-model="selectVal"
    :reserve-keyword="false" remote filterable placeholder="请输入" :remote-method="handleQuery" :loading="loading"
    :options="options" @visible-change="changeHandle" clearable placement="bottom-start">
    <!-- TODO 数据列表为空加提示 -->

    <template #default="{ item }">
      <span style="margin-right: 8px">{{ item.label }}</span>
    </template>
  </el-select-v2>
</template>

<script setup>
import { onMounted } from "vue";
import { getJson } from '@/utils/getAllComponentData';
const { proxy } = getCurrentInstance();
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
  },
  // 分类筛选
  typeFilter: {
    type: Array,
    default: []
  }
})

const allowCreate = ref(true)
const loading = ref(false)
const emit = defineEmits()
const options = ref([])
const selectPeopleRef = ref(null)
const dictData = ref([])
const selectVal = computed({
  get() {
    return props.value || ''
  },
  set(val) {
    const { label = '', type = '' } = val ? options.value.filter(item => item.value == val)[0] : { label: '', type: '' }
    emit('update:label', label)
    emit('update:value', val)
    emit('update:type', type)
  }
})

watch(
  () => props.label,
  val => {
    const value = options.value.filter(item => item.label == val)[0]?.value || ''
    if (val && !value) {
      options.value = [
        {
          label: val,
          value: props.value,
          type: props.type
        }
      ]
    }
  }
)

const changeHandle = (visible) => {
  if (!visible) {
    setTimeout(() => {
      proxy.$refs['selectPeopleRef'].blur()
    }, 0)
  }
}

onMounted(async () => {
  if (window.storeAPI) {
    dictData.value = window.storeAPI.getDict()
  } else {
    let a = await getJson()
    dictData.value = { data: a }
  }
})


const handleQuery = async (val = '') => {
  loading.value = true
  const { data = [] } = dictData.value;
  let list = []
  data.forEach(i => {
    if (i.name.indexOf(val) >= 0 || i.sw.indexOf(val.toLowerCase()) >= 0) {
      if(props.typeFilter.length > 0) {
        if(props.typeFilter.indexOf(i.type) >= 0) {
          list.push({ label: i.name, value: i.id, type: i.type })
        }
      } else {
        list.push({ label: i.name, value: i.id, type: i.type })
      }
    }
  })
  options.value = list
  loading.value = false
  allowCreate.value = false
}
</script>
