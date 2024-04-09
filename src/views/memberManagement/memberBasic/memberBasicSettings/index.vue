<!--
 * @Descrip
  components: { AccountSet },tion: 
 * @Author: 尚夏
 * @Date: 2024-02-19 14:28:33
 * @LastEditTime: 2024-03-15 14:54:58
 * @FilePath: /cbank-client/src/views/memberManagement/memberBasic/memberBasicSettings/index.vue
-->
<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="会员账户&消费规则设置" name="1">
      <AccountSet />
    </el-tab-pane>
    <!-- <el-tab-pane label="会员小票打印设置" name="2">
      <ReceiptSet />
    </el-tab-pane> -->
  </el-tabs>
</template>

<script setup>
  import AccountSet from './Tab/AccountSet.vue';
  import ReceiptSet from './Tab/ReceiptSet.vue';
  const activeName = ref('1');
  const handleClick = (tab, event) => {
    console.log(tab, event)
  }
</script>
