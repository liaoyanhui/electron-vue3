<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-21 14:12:06
 * @LastEditTime: 2024-03-19 16:56:52
 * @FilePath: /cbank-client/src/views/memberManagement/memberBasic/memberCardType/Modal/CardType.vue
-->
<template>
  <el-dialog title="新增会员卡类型" :model-value="visible" width="504px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <el-form ref="cardTypeRef" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="会员卡类型名称" prop="typeName">
        <el-input v-model="form.typeName" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="会员折扣" prop="discount">
          <el-input-number v-model="form.discount" placeholder="请输入" 
          :precision="2"  :step="0.1" :min="0" :max="100" :disabled="form.monthGiftC" controls-position="right" :controls="false" >
            <template #append>
              <span>%</span>
            </template>
          </el-input-number>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.isEnable" class="ml-4">
          <el-radio :label="1" size="large">启用</el-radio>
          <el-radio :label="0" size="large">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="form.remark"
          :rows="2"
          type="textarea"
          placeholder="请输入"
        />
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
  import { addMemberCardTypes, updateMemberCardTypes } from '@/api/member';
  const { proxy } = getCurrentInstance();
  const emit = defineEmits([ 'cancel', 'success']);

  const props = defineProps({
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
    dataSource: {
      type: Object,
      default: null,
    }
  })
  const initData = {
    typeName: undefined,
    discount: undefined,
    isEnable: 1,
    remark: undefined,
  };
  const data = reactive({
    form: {
      ...initData
    },
    rules: {
      typeName: [{ required: true, message: "不能为空", trigger: "blur" }],
      discount: [{ required: true, message: "不能为空", trigger: "blur" }],
    }
  })

  const { visible, dataSource } = toRefs(props);
  const { form, rules }  = toRefs(data);

  watch(
    () => dataSource.value,
    val => {
      if(val) {
        form.value = {
          typeName: val.typeName,
          discount: val.discount,
          isEnable: val.isEnable,
          remark: val.remark, 
        }
      }
    },
    { deep: true, immediate: true}
  )
  function handleBeforeClose() {
    cancel();
  }

  function submitForm() {
    proxy.$refs["cardTypeRef"].validate(valid => {
    if (valid) {
      const d = form.value;
      if(dataSource.value) {
        d.id = dataSource.value.id;
        updateMemberCardTypes(d).then(res => {
          if(res) {
            emit('success');
            form.value = {
              ...initData
            };
          }
        })
        return;
      }
    
      addMemberCardTypes(d).then(res => {
        if(res) {
          emit('success');
          form.value = {
            ...initData
          };
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


  
</script>
