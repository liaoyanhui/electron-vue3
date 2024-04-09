<!--
 * @Description: 付款方式弹窗
 * @Author: 尚夏
 * @Date: 2024-02-05 18:30:10
 * @LastEditTime: 2024-03-04 17:31:59
 * @FilePath: /cbank-client/src/views/system/cashierSettings/Modal/PaymentMethodModal.vue
-->
<template>
  <el-dialog :title="title" :model-value="visible" width="400px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <el-form ref="payMethodRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="付款名称" prop="payName">
        <el-input v-model="form.payName" placeholder="请输入付款名称" :disabled="dataSource"/>
      </el-form-item>
      <el-form-item  label="图片" prop="payImage">
         <el-upload
          v-loading="uploadLoading"
          class="pack-uploader"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :http-request="httpRequest"
        >
          <img v-if="form.payImage" :src="form.payImage" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <div class="color-red mt-6 fs-12 tip">
          <div>建议上传1:1正方形图片，大小要求5M以内，格式支持jpg、png、jpeg、gif</div>
        </div>
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
import useUploadStore from '@/store/upload';
import { payMethodEdit } from '@/api/cashier';

const uploadStore = useUploadStore();
const title = ref('新建付款方式');
const { proxy } = getCurrentInstance();
const uploadLoading = ref(false);
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

const data = reactive({
  form: {
  },
  rules: {
    payName: [{ required: true, message: "付款名称不能为空", trigger: "blur" }],
    payImage: [{ required: true, message: "图片不能为空", trigger: "blur" }],
  }
})

const emit = defineEmits([ 'cancel', 'success']);
const { visible, dataSource } = toRefs(props);
const { form, rules }  = toRefs(data)

function handleBeforeClose() {
  emit('cancel');
  form.value = {};
}

watch(
  () => dataSource.value,
  val => {
    if(val) {
      form.value = {
        payName: val.payName,
        payImage: val.payImage,
      }
      title.value = '编辑付款方式';
    }
  },
  { deep: true, immediate: true }
)

const beforeAvatarUpload = (rawFile) => {
  const isJpgOrPng =
    rawFile.type === 'image/jpeg' ||
    rawFile.type === 'image/png' ||
    rawFile.type === 'image/jpg' ||
    rawFile.type === 'image/gif';
  if (!isJpgOrPng) {
    proxy.$modal.msgError("图片格式只支持png,jpeg,jpg,gif");
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    proxy.$modal.msgError("图片不能超过5MB");
    return false
  }
  return true
}

// 手动上传
function httpRequest(File) {
  try {
    const data = {
      file: File.file
    }
    uploadLoading.value = true;
    uploadStore.ajaxUploadImage(data).then(res => {
      if(res) {
        form.value.payImage = res;
      }
      uploadLoading.value = false;
    }).catch(err => {
      uploadLoading.value = false;
    })
  } catch (error) {
    uploadLoading.value = false;
  }
}

function submitForm() {
  proxy.$refs["payMethodRef"].validate(valid => {
  if (valid) {
    const data = {
      payImage: form.value.payImage,
      payName: form.value.payName,
    }

    if(dataSource.value) {
      data.id = dataSource.value.id;
    }
  
    payMethodEdit(data).then(res => {
      if(res) {
        emit('success');
        form.value = {};
      }
    })
  }})
}
function cancel() {
  emit('cancel');
}

</script>

<style lang="scss" scoped>
.pack-uploader {
  width: 190px;
  height: 190px;
  // display: block;
}
.pack-uploader .avatar {
  width: 190px;
  height: 190px;
  // display: block;
}
.pack-uploader {
  .el-icon.avatar-uploader-icon {
    width: 190px;
    height: 190px;
    border: 1px dashed var(--el-border-color);
  }
}
.tip {
  line-height: normal;
}

</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
