<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-19 15:33:07
 * @LastEditTime: 2024-03-22 17:40:53
 * @FilePath: /cbank-client/src/views/memberManagement/memberInfo/memberInformation/Modal/MemberModal.vue
-->

<template>
  <el-dialog title="新增会员" :model-value="visible" width="790px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <el-form ref="memberRef" :model="form" :rules="rules" label-width="110px">
      <el-row>
        <el-col :span="11">
          <el-form-item label="客人昵称" prop="memberName">
             <el-input v-model="form.memberName" placeholder="请输入"/>
          </el-form-item>
          <el-form-item label="手机号" prop="memberMobile">
             <el-input v-model="form.memberMobile" placeholder="请输入"/>
          </el-form-item>
          <el-form-item label="会员卡类型" prop="accountTypeName">
            <el-select
              v-model="form.accountTypeName"
              class="m-2"
              @change="handleChangeAccountType($event)"
              placeholder="请选择">
              <el-option
                v-for="item in memberCardTypeList"
                :key="item.id"
                :label="item.typeName"
                :value="item"
              />
            </el-select>
          </el-form-item>
           <!-- <el-form-item label="会员卡号" prop="cardNum"  class="card-num">
            <span>111</span>
          </el-form-item> -->
          <el-form-item label="推荐人" prop="reference" class="card-reference">
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
          <el-form-item label="办卡人">
            <el-select
              v-model="form.cardHolderName"
              class="m-2"
              @change="handleChangeCardHolder($event)"
              placeholder="请选择">
              <el-option
                v-for="item in referenceList"
                :key="item.userId"
                :label="item.nickname"
                :value="item"
              />
            </el-select>
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
          <el-form-item label="性别" prop="memberSex">
            <el-radio-group v-model="form.memberSex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="设置密码" prop="accountPassward" class="pwd">
            <el-input type="password" v-model="form.accountPassward" placeholder="请输入"/>
            <div class="tip">若未设置，则默认密码123456</div>
          </el-form-item>
          <!-- <el-form-item label="会员卡ID" prop="cardIdNum">
            <el-input v-model="form.cardIdNum" placeholder="请输入"/>
            <div class="tip">实体会员卡的ID，若无实体卡，则无需填写</div>
          </el-form-item> -->
          <el-form-item label="推荐人手机号" prop="referencePhone">
            <span>{{ reference && reference.loginName}}</span>
          </el-form-item>
          <el-form-item label="办卡人手机号" prop="cardHolderPhone">
            <span>{{ cardHolder && cardHolder.loginName}}</span>
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
        <el-col>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
          </el-form-item>
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
  import { addMemberWithCard, getMemberCardTypes } from '@/api/member';
  import { listUser } from '@/api/system/user';
  
  const { proxy } = getCurrentInstance();

  const props = defineProps({
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
  })

  const initData = {
    memberName: undefined,
    memberSex: 1,
    memberMobile: null,
    referrerName: undefined,
    accountTypeName: undefined,
    cardHolderName: undefined,
    // rechargePlace: undefined,
    accountPassward: undefined,
    // cardIdNum: undefined,
    // cardHolderPhone: undefined,
    // consumptionPlace: undefined,
    remark: undefined,
  }
  const data = reactive({
    form: {
      ...initData,
    },
    rules: {
      memberName: [{ required: true, message: "不能为空", trigger: "blur" }],
      memberSex: [{ required: true, message: "不能为空", trigger: "blur" }],
      memberMobile: [{ required: true, message: "不能为空", trigger: "blur" }],
      accountTypeName: [{ required: true, message: "不能为空", trigger: "blur" }],
    }
  })

  const referenceList = ref([]);
  const memberCardTypeList = ref([]);
  const placeList = ref([]);
  const consumptionPlaceList = ref([]);

  const memberRef = ref(null);
  const emit = defineEmits([ 'cancel', 'success']);

  const { visible } = toRefs(props);
  const { form, rules }  = toRefs(data);


 function getMemberCardList() {
    getMemberCardTypes({searchSource: 0}).then(res => {
      if(res) {
        memberCardTypeList.value = res;
      }
    });
  }

  function handleBeforeClose() {
    emit('cancel');
    form.value = {
      ...initData
    };
  }
  const reference = ref({});
  const cardHolder = ref({});
  const accountType = ref({});
  function handleChangeReference(v) {
    form.value.referrerName = v.nickname;
    reference.value = v;
  }
  function handleChangeCardHolder(v) {
    form.value.cardHolderName = v.nickname;
    cardHolder.value = v;
  }
  function handleChangeAccountType(v) {
    form.value.accountTypeName = v.typeName;
    accountType.value = v;
  } 
  function submitForm() {
    proxy.$refs["memberRef"].validate(valid => {
    if (valid) {
      const d = form.value;
      const data = {
        memberName: d.memberName,
        memberMobile: d.memberMobile,
        memberSex: d.memberSex,
        accountTypeId: accountType.value.id,
        accountTypeName: accountType.value.typeName,
        accountPassward: d.accountPassward,
        remark: d.remark,
        sourceMode: 0,
      }
      if(reference.value) {
        data.referrerId = reference.value.userId;
        data.referrerMobile = reference.value.loginName;
        data.referrer = reference.value.nickname;
      }
      if(cardHolder.value) {
        data.cardHandlerId = cardHolder.value.userId;
        data.cardHandlerMobile = cardHolder.value.loginName;
        data.cardHandler = cardHolder.value.nickname;
      }
      addMemberWithCard(data).then(res => {
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

  getUserList()
  getMemberCardList();
</script>

<style lang="scss" scoped>
  .tip {
    color: #ADADAD;
    font-size: 13px;
  }
  .card-num {
    margin: 44px 0 18px 0;
  }
  .pwd {
    margin-top: 66px;
  }
</style>
