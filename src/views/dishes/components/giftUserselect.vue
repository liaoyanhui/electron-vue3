<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-06 13:43:40
 * @LastEditTime: 2024-02-23 02:07:30
 * @FilePath: /cbank-client/src/views/dishes/components/giftUserselect.vue
-->
<!-- 下拉选择人员组件 -->
<template>
  <el-select ref="gitUserSelectRef" v-bind="$attrs" :reserve-keyword="false" filterable remote placeholder="请输入"
    :remote-method="handleQuery" remote-show-suffix :loading="loading" :options="options" placement="bottom-start"
    @visible-change="changeHandle">
    <el-option v-for="item in options" :key="item.id" :label="item.nickname" :value="item.id" />
  </el-select>
</template>

<script setup>

const { proxy } = getCurrentInstance();
const props = defineProps({
  value: {
    type: [String, Number],
    default: ''
  },

  peoplelist: {
    type: Array,
    default: []
  }
})
const gitUserSelectRef = ref()
const loading = ref(false)
const options = ref(props.peoplelist)
const changeHandle = (visible) => {
  if (!visible) {
    setTimeout(() => {
      proxy.$refs['gitUserSelectRef'].blur()
    }, 0)
  }
}

const handleQuery = async (val = '') => {
  const data = props.peoplelist
  let list = []
  data.forEach(i => {
    if (i.nickname.indexOf(val) >= 0 || i.sw.indexOf(val.toLowerCase()) >= 0) {
      list.push(i)
    }
  })
  options.value = list
}
</script>
