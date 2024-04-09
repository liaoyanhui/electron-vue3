<!--
 * @Description: 
 * @Author: pgm
 * @Date: 2024-02-07 14:05:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-11 22:48:23
 * @FilePath: /cbank-client/src/components/EditPeopleInput/index.vue
-->
<template>
  <div class="inline-flex al-center" v-loading="loading">
    <div v-show="edit">
      <el-select ref="inputRef" style="width: 100px" v-model="inputValue" :reserve-keyword="false" filterable remote
        placeholder="请输入" :remote-method="handleQuery" automatic-dropdown remote-show-suffix :loading="loading" :options="options"
        placement="bottom-start" @visible-change="changeHandle" >
        <el-option v-for="item in options" :key="item[key]" :label="item[label]" :value="item[key]" />
      </el-select>
    </div>
    <span v-show="!edit">{{ showText }} </span>
    <span v-show="!edit" class="edit d-line ml-8" @click="editHandler"></span>
  </div>
</template>

<script setup>
const { proxy } = getCurrentInstance();
import { getJson } from '@/utils/getAllComponentData';
const props = defineProps({
  value: {
    type: Number,
    default: ''
  },
  isValidator: {
    type: Boolean,
    default: false
  },
  filterType: {
    type: Array,
    default:[]
  },
  key: {
    type: String,
    default: 'id'
  },
  label: {
    type: String,
    default: 'name'
  }
})

const emit = defineEmits([
  'update:value',
  "validator"
])
const inputRef = ref();
const loading = ref(false)
const edit = ref(false)
const inputValue = ref(props.value)
const dictData = ref({data:[]})
const editHandler = () => {
  edit.value = true
  setTimeout(() => {
    inputRef.value.focus()
    // proxy.$refs['inputRef'].focus()
    // handleQuery('')
  },0)

};

const options = ref([])
const showText = computed(() => {
  const objs = dictData.value.data.find(item => {
    return item[props.key] == props.value
  })
  console.log('objs',objs)
  if (objs) {
    return objs[props.label]
  } else {
    return ''
  }
})

//下拉框展示隐藏事件
const changeHandle = (visible) => {
  if (!visible) {
    setTimeout(() => {
      inputRef.value.blur()
      blurHandler()
    }, 0)
  }
}

const handleQuery = async (val = '') => {
  const data = dictData.value.data
  let list = []
  data.forEach(i => {
    if (i.name.indexOf(val) >= 0 || i.sw.indexOf(val.toLowerCase()) >= 0) {
      list.push(i)
    }
  })
  options.value = list
}

const blurHandler = () => {
  if (props.isValidator) {
    loading.value = true
    emit("validator", {
      data: inputValue.value, fn: (result) => {
        if (result) {
          edit.value = false
        }
        loading.value = false
      }
    })
  } else {
    edit.value = false
    emit('update:value', inputValue.value)
  }
}

onMounted(async () => {
  let data1 ={} ,resultData =[]
  if (window.storeAPI) {
    data1 = window.storeAPI.getDict()
  } else {
    let a = await getJson()
    data1 = {data:a }
  }
  if (props.filterType.length > 0) {
    resultData= data1.data.filter(item =>props.filterType.includes(item.type))
  } else {
    resultData = data1.data
  }
  dictData.value = {data:resultData}
  options.value = resultData

  
})

</script>

<style scoped>
.edit {
  background: url('@/assets/img/edit-icon.png')no-repeat center center /100%;
  width: 16px;
  height: 16px;
}
</style>