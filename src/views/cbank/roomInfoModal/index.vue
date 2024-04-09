<!--
 * @Description: 房台详情弹框
 * @Author: pgm
 * @Date: 2024-03-02 18:24:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-18 14:40:44
 * @FilePath: /cbank-client/src/views/cbank/roomInfoModal/index.vue
-->

<template>
  <el-drawer v-model="show" :close-on-click-modal="isCanClose" @opened="isCanClose = true" class="cashierSummaryModal"
    size="50%" append-to-body :before-close="cancel" destroy-on-close :with-header="false">
    <div class="h100">
      <div class="d-flex al-center jc-between color-fff py-12 px-24 border-b">
        <div>{{ title }}</div>
        <el-button type="primary" @click="cancel">
          返回收银台
        </el-button>
      </div>
      <div class="content p-24 over-scorll-y">
        <div class="title">房台信息</div>
        <el-row class="row">
          <el-col :span="8"><span class="label">类型：</span>{{ infoData.typeName }}</el-col>
          <el-col :span="8"><span class="label">区域：</span>{{ infoData.areaName }}</el-col>
          <el-col :span="8"><span class="label">状态：</span>{{ status.typeName }}</el-col>
          <el-col :span="8"><span class="label">低消：</span>￥{{ fenToYuan(infoData.roomMinConsumption) }}</el-col>
          <el-col :span="8"><span class="label">房台价格：</span>￥{{ fenToYuan(infoData.roomPrice) }}</el-col>
          <el-col :span="8"><span class="label">包厢管理员：</span>{{ infoData.manageUserName || '-' }}</el-col>
          <el-col :span="8"><span class="label">已绑管理员：</span>{{ infoData.manageListUserName || '-' }}</el-col>
        </el-row>
        <div class="title mt-30">预定信息</div>
        <el-row class="row">
          <el-col :span="8"><span class="label">手机号：</span>{{ infoData.custMobile || '-'}}</el-col>
          <el-col :span="8"><span class="label">房源：</span>{{ roomType }}</el-col>
          <el-col :span="8"><span class="label">人数：</span>{{ infoData.custNum }}</el-col>
          <el-col :span="8"><span class="label">客户称呼：</span>{{ infoData.custName || '-' }}</el-col>
          <el-col :span="8"><span class="label">订房人：</span>{{ infoData.reservationName || '-' }}</el-col>
          <el-col :span="8"><span class="label">预抵时间：</span>{{ infoData.reservationOverTime || '-' }}</el-col>
          <el-col :span="8"><span class="label">返房人：</span>{{ infoData.giveRoomName || '-' }}</el-col>
          <el-col :span="8"><span class="label">本次低消：</span>￥{{ fenToYuan(infoData.minConsumption) }}</el-col>
          <el-col :span="8"><span class="label">带房人：</span>{{ infoData.belongName || '-' }}</el-col>
          <el-col :span="8"><span class="label">开台套餐：</span>{{ infoData.packageName }}</el-col>
          <el-col :span="8"><span class="label">轮房人：</span>{{ infoData.turnRoomName || '-' }} </el-col>
          <el-col :span="8" class="es1"><span class="label">备注：</span>{{ infoData.remark || '-' }}</el-col>
        </el-row>
        <div class="border-b my-30"></div>
        <div class="d-flex al-center w100 ">
          <div class="mr-40 pointer " v-for="item in tableTypeMap" :key="item.type" @click="tableChange(item.type)">
            <div class="tab-border" :class="tableType == item.type ? 'isactive' : ''"> {{ item.name }}</div>
          </div>
        </div>
        <BillInfo v-if="tableType == 1" :roomInfo="roomInfo"></BillInfo>
        <Appearing v-if="tableType== 2" :roomInfo="roomInfo"></Appearing>
        <ReplaceRoomList v-if="tableType == 3" :roomInfo="roomInfo"></ReplaceRoomList>
        <MergeInfo v-if="tableType == 4" :roomInfo="roomInfo"></MergeInfo>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import {ref} from 'vue'
import { fenToYuan } from '@/utils'
import BillInfo from './billInfo.vue'
import MergeInfo from './mergeInfo.vue'
import Appearing from './appearing.vue'
import ReplaceRoomList from './replaceRoomList.vue'
import { getRoomReserveInfo } from '@/api/cbank'
import { useRoomSystemStore } from '@/store/system'

const roomSystemStore = useRoomSystemStore()
const emit = defineEmits(["update:value"])
const props = defineProps({
  value: {
    type: String,
    require: true,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  roomInfo: {
    type: Object,
    required: true,
  },
})
const isCanClose = ref(false)
const infoData = ref({})
const tableLoaing = ref(false)
const queryParams = ref({
  type: 1
})

const typeListMap = ref([
  { name: "散客", value: 1 },
  { name: "公司房", value: 2 },
  { name: "招待房", value: 3 },
  { name: "团购", value: 4 },
  { name: "任务房", value: 5 },
])

const tableTypeMap = ref([
  { type: 1, name: '账单信息' },
  { type: 2, name: '上台信息' },
  { type: 3, name: '转台记录' },
  { type: 4, name: '并台详情' }
])

const tableType = ref(1)
const tabList = ref([])
const cashierData = ref({})

//房间状态
const status = computed(() => {
  console.log(' roomSystemStore.roomSystemStatusColorList.find(item => item.type == props.roomInfo.useStatus) ', roomSystemStore.roomSystemStatusColorList.find(item => item.type == props.roomInfo.useStatus) )
    return roomSystemStore.roomSystemStatusColorList.find(item => item.type == props.roomInfo.useStatus) ?? {}
})
const roomType = computed(() => {
  console.log(infoData.value.roomSource)
  let obj = typeListMap.value.find(item => item.value == infoData.value.roomSource)
  if (obj) {
    return obj.name
  } else {
    return '-'
  }
})

//弹窗控制
const show = computed(() => {
  if (props.value == 'roomInfo') {
    init()
  }
  return props.value == 'roomInfo'
})

const tableChange = (index) => {
  tableType.value = index
}









const init = () => {
  let { roomId } = props.roomInfo
  getRoomReserveInfo({ roomId }).then(res => {
    infoData.value = res
  })

}


//弹框重置
function cancel() {
  tableType.value = 1
  emit('update:value', '')
}
</script>

<style lang="scss" scoped>
.content{
  height: calc(100% - 56px);
}
.title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;

  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 20px;
    background: #2AD1B7;
    margin-right: 10px;
  }
}

.row {
  .el-col {
    margin-top: 15px;
    .label {
      color: #ADADAD;
    }
  }

}

.tab-border {
  &:after {
    content: "";
    display: block;
    width: 26px;
    height: 2px;
    background: transparent;
    margin: 15px auto 0;
  }

  &.isactive:after {
    content: "";
    display: block;
    width: 26px;
    height: 2px;
    background: var(--el-color-primary);
    margin: 15px auto 0;
  }
}
</style>