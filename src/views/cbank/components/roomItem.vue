<!--
 * @Description: 收银台列表-item
 * @Author: pgm
 * @Date: 2024-01-27 00:39:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-22 00:22:59
 * @FilePath: /cbank-client/src/views/cbank/components/roomItem.vue
-->

<template>
  <el-popover v-if="isWeb" ref="popoverRef" v-model:visible="isVisible" :virtual-ref="roomItemRef" trigger="contextmenu"
    title="" virtual-triggering placement="right" :offset="5">
    <div class="pb-4 pointer pop-hover" v-for="(item, index) in roomControl" :key="index" @click="item.method">{{
    item.name }}</div>
  </el-popover>
  <div class="fs-14 p-10 pb-14 radius-8 pointer" ref="roomItemRef" :style="`background-color: ${status.colour}`" @contextmenu="rightClick"
    v-dblclick="{ click: detail, dblclick }">
    <div>
      <div class="d-flex al-center jc-between">
        <div class="fs-20 fw-500 el-1 max-120">
          <span >{{ item.name }}</span>
          <span class="fs-14" v-if="item.typeName&&['small'].includes(roomModeType)">({{ item.typeName }})</span>
        </div>
        <div class="el-1 fs-10" v-if="item.reservationName && ['normal'].includes(roomModeType)">订: {{ item.reservationName }}</div>
        <div v-if="['large'].includes(roomModeType)" class="fs-14 fw-500">{{ status.typeName == '预定' ? '预抵' : status.typeName }} {{ time }}</div>
      </div>
      <div class="d-flex al-center jc-between text-row-height" v-if="['large','normal'].includes(roomModeType)">
        <div>
          <span v-if="item.typeName">{{ item.typeName }}</span>
          <div class="d-line" v-if="item.minConsumption">
            ({{ formatAmount(item.minConsumption) }}<span
              v-if="item.normalConsumption">/{{ formatAmount(item.normalConsumption) }}</span>)</div>
        </div>
        <!-- <div>上台数量</div> -->
      </div>
      <div class="d-flex al-center jc-between text-row-height" v-if="['large','normal'].includes(roomModeType)">
        <div>
          <div v-if="item.beAloneAmount">应：{{ formatAmount(item.payableAmount, 2) }}</div>
        </div>
      </div>
      <div class="text-row-height"  v-if="['large'].includes(roomModeType)">
        <div v-if="item.reservationName">订: {{ item.reservationName }}</div>
      </div>
      <div class="text-row-height"  v-if="['large'].includes(roomModeType)">
        <div v-if="item.turnRoomName">轮房: {{ item.turnRoomName }}</div>
        <div v-if="item.giveRoomName">返: {{ item.giveRoomName }}</div>
      </div>
      <div class="text-row-height el-1">
        <div class="el-1 fs-14" v-if="item.remark">备注: {{ item.remark }}</div>
        <div class="el-1 fs-14" v-else-if="item.packageName">开: {{ item.packageName }}</div>
      </div>
      <!-- <div class="d-flex al-center jc-between">
        <div :class="[item.isFinal != null ? 'final' : 'no-final']">
          <div class="text-row-height">
            <div v-if="item.turnRoomName">轮房: {{ item.turnRoomName }}</div>
            <div v-if="item.giveRoomName">返: {{ item.giveRoomName }}</div>
          </div>
          <div class="text-row-height el-1">
            <div class="el-1" v-if="item.remark">备注: {{ item.remark }}</div>
          </div>
        </div>
        <div class="p-6 border-2-black radius line-1" v-if="item.isFinal == 1">主</div>
        <div class="p-6  border-2-black radius line-1 " v-if="item.isFinal == 0">次</div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { fenToYuan } from '@/utils'
