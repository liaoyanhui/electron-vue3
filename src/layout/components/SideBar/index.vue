<!--
 * @Description: 
 * @Author: pgm
 * @Date: 2024-01-22 01:04:43
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-02-22 14:25:53
 * @FilePath: /cbank-client/src/layout/components/SideBar/index.vue
-->
<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="activeMenu"
            :collapse="permissionStore.collapse"
            :background-color="sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
            :text-color="sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
            :active-text-color="theme"
            unique-opened
            router
        >
        <sidebar-item
          v-for="(route, index) in sidebarRouters"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
        />
        </el-menu>
    </div>
</template>

<script setup>
import SidebarItem from './SidebarItem.vue'
import variables from '@/assets/styles/variables.module.scss'
import useSettingsStore from '@/store/settings'
import usePermissionStore from '@/store/permission'
const route = useRoute();
const permissionStore = usePermissionStore()
const settingsStore=useSettingsStore()
const sideTheme = computed(() => settingsStore.sideTheme);
const theme = computed(() => settingsStore.theme);
const sidebarRouters =  computed(() => permissionStore.sidebarRouters);
const activeMenu = computed(() => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
})


</script>


