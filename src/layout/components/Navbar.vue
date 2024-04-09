<!--
 * @Description: 
 * @Author: pgm
 * @Date: 2024-01-26 10:10:45
 * @LastEditTime: 2024-03-19 23:26:31
 * @FilePath: /cbank-client/src/layout/components/Navbar.vue
-->
<template>
  <!-- <el-affix :offset="0"> -->
  <div class="nav-header">
    <div class="logo-holder">
      <img :src="userStore.logoPic || imgurl" width="45px" height="45px" alt="LOGO"  />
      <span class="ml-10">{{userStore.bankName || '鑫动收银'}}</span>
    </div>
    <div class="top-menu-holder">
      <el-menu    :default-active="activeMenu"  class="el-menu-box" mode="horizontal" @select="handleSelect"
        text-color="#fff" :ellipsis="false">
        <template v-for="(item, index) in topMenus" >
          <el-menu-item  :index="item.path"  :key="index"
          v-if="index < visibleNumber">
            <!-- <i :class="item.icon"></i> -->
            <img v-if="item.meta.icon&&item.meta.icon.includes('http')" :src="item.meta.icon" :width="44" :height="44" class="mr-8" alt="">
            {{ item.meta?.title }}
          </el-menu-item>
        </template>
         <!-- 顶部菜单超出数量折叠 -->
        <el-sub-menu :style="{'--theme': 'dark'}" index="more" v-if="topMenus.length > visibleNumber">
          <template #title>更多菜单</template>
          <template v-for="(item, index) in topMenus">
            <el-menu-item
              :index="item.path"
              :key="index"
              v-if="index >= visibleNumber">
            <!-- <svg-icon
              v-if="item.meta && item.meta.icon && item.meta.icon !== '#'"
              :icon-class="item.meta.icon"/> -->
            {{ item.meta.title }}
            </el-menu-item>
          </template>
        </el-sub-menu>
       
      </el-menu>
    </div>
    <div class="right-holder d-flex al-center">
      <div class="fs-16  date d-flex al-center"><div class="time">{{ currentTime }}</div><div class="ml-4 day">{{ currentDay }}</div></div>
      
      <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="click" >
        <span class="el-dropdown-link">
          {{ userStore.nickname }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <!-- <el-dropdown-item command="changePassword">修改密码</el-dropdown-item> -->
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <!-- <app-order-detail ref="appOrderDetail" /> -->

  <!-- </el-affix> -->
</template>
<script setup>
import { ElMessageBox } from 'element-plus'
import imgurl from '@/assets/img/img.png';
import { constantRoutes } from '@/router/constantRouter';
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat';
import zhCN from 'dayjs/locale/zh-cn';
dayjs.extend(customParseFormat);
dayjs.locale('zh-cn');
import { isHttp } from '@/utils/validate'
import { useRouter } from 'vue-router';
import usePermissionStore from '@/store/permission'
import  useUserStore from '@/store/user'
const route = useRoute();
const router = useRouter();
const userStore = useUserStore()
const permissionStore = usePermissionStore()
// 顶部栏初始数
const visibleNumber = ref(null);
// 当前激活菜单的 index
const currentIndex = ref(null);
// 所有的路由信息
const routers = computed(() => permissionStore.topbarRouters);
// 隐藏侧边栏路由
const hideList = ['/index', '/user/profile'];
const currentTime = ref(dayjs().format('MM月DD日 HH:mm:ss'));
const currentDay = ref(dayjs().format('dddd'));
// 顶部显示菜单
const topMenus = computed(() => {
  let topMenus = [];
  routers.value.map((menu) => {
    if (menu.hidden !== true) {
      // 兼容顶部栏一级菜单内部跳转
      if (menu.path === "/") {
          topMenus.push(menu.children[0]);
      } else {
          topMenus.push(menu);
      }
    }
  })
  return topMenus;
})


// 设置子路由
const childrenMenus = computed(() => {
  let childrenMenus = [];
  routers.value.map((router) => {
    for (let item in router.children) {
      if (router.children[item].parentPath === undefined) {
       
        if(router.path === "/") {
          router.children[item].path = "/" + router.children[item].path;
        } else {
          if(!isHttp(router.children[item].path)) {
            router.children[item].path = router.path + "/" + router.children[item].path;
          }
        }
        router.children[item].parentPath = router.path;
      }
      childrenMenus.push(router.children[item]);
    }
  })
  // console.log('childrenMenus',childrenMenus)
  return constantRoutes.concat(childrenMenus);
})


// 默认激活的菜单
const activeMenu = computed(() => {
  const path = route.path;
  let activePath = path;
  if (path !== undefined && path.lastIndexOf("/") > 0 && hideList.indexOf(path) === -1) {
    const tmpPath = path.substring(1, path.length);
    activePath = "/" + tmpPath.substring(0, tmpPath.indexOf("/"));
    // if (!route.meta.link) {
    //   // permissionStore.handleShow(true)
    // }
  } else if(!route.children) {
    activePath = path;
    // permissionStore.handleShow(false)
  }
  // console.log('activeMenu==>',path)
  if (route.meta.sidebarShow) {
    permissionStore.handleShow(true)
  } else {
    permissionStore.handleShow(false)
  }

  activeRoutes(activePath);
  return activePath;
})


function setVisibleNumber() {
  const width = document.body.getBoundingClientRect().width / 3;
  visibleNumber.value = parseInt(width / 105);
}

function handleSelect(key, keyPath) {
  currentIndex.value = key;
  const route = routers.value.find(item => item.path === key);
  if (isHttp(key)) {
    // http(s):// 路径新窗口打开
    window.open(key, "_blank");
  }
  else {
    // console.log('show',childrenMenus,key)

    const routeMenu = childrenMenus.value.find(item => item.path === key);
    if (routeMenu && routeMenu.query) {
      let query = JSON.parse(routeMenu.query);
      router.push({ path: key, query: query });
    } else {
      router.push({ path: key });
    }
  }

  // else if (!route || !route.children || route.meta.sidebarHide) {
  //   // 没有子路由路径内部打开
  //   const routeMenu = childrenMenus.value.find(item => item.path === key);
  //   if (routeMenu && routeMenu.query) {
  //     let query = JSON.parse(routeMenu.query);
  //     router.push({ path: key, query: query });
  //   } else {
  //     router.push({ path: key });
  //   }
  //   permissionStore.handleShow(false)

  // } else {
  //   // 显示左侧联动菜单
  //   activeRoutes(key);
  //   permissionStore.handleShow(true)

  // }
}

//激活左侧菜单
function activeRoutes(key) {
  let sidebarRouters = [];
  if (childrenMenus.value && childrenMenus.value.length > 0) {
    // console.log('childrenMenus.value===>',childrenMenus.value)
    childrenMenus.value.map((item) => {
      if (key == item.parentPath || (key == "index" && "" == item.path)) {
        sidebarRouters.push(item);
      }
    });
  }
  if (sidebarRouters.length > 0) {
    // console.log('sidebarRouters.length',sidebarRouters)
    permissionStore.setSidebarRouters(sidebarRouters);
  } else {
    permissionStore.handleShow(false)
  }
  return sidebarRouters;
}

// 更新时间显示
const updateTimeDisplay = () => {
  currentTime.value = dayjs().format('MM月DD日 HH:mm:ss');
  currentDay.value = dayjs().format('dddd');
};

// 每秒更新一次时间显示
const timerId = setInterval(updateTimeDisplay, 1000);


onMounted(() => {
  window.addEventListener('resize', setVisibleNumber)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', setVisibleNumber)
  clearInterval(timerId);
})

onMounted(() => {
  setVisibleNumber()
})


function handleCommand(command) {
  switch (command) {
    // case "setLayout":
    //   setLayout();
    //   break;
    case "logout":
      logout();
      break;
    default:
      break;
  }
}
function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logOut()
  }).catch(() => { });
}
</script>
<style lang="scss" scoped>
  .right-holder {
    width: 340px;
    .date{
      .time{
        width: 150px;
      }
      .day{
        white-space: nowrap;
        padding-right:18px;
      }
     
    }
    padding: 0px 20px 0;

  }
</style>
