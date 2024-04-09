<!--
 * @Description: 
 * @Author: pgm
 * @Date: 2024-01-29 05:34:45
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-18 13:40:41
 * @FilePath: /cbank-client/src/views/system/roomSystem/components/roomItem.vue
-->
<template>
  <div class="room-item fs-14 mb-20 color-black">
    <div class="d-flex al-center jc-between pb-14">
      <div class="fs-20 fw-500 el-1">{{ item.name }}</div>
      <div :class="{'third-room': item.isThirdRoom == 1}">{{ item.sort }}</div>

    </div>
    <el-row><span :class="{'color-red': typeName === '未知'}">{{ `${typeName} `}}</span> {{`(￥ ${fenToYuan(item.minConsumption,0)})`  }}</el-row>
    <el-row class="py-2">房台费: ￥{{  fenToYuan(item.price,0) }}</el-row>
    <el-row>开台套餐: {{ item.packageName }}</el-row>
    <div class="d-flex al-center jc-between">
      <div class="d-flex al-center color-green pointer" @click="handleUpdate"> <el-icon ><Edit /></el-icon>编辑</div>
      <div v-if="item.isThirdRoom == 1" class="d-flex al-center color-gray pointer"> <el-icon ><Delete /></el-icon>删除</div>  
      <div v-else class="d-flex al-center color-green pointer" @click="handleDelete"> <el-icon ><Delete /></el-icon>删除</div>  
      <el-switch :model-value="item.status" :active-value="0" :inactive-value="1"
            :before-change="handleStatusChange"></el-switch>
    </div>
  </div>
</template>

<script setup>
import { fenToYuan} from '@/utils'
import {useRoomSystemStore} from '@/store/system'
const { proxy } = getCurrentInstance();
const emit = defineEmits([
  'update:status',
  'update:delete',
  'update:edit'
]);
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
})
const roomSystemStore = useRoomSystemStore()
//房间类型
const typeName = computed(() => {
  return roomSystemStore.roomSystemTypeMap.filter(item => item.id == props.item.roomTypeId)[0]?.typeName || '未知'
})

/** 用户状态修改  */
function handleStatusChange() {
  let row = props.item
  let text = row.status === 0 ? "停用" : "启用";
  let status = row.status === 0 ? 1 : 0
  if (props.item.roomTypeId == 0) {
    proxy.$modal.confirm('包厢"' + row.name + '"需要编辑后才可以启用!').then(function () { 
      emit('update:edit',props.item)
    })
    return
  }
  return new Promise((resolve) => {
    proxy.$modal.confirm('确认要"' + text + row.name + '"?').then(function () {
      emit('update:status',props.item)
      return resolve(true)
    }).catch(() => {
      return resolve(false)
    })
  }) 
};

function handleDelete() {
  let { isThirdRoom } = props.item
  if (isThirdRoom == 1) {
    proxy.$modal.msgError('同步于鑫动的房间不可删除')
    return 
  }
  emit('update:delete',props.item)
}

function handleUpdate() {
  emit('update:edit',props.item)
}
</script>

<style lang="scss" scoped>
.room-item{
  flex:0 0 204px;
  margin-right:24px;
  background: #FFFFFF;
  border-radius: 10px;
  padding:15px;
  max-width: 190px;
  &:last-child{
    margin-right:0;
  }

}
.third-room{
  background: #9a50ee;
  border-radius: 50%;
  width: 20px;
  text-align: center;
  color: #fff;
}
</style>