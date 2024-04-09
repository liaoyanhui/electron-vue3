/*
 * @Description: 
 * @Author: pgm
 * @Date: 2024-01-15 17:32:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-20 02:05:08
 * @FilePath: /cbank-client/src/router/index.js
 */
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import {  ElMessage } from 'element-plus'
import {constantRoutes,dynamicRoutes} from './constantRouter';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import useUserStore from '@/store/user'
import usePermissionStore from '@/store/permission'
import { getToken } from '@/utils/auth'
import { isRelogin } from '@/utils/request'
import { isHttp } from '@/utils/validate'
const whiteList = ['/login','/print'];



const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})


NProgress.configure({ showSpinner: false });
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (getToken()) { 
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else { 
      console.log('to',to.path,from)
      if (useUserStore().roles.length === 0) { 
        isRelogin.show = true
          // 判断当前用户是否已拉取完user_info信息
        useUserStore().getInfo().then((res) => {
            let roleId = res
            isRelogin.show = false
            usePermissionStore().generateRoutes(roleId).then(accessRoutes => {
              // 根据roles权限生成可访问的路由表
              if (accessRoutes.length == 0) {
                next({path:'/403'})
              }
              accessRoutes.forEach(route => {
                if (!isHttp(route.path)) {
                  router.addRoute(route) // 动态添加可访问路由表
                }
              })
              // console.log('hack方法 确保addRoutes已完成',to.path)
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
            })
        }).catch(err => {
            console.log('err===>',err)
            useUserStore().logOut().then(() => {
              ElMessage.error(err)
            })
          })
      } else {
        next()
      }
    }
  } else {
     // 没有token
     if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
     } else {
       console.log('fullPath',to.fullPath)
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
 
});

router.afterEach(() => {
  NProgress.done()
})

export default router;