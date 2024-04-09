<!--
 * @Description: 修改会员卡
 * @Author: 尚夏
 * @Date: 2024-02-20 15:30:52
 * @LastEditTime: 2024-03-08 14:40:54
 * @FilePath: /cbank-client/src/views/memberManagement/memberInfo/memberCardInformation/Modal/EditMemberCard.vue
-->
<template>
  <el-dialog title="修改会员卡" :model-value="visible" width="790px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <el-form ref="memberRef" :model="form" :rules="rules" label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号" prop="memberMobile">
            <el-input v-model="form.memberMobile" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="会员昵称" prop="memberName">
            <el-input v-model="form.memberName"  disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="会员卡类型" prop="accountTypeName">
            <el-input v-model="form.accountTypeName"  disabled/>
          </el-form-item>
          <el-form-item label="会员卡号"  class="card-num">
            <el-input v-model="form.accountCardNumber" disabled></el-input>
          </el-form-item>
          <el-form-item label="推荐人" prop="reference">
            <el-select
              v-model="form.referrerName"
              class="m-2"
              @change="handleChangeReference($event)"
              placeholder="请选择">
              <el-option
                v-for="item in referenceList"
                :key="item.userId"
                :label="item.nickname"
                :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="办卡人" >
            <el-input v-model="form.cardHandler" disabled></el-input>
          </el-form-item>
          <!-- <el-form-item label="允许充值场所" prop="rechargePlace">
            <el-select
              v-model="form.rechargePlace"
              class="m-2"
              placeholder="请选择"
              multiple>
              <el-option
                v-for="item in placeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="设置密码" prop="password">
            <el-input type="password" v-model="form.password" placeholder="请输入"/>
            <div class="tip">若未设置，则默认密码123456</div>
          </el-form-item>
          <!-- <el-form-item label="会员卡ID" prop="cardIdNum">
            <el-input v-model="form.cardIdNum" placeholder="请输入"/>
            <div class="tip">实体会员卡的ID，若无实体卡，则无需填写</div>
          </el-form-item> -->
          <el-form-item label="推荐人手机号" prop="referencePhone" class="card-reference">
            <span>{{ reference && reference.loginName}}</span>
          </el-form-item>
          <el-form-item label="办卡人手机号" prop="cardHolderPhone">
            <span>{{ form.cardHandlerMobile }}</span>
          </el-form-item>
          <!-- <el-form-item label="允许消费场所" prop="consumptionPlace">
            <el-select
              v-model="form.consumptionPlace"
              class="m-2"
              placeholder="请选择"
              multiple>
              <el-option
                v-for="item in consumptionPlaceList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  import { updateMemberCard } from '@/api/member';
  import { listUser } from '@/api/system/user';
  const { proxy } = getCurrentInstance();

  const props = defineProps({
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
    dataSource: {
      type: Object,
      require: true,
      default: {}
    }
  })

  const initData = {
    memberName: undefined,
    memberMobile: null,
    accountTypeName: undefined,
    accountCardNumber: undefined,
    cardHandler: undefined,
    cardHandlerMobile: undefined,
    referrerName: undefined,
  };
  const data = reactive({
    form: {
      ...initData,
    },
    rules: {
      memberName: [{ required: true, message: "不能为空", trigger: "blur" }],
      memberMobile: [{ required: true, message: "不能为空", trigger: "blur" }],
      accountTypeName: [{ required: true, message: "不能为空", trigger: "blur" }],
      rechargePlace: [{ required: true, message: "请选择", trigger: "blur" }],
      consumptionPlace: [{ required: true, message: "请选择", trigger: "blur" }],
    }
  })

  const referenceList = ref([]);
  const cardHolderList = ref([]);
  const memberCardTypeList = ref([]);
  const placeList = ref([]);
  const consumptionPlaceList = ref([]);

  const memberRef = ref(null);
  const emit = defineEmits([ 'cancel', 'success']);

  const { visible, dataSource } = toRefs(props);
  const { form, rules }  = toRefs(data);

  const accountType = ref({});
  const reference = ref({});
  watch(
    () => dataSource.value,
    val => {
      if(val) {
        form.value = {
          memberName: val.memberName,
          memberMobile: val.memberMobile,
          accountTypeName: val.accountTypeName,
          accountCardNumber: val.accountCardNumber,
          cardHandler: val.cardHandler,
          cardHandlerMobile: val.cardHandlerMobile,
          referrerName: val.referrer,
        }
        reference.value = {
          userId: val.referrerId,
          loginName: val.referrerMobile,
          nickname: val.referrer,
        }
        accountType.value = {
          id: val.accountTypeId,
          typeName: val.accountTypeName,
        }
      }
    },
    { deep: true, immediate: true }
  )
  function handleBeforeClose() {
    emit('cancel');
    form.value = {};
  }

  
  function handleChangeReference(v) {
    form.value.referrerName = v.nickname;
    reference.value = v;
  }

  function submitForm() {
    proxy.$refs["memberRef"].validate(valid => {
    if (valid) {
      const d = form.value;
      const data = {
        id: dataSource.value.id,
        accountTypeId: accountType.value.id,
        accountTypeName: accountType.value.typeName,
        accountPassward: d.accountPassward,
      }
      if(reference.value) {
        data.referrerId = reference.value.userId;
        data.referrerMobile = reference.value.loginName;
        data.referrer = reference.value.nickname;
      }
      
      updateMemberCard(data).then(res => {
        if(res) {
          proxy.$modal.msgSuccess("操作成功");
          emit('success');
          form.value = {
            ...initData
          }
        }
      })
    }})
  }

  function cancel() {
    emit('cancel');
    form.value = {};
  }

  function getUserList() {
    listUser({ pageNum:1, pageRow: 9999}).then(res => {
      if(res) {
        referenceList.value = res.list;
      }
    })
  }
  getUserList();

</script>

<style lang="scss" scoped>
  .tip {
    color: #ADADAD;
    font-size: 13px;
  }
  .card-num {
    margin: 44px 0;
  }
  .card-reference {
     margin: 90px 0 18px 0;
  }
</style>