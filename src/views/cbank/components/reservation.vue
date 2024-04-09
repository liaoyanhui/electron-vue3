<!--
 * @Description: 预定信息模块
 * @Author: pgm
 * @Date: 2024-01-27 00:39:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-19 18:16:59
 * @FilePath: /cbank-client/src/views/cbank/components/reservation.vue
-->
<template>
  <div>
    <div class="d-flex al-center jc-between color-fff py-12 px-24 border-b">
    <div >{{ title }}</div>
    <el-button type="primary" @click="cancel">
      返回收银台
    </el-button>
  </div>
  <el-form :model="form" ref="configRef" :inline="true" label-width="80px" class="pt-20">
    <el-row>
      <el-col :span="12">
        <el-form-item label="手机号" prop="ipaddr">
          <el-input v-model="form.custMobile" placeholder="请输入手机号" class="input-with-select" max="11"
            style="width: 400px">
            <template #append>
              <el-button />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="人数" prop="custNum">
          <el-input-number v-model="form.custNum" :min="1" :precision="0" :step="1"  :max="99" style="width: 400px" />
        </el-form-item>
        <el-form-item label="订房人" prop="reservationId">
          <SelectPeople v-model:value="form.reservationId" v-model:label="form.reservationName" :typeFilter="[2,3]"
            :disabled="form.isTurnRoom" v-model:type="form.reservationType" placeholder="请选择订房人" automatic-dropdown
            style="width: 400px">
          </SelectPeople>
        </el-form-item>
        <el-form-item label="返房人" prop="giveRoomId">
          <SelectPeople v-model:value="form.giveRoomId" v-model:label="form.giveRoomName" :typeFilter="[2,3]" :disabled="form.isTurnRoom"
            v-model:type="form.giveRoomType" placeholder="请选择返房人" automatic-dropdown style="width: 400px">
          </SelectPeople>

        </el-form-item>
        <el-form-item label="带房人" prop="belongId">
          <SelectPeople v-model:value="form.belongId" v-model:label="form.belongName" :typeFilter="[2,3]" :disabled="form.isTurnRoom"
            v-model:type="form.belongType" placeholder="请选择带房人" automatic-dropdown style="width: 400px">
          </SelectPeople>
        </el-form-item>
        <el-row>
          <el-form-item label="轮房" prop="isTurnRoom">
            <el-switch v-model="form.isTurnRoom" @change="isTurnRoomChange" />
          </el-form-item>
          <el-form-item label="" prop="turnRoomId">
            <SelectPeople v-model:value="form.turnRoomId" v-model:label="form.turnRoomName" :typeFilter="[2,3]" :disabled="!form.isTurnRoom"
              v-model:type="form.turnRoomType" placeholder="请选择轮房人" automatic-dropdown style="width: 300px">
            </SelectPeople>
          </el-form-item>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" clearable style="width: 400px" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="房源" prop="roomSource">
          <el-select v-model="form.roomSource" placeholder="请选择房源类型" style="width: 400px" class="custom-select">
            <el-option v-for="item in typeListMap" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="客人称呼" prop="custName">
          <el-input v-model="form.custName" placeholder="请输入客户姓名" clearable style="width: 400px" />
        </el-form-item>
        <el-form-item label="预抵时间" prop="reservationOverTime">
          <el-time-picker type="date" v-model="form.reservationOverTime" :disabled-hours="disabledHours"
            :disabled-minutes="disabledMinutes" format="HH:mm" value-format="HH:mm" style="width: 400px"></el-time-picker>
          <!-- <TimePicker :id="'32'" :time="form.reservationOverTime" @selectTime="(time) => form.reservationOverTime = time" /> -->
        </el-form-item>
        <el-form-item label="">
          <div class="time-box">
            <el-row>
              <el-col :span="8" v-for="(item, index) in timeList" :key="item">
                <div :class="{ 'isactive': form.reservationOverTime === item, 'mb-20 ': index < 3 }"
                  class="pl-22 border-1 mr-50 radius-4" effect="plain" @click="form.reservationOverTime = item"> {{ item }}
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item label="房台低消" prop="custName">
          <span>￥</span>
          <el-input-number ref="minConsumptionInputRef" v-show="priceEdit" v-model="minConsumption" placeholder="请输入房台低消"
            style="width: 120px" :precision="2" :step="0.01" controls-position="right" :controls="false"
            @blur="() => priceEdit = false" />
          <span v-show="!priceEdit">{{ fenToYuan(form.minConsumption) }} </span>
          <span class="edit" @click="minConsumptionEditHandler"></span>
        </el-form-item>
        <el-form-item label="开台套餐" prop="custName">
          <el-select v-model="form.packageId" filterable placeholder="请选择开台套餐" style="width: 400px"
            :disabled="[3, 5, 7].includes(roomInfo.useStatus)" clearable>
            <el-option v-for="item in openPlatformPackageList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <div class="d-flex al-center ml-50">
        <el-button @click="cancel" size="large" class="ml-30">取 消</el-button>
        <el-button type="primary" @click="submitForm" size="large">提交</el-button>
      </div>
    </el-row>
  </el-form>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { addRoomReserve, updateRoomReserveInfo, getRoomReserveInfo } from '@/api/cbank'
