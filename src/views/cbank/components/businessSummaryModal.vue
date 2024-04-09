<!--
 * @Description: 营业汇总弹窗
 * @Author: pgm
 * @Date: 2024-02-27 14:17:12
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-18 16:16:17
 * @FilePath: /cbank-client/src/views/cbank/components/businessSummaryModal.vue
-->
<template>
  <el-drawer v-model="show" class="businessModal" size="701" append-to-body :before-close="cancel" destroy-on-close
    :with-header="false">
    <el-radio-group v-model="queryParams.type" class="d-flex jc-center al-center w100 mt-40" @change="handleQuery"
      size="large">
      <el-radio-button :label="1">营业汇总</el-radio-button>
      <el-radio-button :label="2">订房统计</el-radio-button>
    </el-radio-group>
    <!-- 营业汇总 -->
    <div class="m-24 border-1 business-modal-1" v-if="queryParams.type == 1">
      <el-row class="border-b">
        <el-col :span="8">
          <div>菜品收入</div>
          <div><span class="label">今：</span>¥{{ fenToYuan(businessData.todayDishTotalAmount) }}</div>
          <div><span class="label">已结：</span>¥{{ fenToYuan(businessData.todayDishSettlementAmount) }}</div>
          <div><span class="label">未结：</span>¥{{ fenToYuan(businessData.todayDishUnsettledAmount) }}</div>
          <div><span class="label">均销：</span>¥{{ fenToYuan(businessData.todayDishAverageAmount) }}</div>
          <div><span class="label">昨：</span>¥{{ fenToYuan(businessData.yesterdayDishTotalAmount) }}</div>
          <div><span class="label">均销：</span>¥{{ fenToYuan(businessData.yesterdayDishAverageAmount) }}</div>
        </el-col>
        <el-col class="border-l border-r" :span="8">
          <div>房台收入</div>
          <div><span class="label">今：</span>¥{{ fenToYuan(businessData.todayRoomTotalAmount) }}</div>
          <div><span class="label">已结：</span>¥{{ fenToYuan(businessData.todayRoomSettlementAmount) }}</div>
          <div><span class="label">未结：</span>¥{{ fenToYuan(businessData.todayRoomUnsettledAmount) }}</div>
          <div><span class="label">实收：</span>¥{{ fenToYuan(businessData.todayRoomRealIncomeAmount) }}</div>
          <div><span class="label">均销：</span>¥{{ fenToYuan(businessData.todayRoomAverageAmount) }}</div>
          <div><span class="label">昨：</span>¥{{ fenToYuan(businessData.yesterdayTotalAmount) }}</div>
          <div><span class="label">均销：</span>¥{{ fenToYuan(businessData.yesterdayAverageAmount) }}</div>
        </el-col>
        <el-col :span="8">
          <div>台票收入</div>
          <div><span class="label">今：</span>¥{{ fenToYuan(businessData.todayTicketAmount) }}</div>
          <div><span class="label">核销：</span>¥{{ fenToYuan(businessData.todayTicketVerificationAmount) }}</div>
          <div><span class="label">退票：</span>¥{{ fenToYuan(businessData.todayTicketBackAmount) }}</div>
          <div><span class="label">昨：</span>¥{{ fenToYuan(businessData.yesterdayTicketAmount) }}</div>
        </el-col>
      </el-row>
      <el-row class="border-b">
        <el-col :span="8">
          <div>房台/人数</div>
          <div>{{ businessData.roomAndPeoples }}</div>
        </el-col>
        <el-col class="border-l border-r" :span="8">
          <div>已开房台</div>
          <div>{{ businessData.openRoomSize }}</div>
        </el-col>
        <el-col :span="8">
          <div>开台率</div>
          <div>{{ businessData.openRoomRate }}</div>
        </el-col>
      </el-row>
      <el-row class="border-b">
        <el-col :span="8">
          <div>在店</div>
          <div>{{ businessData.insideRoomSize }}</div>
        </el-col>
        <el-col class="border-l border-r" :span="8">
          <div>未到</div>
          <div>{{ businessData.outsideRoomSize }}</div>
        </el-col>
        <el-col :span="8">
          <div>客离</div>
          <div>{{ businessData.leaveRoomSize }}</div>
        </el-col>
      </el-row>
      <el-row class="border-b">
        <el-col :span="8">
          <div>降销差额</div>
          <div>￥{{ fenToYuan(businessData.minConsumptionDifferenceAmount) }}</div>
        </el-col>
        <el-col class="border-l border-r" :span="8">
          <div>折扣金额</div>
          <div>￥{{ fenToYuan(businessData.discountAmount) }}</div>
        </el-col>
        <el-col :span="8">
          <div>赠送金额</div>
          <div>￥{{ fenToYuan(businessData.giveAmount) }}</div>
        </el-col>
      </el-row>
      <el-row class="border-b">
        <el-col :span="8">
          <div>退单金额</div>
          <div>￥{{ fenToYuan(businessData.refundAmount) }}</div>
        </el-col>
        <el-col class="border-l border-r" :span="8">
          <div>新增会员</div>
          <div>Todo</div>
        </el-col>
        <el-col :span="8" class="p-24 ">
          <div>会员余额</div>
          <div>Todo</div>
        </el-col>
      </el-row>
      <el-row class="border-b">
        <el-col :span="8" class="p-24">
          <div>会员充值</div>
          <div>Todo</div>
        </el-col>
        <el-col class="border-l border-r p-24" :span="8">
          <div>存酒数</div>
          <div>Todo</div>
        </el-col>
        <el-col :span="8" class="p-24">
          <div>取酒数</div>
          <div>Todo</div>
        </el-col>
      </el-row>
    </div>
    <div class="m-24 business-modal-2" v-if="queryParams.type == 2">
      <div class="d-flex al-center w100 ">
        <div class="mx-20 pointer flex-1 text-center" v-for="item in tableTypeMap" :key="item.type"
          @click="tableChange(item.type)">
          <div class="tab-border" :class="tableType == item.type ? 'isactive' : ''"> {{ item.name }}</div>
        </div>
      </div>
      <el-table :data="tabList" class="border-1" height="100%" v-loading="tableLoaing">
        <el-table-column label="部门" v-if="[1].includes(tableType)" align="center" prop="organizationName" :show-overflow-tooltip="true" />
        <el-table-column label="部门" v-if="[2].includes(tableType)" align="center" prop="backReservation"   :show-overflow-tooltip="true" />
        <el-table-column label="艺名" v-if="[3].includes(tableType)" align="center" prop="userCompanyName"   />
        <el-table-column label="艺名" v-if="[4].includes(tableType)" align="center" prop="backReservation"   />
        <el-table-column label="自订" v-if="[1,3].includes(tableType)" align="center" prop="haveReservation"  />
        <el-table-column label="返还对象" v-if="[2,4].includes(tableType)" v align="center" prop="reservationName"  />
        <el-table-column label="房台号" v-if="[2,4].includes(tableType)" align="center" prop="roomName"   />
        <el-table-column label="返房" v-if="[1,3].includes(tableType)" align="center" prop="backReservation"  />
        <el-table-column label="开台/总" align="center" v-if="[1,3].includes(tableType)"  prop="openRoomAndSum" :show-overflow-tooltip="true"  />
        <el-table-column label="总数" align="center" v-if="[2,4].includes(tableType)" prop="backReservationSumNumber"  />
      </el-table>
    </div>
  </el-drawer>
