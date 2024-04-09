<!--
 * @Description: 菜品信息
 * @Author: 尚夏
 * @Date: 2024-01-24 16:08:19
 * @LastEditTime: 2024-03-20 01:07:26
 * @FilePath: /cbank-client/src/views/system/company/config.vue
-->
<template>
  <el-dialog :title="title" :model-value="visible" width="600px" 
    destroy-on-close :before-close="handleBeforeClose"
    lock-scroll >
    <el-form ref="dishInfoRef" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="收银台名称" prop="name">
            <el-input v-model="form.bankName" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="收银台logo" prop="name">
            <el-upload
              v-loading="uploadLoading"
              class="pack-uploader ml-24"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="(file)=>httpRequest(file,'logoPic')"
            >
              <img v-if="form.logoPic" :src="form.logoPic" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <span style="align-self: flex-start" class="ml-6 color-green" @click="form.logoPic=''">恢复默认</span>
            <div class="color-red ml-24 mt-6 fs-12">
              <div>建议上传1:1正方形图片，大小要求5M以内，格式支持jpg、png、jpeg、gif</div>
            </div>
          </el-form-item>
          <el-form-item label="收银台背景" prop="name">
            <el-upload
              v-loading="uploadLoading"
              class="pack-bg ml-24"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="(file)=>httpRequest(file,'packagePic')"
            >
            <img v-if="form.packagePic" :src="form.packagePic" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <span style="align-self: flex-start" class="ml-6 color-green" @click="form.packagePic=''">恢复默认</span>
          <div class="color-red ml-24 mt-6 fs-12">
            <div>建议上传16:9比例的图片，大小要求10M以内，格式支持jpg、png、jpeg、gif</div>
          </div>
          </el-form-item>
    </el-form>


    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleBeforeClose()">关闭</el-button>
            <el-button type="primary" @click="handleSave()" :disabled="uploadLoading">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>

import useUploadStore from '@/store/upload';
  import {updateCompanyInfo } from '@/api/common/common'
  import { ElMessage } from 'element-plus';

  const { proxy } = getCurrentInstance();
  const title = ref('修改场所配置');
  const emit = defineEmits([ 'cancel', 'success','getList']);
  const uploadLoading = ref(false);
  const uploadStore = useUploadStore();
  const dishInfoRef = ref(null);
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
  const continuousCreate = ref(false);
  const initForm = {
    name: '',
    
  }
  const data = reactive({
    // form: {
    //   ...initForm
    // },
    rules: {
    }
  })

const { visible, dataSource: form } = toRefs(props);
  console.log('from',form)
  const {  rules }  = toRefs(data);
  const logoUrl = ref('')

  function handleBeforeClose() {
    emit('cancel');
  }

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
function httpRequest(File,type) {
    try {
      const data = {
        file: File.file,
        filePath: '/company-config',
        companyId: 26
      }
      uploadLoading.value = true;
      uploadStore.ajaxUploadImage(data).then(res => {
        if(res) {
          form.value[type] = res;
        }
        uploadLoading.value = false;
      }).catch(err => {
        uploadLoading.value = false;
      })
    } catch (error) {
      uploadLoading.value = false;
    }
  }

  async function handleSave(status) {
    dishInfoRef.value.validate((valid, fields) => {
      
      if (valid) {  
        console.log('form', form.value)

        let params = {
          ...form.value,
          status: form.value.status ? 1 : 0,
          currentCompanyId: form.value.id
        }
        updateCompanyInfo(params).then(res => {
          proxy.$modal.msgSuccess("操作成功");
          emit('getList');
        })
       
      } else {
        console.log('error submit!', fields)
      }
    })
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
.pack-bg {
  width: 337px;
  height: 190px;
  // display: block;
}
.pack-bg .avatar {
  width: 337px;
  height: 190px;
  // display: block;
}
.pack-bg {
  .el-icon.avatar-uploader-icon {
    width: 337px;
    height: 190px;
    border: 1px dashed var(--el-border-color);
  }
}
.tip {
  color: red;
  height: 30px;
  padding-left: 5px;
  line-height: 30px;
}
.el-divider--horizontal {
  margin: 12px 0;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
