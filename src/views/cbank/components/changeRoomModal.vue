<!--
 * @Description: 转台弹窗
 * @Author: pgm
 * @Date: 2024-02-18 19:59:12
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-20 00:10:26
 * @FilePath: /cbank-client/src/views/cbank/components/changeRoomModal.vue
-->
<template>
  <el-dialog v-bind="$attrs" v-model="show" width="790px" append-to-body destroy-on-close :before-close="cancel">
    <el-form ref="changeRoomRef" :model="form" :rules="rules" label-width="80px">
      <el-row class="mt-20">
        <!-- <el-col :span="1"></el-col> -->
        <el-col :span="11" class="bg-fff06 radius-8 p-10">
          <el-form-item label="当前房台" />
          <el-form-item label="房台名称" prop="parentType">
            <div>{{ roomInfo.name }}</div>
          </el-form-item>
          <el-form-item label="房台类型" prop="parentType">
            <div>{{ roomInfo.typeName }}</div>
          </el-form-item>
          <el-form-item label="房台价格" prop="parentType">
            <div>{{ fenToYuan(roomInfo.price, 0) }}</div>
          </el-form-item>
          <el-form-item label="房台低消" prop="parentType">
            <div>{{ fenToYuan(roomInfo.minConsumption, 0) }}</div>
          </el-form-item>
          <el-form-item label="开台套餐" prop="parentType">
            <div>{{ roomInfo.packageName }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="2" class="d-flex al-center jc-center">
          <div class="change-icon"></div>
        </el-col>
        <el-col :span="11" class="bg-fff06 radius-8 p-10">
          <el-form-item label="目标房台" />
          <el-form-item label="房台名称" prop="id">
            <el-select filterable v-model="form.id" placeholder="请选择包厢" style="width: 220px" class="custom-select"
              @change="selectRoomHandle">
              <el-option v-for="item in roomList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="房台类型" prop="parentType">
            <div>{{ selectRoomInfo.typeName }}</div>
          </el-form-item>
          <el-form-item label="房台价格" prop="parentType">
            <EditAmountInput v-if="selectRoomInfo.price" v-model:value="selectRoomInfo.price"></EditAmountInput>
          </el-form-item>
          <el-form-item label="房台低消" prop="parentType">
            <!-- <div v-if="!selectRoomInfo">{{ selectRoomInfo.minConsumption }}</div> -->
            <EditAmountInput v-if="selectRoomInfo.minConsumption != null" v-model:value="selectRoomInfo.minConsumption">
            </EditAmountInput>
          </el-form-item>
          <el-form-item label="开台套餐" prop="parentType">
            <el-select v-if="selectRoomInfo.packageId" :disabled="!!roomInfo.consumeHistoryId"
              v-model="selectRoomInfo.packageId" filterable placeholder="请选择开台套餐" style="width: 400px">
              <el-option v-for="item in openPlatformPackageList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">转 换</el-button>

      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import EditAmountInput from '@/components/EditAmountInput'
import { changeRoom, replaceRoom } from '@/api/cbank'
import { companyRoomSimplifyList } from "@/api/system/room-system";
import { useDishesSystemStore } from '@/store/system'
import { fenToYuan } from '@/utils';
const { proxy } = getCurrentInstance();
const dishesSystemSote = useDishesSystemStore()
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
const changeRoomRef = ref(null)
const selectRoomInfo = ref({
  packageId: props.roomInfo.packageId,
  packageName: props.roomInfo.packageName
}) // 选择的目标房台信息
const data = reactive({
  form: {
    id:''
  },
  rules: {
    id: [{ required: true, message: "请选择房台", trigger: "change" }],
  },
 
})

const { form, rules } = toRefs(data);
const openPlatformPackageList = ref([]) //开台套餐列表
const roomList = ref([]) //房台select列表

//弹窗控制
const show = computed(() => {
  if (props.value == 'changeRoom') {
    init()
  } 
  return props.value == 'changeRoom'
})
// 模块初始化
const init = () => {
  let { roomId } = props.roomInfo
  getList()
  dishesSystemSote.getDishInfoSelect({ type: 2, roomId }).then(res => {
    openPlatformPackageList.value = res.list
  })
}

/** 获取房间列表 */
function getList() {
  let params = {
    useStatus: 0
  }
  companyRoomSimplifyList(params).then(result => {
    roomList.value = result;
  });
}

//目标房台切换事件
function selectRoomHandle(value) {
  let { consumeHistoryId, packageId, packageName } = props.roomInfo
  selectRoomInfo.value = roomList.value.filter(item => item.id == value)[0]
  if (consumeHistoryId) {
    selectRoomInfo.value.packageId = packageId
    selectRoomInfo.value.packageName = packageName
  }
}


function submitForm() {
  proxy.$refs["changeRoomRef"].validate(valid => {
    if (valid) {
      let { roomId, reserveId, consumeHistoryId } = props.roomInfo
      const { id: replaceRoomId, packageId = '', minConsumption = '', price: roomPrice } = selectRoomInfo.value
      let params = {
        packageId,
        roomId,
        minConsumption,
        replaceRoomId,
        roomPrice
      }
      if (reserveId) {
        params.reserveId = reserveId
      }
      if (consumeHistoryId) {
        changeRoom(params).then(res => {
          cancel()
          proxy.$modal.msgSuccess("修改成功");
        })
      } else {
        replaceRoom(params).then(res => {
          cancel()
          proxy.$modal.msgSuccess("修改成功");
        })
      }
    }
  })

}

//弹框重置
function cancel() {
  emit('update:value', '')
  form.value={}
  selectRoomInfo.value = {};
}
</script>
<style lang="scss" scoped>
.change-icon{
  background: url('@/assets/img/cbank/zhuanhuan.png')no-repeat center center /100%;
  width: 40px;
  height: 40px;
}
</style>