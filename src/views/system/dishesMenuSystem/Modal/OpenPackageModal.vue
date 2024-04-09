<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-01-25 15:43:14
 * @LastEditTime: 2024-03-14 15:52:53
 * @FilePath: /cbank-client/src/views/system/dishesMenuSystem/Modal/OpenPackageModal.vue
-->

<template>
  <el-dialog :title="title" :model-value="visible" width="1100px" 
    destroy-on-close :before-close="handleBeforeClose"
    lock-scroll>
      <div style="height: 62vh">
        <el-scrollbar>
          <el-form ref="dishInfoRef" :model="form" :rules="rules" label-width="80px">
            <el-row>
              <el-col :span="16">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="套餐名称" prop="name">
                      <el-input v-model="form.name" placeholder="请输入" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="套餐简称" prop="shortName">
                      <el-input v-model="form.shortName" placeholder="请输入" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="套餐价格" prop="packagePrice">
                      <el-input-number v-model="form.packagePrice" placeholder="请输入金额" style="width: 180px" 
          :precision="2"  :step="0.1" :min="0" :max="999999" controls-position="right" :controls="false" />

                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="是否入低消" prop="isHypothermia" label-width="90px">
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
                    <el-form-item label="是否计入点单业绩" prop="orderPerformance" label-width="140px">
                      <el-switch v-model="form.orderPerformance" />
                      <span class="color-999 ml-6">默认开启</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="是否计入订房业绩" prop="bookingPerformance" label-width="130px">
                      <el-switch v-model="form.bookingPerformance" />
                      <span class="color-999 ml-6">默认开启</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="是否可赠送" prop="canGivenAsGift" label-width="90px">
                      <el-switch v-model="form.canGivenAsGift" />
                      <!-- <span class="color-999 ml-6">默认关闭</span> -->
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item v-if="pgType == 2" label="适用房型" prop="applicableRoomType">
                      <el-select
                        v-model="form.applicableRoomType"
                        class="m-2"
                        placeholder="请选择"
                        multiple
                      >
                        <el-option
                          v-for="item in houseTypeList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
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
          <el-divider />
          <el-row>
            <el-col :span="15">
              <div class="pr-8">
                 <div class="mr-8 mb-8">
                  <el-input v-model="queryParams.name" placeholder="请输入品名或拼音" class="mr-8" style="width: 180px"/>
                  <el-tree-select
                    v-model="queryParams.typeId"
                    :data="deptOptions"
                    :render-after-expand="false"
                    check-strictly
                    clearable
                    placeholder="请选择分类"
                    style="width: 180px"
                  />
                  <el-button type="primary" @click="handleQuery" class="my-2 ml-8">查询</el-button>
                </div>
                <el-table :data="dishList" class="ml10" ref="tableRef">
                  <el-table-column label="品名" align="center" key="name" prop="name" :show-overflow-tooltip="true" />
                  <el-table-column label="分类" align="center" key="dishTypeName" prop="dishTypeName" :show-overflow-tooltip="true" />
                  <el-table-column label="售价" align="center" key="mealPrice" prop="mealPrice" :show-overflow-tooltip="true" :formatter="(a,b,c,d) => c/100 " />
                  <el-table-column label="单位" align="center" key="dishUnitName" prop="dishUnitName" :show-overflow-tooltip="true" />
                  <el-table-column label="默认出品部门" align="center" key="departmentName" prop="departmentName" :show-overflow-tooltip="true" />
                  <el-table-column label="操作" align="center">
                    <template #default="scope">
                      <el-link :underline="false" type="success" @click="handleAdd(scope.$index, scope.row)"
                        v-if="selectDish.findIndex(i => i.id == scope.row.id) == -1"
                      >添加</el-link>
                      <span v-else>已添加</span>
                    </template>
                  </el-table-column>
                </el-table>
                <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageRow" @pagination="getList" />
              </div>
            </el-col>
            <el-col :span="9">
              <div class="mb-8" style="height: 36px"></div>
              <el-table :data="selectDish" class="ml10" ref="tableRef">
                <el-table-column label="品名" align="center" key="name" prop="name" :show-overflow-tooltip="true" />
                <el-table-column label="单位" align="center" key="dishUnitName" prop="dishUnitName" :show-overflow-tooltip="true" />
                <el-table-column label="数量" align="center" key="dishCount" prop="dishCount" :show-overflow-tooltip="true" width="140px">
                  <template #default="scope">
                    <el-input-number v-model="scope.row.dishCount" placeholder="请输入数量" :min="1" size="small" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="scope">
                    <el-link :underline="false" type="danger" @click="handleDel(scope.$index, scope.row)">移除</el-link>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-scrollbar>
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
  import useProduceStore from '@/store/produce';
  import { onMounted } from 'vue';
  import useLoading from '@/hooks/loading';
  import { getDishInfo, openPlatformPackageEdit } from '@/api/system/produce-system';
  import { fenToYuan, yuanTofen } from '@/utils/index.js';
  import { validPrice } from '@/utils/validate.js';

  const { proxy } = getCurrentInstance();
  const uploadStore = useUploadStore();
  const produceStore = useProduceStore();
  const title = ref('新建套餐');
  const uploadLoading = ref(false);
  const emit = defineEmits([ 'cancel', 'success']);
  const houseTypeList = ref([]);
 
  const packageTypeList = ref([
    { id: 1, name: '普通套餐'},
    { id: 2, name: '开台套餐'},
  ]);
  const deptOptions = ref([]);
  const dishInfoRef = ref(null);

  const total = ref(0);

  const dishList = ref([]);
  const selectDish = ref([]);

  const { loading, setLoading } = useLoading(false);

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
    pgType: {
      type: Number,
      default: null
    }
  })

  const data = reactive({
    form: {
      name: '',
      packagePrice: null,
      applicableRoomType: '',
      isHypothermia: true,
      canGivenAsGift: false,
      bookingPerformance: true,
      orderPerformance: true,
      status: true,
      packageType: '',
      shortName: ''
    },
    queryParams: {
      pageNum: 1,
      pageRow: 10,
      name: undefined,
      typeId: null,
      status: 1,
    },
    rules: {
      name: [{ required: true, message: "不能为空", trigger: "blur" }],
      shortName:[{ required: true, message: "不能为空", trigger: "blur" }],
      packagePrice: [
        { required: true, message: "不能为空", trigger: "blur" },
      ],
    }
  })

  const { visible, dataSource, pgType } = toRefs(props);
  const { form, rules, queryParams }  = toRefs(data);
  const imageUrl = ref('')

  async function getRoomList() {
    const res= await produceStore.ajaxCompanyRoomTypeList();
    if(res) {
      houseTypeList.value=res;
    }
  }

  /** 查询菜品分类树结构 */
  function getDeptTree() {
    setLoading(true)
    produceStore.ajaxGetDishTypeSelect().then(res => {
      setLoading(false)
      deptOptions.value = res;
    }).catch(e => {
      setLoading(false)
    })
  };

  function getList() {
    getDishInfo(queryParams.value).then(res => {
      if(res) {
        dishList.value = res.list;
        total.value = res.count;
      }
    })
  }

  onMounted(() => {
    getDeptTree();
    getList();
    getRoomList();
  })
  
  watch(
    () => [dataSource.value, pgType.value],
    (val) => {
      let str = '';
      if(val[0]){
        str += '编辑';
      } else {
        str += '新建';
      }
      if(val[1] == 1) {
        str += '普通套餐';
      } else if(val[1] == 2) {
        str += '开台套餐';
      }
      title.value = str;
      if(val[0]) {
        let type = val[0].applicableRoomType && val[0].applicableRoomType.split(',');
        if(type) {
          type = type.map(i => {
            return Number(i)
          })
        }
        form.value = {
          name: val[0].name,
          shortName: val[0].shortName,
          packagePrice: fenToYuan(val[0].price),
          applicableRoomType: type,
          isHypothermia: val[0].isHypothermia == 1 ? true : false,
          canGivenAsGift: val[0].canGivenAsGift == 1 ? true : false,
          bookingPerformance: val[0].bookingPerformance == 1 ? true : false,
          orderPerformance: val[0].orderPerformance == 1 ? true : false,
          status: val[0].status == 1 ? true : false,
          // packageType: val[0].packageType,
        }
        imageUrl.value = val[0].packagePic;
        if(val[0].dishInfoResps) {
          selectDish.value = val[0].dishInfoResps.map(item => {
            return {
              ...item,
              dishUnitName: item.unitName
            }
          })
        }
      }
    },
    { immediate: true, deep: true }
  )
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

  function handleAdd(index, item) {
    const list = unref(selectDish);
    if (list.length > 0) {
      const Index = list.find(i => {
        return i.id == item.id;
      })
      if(!Index || Index == -1) {
        selectDish.value.push({
          ...item,
          dishCount: 1,
        });
      }
      return;
    }
    selectDish.value.push({
      ...item,
      dishCount: 1,
    });
  }
  function handleDel(index, item) {
    const newArr = selectDish.value.filter(i => i.id !== item.id);
    selectDish.value = [...newArr];
  }

  function handleQuery() {
    queryParams.value.pageNum = 1;
    getList()
  }

  async function submitForm() {
    if (!dishInfoRef.value) return
    await dishInfoRef.value.validate((valid, fields) => {
      if(valid) {
        const item = selectDish.value.find(i => i.dishCount == 0);
        if (item) {
          proxy.$modal.msgWarning(item.name + "不能为空");
          return;
        }
        if (!selectDish.value || selectDish.value.length == 0) {
          proxy.$modal.msgWarning("菜品不能为空");
          return;
        }
        const newDishArr = selectDish.value.map(item => {
          return {
            dishId: item.id,
            count: item.dishCount,
          }
        })
        const d = unref(form);
        const data = {
          name: d.name,
          shortName: d.shortName,
          packagePrice: yuanTofen(d.packagePrice),
          packageType: pgType.value,
          isHypothermia: d.isHypothermia ? 1 : 0,
          canGivenAsGift: d.canGivenAsGift ? 1 : 0,
          bookingPerformance: d.bookingPerformance ? 1 : 0,
          orderPerformance: d.orderPerformance ? 1 : 0,
          status: d.status ? 1 : 0,
          packagePic: imageUrl.value || '',
          dishInfoStr: JSON.stringify(newDishArr)
        };
        if(pgType.value == 2) {
          data.applicableRoomType = d.applicableRoomType && d.applicableRoomType.join(',');
        }
        if(dataSource.value && dataSource.value.id) {
          data.id = dataSource.value.id;
        }
        openPlatformPackageEdit(data).then(res => {
          if(res) {
            proxy.$modal.msgSuccess("操作成功");
            selectDish.value = [];
            form.value = {
              name: '',
              packagePrice: '',
              // packageType: '',
              applicableRoomType: '',
              isHypothermia: true,
              canGivenAsGift: false,
              bookingPerformance: true,
              orderPerformance: true,
              status: true,
            };
            emit('success');
          }
        })
      }
    })
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

</style>


<style>
/* .avatar-uploader .el-upload {
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
  width: 50px;
  height: 50px;
  text-align: center;
} */
</style>

