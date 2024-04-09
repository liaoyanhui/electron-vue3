<!--
 * @Description: 
 * @Author: pgm
 * @Date: 2024-01-18 21:49:56
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-19 14:44:21
 * @FilePath: /cbank-client/src/views/redirect/index.vue
-->
<template>
  <div></div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import usePermissionStore from '@/store/permission'
const permissionStore = usePermissionStore()

const router = useRouter();
const route = useRoute();
const gotoPath = route.params.path;
// 所有的路由信息
const routers = computed(() => permissionStore.topbarRouters);
//判断是否可以跳转该路由
const isCan = permissionStore.canJumpRoutre('/' + gotoPath)
if (gotoPath&&isCan) {
  router.replace({path: `/${gotoPath}`});
} else {
  let path = routers.value[0]?.path ?? '/403'
  router.replace(path)
}

</script>

<style scoped lang="less"></style>
