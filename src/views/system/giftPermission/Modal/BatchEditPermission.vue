<!--
 * @Description: 批量
 * @Author: 尚夏
 * @Date: 2024-02-22 11:07:10
 * @LastEditTime: 2024-03-11 18:56:00
 * @FilePath: /cbank-client/src/views/system/giftPermission/Modal/BatchEditPermission.vue
-->
<template>
  <el-dialog title="批量修改赠送权限" :model-value="visible" width="504px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <el-form :model="form" :rules="rules" ref="permissionRef" label-width="110px">
      <el-row>
        <el-col>
          <el-form-item label="日赠送限额">
            <el-input-number  :precision="2" :controls="false"  :step="0.01" :min="0"  v-model="form.dateGiftPrice" :disabled="form.dateGiftC" placeholder="请输入" style="width: 280px"></el-input-number>
            <el-checkbox v-model="form.dateGiftC" label="不限" class="ml-12"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="月赠送限额">
            <el-input-number  :precision="2" :controls="false"  :step="0.01" :min="0"  v-model="form.monthGiftPrice" :disabled="form.monthGiftC" placeholder="请输入" style="width: 280px"></el-input-number>
            <el-checkbox v-model="form.monthGiftC" label="不限" class="ml-12"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="日赠送次数限制">
            <el-input-number  :precision="2" :controls="false"  :step="0.01" :min="0"  v-model="form.dateGiftCount" :disabled="form.dateGiftCountC"  placeholder="请输入" style="width: 280px"></el-input-number>
            <el-checkbox v-model="form.dateGiftCountC" label="不限" class="ml-12"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="单次赠送限额">
            <el-input-number  :precision="2" :controls="false"  :step="0.01" :min="0"  v-model="form.singleLimit" :disabled="form.singleLimitC" placeholder="请输入" style="width: 280px"></el-input-number>
            <el-checkbox v-model="form.singleLimitC" label="不限" class="ml-12"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="菜品赠送方案">
            <el-select
              v-model="form.giftPackageId"
              placeholder="请输入"
              clearable
              :disabled="form.dishesSchemeC"
              style="width: 280px"
            >
               <el-option
                v-for="item in dishesSchemeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-checkbox v-model="form.dishesSchemeC" label="不限" class="ml-12"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-table v-loading="loading" height="150" ref="tableRef" :data="dishesList">
            <el-table-column label="序号" align="center" type="index" width="50" />
            <el-table-column label="菜品名称" align="center" key="name" prop="name" :show-overflow-tooltip="true" />
            <el-table-column label="单价" align="center" key="mealPrice" prop="mealPrice" :formatter="(a,b,c,d) => fenToYuan(c)"/>
            <el-table-column label="单位" align="center" key="dishUnitName" prop="dishUnitName" />
          </el-table>
        </el-col>
        <el-col>
          <el-form-item label="" prop="updateDate" label-width="0" :inline-message="false">
            <el-checkbox v-model="form.enableUpdateMonth" label="每个月自动将可用余额调至初始金额" class="ml-12 mr-6"/>
           <div v-if="form.enableUpdateMonth">
              <span class="ml-6">更新时间</span>
              <el-input-number  :precision="2" :controls="false"  :step="0.01" :min="0"  v-model="form.updateDay" size="small" class="mx-6" style="width: 60px"></el-input-number>
              <span>号</span>
            </div>
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
  import { batchEditGift, giftPackageSelect, giftPackageSelectInfo } from '@/api/gift';
  import { fenToYuan, yuanTofen } from '@/utils'

  const loading = ref(false);
  const { proxy } = getCurrentInstance();
  const props = defineProps({
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
    dataSource: {
      type: Array,
      require: true,
      default: null
    }
  })
  
  const initData = {
    dateGiftPrice: 0,
    monthGiftPrice: 0,
    dateGiftCount: 0,
    singleLimit: 0,
    dateGiftC: false,
    monthGiftC: false,
    singleLimitC: false,
    dishesSchemeC: false,
    dateGiftCountC: false,
    enableUpdateMonth: false,
    giftPackageId: undefined,
  }
  const data = reactive({
    form: {
      ...initData
    },
    rules: {
      updateDate: [
        { validator: (rule, value, callback) => {
          if(form.value.enableUpdateMonth) {
            if(!form.value.updateDay) {
              return callback(new Error('输入日期'));
            }
            if( form.value.updateDay < 0 || form.value.updateDay > 28) {
              return callback(new Error('日期只能选择1~28号'));
            }
          }
          callback()
        }, trigger: "blur" },
      ],
    }
  });
  const emit = defineEmits([ 'cancel', 'success']);
  const { visible, dataSource } = toRefs(props);
  const { form, rules } = toRefs(data);

  const dishesSchemeList = ref([]);
  const dishesList = ref([]);
  function getDishesList() {
    giftPackageSelect().then(res => {
      dishesSchemeList.value = res;
    })
  }

  watch(
    () => form.value.giftPackageId,
    val => {
      if(val) {
        loading.value = true;
        try {
          giftPackageSelectInfo({id:val, pageRow: 999}).then(res => {
            if(res) {
              dishesList.value = res.list;
              loading.value = false;
            }
          })
        } catch (error) {
          loading.value = false;
        }
      } else {
        dishesList.value = [];
      }
    }
  )
  function handleBeforeClose() {
    emit('cancel');
  }
  function submitForm() {
    proxy.$refs["permissionRef"].validate(valid => {
    if (valid) {
      if(dataSource.value) {
        const d = unref(form);
        const data = {
          ids: dataSource.value,
        }
        if(d.dateGiftC) {
          data.todayQuota = -1;
        } else {
          data.todayQuota = yuanTofen(d.dateGiftPrice) || 0;
        }
        if(d.monthGiftC) {
          data.monthQuota = -1;
        } else {
          data.monthQuota = yuanTofen(d.monthGiftPrice) || 0;
        }
        if(d.dateGiftCountC) {
          data.todayGiftQuotaCount = -1;
        } else {
          data.todayGiftQuotaCount = d.dateGiftCount || 0;
        }
        if(d.singleLimitC) {
          data.singleGiftLimit = -1;
        } else {
          data.singleGiftLimit = yuanTofen(d.singleLimit) || 0;
        }
        if(d.dishesSchemeC) {
          data.giftPackageId = -1;
        } else {
          data.giftPackageId = d.giftPackageId || 0;
        }
        if(d.enableUpdateMonth) {
          data.updateDay = d.updateDay || 1;
        }
        batchEditGift(data).then(res => {
          if(res) {
            form.value = {
              ...initData,
            }
            emit('success');
          }
        })
      }
    }
  });
  }
  function cancel() {
    emit('cancel');
  }

  getDishesList();
</script>
