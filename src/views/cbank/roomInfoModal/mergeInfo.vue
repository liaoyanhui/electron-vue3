<!--
 * @Description: 并台
 * @Author: pgm
 * @Date: 2024-02-21 20:27:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-18 17:29:20
 * @FilePath: /cbank-client/src/views/cbank/roomInfoModal/mergeInfo.vue
-->


<template>
  <div class="room-list">
    <div class="empty w100 text-center mt-50" v-if="roomList?.length ==0">
      <img src="../../../assets/img/cbank/empty/暂无并台详情@2x.png"/>
      <div class="mt-16">暂无并台详情！</div>
    </div>
    <div v-else class="room radius-8 p-14 mt-14" v-for="(item, index) in roomList" :key="index" :class="['border-1']">
      <div class="d-flex jc-between al-center">
        <div class="fs-20">{{ item.roomName }}</div>
        <div class="color-icon bg-green" v-if="index == 0">主</div>
        <div class="color-icon bg-red2" v-else>并</div>
      </div>
      <div class="mt-8">{{ item.hostBillNumber }}</div>
      <div class="mt-8">¥{{ fenToYuan(item.payableAmount) }}</div>
      <div class="d-flex jc-between al-center mt-8">
        <div>{{ item.custName }}</div>
        <div class="color-red">{{ item.recordInfo }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { mergeList } from '@/api/cbank'
import { fenToYuan } from '@/utils';
const props = defineProps({
  roomInfo: {
    type: Object,
    require: true
  },
  value: {
    type: String,
    require: true,
    default: ''
  },

})
const roomList = ref(null);
function getMergeList() {
  let { roomId, consumeHistoryId } = props.roomInfo
  let params = {
    roomId, consumeHistoryId
  }
  mergeList(params).then(res => {
    roomList.value = res
  })

}
onMounted(() => {
  console.log('props.roomInfo.consumeHistoryId',props.roomInfo)
  if (props.roomInfo.consumeHistoryId) {
    getMergeList()
  } else {
    roomList.value = []
  }
})


</script>

<style lang="scss" scoped>
.room-list {
  display: flex;
  flex-wrap: wrap;

  .room {
    width: 178px;

    &:nth-child(3n-1) {
      margin-left: 30px;
      margin-right: 30px;
    }
  }
}

.color-icon {
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
</style>