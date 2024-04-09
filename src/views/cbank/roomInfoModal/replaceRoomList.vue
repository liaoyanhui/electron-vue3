<!--
 * @Description: 
 * @Author: pgm
 * @Date: 2024-03-02 21:46:00
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-15 21:48:30
 * @FilePath: /cbank-client/src/views/cbank/roomInfoModal/replaceRoomList.vue
-->
<template>
  <div class="empty w100 text-center mt-50" v-if="historyList?.length==0">
      <img src="../../../assets/img/cbank/empty/暂无转台记录@2x.png"/>
      <div class="mt-16">暂无转台记录！</div>
  </div>
  <div v-for="item in historyList" :key="item.id" class="bg-fff06 radius-8 mb-20 p-24">
    <div>{{ item.turntableTime }}</div>
    <el-row style="width: 70%;" class="row">
      <el-col :span="12">
        <div ><span class="label">旧房台：</span>{{ item.oldRoomName }}</div>
        <div ><span class="label">房台类型：</span>{{ item.oldRoomType }}</div>
        <div ><span class="label">房台价格：</span>￥{{ fenToYuan(item.oldRoomPrice) }}</div>
        <div ><span class="label">房台低消：</span>￥{{ fenToYuan(item.oldRoomMinConsumption) }}</div>
        <div ><span class="label">开台套餐：</span>{{ item.oldRoomPackageName }}</div>
      </el-col>
      <el-col :span="12">
        <div ><span class="label">新房台：</span>{{ item.newRoomName }}</div>
        <div ><span class="label">房台类型：</span>{{ item.newRoomType }}</div>
        <div ><span class="label">房台价格：</span>￥{{ fenToYuan(item.newRoomPrice) }}</div>
        <div ><span class="label">房台低消：</span>￥{{fenToYuan(item.newRoomMinConsumption) }}</div>
        <div ><span class="label">开台套餐：</span>{{ item.newRoomPackageName }}</div>
      </el-col>
    </el-row>

  </div>
</template>

<script setup>
import { roomReplaceRecordList } from '@/api/cbank'
import { fenToYuan } from '@/utils';
const emit = defineEmits(["update:value"])
const props = defineProps({
  roomInfo: {
    type: Object,
    required: true,
  },
})
const historyList = ref(null)
function getRoomReplaceRecordList(){
  let { roomId, consumeHistoryId } = props.roomInfo
  roomReplaceRecordList({ roomId, consumeHistoryId }).then(res => {
    historyList.value = res
  })
}
onMounted(()=>{
  // if (props.roomInfo.consumeHistoryId) {
  //   getRoomReplaceRecordList()
  // }
  getRoomReplaceRecordList()
})

</script>

<style lang="scss" scoped>
.row {
  .el-col {
  
    div{
      margin-top: 10px;
    }
    .label {
      color: #ADADAD;
    }
  }

}
</style>