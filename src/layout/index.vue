<!--
 * @Description: 
 * @Author: pgm
 * @Date: 2024-02-26 15:40:00
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-20 00:25:24
 * @FilePath: /cbank-client/src/layout/index.vue
-->
<template>
  <div :class="sideShow ?'app-wrapper' : 'hideSidebar app-wrapper'" :style="`background-image:  ${userStore.packagePic && !sideShow? 'url('+userStore.packagePic + ')' : 'none'}`">
    <navbar @setLayout="setLayout" />
    <div class="main-container" >
      <sidebar class="sidebar-container" v-if="sideShow"/>
      <app-main />
      <!-- <settings ref="settingRef" /> -->
    </div>
  </div>
</template>

<script setup>
import useSettingsStore from '@/store/settings'
import usePermissionStore from '@/store/permission'
import AppMain from './components/AppMain.vue'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/SideBar/index.vue'
import useUserStore from '@/store/user'
const settingsStore = useSettingsStore()
const userStore = useUserStore()
const permissionStore = usePermissionStore()
const route = useRoute();
const router = useRouter();
// 所有的路由信息
const routers = computed(() => permissionStore.routes);
const theme = computed(() => settingsStore.theme);
const sideShow = computed(() => permissionStore.sideShow);
if (route.path == '/redirect') {
  let asyncRoutes = routers.value.filter(item => item.id)
  let path = asyncRoutes.length>0 ? asyncRoutes[0].path :  ''
  if (path) {
    router.replace(path)
  }
} 
const settingRef = ref(null);
function setLayout() {
  settingRef.value.openSetting();
}
</script>

<style lang="scss" scoped>
  @import "@/assets/styles/mixin.scss";
  @import "@/assets/styles/variables.module.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

// .fixed-header {
//   position: fixed;
//   top: 0;
//   right: 0;
//   z-index: 9;
//   width: 100%;
//   transition: width 0.28s;
// }

.hideSidebar .main-container {
  width: 100%;
  margin-left:0;
}

.sidebarHide .fixed-header {
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}
.main-container {
    // width: calc(100% - $base-sidebar-width);
    // margin-left: $base-sidebar-width;
    height: 100%;
    // transition: margin-left .28s;
    position: relative;
    display: flex;
    
  }
</style>