<!--
 * @Description: 收银台页面
 * @Author: pgm
 * @Date: 2024-01-25 22:04:22
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-22 00:17:47
 * @FilePath: /cbank-client/src/views/cbank/index.vue
-->
<template>
  <div class="app-container overflow">
    <div class="d-flex al-start jc-between mb-24">
      <div>
        <!-- 房间类型筛选 -->
        <el-radio-group v-model="queryParams.roomTypeId" class="mr-30" @change="handleQuery" size="large">
          <el-radio-button label="">全部房台</el-radio-button>
          <el-radio-button :label="item.id" v-for="item in roomSystemTypeMap" :key="item.id">{{ item.typeName
          }}</el-radio-button>
        </el-radio-group>
        <!-- 房间区域筛选 -->
        <el-radio-group v-model="queryParams.areaId" class="mr-30" @change="handleQuery" size="large">
          <el-radio-button label="">全部区域</el-radio-button>
          <el-radio-button :label="item.id" v-for="item in roomSystemAreaMap" :key="item.id">{{ item.areaName
          }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="d-flex al-center">
        <el-button type="primary" size="large" @click="onRefresh">刷新</el-button>
        <el-button type="primary" size="large" @click="clearnAllHandle"
          v-hasPermi="['cbank:yijianqingtai']">一键清台</el-button>
        <el-button type="primary" size="large" @click="modelType = 'businessSummaryModal'"
          v-hasPermi="['cbank:yingyehuizong']">营业汇总</el-button>
        <el-button type="primary" size="large" @click="modelType = 'cashierSummaryModal'"
          v-hasPermi="['cbank:souyinhuizong']">收银汇总</el-button>
          <el-popover placement="left" :width="100" trigger="click"   :popper-style="{'min-width': '40px'}">
          <template #reference>
            <img src="../../assets/img/cbank/moshi.png" width="24px" height="24px" class="ml-18 pointer">
          </template>
          <div class="text-center">
            <div class="mb-10 pointer" :class="{'color-green bg-gray': settingsStore.roomModeType == 'large'}"   @click="()=>roomSize=200">大</div>
            <div class="mb-10 pointer" :class="{'color-green bg-gray': settingsStore.roomModeType == 'normal'}"  @click="()=>roomSize=180">中</div>
            <div class="mb-10 pointer" :class="{'color-green bg-gray': settingsStore.roomModeType == 'small'}"  @click="()=>roomSize=150">小</div>
            <el-slider v-model="roomSize"  size="small" :min="150" :max="220" :step="10" :show-tooltip="false" />
          </div>
    </el-popover>
       
      </div>
    </div>

    <!-- 房间列表 -->
    <div class="roomList over-scorll-y" ref="roomListRef">
      <div class="room-item" v-for="(roomItem,index) in roomList" :key="roomItem.id"  :class="{ 'last-column': (index + 1) % columns === 0 ,'last-row-item': isLastRowItem(index) }">
        <RoomItem :item="roomItem" v-model:selectItem="selectRoomItem" @handlemodel='handlemodel' ></RoomItem>
      </div>
    </div>
  </div>
  <!-- 底部房间状态筛选 -->
  <div class="status-box">
    <div class="status-list py-12 px-30 ">
      <div class="d-flex al-center jc-center pointer item" v-for="(item, index) in roomSystemStatusColorList" :key="index"
        @click="selectRoomStatus(item)">
        <div class="color-view" :class="{ isActive: selectUseStatusList.includes(item.type)}"
          :style="`background-color: ${item.colour}`"></div>
        <div class="color-name color-black fs-16 ml-8">{{ item.typeName }}<span>({{ item.roomStatusSize }})</span></div>
      </div>
    </div>
  </div>
  <!-- 右滑弹出层 -->
  <el-drawer v-model="open" :close-on-click-modal="isCanClickModal"  @opened="isCanClickModal = true" class="cbank" :size="modelSize" append-to-body
    @before-close="reset" destroy-on-close :with-header="false">
    <div class="d-flex drawer-content h100">
      <DrawerLeft :modelType="modelType" @update:model='handlemodel' :roomInfo="modelParams"></DrawerLeft>
      <component :is="modelComponent" ref="dynamicComponentRef" :title="modelTitle" :roomInfo="modelParams"
        @reset="reset" />
    </div>
  </el-drawer>
  <!-- 转台弹窗 -->
  <ChangeRoomModal :roomInfo="modelParams" :title="modelTitle" v-model:value="modelType"></ChangeRoomModal>
  <!-- 并台弹窗 -->
  <MergeRoomModalVue :roomInfo="modelParams" :title="modelTitle" v-model:value="modelType"></MergeRoomModalVue>
  <!-- 营业汇总弹窗 -->
  <BusinessSummaryModal v-model:value="modelType"></BusinessSummaryModal>
  <!-- 收银汇总 -->
  <CashierSummaryModal v-model:value="modelType"></CashierSummaryModal>

  <RoomInfoModal :roomInfo="modelParams" v-model:value="modelType" :title="modelTitle"></RoomInfoModal>
</template>



<script setup name="Config">
import { ElMessageBox } from 'element-plus'
import RoomItem from './components/roomItem'
import Dishes from '@/views/dishes/index'
import Reservation from './components/reservation.vue';
import DrawerLeft from './components/drawerLeft.vue';
import SettleAccounts from './components/settleAccounts.vue';
import ChangeRoomModal from './components/changeRoomModal.vue';
import MergeRoomModalVue from './components/mergeRoomModal.vue';
import BusinessSummaryModal from './components/businessSummaryModal.vue';
import CashierSummaryModal from './components/cashierSummaryModal.vue'
import RoomInfoModal from './roomInfoModal/index.vue';
import { getCompanyRoomList } from "@/api/system/room-system";
import { clearAll } from '@/api/cbank/index'
import { useRoomSystemStore } from '@/store/system/index'
import useSettingsStore from '@/store/settings'
import { sseService } from '@/utils/eventsource'
import { throttle,debounce } from '@/utils';
const roomSystemStore = useRoomSystemStore()
const settingsStore = useSettingsStore()
const { proxy } = getCurrentInstance();
const loading = ref(true);
const total = ref(0);
const data = reactive({
  queryParams: {
    typeName: undefined,
    useStatusList: '',
    roomTypeId: '',
    areaId: '',
    isDisableShow: 0
  },
});
const roomListRef = ref(null)
let columns = ref(4); // 默认每行显示的列数
const selectRoomItem = ref(null)
const isCanClickModal = ref(false)
const roomList = ref([]); //房台列表
const open = ref(false); //弹出层控制
const selectUseStatusList = ref([])
const dynamicComponentRef = ref(null); //弹出层当前模块组件注册
const modelComponent = shallowRef(Dishes) //弹出层当前模块
const modelComponentMap = shallowRef({ //弹窗内部组件对应关系
  'dishes': Dishes, //点单
  'reservation': Reservation,//预约
  'settleAccounts': SettleAccounts //结账
})

const modelData = reactive(
  {
    modelType: '', //弹窗类型
    modelTitle: '',//弹窗标题
    modelSize: '80%',//弹窗宽度 px
    modelParams: {}, //弹窗接收到的参数
    modelNeedFooter: true //是否需要底部按钮
  })

const { modelType, modelTitle, modelParams, modelSize, modelNeedFooter } = toRefs(modelData)
const { queryParams } = toRefs(data);
//房间类型列表
const roomSystemTypeMap = computed(() => roomSystemStore.roomSystemTypeMap)
//区域列表
const roomSystemAreaMap = computed(() => roomSystemStore.roomSystemAreaMap)
//列表房间状态颜色
const roomSystemStatusColorList = computed(() => roomSystemStore.roomSystemStatusColorList)


const roomSize = computed({
  get() {
    return settingsStore.roomSize
  },
  set(val) {
    settingsStore.changeRoomSize(val)
    updateColumns()
  }
})


/** 获取房间列表 */
function getList() {
  loading.value = true;
  let params = {
    ...queryParams.value
  }
  getCompanyRoomList(params).then(result => {
    roomList.value = result;
    total.value = result.length;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
}

const updateColumns = debounce(() => {
  console.log('aaa')
  const containerWidth = roomListRef.value.clientWidth + 10;
  const itemWidth = settingsStore.roomSize; // 假设每个元素宽度为150px
  columns.value = Math.floor(containerWidth / itemWidth);
  document.documentElement.style.setProperty('--columns', columns.value);
},100);

const isLastRowItem = (index) => {
  const totalItems = roomList.value.length;
  const itemsInLastRow = totalItems % columns.value || columns.value;
  const lastRowIndex = Math.floor((totalItems - 1) / columns.value);
  const itemRowIndex = Math.floor(index / columns.value);
  return itemRowIndex === lastRowIndex && index >= totalItems - itemsInLastRow;
};

/** 弹框重置 */
function reset() {
  modelType.value = '',
    modelComponent.value = null
  modelTitle.value = ''
  modelParams.value = {}
  open.value = false,
   modelNeedFooter.value = true

}

/** 房台分类/房台区域 筛选 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}


/** 弹框 */
function handlemodel(modelConfig) {
  let { data , type, show, title = modelTitle.value, size = "80%", footer = true } = modelConfig
 
  if (!data) {
    let obj = roomList.value.find(item => item.id == modelParams.value.roomId)
    obj.roomId = modelParams.value.roomId
    data = obj
  }
  let { name = '', typeName = '' } = data
  open.value = show
  modelType.value = type
  modelTitle.value = `${title}(${name}-${typeName})`
  modelComponent.value = modelComponentMap.value[type]
  modelParams.value = data
  modelSize.value = size
  modelNeedFooter.value = footer
  if (show) {
    setTimeout(() => {
      isCanClickModal.value = true
    }, 1500)
  }
  // setTimeout(() => {
  //   isCanClickModal.value = true
  // },1500)
}



//根据房台状态筛选
function selectRoomStatus(item) {
  let list =  selectUseStatusList.value
  let index = selectUseStatusList.value.indexOf(item.type)
  if (index > -1) {
    list.splice(index,1)
  } else {
    list.push(item.type)
  }
  selectUseStatusList.value = list
  queryParams.value.useStatusList = list.join(',')

  handleQuery()
}

const clearnAllHandle = () => {
  ElMessageBox.confirm('确定进行一键清台操作？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    proxy.$modal.loading()
    clearAll().then(() => {
      proxy.$modal.msgSuccess("清台成功");
    }).finally(() => {
      proxy.$modal.closeLoading()
    })
  }).catch(() => { });

}

const onRefresh = async () => {
  proxy.$modal.loading()
  sseService.removeEvent([{ "roomStatus": updateRoomList }])
  sseService.connect({ eventList: [{ "roomStatus": updateRoomList }] })
  try {
    // await userStore.getUserInfo()
    let res1 =  getList();
    let res2 =  roomSystemStore.ajaxRoomSystemTypeMap()
    let res3 = roomSystemStore.ajaxRoomSystemAreaMap()
    let res4 = roomSystemStore.ajaxRoomSystemStatusColorList()
    await Promise.all([res1, res2,res3,res4,res5])
    proxy.$modal.closeLoading()
  } catch (e) {
    proxy.$modal.closeLoading()
  }
}

//页面初始化
onMounted(() => {
  updateColumns();
  window.addEventListener('resize', updateColumns);
  init()
})

const init = () => {
  console.log('sseService',sseService)
  sseService.removeEvent([{ "roomStatus": updateRoomList }])
  getList();
  roomSystemStore.ajaxRoomSystemTypeMap()
  roomSystemStore.ajaxRoomSystemAreaMap()
  roomSystemStore.ajaxRoomSystemStatusColorList()
  sseService.connect({ eventList: [{ "roomStatus": updateRoomList }] })
}


//推送监听
const updateRoomList = throttle(() => {
  getList()
}, 800)

//卸载监听事件
onBeforeUnmount(() => {
  sseService.removeEvent([{ "roomStatus": updateRoomList }])
  window.removeEventListener('resize', updateColumns);
})

</script>
<style scoped lang="scss">

.roomList {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding-bottom: 80px;
  .room-item{
    flex: 1 0 calc(100% / var(--columns));
    // margin-right: 10px;
    color: #000;
    line-height: 28px;
    border-radius: 10px;
    margin-bottom: 11px;
    border-radius: 10px;
    padding-right: 10px;
  }
  .last-row-item{
    flex: 0 0 calc(100% / var(--columns));
  }
}
.status-box {
  position: fixed;
  width: 100%;
  text-align: center;
  bottom: 40px;
  left: 0;

  .status-list {
    background: #FFFFFF;
    box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    margin: 0 auto;
    display: inline-flex;
    align-items: center;

    .item {
      width: 120px;

      .color-view {
        width: 18px;
        height: 18px;
        box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.5);
        border-radius: 2px;
        border: 1px solid #ADADAD;
        position: relative;

        &.isActive::before {
          content: "";
          position: absolute;
          top: 29%;
          left: 1px;
          width: 6px;
          height: 12px;
          border: solid #2AD1B7;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg) translateY(-50%);
        }
      }
    }
  }
}




.drawer-content {
  padding-left: 90px;
}</style>