<!--
 * @Description: 
 * @Author: pgm
 * @Date: 2024-01-23 15:38:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-02-21 21:46:17
 * @FilePath: /cbank-client/src/App.vue
-->
<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<script setup >

import zhCn from 'element-plus/es/locale/lang/zh-cn';
</script>
<style>
@import './assets/styles/index.scss';


</style>

