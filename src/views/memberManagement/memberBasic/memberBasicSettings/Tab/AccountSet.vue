<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-21 14:56:51
 * @LastEditTime: 2024-03-15 14:51:33
 * @FilePath: /cbank-client/src/views/memberManagement/memberBasic/memberBasicSettings/Tab/AccountSet.vue
-->
<template>
  <div class="app-container content-box p-24">
    <div class="fw-500 mt-24">会员账户设置</div>
    <div class="my-20">同一会员账号，会员卡上限为5张</div>
    <div class="fw-500 my-24">
      消费扣款规则设置
    </div>
    <el-form ref="accountRef" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="消费扣款规则设置" prop="consumptionRules">
        <el-select
          v-model="form.consumptionRules"
          class="m-2"
          placeholder="请选择"
          style="width: 300px">
          <el-option
            v-for="item in ruleList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="fw-500 my-24">会员充值&消费短信设置</div>
    <el-form-item>
      <el-checkbox label="启用充值短信通知" v-model="form.rechargeSendMsg" />
      <el-checkbox label="启用消费短信通知" v-model="form.consumeSendMsg"/>
      <el-checkbox label="短信显示账户余额" v-model="form.msgByAmout"/>
    </el-form-item>
    <div class="ml-24">
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </div>
</template>

<script setup>
  import { getConsumptionRules, getMemberBasicSetting, saveMemberBasicSetting } from '@/api/member';
  
  const { proxy } = getCurrentInstance();
  const ruleList = ref([]);
  const data = reactive({
    form: {
      consumptionRules: undefined,
      rechargeSendMsg: false,
      consumeSendMsg: false,
      msgByAmout: false,
    },
    rules: {
      consumptionRules: [{ required: true, message: "不能为空", trigger: "blur" }],
    }
  })
  const { form, rules }  = toRefs(data);

  function submitForm() {
    proxy.$refs["accountRef"].validate(valid => {
      if (valid) {
        const d = form.value;
        const data = {
          consumptionRules: d.consumptionRules,
          rechargeSendMsg: d.rechargeSendMsg ? 1 : 0,
          consumeSendMsg: d.consumeSendMsg ? 1 : 0,
          msgByAmout: d.msgByAmout ? 1 : 0,
        }
        saveMemberBasicSetting(data).then(res => {
          if(res) {
            proxy.$modal.msgSuccess("操作成功");
          }
        })
      }
    })
  }

  function getRuleList() {
    getConsumptionRules().then(res => {
      if(res) {
        ruleList.value = res;
      }
    })
  }

  function getBasic() {
    getMemberBasicSetting().then(res => {
      form.value = {
        consumptionRules: res.consumptionRules,
        rechargeSendMsg: res.rechargeSendMsg == 1 ? true : false,
        consumeSendMsg: res.consumeSendMsg == 1 ? true : false,
        msgByAmout: res.msgByAmout == 1 ? true : false,
      }
    })
  }
  getRuleList();
  getBasic();
</script>

<style lang="scss" scoped>
.content-box {
  border-radius: 10px;
  background: #323745;
}
</style>