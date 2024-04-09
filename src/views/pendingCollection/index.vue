<!--
 * @Description: 挂账回收
 * @Author: 尚夏
 * @Date: 2024-03-04 15:05:00
 * @LastEditTime: 2024-03-11 15:29:23
 * @FilePath: /cbank-client/src/views/pendingCollection/index.vue
-->

<template>
  <div class="app-container h100 d-flex flex-column over-scorll p-r">
    <div class="header mb-24 ">
      <el-radio-group v-model="activeName" >
        <el-radio-button label="first">挂账回收</el-radio-button>
        <el-radio-button label="second">已回收</el-radio-button>
      </el-radio-group>
    </div>
    <div class="container">
      <template v-if="activeName == 'first'">  <Pending /> </template>
      <template v-if="activeName == 'second'">  <Recycled /> </template>
    </div>
  </div>
</template>

<script setup>
  import Pending from './Tab/Pending.vue';
  import Recycled from './Tab/Recycled.vue';
  const activeName = ref('first');

</script>


<style lang="scss" scoped>
  .header {
    display: flex;
    position: relative;
    z-index: 999;
    width: 50%;
  }
  .container{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    // height: calc( 100% - 58px);
  }
</style>

<style>
  .today .el-drawer__header {
    margin-left: 0 !important;
    color: #fff;
    padding-bottom: 0 !important;
    height: 50px;
    line-height: 50px;
    padding: 0 24px;
  }
  .today .el-drawer__body {
    padding: 20px 24px !important;
  }
</style>