import { clearAll, guestsEntering, clearRoom, directOpenRoom, cancellationRoomReserveInfo, maintenanceRoom } from '@/api/cbank'
import { useRoomSystemStore } from '@/store/system'
import auth from '@/plugins/auth'
import useUserStore from '@/store/user'
const permissions = useUserStore().permissions
import { computed, onBeforeMount, onMounted } from 'vue'
const roomSystemStore = useRoomSystemStore()
import useSettingsStore from '@/store/settings'
const settingsStore = useSettingsStore()
const { proxy } = getCurrentInstance();
const roomItemRef = ref()
const popoverRef = ref()
const visible = ref(false)
const isWeb = import.meta.env.VITE_PLATFORM === "web"
const emit = defineEmits([
  'handlemodel',
  'update:selectItem'
]);
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  selectItem: {
    type: Number,
    default: null
  }
})
const roomHandelControlMap = ref([
  {
    name: '预定',
    method: preaRoom,
    status: [0],
    permission: 'cbank:control:yuyue'
  },
  {
    name: '修改预定信息',
    method: preaRoom,
    status: [1, 2, 3, 4, 5, 7],
    permission: 'cbank:control:yuyue'
  },
  {
    name: '入客',
    method: entry,
    status: [0, 1, 4],
    permission: "cbank:control:ruke"
  },
  {
    name: '开台',
    method: open,
    status: [0, 1, 2, 4],
    permission: "cbank:control:open"
  },
  {
    name: '转台',
    method: changeRoom,
    status: [1, 2, 3, 4],
    permission: "cbank:control:zhuantai"
  },
  {
    name: '续单',
    method: createorder,
    status: [5, 7],
    permission: "cbank:control:shouyindiandan"
  },

  {
    name: '并台',
    method: mergeRoom,
    status: [3, 5],
    permission: "cbank:control:bingtai"
  },
  {
    name: '点单',
    method: createorder,
    status: [3],
    permission: "cbank:control:shouyindiandan"
  },
  {
    name: '取消预定',
    method: cancellationRoom,
    status: [1, 4],
    permission: 'cbank:control:yuyue'
  },

  {
    name: '关台',
    method: clearSingle,
    status: [2],
    permission: "cbank:control:guantai"
  },
  {
    name: '标签',
    method: defaultCilck,
    status: [0, 1, 2, 3, 4, 5, 6, 7],
    permission: "*:*:*"
  },
  {
    name: '充值',
    method: defaultCilck,
    status: [2, 3, 5],
    permission: "*:*:*"
  },
  {
    name: '结账',
    method: pay,
    status: [3],
    permission: "cbank:control:jiezhang"
  },
  {
    name: '房台财务',
    method: pay,
    status: [3, 5, 7],
    permission: "cbank:control:jiezhang"
  },
  {
    name: '清台',
    method: clearSingle,
    status: [7],
    permission: "cbank:control:qingtai"
  },
  {
    name: '维修',
    method: maintenance,
    status: [0],
    permission: "cbank:control:weixiu"
  },
  {
    name: '转空房',
    method: clearSingle,
    status: [6],
    permission: "cbank:control:kongfang"
  },
])

const roomModeType = computed(()=>settingsStore.roomModeType)
const isVisible = computed({
  get() {
    return props.selectItem == props.item.id && visible.value
  },
  set(val) {
    if (val) {
      visible.value = true
      emit('update:selectItem', props.item.id)
    } else {
      visible.value = false
      // emit('update:selectItem', null)
    }

  },
})
const roomControl = computed(() => {
  return roomHandelControlMap.value.filter(item => item.status.includes(props.item.useStatus))
})


//房间状态
const status = computed(() => {
  return roomSystemStore.roomSystemStatusColorList.filter(item => item.type == props.item.useStatus)[0] || []
})

const time = computed({
  get() {
    const { useStatus, useTime, reservationOverTime, openTime } = props.item
    let str = ''
    switch (useStatus) {
      case 1:
        str = reservationOverTime ? dayjs(reservationOverTime, 'HH:mm').format('HH:mm') : ''
        break;
      case 2:
        str = useTime ? dayjs(useTime).format('HH:mm') : ''
        break;
      case 3:
        str = dayjs(openTime).format('HH:mm')
        break;

    }
    return str
  }
})


function getContextTemlate(data) {
  let contextTemplate = []
  roomControl.value.forEach(item => {

    if (auth.hasPermi(item.permission)) {
      contextTemplate.push({
        label: item.name,
        click: () => item.method(data)
      })
    }
  })
  return contextTemplate;
}

function defaultCilck() {
  proxy.$modal.msgError("功能暂未开放");
}

function dblclick() {
  emit('update:selectItem', props.item.id)
  const { useStatus } = props.item
  switch (useStatus) {
    case 0:
    case 1:
    case 2:
    case 4:
      if (auth.hasPermi('cbank:control:yuyue')) {
        preaRoom()
      }
      break;
    case 3:
    case 5:
    case 7:
      if (auth.hasPermi('cbank:control:jiezhang')) {
        pay()
      }

      break;
    case 6:
      // if (hasPermissions('cbank:control:guantai')) {
      //   clearSingle()
      // }
      break;

  }

}