</template>

<script setup>
import { businessSummary,departmentReservation,departmentBackRoom,personalReservation,personalBackRoom } from '@/api/cbank'
import { fenToYuan } from '@/utils';
const emit = defineEmits(["update:value"])
const props = defineProps({
  value: {
    type: String,
    require: true,
    default: ''
  },

})
const tableLoaing = ref(false)
const queryParams = ref({
  type: 1
})
const tableTypeMap = ref([
  { type: 1, name: '部门订房' },
  { type: 2, name: '部门返房' },
  { type: 3, name: '个人订房' },
  { type: 4, name: '个人返房' }
])
const tableType = ref(1)
const tabList = ref([])
const businessData = ref({})
//弹窗控制
const show = computed(() => {
  if (props.value == 'businessSummaryModal') {
    init()
  }
  return props.value == 'businessSummaryModal'
})


/** tab切换 */
function handleQuery(index) {
  if (index == 2) {
    getTabList(1)
  }
  // queryParams.value.pageNum = 1;
  // getList();
  // getTabList(index)
}

const tableChange = (index) => {
  if (tableLoaing.value) {
    return
  }
  tableType.value = index
  getTabList(index)
}
const getTabList = (index) => {
  tabList.value = null
  let func;
  switch (index) { 
    case 1:
      func=departmentReservation
      break;
    case 2:
      func=departmentBackRoom
      break;
    case 3:
      func=personalReservation
      break;
    case 4:
      func=personalBackRoom
      break;
  }
  if (func) {
    tableLoaing.value =true
    func().then(res => {
      tableLoaing.value = false
      tabList.value =res
    }).catch(() => {
      tableLoaing.value = false
    })
  }
}

const init = () => {
  businessSummary().then(res => {
    businessData.value =res
  })
}

//弹框重置
function cancel() {
  tableType.value = 1
  queryParams.value.type = 1
  emit('update:value', '')
  // form.value={}
  // selectRoomInfo.value = {};
}
</script>

<style lang="scss" scoped>
.business-modal-1 {
  line-height: 1.2;

  .el-row {
    .el-col {
      padding: 24px;
      padding-bottom: 12px;

      &>div {
        padding-bottom: 12px;
      }
    }
  }
}
span.label{
  display: inline-block;
  width: 50px;
}
.business-modal-2 {
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

}
</style>