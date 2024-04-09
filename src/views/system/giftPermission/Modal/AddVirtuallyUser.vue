<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-22 12:06:30
 * @LastEditTime: 2024-03-11 20:42:17
 * @FilePath: /cbank-client/src/views/system/giftPermission/Modal/AddVirtuallyUser.vue
-->
<template>
  <el-dialog title="新增虚拟用户" :model-value="visible" width="504px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <el-form :model="form" :rules="rules" ref="permissionRef" label-width="110px">
      <el-row>
        <el-col>
          <el-form-item label="艺名" prop="virtualUserName">
            <el-input v-model="form.virtualUserName" placeholder="请输入" style="width: 280px"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="用户属性">
            <el-select
              disabled
              v-model="form.type"
              placeholder="请输入"
              clearable
              style="width: 280px"
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="初始金额" prop="initialAccount">
            <el-input-number v-model="form.initialAccount" placeholder="请输入" style="width: 280px" 
          :precision="2"  :step="0.1" :min="0" :max="9999999" controls-position="right" :controls="false" />

          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="日赠送限额">
            <el-input-number v-model="form.dateGiftPrice" placeholder="请输入" style="width: 280px" 
          :precision="2"  :step="0.1" :min="0" :max="9999999" :disabled="form.dateGiftC" controls-position="right" :controls="false" />
            <el-checkbox v-model="form.dateGiftC" label="不限" class="ml-12"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="月赠送限额">
            <el-input-number v-model="form.monthGiftPrice" placeholder="请输入" style="width: 280px" 
          :precision="2"  :step="0.1" :min="0" :max="9999999" :disabled="form.monthGiftC" controls-position="right" :controls="false" />
            <el-checkbox v-model="form.monthGiftC" label="不限" class="ml-12"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="日赠送次数限制">
            <el-input-number v-model="form.dateGiftCount" placeholder="请输入" style="width: 280px" 
          :precision="2"  :step="0.1" :min="0" :max="9999999" :disabled="form.dateGiftCountC"  controls-position="right" :controls="false" />
            <el-checkbox v-model="form.dateGiftCountC" label="不限" class="ml-12"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="单次赠送限额">
            <el-input-number v-model="form.singleLimit" placeholder="请输入" style="width: 280px" 
          :precision="2"  :step="0.1" :min="0" :max="9999999" :disabled="form.singleLimitC" controls-position="right" :controls="false" />
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
          <el-form-item label="" prop="updateDay" label-width="0" :inline-message="false">
            <el-checkbox v-model="form.enableUpdateMonth" label="每个月自动将可用余额调至初始金额" class="ml-12 mr-6"/>
            <div v-if="form.enableUpdateMonth">
              <span class="ml-6">更新时间</span>
              <el-input type="number" v-model="form.updateDay" size="small" class="mx-6" style="width: 60px"></el-input>
              <span>号</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSave(0)">保存</el-button>
        <el-button type="primary" @click="handleSave(1)">保存并启用</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  import { editGift, giftPackageSelect, giftPackageSelectInfo } from '@/api/gift';
  import { fenToYuan, yuanTofen } from '@/utils'
  const loading = ref(false);
  const { proxy } = getCurrentInstance();
  const props = defineProps({
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
  })

  const typeList = ref([
    { label: '真实用户', value: 1},
    { label: '虚拟用户', value: 2},
  ])
  
  const initData = {
    virtualUserName: '',
    initialAccount: 0,
    type: 2,
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
      virtualUserName: [{ required: true, message: "不能为空", trigger: "blur" }],
      updateDay: [
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
  const { visible } = toRefs(props);
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
  function handleSave(status) {
    proxy.$refs["permissionRef"].validate(valid => {
    if (valid) {
      const d = unref(form);
      const data = {
        virtualUserName: d.virtualUserName,
        initialAccount: yuanTofen(d.initialAccount),
        type: d.type,
        enableUpdateMonth: d.enableUpdateMonth ? 1 : 0,
        status,
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
        data.singleGiftLimit = d.singleLimit || 0;
      }
      if(d.dishesSchemeC) {
        data.giftPackageId = -1;
      } else {
        data.giftPackageId = d.giftPackageId || 0;
      }
      if(d.enableUpdateMonth) {
        data.updateDay = d.updateDay || 1;
      }

      editGift(data).then(res => {
        if(res) {
          form.value = {
            ...initData,
          }
          emit('success');
        }
      })
    }
  });
  }
  function cancel() {
    emit('cancel');
  }

  getDishesList();
</script>
