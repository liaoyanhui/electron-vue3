<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-03-02 16:12:57
 * @LastEditTime: 2024-03-05 14:24:25
 * @FilePath: /cbank-client/src/views/bookingPerformance/PerformanceInquiry.vue
-->
<template>
  <div class="app-container content-box p-24">
    <el-tabs
      v-model="activeName"
      type="card"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane label="部门查询" name="department">
        <DepartmentRecord />
      </el-tab-pane>
      <el-tab-pane label="个人查询" name="personal">
        <PersonalRecord />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
  import DepartmentRecord from './Tab/DepartmentRecord.vue';
  import PersonalRecord from './Tab/PersonalRecord.vue';
  const activeName = ref('department');

  function handleClick() {}
</script>
<style lang="scss" scoped>
.content-box {
  border-radius: 10px;
  background: #323745;
}
</style>