import SelectPeople from '@/components/SelectPeople/SelectPeople.vue';
import { fenToYuan, yuanTofen } from '@/utils'
import { useDishesSystemStore } from '@/store/system'
import { computed } from 'vue';
const dishesSystemSote = useDishesSystemStore()
const { proxy } = getCurrentInstance();
const props = defineProps({
  roomInfo: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    default:''
  }
})
const emit = defineEmits(['reset'])

const minConsumptionInputRef = ref()
const priceEdit = ref(false)
const data = reactive({
  form: { custNum: 1, reservationId: '', turnRoomType: '', reservationOverTime: '' },
  queryParams: {
    typeName: undefined,
    useStatus: '',
    roomTypeId: '',
    areaId: '',
    isTurnRoom: false
  },
  rules: {
    name: [{ required: true, message: "房台不能为空", trigger: "blur" }],
    areaId: [{ required: true, message: "请选择房台区域", trigger: "change" }],
    roomTypeId: [{ required: true, message: "请选择房台类型", trigger: "change" }],
    minConsumption: [{ required: true, message: "请输入最低消费", trigger: "blur" }],
    price: [{ required: true, message: "请输入房台价格", trigger: "blur" }],
  }
});
let openPlatformPackageList = ref([])
const loading = ref(false)
const timeList = ref([])


const typeListMap = ref([
  { name: "散客", value: 1 },
  { name: "公司房", value: 2 },
  { name: "招待房", value: 3 },
  { name: "团购", value: 4 },
  { name: "任务房", value: 5 },
])

const { form, rules } = toRefs(data)

const disabledHours = () => {
  return []
  //TODO
  // const hours = [];
  // const currentHour = new Date().getHours();
  // if (currentHour < 12) {
  //   // 如果当前时间小于12点，禁止选择12点及以后的时间
  //   return Array.from({ length: currentHour}, (v, k) => k).concat(Array.from({ length: 12 }, (v, k) => 12 + k));
  // } else {
  //   // 如果当前时间大于等于12点，禁止选择当前小时及以后的时间
  //   return Array.from({ length: currentHour - 12 }, (v, k) => 12 + k);
  // }
}
const disabledMinutes = (selectedHour) => {
  return []
  //TODO
  // if (selectedHour === new Date().getHours()) {
  //   const currentMinute = new Date().getMinutes();
  //   return Array.from({ length: currentMinute }, (v, k) => k);
  // } else {
  //   // 如果选中的小时不是12点或者20点，不禁止选择任何分钟
  //   return [];
  // }
}

