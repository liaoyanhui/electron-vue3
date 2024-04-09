<!--
 * @Description: 
 * @Author: pgm
 * @Date: 2024-02-04 15:30:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-11 22:56:03
 * @FilePath: /cbank-client/src/views/dishes/components/orderList.vue
-->
<template>
  <el-table :data="productList" class="border-l border-r" height='100%'>
    <el-table-column label="下单时间" align="center" min-width="110" :formatter="formatDate" />
    <el-table-column label="菜品名称" align="center" min-width="110">
      <template #default="scope">
        <div class="d-flex al-center product-item">
          <div class="d-flex flex-column ml-4">
            <div>{{ scope.row.goodsName }}</div>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="口味" align="center" prop="goodsTasteName" min-width="80" />
    <el-table-column label="数量" align="center" prop="goodsNumber" min-width="90" />
    <el-table-column label="单位" align="center" prop="goodsUnit" min-width="50" />
    <el-table-column label="操作" align="center" key="remarks" prop="remarks" min-width="80">
      <template #default="scope">
        <el-button v-if="isCanOrder(scope.row)" @click="addCart(scope.row)" type="primary" class="py-6" >再来一单</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import dayjs from 'dayjs'
import { getPackageList } from '@/api/cbank'
import { computed, onMounted } from 'vue';
const props = defineProps({
  roomId: {
    type: [String, Number],
    required: true
  },
  sendUserGiftId: {
    type: [Number, String],
    default: null
  }
})

const emit = defineEmits(['addShopCart']);
const productList = ref([])
const isCanOrder = computed(()=>(row)=>{
  if (row.goodsId == 0) {
    return false
  }
  if (row.giveUserId) {
    return row.giveUserId == props.sendUserGiftId
  } else {
    return true
  }

})
const formatDate = (row) => {
  return dayjs(row.addTime).format('HH:mm')
}

const getOrderList = () => {
  let roomId = props.roomId
  getPackageList({ roomId }).then(res => {
    productList.value = res
  })
}

const addCart = (row) => {
  let { goodsId: id,  type } = row
  let params = { id,type }
  emit('addShopCart', params)
}

getOrderList()






</script>

<style scoped lang="scss">
.custom-select:deep(.el-select__wrapper) {
  background-color: #2ad1b7;

  .el-select__placeholder,
  .el-select__icon {
    color: #fff
  }
}
</style>