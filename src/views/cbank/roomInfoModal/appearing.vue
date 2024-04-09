<!--
 * @Description: 
 * @Author: pgm
 * @Date: 2024-03-08 14:37:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-22 00:20:32
 * @FilePath: /cbank-client/src/views/cbank/roomInfoModal/appearing.vue
-->
<template>
   <div class="empty w100 text-center mt-50" v-if="pageData?.length == 0" >
      <img src="../../../assets/img/cbank/empty/暂无上台信息@2x.png"/>
      <div class="mt-16">暂无上台信息！</div>
  </div>
  <div v-else>
   <div v-for="item in pageData" :key="item.id" class="bg-fff06 radius-8 mt-20 p-20 d-flex al-center" >
      <img :src="item.avatar || avatar" alt="" width="100px" height="100px"/>
      <div  class="d-flex flex-column jc-between ml-16 flex-1" style="height:100px">
         <div  class="d-flex al-center"><div>{{ item.ticketName }}</div>
         <el-tag  class="ml-10" effect="dark" round :type="item.sourceType == 1? 'green':'warning' ">{{ item.sourceType == 1? '购买':'赠送' }}</el-tag> 
         <el-tag class="ml-10" effect="dark" round  type="warning" v-if="item.status == 4">退票中</el-tag>
      </div>
         <div class="color-ADADAD fs-14"><div>{{ item.organizationName }}</div></div>
         <div class="color-ADADAD fs-14">{{ item.nickname }}-{{ item.levelName }}</div>
         <!-- <div  class="color-ADADAD fs-14">{{ item.scanCodeNickname }}</div> -->
         <div class="color-ADADAD fs-14">{{ item.usedTime }}</div>
      </div>
      <div class="amount color-red fs-18 ">￥{{fenToYuan(item.price)  }}</div>
   </div>
  </div>
</template>

<script setup>
import { getUserTicketList } from '@/api/cbank'
import avatar from '../../../assets/img/cbank/appearing-img-1.png'
import { fenToYuan } from '@/utils';
const props = defineProps({
  roomInfo: {
    type: Object,
    require: true
  },
})
const pageData =ref(null)
function getData(){
  let {  consumeHistoryId } = props.roomInfo
   getUserTicketList({ consumeHistoryId }).then(res => {
      pageData.value = res
   })
}

onMounted(()=>{
  // if (props.roomInfo.consumeHistoryId) {
  //   getRoomReplaceRecordList()
  // }
  getData()
})
</script>

<style lang="scss" scoped>
.amount{
   align-self: flex-start;
}

</style>