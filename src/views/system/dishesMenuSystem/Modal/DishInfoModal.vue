<!--
 * @Description: 菜品信息
 * @Author: 尚夏
 * @Date: 2024-01-24 16:08:19
 * @LastEditTime: 2024-03-20 10:37:44
 * @FilePath: /cbank-client/src/views/system/dishesMenuSystem/Modal/DishInfoModal.vue
-->
<template>
  <el-dialog :title="title" :model-value="visible" width="800px" 
    destroy-on-close :before-close="handleBeforeClose"
    lock-scroll >
    <div style="height: 60vh">
      <el-scrollbar>
        <el-form ref="dishInfoRef" :model="form" :rules="rules" label-width="120px">
          <el-row>
            <el-col :span="14">
              <el-form-item label="菜品名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="菜品简称" prop="name">
                <el-input v-model="form.shortName" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="菜品英文名" prop="englishName">
                <el-input v-model="form.englishName" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="分类" prop="dishTypeId">
                <el-tree-select
                  v-model="form.dishTypeId"
                  :data="typeList"
                  :render-after-expand="false"
                  check-strictly
                  placeholder="请选择"
                />
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="单位" prop="dishUnitId">
                    <el-select
                      v-model="form.dishUnitId"
                      class="m-2"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in units"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="排序" prop="sort">
                    <el-select
                      v-model="form.sort"
                      class="m-2"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in sorts"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="售价" prop="mealPrice">
                    <el-input-number v-model="form.mealPrice" placeholder="请输入金额" style="width: 100px" 
          :precision="2"  :step="0.1" :min="0" :max="999999" controls-position="right" :controls="false" />
                    <!-- <el-input v-model="form.mealPrice" type="number" placeholder="请输入" /> -->
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="成本价" prop="costPrice">
                    <el-input-number v-model="form.costPrice" placeholder="请输入金额" style="width: 100px" 
          :precision="2"  :step="0.1" :min="0" :max="999999" controls-position="right" :controls="false" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="默认出品部门" prop="makeDepartmentId">
                <el-select
                  v-model="form.makeDepartmentId"
                  class="m-2"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in departments"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="条形码" prop="barcode">
                <el-input v-model="form.barcode" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
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
                <div class="color-red ml-24 mt-6 fs-12">
                  <div>建议上传1:1正方形图片，大小要求5M以内，格式支持jpg、png、jpeg、gif</div>
                </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
                <el-form-item label="保质期(天)" prop="shelfLife">
                  <el-input v-model="form.shelfLife" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <div class="tip">保质期为0表示长期</div>
              </el-col>
          </el-row>
          <el-divider />
          <el-row>
            <el-col>
              <div class="fw-500 fs-18 mb-12">买单信息</div>
            </el-col>
            <el-col>
              <el-form-item label="是否可落单" prop="canBeLeftAlone">
                <el-switch v-model="form.canBeLeftAlone" />
                <span>开启后，可参与点单，默认开启</span>
              </el-form-item>
              <el-form-item label="是否可赠送" prop="canGivenAsGift">
                <el-switch v-model="form.canGivenAsGift"/>
                <span>开启后，该菜品员工可赠送，默认关闭</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider />
          <el-row>
            <el-col>
              <div class="fw-500 fs-18 mb-12">消费信息</div>
            </el-col>
            <el-col>
              <el-form-item label="入低消" prop="inputLowConsumption">
                <el-switch v-model="form.inputLowConsumption" />
                <span>开启后，落单后消费可入低消，默认关闭</span>
              </el-form-item>
              <el-form-item label="赔偿品" prop="compensationProducts" >
                <el-switch v-model="form.compensationProducts"  @change="handleChangeCompensation"/>
                <span>开启后，用于客户赔偿，不入品台打单，默认关闭</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider />
          <el-row>
            <el-col>
              <div class="fw-500 fs-18 mb-12">业绩信息</div>
            </el-col>
            <el-col>
              <el-form-item label="是否入订房业绩" prop="bookingPerformance">
                <el-switch v-model="form.bookingPerformance" />
                <span>开启后，可参与订房业绩，默认开启</span>
              </el-form-item>
              <el-form-item label="是否入点单业绩" prop="orderPerformance">
                <el-switch v-model="form.orderPerformance" />
                <span>开启后，可参与点单业绩，默认开启</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider />
          <!-- <el-row>
            <el-col>
              <div class="fw-500 fs-18 mb-12">显示设置</div>
            </el-col>
            <el-col>
              <el-form-item label="移动端显示" prop="appDisplay">
                <el-switch v-model="form.appDisplay" />
                <span>开启后，可在移动端点单，默认开启</span>
              </el-form-item>
              <el-form-item label="电脑端显示" prop="webDisplay">
                <el-switch v-model="form.webDisplay" />
                <span>开启后，可在电脑端点单，默认开启</span>
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col>
              <div class="fw-500 fs-18 mb-12">出品设置</div>
            </el-col>
            <el-col>
               <el-form-item label="是否可出品" prop="produce">
                <el-switch v-model="form.produce" @change="handleProduce" />
                <span>开启后，落单后该菜品会入出品台打单，默认开启</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider />
        </el-form>
      </el-scrollbar>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <div class="footer">
          <div>
            <el-checkbox v-model="continuousCreate" :disabled="dataSource ? true : false" label="连续新建" size="large" />
          </div>
          <div>
            <el-button @click="handleSave(0)">保存</el-button>
            <el-button type="primary" @click="handleSave(1)">保存并启用</el-button>
          </div>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  import { onMounted, reactive, unref, watchEffect } from "vue";
  import useUploadStore from '@/store/upload';
  import { ElMessage } from 'element-plus';
  import useProduceStore from "@/store/produce";
  import { getDishUnitSelect } from '@/api/system/produce-system';
  import { fenToYuan, yuanTofen } from '@/utils/index.js';
  import { validPrice } from '@/utils/validate.js';

  const { proxy } = getCurrentInstance();
  const title = ref('新建菜品');
  const typeList = ref([]);
  const emit = defineEmits([ 'cancel', 'success']);
  const uploadLoading = ref(false);
  const uploadStore = useUploadStore();
  const produceStore = useProduceStore();
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
    englishName: '',
    dishTypeId: null,
    dishUnitId: null,
    sort: 0,
    mealPrice: null,
    costPrice: null,
    makeDepartmentId: null,
    barcode: '',
    shelfLife: '',
    canBeLeftAlone: true,
    canGivenAsGift: false,
    inputLowConsumption: false,
    compensationProducts: false,
    bookingPerformance: true,
    orderPerformance: true,
    appDisplay: true,
    webDisplay: true,
    produce: true,
    shortName: '',
  }
  const data = reactive({
    form: {
      ...initForm
    },
    rules: {
      name: [{ required: true, message: "不能为空", trigger: "blur" }],
      dishTypeId: [{ required: true, message: "请选择", trigger: "blur" }],
      dishUnitId: [{ required: true, message: "请选择", trigger: "blur" }],
      shortName: [{ required: true, message: "不能为空", trigger: "blur" }],
      mealPrice: [
        { required: true, message: "请输入", trigger: "blur" },
        { validator: (rule, value, callback) => {
          const { valide, errorText } = validPrice(value);
          if(!valide) {
            return callback(new Error(errorText));
          }
          callback()
        }, trigger: "blur" },
      ],
      // costPrice: [
      //   { validator: (rule, value, callback) => {
      //       const { valide, errorText } = validPrice(value);
      //       if(!valide) {
      //         return callback(new Error(errorText));
      //       }
      //       callback()
      //   }, trigger: "blur"}
      // ],
      sort: [{ required: true, message: "请选择", trigger: "blur" }],
      makeDepartmentId: [{ required: true, message: "不能为空", trigger: "blur" }],
    }
  })

  const { visible, dataSource } = toRefs(props);
  const { form, rules }  = toRefs(data);
  const imageUrl = ref('')

  // 监听数据 如果是编辑 自动填入数据
  watch(
    () => dataSource.value,
    val => {
      if(val) {
        form.value = {
          name: val.name,
          englishName: val.englishName,
          dishTypeId: val.dishTypeId,
          dishUnitId: val.dishUnitId,
          shortName: val.shortName,
          sort: val.sort,
          mealPrice: fenToYuan(val.mealPrice)/1,
          costPrice: val.costPrice?fenToYuan(val.costPrice)/1:null,
          makeDepartmentId: val.makeDepartmentId,
          barcode: val.barcode,
          shelfLife: val.shelfLife,
          canBeLeftAlone: val.canBeLeftAlone == 1 ? true : false,
          canGivenAsGift: val.canGivenAsGift == 1 ? true : false,
          inputLowConsumption: val.inputLowConsumption == 1 ? true : false,
          compensationProducts: val.compensationProducts == 1 ? true : false,
          bookingPerformance: val.bookingPerformance == 1 ? true : false,
          orderPerformance: val.orderPerformance == 1 ? true : false,
          appDisplay: val.appDisplay == 1 ? true : false,
          webDisplay: val.webDisplay == 1 ? true : false,
          produce: val.produce == 1 ? true : false,
        };
        imageUrl.value = val.pic;
        title.value = '编辑菜品';
      }
    },
    { deep: true, immediate: true }
  );
  const units = ref([]);
  const sorts = ref([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const departments = ref([]);

  // 获取所有分类
  function fetchAllType() {
    produceStore.ajaxGetDishTypeSelect().then(res => {
      if(res) {
        typeList.value = res;
      }
    })
  }

  // 获取单位列表
  function getDishUnits() {
    getDishUnitSelect().then(res => {
      if(res && res.list && res.list.length > 0) {
        const arr = res.list.map(item => {
          return {
            value: item.id,
            label: item.unitName
          };
        })
        units.value = [...arr];
      }
    })
  }

  // 获取部门
  function getDepartmentList() {
    produceStore.ajaxProductionDepartmentList().then(res => {
      if (res) {
        const arr = res.list.map(item => {
          return {
            value: item.id,
            label: item.departmentName,
          }
        })
        departments.value = arr;
      }
    })
  }

  onMounted(() => {
    fetchAllType();
    getDishUnits();
    getDepartmentList();
  })

  function handleBeforeClose() {
    emit('cancel');
  }

  // 是否可赠送
  function handleChangeCompensation(v) {
    if (v) {
      if(form.value.produce) {
        form.value.produce = false;
      }
    }
  }

  // 是否可出品
  function handleProduce(v) {
    if (v) {
      if(form.value.compensationProducts) {
        form.value.compensationProducts = false;
      }
    }
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

  async function handleSave(status) {
    if (!dishInfoRef.value) return
    await dishInfoRef.value.validate((valid, fields) => {
      if (valid) {
        const d = unref(form);
        const data = {
          name: d.name,
          englishName: d.englishName,
          dishTypeId: d.dishTypeId,
          dishUnitId: d.dishUnitId,
          sort: d.sort,
          shortName:d.shortName,
          mealPrice: yuanTofen(d.mealPrice),
          costPrice:d.costPrice? yuanTofen(d.costPrice):'',
          barcode: d.barcode,
          shelfLife: d.shelfLife,
          makeDepartmentId: d.makeDepartmentId,
          canBeLeftAlone: d.canBeLeftAlone ? 1 : 0,
          canGivenAsGift: d.canGivenAsGift ? 1 : 0,
          inputLowConsumption: d.inputLowConsumption ? 1 : 0,
          compensationProducts: d.compensationProducts ? 1 : 0,
          bookingPerformance: d.bookingPerformance ? 1 : 0,
          orderPerformance: d.orderPerformance ? 1 : 0,
          appDisplay: d.appDisplay ? 1 : 0,
          webDisplay: d.webDisplay ? 1 : 0,
          produce: d.produce ? 1 : 0,
          status,
          pic: imageUrl.value || '',
        };
        if (dataSource.value) {
          data.id = dataSource.value.id;
        }
        produceStore.ajaxUpdateDishInfo(data).then(res => {
          if (res) {
            proxy.$modal.msgSuccess("操作成功");
            imageUrl.value = '';
            if(continuousCreate.value) {
              // form.value = {
              //   ...initForm
              // };
              emit('success', { noVisible: true });
            } else {
              form.value = {
                ...initForm
              };
              emit('success');
            }
          }
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
