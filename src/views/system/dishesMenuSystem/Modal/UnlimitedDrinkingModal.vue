<!--
 * @Description: 无限畅饮活动弹窗
 * @Author: 尚夏
 * @Date: 2024-02-04 10:16:01
 * @LastEditTime: 2024-03-14 15:57:53
 * @FilePath: /cbank-client/src/views/system/dishesMenuSystem/Modal/UnlimitedDrinkingModal.vue
-->
<template>
  <el-dialog :title="title" :model-value="visible" width="900px" 
  destroy-on-close :before-close="handleBeforeClose">
    <div>
      <el-form ref="drinkingRef" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="16">
            <el-row>
              <el-col :span="12">
                <el-form-item label="畅饮名称" prop="name">
                  <el-input v-model="form.name" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="畅饮简称" prop="shortName">
                  <el-input v-model="form.shortName" placeholder="请输入" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="畅饮价格" prop="drinkPrice">
                  <el-input-number v-model="form.drinkPrice" placeholder="请输入" style="width: 110px" 
          :precision="2"  :step="0.1" :min="0" :max="9999999" controls-position="right" :controls="false" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="畅饮最低价" prop="drinkLowPrice">
                  <el-input-number v-model="form.drinkLowPrice" placeholder="请输入" style="width: 110px" 
          :precision="2"  :step="0.1" :min="0" :max="9999999" controls-position="right" :controls="false" />

                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="畅饮商品" prop="dishIds">
                  <el-select
                    v-model="form.dishIds"
                    class="m-2 mr-8"
                    placeholder="支持首字母搜索"
                    clearable
                    filterable
                    :filter-method="filterMethod"
                  >
                    <el-option
                      v-for="item in filterProductNameList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="出品数量" prop="defaultProduceCount">
                  <el-input-number v-model="form.defaultProduceCount" placeholder="请输入" style="width: 100px" value-on-clear="null"
          :precision="0"  :step="1" :min="0" :max="9999999" controls-position="right" :controls="false" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否计入点单业绩" prop="orderPerformance" label-width="160px">
                  <el-switch v-model="form.orderPerformance" />
                  <span class="color-999 ml-6">默认开启</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否计入订房业绩" prop="bookingPerformance" label-width="150px">
                  <el-switch v-model="form.bookingPerformance" />
                  <span class="color-999 ml-6">默认开启</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否入低消" prop="isHypothermia" label-width="110px">
                  <el-switch v-model="form.isHypothermia" />
                  <span class="color-999 ml-6">默认开启</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否开启" prop="status" label-width="80px">
                  <el-switch v-model="form.status" />
                  <span class="color-999 ml-6">默认开启</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否可赠送" prop="canGivenAsGift" label-width="110px">
                  <el-switch v-model="form.canGivenAsGift" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-upload
                v-loading="uploadLoading"
                class="pack-uploader ml-24"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="httpRequest"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            <div class="color-red ml-24 fs-12">
              <div>建议上传1:1正方形图片，大小要求5M以内，格式支持jpg、png、jpeg、gif</div>
            </div>
          </el-col>
        </el-row>
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
  import useUploadStore from '@/store/upload';
  import { fenToYuan, yuanTofen } from '@/utils/index.js';
  import useLoading from '@/hooks/loading';
  import { onMounted } from 'vue';
  import { productDishInfo } from '@/api/product';
  import { unlimitedDrinkingActivity } from '@/api/system/produce-system';
  import { validPrice } from '@/utils/validate.js';

  const uploadStore = useUploadStore();
  const { proxy } = getCurrentInstance();
  const uploadLoading = ref(false);
  const title = ref('新增畅饮');

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
    },
  })

  const initData = ref({
    name: '',
    dishIds: undefined,
    drinkPrice: null,
    drinkLowPrice: null,
    defaultProduceCount: null,
    isHypothermia: true,
    canGivenAsGift: false,
    bookingPerformance: true,
    orderPerformance: true,
    status: true,
  })
  const data = reactive({
    form: {
      ...initData.value
    },
    rules: {
      name: [{ required: true, message: "不能为空", trigger: "blur" }],
      shortName : [{ required: true, message: "不能为空", trigger: "blur" }],
      dishIds: [{ required: true, message: "不能为空", trigger: "blur" }],
      drinkPrice: [
        { required: true, message: "不能为空", trigger: "blur" },
        { validator: (rule, value, callback) => {
          const { valide, errorText } = validPrice(value);
          if(!valide) {
            return callback(new Error(errorText));
          }
          callback()
        }, trigger: "blur" },
      ],
      defaultProduceCount: [
        { validator: (rule, value, callback) => {
          if( value < 0) {
            return callback(new Error('出品数量不能为负数'))
          }
          callback()
        }, trigger: "blur" },
      ],
      drinkLowPrice: [
        { required: true, message: "不能为空", trigger: "blur" },
        { validator: (rule, value, callback) => {
          const { valide, errorText } = validPrice(value);
          if(!valide) {
            return callback(new Error(errorText));
          }
          callback()
        }, trigger: "blur" },
      ],
    }
  })

  const { visible, dataSource } = toRefs(props);
  const { form, rules }  = toRefs(data);
  const imageUrl = ref('');
  const productNameList = ref([]);
  const filterProductNameList = ref([]);

  watch(
    () => dataSource.value,
    val => {
      if(val) {
        const cdrinkInfinityInfos = val.cdrinkInfinityInfos;
        let ids;
        if(cdrinkInfinityInfos) {
          ids = cdrinkInfinityInfos.map(item => Number(item.dishId));
        }
        form.value = {
          name: val.drinkName,
          dishIds: ids[0] || undefined,
          shortName: val.shortName || '',
          drinkPrice: fenToYuan(val.drinkPrice),
          drinkLowPrice: fenToYuan(val.drinkLowPrice),
          isHypothermia: val.inputLowConsumption == 1 ? true : false,
          canGivenAsGift: val.canGivenAsGift == 1 ? true : false,
          bookingPerformance: val.bookingPerformance == 1 ? true : false,
          orderPerformance: val.orderPerformance == 1 ? true : false,
          status: val.status == 1 ? true : false,
          defaultProduceCount: val.defaultProduceCount,
        }
        imageUrl.value = val.drinkPic;
        title.value = '编辑畅饮';
      }
    },
    { deep: true, immediate: true }
  )


  // 获取菜品列表
  function getProductNameList() {
    productDishInfo({canBeLeftAlone: 1}).then(res => {
      productNameList.value = res;
      filterProductNameList.value = res;
    })
  }

  // 自定义搜索菜品列表
  function filterMethod(val) {
    if(val) {
      const newArr = productNameList.value.filter(item => {
        if(item.name && item.name.indexOf(val) > -1) {
          return true;
        }
        if(item.englishName && item.englishName.indexOf(val) > -1) {
          return true;
        }
        if(item.nameInitial && item.nameInitial.indexOf(val) > -1) {
          return true;
        }
        return false;
      })
      filterProductNameList.value = newArr;
    } else {
      filterProductNameList.value = productNameList.value;
    }
  }

  onMounted(() => {
    getProductNameList();
  })
  function handleBeforeClose() {
    emit('cancel');
    form.value = {
      ...initData.value
    };
    imageUrl.value = '';
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
  function httpRequest(File) {
    try {
      const data = {
        file: File.file
      }
      uploadLoading.value = true;
      uploadStore.ajaxUploadImage(data).then(res => {
        if(res) {
          imageUrl.value = res;
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
    proxy.$refs["drinkingRef"].validate(valid => {
      if (valid) {
        const d = unref(form);
        const data = {
          name: d.name,
          shortName: d.shortName,
          defaultProduceCount: d.defaultProduceCount,
          dishIds: [d.dishIds],
          drinkPrice: yuanTofen(d.drinkPrice),
          drinkLowPrice: yuanTofen(d.drinkLowPrice),
          isHypothermia: d.isHypothermia ? 1 : 0,
          canGivenAsGift: d.canGivenAsGift ? 1 : 0,
          bookingPerformance: d.bookingPerformance ? 1 : 0,
          orderPerformance: d.orderPerformance ? 1 : 0,
          status: d.status ? 1 : 0,
          drinkPic: imageUrl.value || '',
        };
        if (dataSource.value) {
          data.id = dataSource.value.id;
        }
        unlimitedDrinkingActivity(data).then(res => {
          if(res) {
            emit('success');
            form.value = {
              ...initData.value
            };
            imageUrl.value = '';
          }
        })
    }})
  }

  function cancel() {
    emit('cancel');
    form.value = {
      ...initData.value
    };
    imageUrl.value = '';
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

</style>
