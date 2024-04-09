<!--
 * @Description: 收银参数设置
 * @Author: 尚夏
 * @Date: 2024-02-05 17:40:59
 * @LastEditTime: 2024-02-18 20:14:30
 * @FilePath: /cbank-client/src/views/system/cashierSettings/cashierParameterSettings.vue
-->

<template>
  <div class="app-container">
    <div>
      <span class="fs-18">收银参数设置</span>
    </div>
    <div class="content c1 my-24">
      <div class="fw-500 color-black mb-20">转台设置</div>
      <div class="fw-400 color-black fs-14 c1-content">
        <div>
          <span class="label">收取低消设置：</span>
          <div>
            <el-radio-group v-model="data.turntableHypothermiaType" @change="handleChangeHT">
              <el-row>
                <el-col>
                  <el-radio :label="1">转台时将收取价格更高的房台低消</el-radio>
                </el-col>
                <el-col>
                  <el-radio :label="2">转台时取原房台的低消</el-radio>
                </el-col>
                <el-col>
                  <el-radio :label="3">转台时取新房台的低消</el-radio>
                </el-col>
              </el-row>
            </el-radio-group>
          </div>
        </div>
        <div>
          <span class="label">开房套餐：</span>
          <div>
            <el-radio-group v-model="data.turntableOpenRoomPackage" @change="handleChangeRT">
              <el-row>
                <el-col>
                  <el-radio :label="1">转台时将收取价格更高的房间开台套餐</el-radio>
                </el-col>
                <el-col>
                  <el-radio :label="2">转台时取原房台的低消</el-radio>
                </el-col>
                <el-col>
                  <el-radio :label="3">转台时取新房台的低消</el-radio>
                </el-col>
              </el-row>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>
    <div class="content c2 my-24">
      <div class="fw-500 color-black mb-20">补低消按钮设置</div>
      <div class="fw-400 color-black fs-14 c2-status mb-30">
        <span class="fw-500">是否开启补低消按钮：</span>
        <el-switch :model-value="data.repairHypothermiaStatus == 1 ? true : false" @change="handleChangeH" />
        <span class="ml-12 color-666">开启后，收银结账页面会出现该功能按钮，点击该按钮系统会根据当前房台落单金额自动在账单中生成该名称的商品</span>
      </div>
      <div class="fw-400 color-black fs-14 c2-status">
        <span class="fw-500">补低消商品名称：</span>
        <span v-if="isChange">{{ data.repairHypothermiaDishName }}</span>
        <el-input v-else style="width: 120px" v-model="data.repairHypothermiaDishName" />
        <el-button type="primary" class="ml-40" @click="handleChange">
          {{ isChange ? '修改' : '确定'}}
        </el-button>
      </div>
    </div>
    <div class="content c3 my-24 ">
      <div class="fw-500 color-black mb-20">收取房费按钮设置</div>
       <div class="fw-400 color-black fs-14 c3-status mb-30">
        <span class="fw-500">是否开启收取房费按钮：</span>
        <el-switch :model-value="data.chargeRoomStatus == 1 ? true : false" @change="handleChangeR" />
        <span class="ml-12 color-666">开启后，收银结账页面会出现该功能按钮，点击该按钮系统会根据当前房台价格自动在账单中生成房台费</span>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { companyConfig, companyConfigEdit } from '@/api/cashier'
  import { onMounted, reactive } from 'vue';
  const { proxy } = getCurrentInstance();

  const isChange = ref(true);
  const dataSource = reactive({
    data: {
      
    }
  })
  const { data }  = toRefs(dataSource)

  function getConfig() {
    companyConfig().then(res => {
      if(res) {
        data.value = res;
      }
    })
  }

  function handleChange() {
    // 确定
    if(!isChange.value) {
      companyConfigEdit({
        ...data.value
      }).then(res => {
        if(res) {
          proxy.$modal.msgSuccess("操作成功");
        }
      })
    }
    isChange.value = !isChange.value;
  }

  onMounted(() => {
    getConfig();
  })

  function handleChangeHT(val) {
    companyConfigEdit({
      ...data.value,
      turntableHypothermiaType: val,
    }).then(res => {
      if(res) {
        data.value = {
          ...data.value,
          turntableHypothermiaType: val,
        };
      }
    })
  }
  function handleChangeRT(val) {
    companyConfigEdit({
       ...data.value,
      turntableOpenRoomPackage: val,
    }).then(res => {
      if(res) {
        data.value = {
          ...data.value,
          turntableOpenRoomPackage: val,
        };
      }
    })
  }

  function handleChangeH(val) {
    companyConfigEdit({
      ...data.value,
      repairHypothermiaStatus: val ? 1 : 0,
    }).then(res => {
      if(res) {
        data.value = {
          ...data.value,
          repairHypothermiaStatus: val ? 1 : 0
        };
        proxy.$modal.msgSuccess("操作成功");
      }
    })
  }
  function handleChangeR(val) {
    companyConfigEdit({
      ...data.value,
      chargeRoomStatus: val ? 1 : 0,
    }).then(res => {
      if(res) {
        data.value = {
          ...data.value,
          chargeRoomStatus: val ? 1 : 0
        };
        proxy.$modal.msgSuccess("操作成功");
      }
    })
  }
</script>

<style lang="scss" scoped>
  .content {
    border-radius: 10px;
    background: #fff;
    padding: 22px 24px;
  }
  .c1 {
     height: 198px;
     &-content {
      display: flex;
      > div {
        display: flex;
        :deep(.el-radio__label) {
         color: #545F6A;
        }
      }
     }
  }
  .c2 {
    height: 175px;
    &-status {
      display: flex;
      align-items: center;
    }
  }
  .c3 {
    height: 119px;
    &-status {
      display: flex;
      align-items: center;
    }
  }
  .label {
    display: inline-block;
    height: 32px;
    line-height: 32px;
    flex-shrink: 0;
  }
</style>