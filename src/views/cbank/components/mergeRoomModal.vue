<!--
 * @Description: 并台
 * @Author: pgm
 * @Date: 2024-02-21 20:27:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-01 20:16:14
 * @FilePath: /cbank-client/src/views/cbank/components/mergeRoomModal.vue
-->


<template>
  <el-dialog  v-model="show" width="688px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <el-form ref="mergeRoomRef" :model="form" label-width="80px">
      <el-form-item label="选择房台" prop="parentType">
        <el-select filterable v-model="form.openPackage" placeholder="请选择房台" style="width: 220px" class="custom-select" @change="selectRoomHandle">
          <el-option v-for="item in selectListData" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="room-box bg-fff06 p-16 radius-8">
      <div>已并房台</div>
      <div class="room-list">
        <div class="room  radius-8 p-14 mt-14" v-for="(item,index) in roomList" :key="index" :class="[index === selectIndex ? 'border-green':'border-1']" @click="selectIndex = index">
          <div class="d-flex jc-between al-center">
            <div class="fs-20">{{ item.roomName }}</div>
            <div class="color-icon bg-green" v-if="index == 0">主</div>
            <div class="color-icon bg-red2" v-else>并</div>
          </div>
          <div class="mt-8">{{ item.hostBillNumber  }}</div>
          <div class="mt-8">¥{{ fenToYuan(item.payableAmount) }}</div>
          <div class="d-flex jc-between al-center mt-8">
            <div>{{ item.custName }}</div>
            <div class="color-red">{{ item.recordInfo }}</div>
          </div>
        </div>
      </div>
      <div class="d-flex jc-end al-center mt-20">
        <div class="d-flex al-center">主单实付合计：<span class="color-red fs-18">￥{{ fenToYuan(total) }}</span></div>
        <el-button type="danger" v-if="selectIndex !=null" class="submit ml-24" :disabled="roomList.length <=1" @click="removeRoom">{{selectIndex == 0? `移除所有并台`:'移除该房台' }}</el-button>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确认修改</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { directOpenRoom,mergeList,mergeOperate,roomPayableInfo } from '@/api/cbank'
import { companyRoomSimplifyList } from "@/api/system/room-system";
import { fenToYuan } from '@/utils';
import { watchEffect } from 'vue';

const { proxy } = getCurrentInstance();

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

const emit = defineEmits(['update:value']);
const selectList = ref([])
const selectIndex =ref(null)
const roomList = ref([]);
const show = computed(() => {
  if (props.value == 'mergeRoom') {
    init()
    return true
  } else {
    return false
  }
})
const data = reactive({
  form: {},
})
const { form } = toRefs(data);

//目标房台切换事件
function selectRoomHandle(value) {
  if (value) {
    let {consumeHistoryId,id:roomId} = selectList.value.filter(item => item.id == value)[0]
    getRoomPayableInfo({ consumeHistoryId, roomId })
  }
  form.value = {}
  
}

const removeRoom = () => {
  let list = roomList.value
  if (selectIndex.value == 0) {
    roomList.value=[list[0]]
  } else {
    roomList.value.splice(selectIndex.value, 1)
  }
  selectIndex.value = null
}

/** 获取房间列表 */
function getSelectList() {
  let params = {
    isMerge: 1,
  }
  companyRoomSimplifyList(params).then(result => {
    selectList.value = result
  });
}

const selectListData = computed(() => {
  let list = roomList.value.map(item => item.roomId)
  return selectList.value.filter(item => {
    return !list.includes(item.id)
  })
})



const init = () => {
  getMergeList()
  getSelectList()
}

function getMergeList() {
  let {roomId,consumeHistoryId} = props.roomInfo
  let params = {
    roomId,consumeHistoryId
  }
  mergeList(params).then(res => {
    if (res.length == 0) {
      getRoomPayableInfo(params)
    } else {
      roomList.value = res
    }
  })

}

const total = computed(() => {
  let amount = 0
    roomList.value.forEach(item=>{
      amount +=item.payableAmount
    })
  return amount
})

function getRoomPayableInfo(params) {
  proxy.$modal.loading()
  roomPayableInfo(params).then(res => {
    roomList.value.push(res)
  }).finally(() => {
    proxy.$modal.closeLoading()
  })
}


function handleBeforeClose() {
  cancel()
}

function submitForm() {
  let ids = roomList.value.map(item => item.roomId)
  let beingMergeRoomId = ids.shift()
  let disappearMergedRoomIdList = ids.join()
  proxy.$modal.loading()
  mergeOperate({ beingMergeRoomId, disappearMergedRoomIdList }).then(() => {
    cancel()
  }).finally(() => {
    proxy.$modal.closeLoading()
  })
  
}

function cancel() {
  roomList.value = []
  selectList.value = []
  form.value={}
  emit('update:value', '')
}
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
}</style>