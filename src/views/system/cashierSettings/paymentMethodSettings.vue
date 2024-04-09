<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-05 17:40:10
 * @LastEditTime: 2024-02-18 18:41:18
 * @FilePath: /cbank-client/src/views/system/cashierSettings/paymentMethodSettings.vue
-->

<template>
  <div class="app-container">
    <div>
      <span class="fs-18">付款方式设置</span>
      <span class="color-red fs-12">（结账页面默认只展示前6种付款方式，可通过移动下面的付款方式调整展示位置）</span>
    </div>
    <div class="add-btn">
      <el-button type="primary" plain icon="Plus" @click="handleAdd">新建</el-button>
    </div>
    <ul class="payment-method">
      <li v-for="(item,index) in methodList" :key="index" class="mb-20">
        <img :src="item.payImage" alt="" width="50px" height="50px">
        <div class="fs-18 fw-500 color-333 mt-14 ">{{ item.payName }}</div>
        <div class="li-model p-20">
          <div>
            <img :src="getImageUrl('edit-icon')" alt="" width="20px" height="20px" @click="handleEdit(item)">
            <img :src="getImageUrl('del-icon')" alt=""  width="20px" height="20px" @click="handleDel(item.id)">
          </div>
          <div>
            <img :src="getImageUrl('turn-left')" alt="" width="20px" height="20px" @click="handleSort(1, item.id)">
            <img :src="getImageUrl('turn-right')" alt="" width="20px" height="20px" @click="handleSort(2, item.id)">
          </div>
        </div>
      </li>
    </ul>
    <PaymentMethodModal :visible="visible" @cancel="handleCancel" @success="handleSuccess" :dataSource="dataSource" />
  </div>
</template>

<script setup>
  import PaymentMethodModal from './Modal/PaymentMethodModal.vue';
  import { getPayMethodList, payMethodSort, payMethodDelete } from '@/api/cashier';
  import { onMounted } from 'vue';
  
  const visible = ref(false);
  const dataSource = ref(null);
  // const methodList = ref([
  //   { name: '支付宝', icon: 'zhifubao'},
  //   { name: '微信', icon: 'weixin'},
  //   { name: '银行卡', icon: 'card'},
  // ]);
  const methodList = ref([]);
  const getImageUrl = (item) => {
    let name = item
    return new URL(`../../../assets/img/pay/${item}.png`, import.meta.url).href
  }

  function getMethodList() {
    getPayMethodList().then(res => {
      methodList.value = res;
    })
  }

  onMounted(() => {
    getMethodList();
  })
  
  function handleAdd() {
    dataSource.value = null;
    visible.value = true;
  }

  function handleEdit(data) {
    dataSource.value = data;
    visible.value = true;
  }

  function handleSort(type, id) {
    payMethodSort({moveType: type, id}).then(res => {
      if(res) {
        getMethodList();
      }
    })
  }

  function handleDel(id) {
    payMethodDelete({id}).then(res => {
      if(res) {
        getMethodList();
      }
    })
  }

  function handleCancel() {
    visible.value = false;
    dataSource.value = null;
  }

  function handleSuccess() {
    visible.value = false;
    dataSource.value = null;
    getMethodList();
  }

</script>

<style lang="scss" scoped>
  .add-btn {
    margin: 39px 0 24px 0;
  }
  .payment-method {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 225px;
      height: 225px;
      border-radius: 10px;
      background-color: #fff;
      margin-right: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      .li-model {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        // background: rgba(0,0,0,.6);
        display: none;
        > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          img {
            cursor: pointer;
          }
        }
      }
    }
    li:hover {
      .li-model {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
  }
</style>
