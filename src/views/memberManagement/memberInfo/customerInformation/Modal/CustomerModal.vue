<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-19 15:33:07
 * @LastEditTime: 2024-03-07 20:44:56
 * @FilePath: /cbank-client/src/views/memberManagement/memberInfo/customerInformation/Modal/CustomerModal.vue
-->

<template>
  <el-dialog title="新增客户" :model-value="visible" width="504px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <el-form ref="customerRef" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="客人昵称" prop="memberName">
        <el-input v-model="form.memberName" placeholder="请输入昵称"/>
      </el-form-item>
      <el-form-item label="性别" prop="memberSex">
        <el-radio-group v-model="form.memberSex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号" prop="memberMobile">
        <el-input v-model="form.memberMobile" placeholder="请输入手机号"/>
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
      <el-form-item label="推荐人手机号" prop="referrerMobile">
        <span>{{ reference && reference.loginName}}</span>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
      </el-form-item>
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
  import { listUser } from '@/api/system/user';
  import { addMember } from '@/api/member';
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
    remark: undefined,
  };
  const data = reactive({
    form: {
      ...initData
    },
    rules: {
      memberName: [
        { required: true, message: "不能为空", trigger: "blur" },
        { max: 20, message: '不能超过20个字符', trigger: "blur" }
      ],
      memberSex: [{ required: true, message: "不能为空", trigger: "blur" }],
      memberMobile: [{ required: true, message: "不能为空", trigger: "blur" }],
    }
  })

  const referenceList = ref([]);

  const customerRef = ref(null);
  const emit = defineEmits([ 'cancel', 'success']);

  const { visible, dataSource } = toRefs(props);
  const { form, rules }  = toRefs(data);

  const reference = ref({});
  function handleChangeReference(v) {
    form.value.referrerName = v.nickname;
    reference.value = v;
  }

  function handleBeforeClose() {
    emit('cancel');
    form.value = {};
  }

  function submitForm() {
    proxy.$refs["customerRef"].validate(valid => {
    if (valid) {
      const d = form.value;
      const data = {
        memberName: d.memberName,
        memberSex: d.memberSex,
        memberMobile: d.memberMobile,
        // reference: undefined,
        remark: d.remark,
        sourceMode: 0,
      }
      if(reference.value) {
        data.referrerId = reference.value.userId;
        data.referrerMobile = reference.value.loginName;
        data.referrer = reference.value.nickname;
      }
      addMember(data).then(res => {
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
    form.value = {
      ...initData
    };
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
