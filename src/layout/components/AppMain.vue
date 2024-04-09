<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <div class="app-main-container">
          <keep-alive :include="tagsViewStore.cachedViews">
            <component v-if="route.meta.keepAlive" :is="Component" :key="route.path" />
          </keep-alive>
          <component v-if="!route.meta.keepAlive" :is="Component" :key="route.path" />
        </div>
      </transition>
    </router-view>
  </section>
</template>
<script setup >

import useTagsViewStore from '@/store/tagsView'
const tagsViewStore = useTagsViewStore()
</script>
<style lang="scss" scoped>


</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 6px;
  }
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  border-radius: 3px;
}
</style>


