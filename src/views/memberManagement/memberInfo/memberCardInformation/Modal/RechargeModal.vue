<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-20 17:07:35
 * @LastEditTime: 2024-03-08 17:35:54
 * @FilePath: /cbank-client/src/views/memberManagement/memberInfo/memberCardInformation/Modal/RechargeModal.vue
-->

<template>
  <el-dialog title="充值" :model-value="visible" width="790px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <!-- <el-form ref="memberRef" :model="form" :rules="rules" label-width="70px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号"/>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
            <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-col>
        <el-col v-if="showCard">
          <el-table ref="tableRef" :data="list" >
            <el-table-column label="序号" type="index" width="50" />
            <el-table-column label="所在场所" align="center" key="oldNick" prop="oldNick" :show-overflow-tooltip="true" />
            <el-table-column label="卡号" align="center" key="operator" prop="operator" />
            <el-table-column label="总余额" align="center" key="updateTime" prop="updateTime" :show-overflow-tooltip="true"/>
          </el-table>
        </el-col>
      </el-row>
    </el-form> -->
    <div>
      <div>
        <div class="fw-500 my-12">会员卡信息</div>
        <div class="card-info">
          <div>
            <span>会员昵称：{{ dataSource && dataSource.memberName }}</span>
            <span>会员卡号：{{ dataSource && dataSource.accountCardNumber }}</span>
            <span>会员卡类型：{{ dataSource && dataSource.accountTypeName }}</span>
          </div>
          <div class="my-10">
            <span>当前充值余额：¥{{ dataSource && dataSource.accountBalanceRecharge}}</span>
            <span>当前赠送余额：¥{{ dataSource && dataSource.accountBalanceDonate }}</span>
            <!-- <span>当前体验余额：¥2000</span> -->
          </div>
        </div>
        <div class="fw-500 my-12">会员卡充值</div>
        <el-table :data="tableData">
          <el-table-column align="center" prop="runningAmount" label="支付金额">
            <template #default="scope">
              <el-input type="number" v-model="scope.row.runningAmount" style="width: 200px" placeholder="请输入"/>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="state" label="支付方式">
            <template #default="scope">
              <el-select
                v-model="scope.row.paymentMethodName"
                class="m-2"
                placeholder="请选择"
                @change="handleChangeReference($event, scope.$index)"
                style="width: 200px"
              >
                <el-option
                  v-for="item in payMethodList"
                  :key="item.id"
                  :label="item.payName"
                  :value="item"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click.prevent="deleteRow(scope.$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="mt-4" style="width: 100%" @click="onAddItem">新增</el-button>
      </div>
      <el-form ref="rechargeRef" :model="form1" :rules="rules1" label-width="110px">
        <el-row class="my-12">
          <el-col :span="6">
            <el-form-item label="充值金额" label-width="70px">
              <span>¥{{ totalRechargeAmount }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="赠送金额" prop="donateAmount">
              <el-input v-model="form1.donateAmount" placeholder="请输入"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="sendSmsTag">
              <el-checkbox v-model="form1.sendSmsTag" label="是否发送短信" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <div class="fw-500 my-12">绑定房台</div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="房台" prop="room"  label-width="70px">
              <el-input v-model="form1.room" placeholder="请输入"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="推荐人1" prop="room" label-width="70px">
              <el-input v-model="form1.room" placeholder="请输入"/>
            </el-form-item>
            <el-form-item label="推荐人2" prop="room" label-width="70px">
              <el-input v-model="form1.room" placeholder="请输入"/>
            </el-form-item>
           </el-col>
           <el-col :span="11" :offset="1">
            <el-form-item label="推荐人1手机号" prop="room">
              <el-input v-model="form1.room" placeholder="请输入"/>
            </el-form-item>
            <el-form-item label="推荐人2手机号" prop="room">
              <el-input v-model="form1.room" placeholder="请输入"/>
            </el-form-item>
           </el-col>
           <el-col>
            <el-form-item label="备注" prop="remark" label-width="70px">
              <el-input v-model="form.remark" placeholder="请输入" clearable />
            </el-form-item>
           </el-col>
        </el-row> -->
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  import { rechargeMemberCard } from '@/api/member';
  import { getPayMethodList } from '@/api/cashier';
  import { fenToYuan, yuanTofen } from '@/utils/index.js';

  const { proxy } = getCurrentInstance();
  const list = ref([]);

  const props = defineProps({
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
    dataSource: {
      type: Object,
      require: true,
      default: null
    }
  })

  const data = reactive({
    form: {
      phone: null,
    },
    rules: {
      phone: [{ required: true, message: "不能为空", trigger: "blur" }],
    }
  })
  const data1 = reactive({
    form1: {
      donateAmount: null,
      sendSmsTag: false,
    },
    rules1: {
    }
  })

  const memberRef = ref(null);
  const rechargeRef = ref(null);
  const tableData = ref([]);
  const payMethodList = ref([]);
  const emit = defineEmits([ 'cancel', 'success']);

  const { visible, dataSource } = toRefs(props);
  const { form, rules }  = toRefs(data);
  const { form1, rules1 }  = toRefs(data1);

  const totalRechargeAmount = ref(0);
  function handleBeforeClose() {
    emit('cancel');
    form.value = {};
  }

  function handleChangeReference(v, i) {
    tableData.value[i].paymentMethodName = v.payName;
    tableData.value[i].paymentMethodId = v.id;
  }

  const showCard = ref(false);
  function handleSearch() {
    showCard.value = true;
  }

  const deleteRow = (index) => {
    tableData.value.splice(index, 1)
  }

  const onAddItem = () => {
    const Len = tableData.value.length;
    if(Len >= 3) {
      proxy.$modal.msgWarning("不能超过3种支付方式");
      return;
    }
    tableData.value.push({
      id: Len > 0 ? tableData.value[Len -1].id + 1 : 1,
      paymentMethodId: undefined,
      paymentMethodName: undefined,
      runningAmount: undefined,
    })
  }

  watch(
    () => tableData.value,
    val => {
      if(val) {
        let amount = 0;
        val.forEach(item => {
          if(item.paymentMethodId && item.runningAmount) {
            amount += Number(item.runningAmount);
          }
        })
        totalRechargeAmount.value = amount;
      }
    },
    { deep: true, immediate: true }
  )

  function submitForm() {
    const list = [];
    tableData.value.forEach(item => {
      if(item.paymentMethodId && item.runningAmount) {
        item.runningAmount = Number(item.runningAmount)
        list.push(item);
      }
    })
    if(list.length == 0) {
      proxy.$modal.msgWarning("请填写支付方式");
      return;
    }
    const d1 = form1.value;
    const data = {
      accountId: dataSource.value.id,
      rechargeAmount: totalRechargeAmount.value,
      donateAmount: d1.donateAmount,
      sendSmsTag: d1.sendSmsTag ? 1 : 0,
      detailDTOS: JSON.stringify(list)
    }
    rechargeMemberCard(data).then(res => {
      if(res) {
        proxy.$modal.msgSuccess("操作成功");
        emit('success')
        form1.value = {
          donateAmount: null,
          sendSmsTag: false,
        }
      }
    })
  }

  function cancel() {
    emit('cancel');
    form.value = {};
  }
  function getMethodList() {
    getPayMethodList().then(res => {
      payMethodList.value = res;
    })
  }
  getMethodList();
</script>


<style lang="scss" scoped>
  .tip {
    color: #ADADAD;
    font-size: 13px;
  }
  .card-num {
    margin: 44px 0;
  }
  .card-info {
    > div {
      display: flex;
       > span {
        margin-right: 24px;
      }
    }
  }
</style>