function detail() {
  if (props.item.useStatus == 6) {
    return
  }
  emit('handlemodel', {
    data: { ...props.item, roomId: props.item.id },
    title: `点单`,
    type: 'roomInfo',
  })
}


//右键事件
function rightClick() {
  console.log('aaa')
  let data = props.item
  const contextTemplate = getContextTemlate(data);
  if (!isWeb) {
    window.menuApi?.showMenu(contextTemplate);
  } else {
    emit('update:selectItem', data.id)
  }
}

// 入客
function entry() {
  const { id: roomId, reserveId } = props.item
  let params = {
    roomId,
    reserveId
  }
  guestsEntering(params).then(res => {
    visible.value = false
    proxy.$modal.msgSuccess("操作成功");
    // if(res.)
  })
}

//清台单个房台
function clearSingle() {
  const { id: roomId } = props.item
  let params = {
    roomId,
    reserveId: 0 //TODO
  }
  clearRoom(params).then(() => {
    proxy.$modal.msgSuccess("操作成功");
  })
}
//
function cancellationRoom() {
  const { id: roomId, reserveId } = props.item
  let params = {
    roomId,
    status: 2,
    id: reserveId
  }
  cancellationRoomReserveInfo(params).then(() => {
    proxy.$modal.msgSuccess("取消预定成功");
  })
}

//下单
function createorder() {
  visible.value = false
  emit('handlemodel', {
    data: { ...props.item, roomId: props.item.id },
    title: `点单`,
    type: 'dishes',
    show: true,
  })
}


//预定
function preaRoom() {
  console.log('预定')
  // const { id: roomId, consumeHistoryId, name, useStatus, } = props.item
  visible.value = false
  emit('handlemodel', {
    data: { ...props.item, roomId: props.item.id },
    type: 'reservation',
    title: `预定信息`,
    show: true
  })
}

//开台套餐
function open() {
  let { id: roomId, reserveId } = props.item
  let params = {
    roomId, reserveId
  }
  directOpenRoom(params).then(res => {
    proxy.$modal.msgSuccess("开台成功");
  }).catch(() => {

  })
}


//转台
function changeRoom() {
  emit('handlemodel', {
    data: { ...props.item, roomId: props.item.id },
    type: 'changeRoom',
    title: `转台`,
    footer: false
  })
}

// //并台
function mergeRoom() {
  emit('handlemodel', {
    data: { ...props.item, roomId: props.item.id },
    type: 'mergeRoom',
    title: `并台`,
    footer: false
  })
}

function changeOrder() {
  // const { id: roomId,reserveId, consumeHistoryId, name, useStatus } = props.item
  visible.value = false
  emit('handlemodel', {
    data: { ...props.item, roomId: props.item.id },
    type: 'changeOrder',
    title: `改单`,
    show: true,
    footer: false
  })
}

function pay() {
  // const { id: roomId,reserveId, consumeHistoryId, name, useStatus } = props.item
  visible.value = false
  emit('handlemodel', {
    data: { ...props.item, roomId: props.item.id },
    type: 'settleAccounts',
    title: `结账`,
    show: true,
    footer: false
  })
}
//空包转维修
function maintenance() {
  let { id: roomId, reserveId } = props.item
  let params = {
    roomId, reserveId
  }
  maintenanceRoom(params).then(res => {
    proxy.$modal.msgSuccess("修改成功");
  })
}


const formatAmount = (amount, tofixed = 0) => {
  return fenToYuan(amount, tofixed)
}
onMounted(() => {
  // document.addEventListener("click", function (event) {
  //   const dom = roomItemRef.value;
  //   const target = event.target;
  //   if (target !== dom && !dom?.contains(target)) {
  //     // 点击的不是下拉框或者下拉框的子元素，关闭下拉框
  //     visible.value = false;
  //   }
  // });
});


defineExpose({
  createorder,
  preaRoom
})

</script>

<style lang="scss" scoped>
  .text-row-height {
    height: 23px;
  }
  .max-120 {
    max-width: 120px;
  }
  .final {
    max-width: 160px;
  }
  .no-final {
    max-width: 200px;
  }


.cs {
  font-family: 'Helvetica Neue, Helvetica, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif';
}

.pop-hover:hover {
  width: 100%;
  // opacity: 0.7;
  background: rgba(255, 255, 255, .6);
  // color: ;
}
</style>