const isTurnRoomChange = (val) => {
  if (val) {
    form.value.reservationType = ''
    form.value.reservationId = ''
    form.value.giveRoomType = ''
    form.value.giveRoomId = ''
    form.value.belongType = ''
    form.value.belongId = ''
    form.value.giveRoomName = ""
    form.value.reservationName = ""
    form.value.belongName = ""
  } else {
    form.value.turnRoomType = 0
    form.value.turnRoomId = 0
    form.value.turnRoomName = ''
  }
}

// 房台低消
const minConsumption = computed({
  get: () => {
    return fenToYuan(form.value.minConsumption) / 1
  },
  set: (val) => {
    form.value.minConsumption = yuanTofen(val)
  }
})

// 房台低消修改
const minConsumptionEditHandler = () => {
  priceEdit.value = true
  minConsumptionInputRef.value.focus()
}

watch(() => form.value.turnRoomId, (val) => {
  if (val) {
    form.value.reservationType = form.value.turnRoomType
    form.value.reservationId = val
    form.value.reservationName = form.value.turnRoomName
  }
})

//获取自定义预选时间列表
const getTimeList = () => {
  // 获取当前时间
  const now = dayjs();
  // 获取当前时间的分钟数
  const currentMinute = now.minute();
  // 计算距离下一个半点还有多少分钟
  let minutesToAdd = 30 - (currentMinute % 30);
  // 如果当前时间已经是半点或者之后，就需要跳到下一个小时的半点
  if (minutesToAdd === 0) {
    minutesToAdd = 30;
  }
  // 获取当前时间的下一个半点时间
  const nextHalfHour = now.add(minutesToAdd, 'minute');
  const end = nextHalfHour.add(3, 'hour');
  // 每半小时输出一次时间
  let cur = nextHalfHour;
  let arr = []
  while (cur.isBefore(end)) {
    // 输出当前时间
    arr.push(cur.format('HH:mm'))
    // 加半小时
    cur = cur.add(30, 'minute');
  }
  timeList.value = arr
}

//获取开台套餐列表
const getPackageList = () => {
  dishesSystemSote.getOpenPlatformPackageRoom().then(res => {
    openPlatformPackageList.value = res
  })
}
const cancel = () => {
  emit('reset')
}

// 暴露给父组件的方法
const submitForm = () => {
  proxy.$refs["configRef"].validate(valid => {
    if (valid) {
      let { roomId, consumeHistoryId: roomConsumeHistoryId, useStatus } = props.roomInfo
      console.log(' props.roomInfo==>', props.roomInfo)
      let params = {
        ...form.value,
        roomId,
        useStatus: 1,
        roomConsumeHistoryId,
      }
      console.log('form.value', form.value)
      if (useStatus == 0) {
        addRoomReserve(params).then(() => {
          proxy.$modal.msgSuccess("操作成功");
          cancel()
        })
      } else if (useStatus >= 1) {
        updateRoomReserveInfo(params).then(response => {
          proxy.$modal.msgSuccess("操作成功");
          cancel()
        });
      } else {
        proxy.$modal.msgWarning("当前房台不能预约" + useStatus);
      }

    }
  });

};


const init = ()=>{
  let { roomId } = props.roomInfo
  getRoomReserveInfo({ roomId }).then(res => {
    let custNum = res.custNum || 1
    let isTurnRoom = !!res.turnRoomId && !!res.turnRoomType
    let type = res.roomSource || 1
    if (!res.packageId) {
      res.packageId =null
    }
    form.value = { ...res, custNum,isTurnRoom, type }
  })
  getTimeList()
  getPackageList()
}

init()


</script>

<style scoped>
.time-box {
  margin-left: 80px;
}

.edit {
  background: url('@/assets/img/edit-icon.png')no-repeat center center /100%;
  width: 16px;
  height: 16px;
  margin-left: 20px;
}
</style>