<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-03-05 20:52:43
 * @LastEditTime: 2024-03-20 11:48:33
 * @FilePath: /cbank-client/src/views/bookingPerformance/Modal/UpdatePerformance.vue
-->
<template>
  <el-dialog :title="title" :model-value="visible" width="688px" append-to-body destroy-on-close :before-close="handleBeforeClose" lock-scroll>
    <div style="height: 62vh">
      <el-scrollbar>
        <el-form ref="performanceRef" :model="form" :rules="rules" label-width="140px">
          <el-form-item label="方案名称" prop="optionName">
            <el-input v-model="form.optionName" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="业绩计算">
            <div class="rate">
              <div class="color-red">订房业绩=结账实付金额-不入订房业绩菜品金额-(下方勾选的支付方式)</div>
              <div>不入订房业绩支付方式：</div>
              <el-checkbox-group v-model="form.paymentId">
                <el-checkbox v-for="item in methodList" :key="item.id" :label="item.id" :value="item.id">{{ item.payName }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
          <el-form-item label="自订房提成比例" prop="selfBookingScale">
            <el-input type="number" v-model="form.selfBookingScale" placeholder="请输入">
              <template #append>%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="还订房提成比例" prop="returnBookingScale">
            <el-input type="number" v-model="form.returnBookingScale" placeholder="请输入">
              <template #append>%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="分组" >
            <div class="rate group">
              <div class="rate-left">
                <el-checkbox-group v-model="form.organizationIds">
                  <div v-for="item in deptList" :key="item.id">
                    <el-checkbox :label="item.id" :value="item.id">{{ item.name }}</el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>
              <div class="rate-right">
                <div>以下订房人适用本提成方案：</div>
                <div v-for="(item,index) in checkUserNames" :key="index">{{ item }}</div>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm(0)">保存</el-button>
        <el-button type="primary" @click="submitForm(1)">保存并启用</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  import { getPayMethodList } from '@/api/cashier';
  import { performanceEdit } from '@/api/bookingPerformance';
  import { listDept } from '@/api/system/dept';
  
  const { proxy } = getCurrentInstance();
  const title = ref('新增方案')
  const methodList = ref([]);
  const deptList = ref([]);
  const props = defineProps({
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
    dataSource: {
      type: Object,
      default: null
    }
  })
  const initFormData = ref({
    optionName: undefined,
    selfBookingScale: undefined,
    returnBookingScale: undefined,
    paymentId: [],
    organizationIds: [],
  })
  const data = reactive({
    form: {
     ...initFormData.value,
    },
    rules: {
      optionName: [{ required: true, message: "不能为空", trigger: "blur" }],
      selfBookingScale: [
        { required: true, message: "请输入", trigger: "blur" },
        { validator: (rule, value, callback) => {
          if(value > 0 && value < 100) {
            return callback()
          } else {
            return callback((new Error('比例不能超过0～100')))
          }
        }, trigger: "blur" },
      ],
      returnBookingScale: [
        { required: true, message: "请输入", trigger: "blur" },
        { validator: (rule, value, callback) => {
          if(value > 0 && value < 100) {
            return callback()
          } else {
            return callback((new Error('比例不能超过0～100')))
          }
        }, trigger: "blur" },
      ],
      // organizationIds: [{ required: true, message: "请选择组", trigger: "blur" }]
    }
  });

  const { form, rules } = toRefs(data);
  const emit = defineEmits([ 'cancel', 'success']);
  const { visible, dataSource } = toRefs(props);

  const checkUserNames = ref([]);
  watch(
    () => dataSource.value,
    val => {
      if(val) {
        form.value = { ...val };
        if (val.id) {
          title.value ='编辑方案'
        } else {
          title.value  ='新增方案'
        }
        if(val.paymentIds) {
          form.value.paymentId = val.paymentIds.split(',').map(item => Number(item));
        };
      }
    },
    { deep: true, immediate: true }
  )
  watch(
    () => [form.value.organizationIds,deptList.value],
    val => {
      if(val[0] && val[1] && val[1].length > 0){
        const names = [];

        val[0].forEach(item => {
          const v = val[1].find(i => i.id == item);
          if(v) {
            names.push(v.usernames)
          }
        })
        checkUserNames.value = names;
      } else {
        checkUserNames.value = [];
      }
    }, { deep: true, immediate: true }
  )


  function handleBeforeClose() {
    form.value = {
      ...initFormData
    }
    emit('cancel')
  }
  function submitForm(status) {
    proxy.$refs["performanceRef"].validate(valid => {
      if (valid) {
        const d = form.value;
        d.status = status;
        d.paymentIds = d.paymentId.length > 0 ? d.paymentId.join() : undefined;
        if(dataSource.value) {
          d.id = dataSource.value.id;
        }
        performanceEdit(d).then(res => {
          if(res) {
            proxy.$modal.msgSuccess("操作成功");
            form.value = {
              ...initFormData
            }
            emit('success');
          }
        })
      }
    })
  }
  function cancel() {
    form.value = {
      ...initFormData
    }
    emit('cancel')
  }

  function getMethodList() {
    getPayMethodList().then(res => {
      methodList.value = res;
    })
  }

  function getListDept() {
    listDept().then(res => {
      deptList.value = res;
    })
  }

  getMethodList();
  getListDept();
</script>

<style lang="scss" scoped>
  .rate {
    border-radius: 4px;
    border: 1px solid #595b68;
    width: 100%;
    padding: 11px;
    &-left {
      width: 159px;
      border-right: 1px solid #595b68;
    }
    &-right {
      width: calc(100% - 159px);
      padding-left: 12px;
    }
  }
  .group {
    display: flex;
  }
</style>