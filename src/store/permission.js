import auth from '@/plugins/auth'
import router from '@/router'
import {
  constantRoutes,
  dynamicRoutes,
  systemRouters,
  mockRouters
} from '../router/constantRouter'
import {
  loginUserRouterMenu
} from '@/api/system/menu'
import Layout from '@/layout/index.vue'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'

// 匹配views里面所有的.vue文件
const modules =
  import.meta.glob('@/views/**/*.vue')

const usePermissionStore = defineStore(
  'permission', {
  state: () => ({
    collapse: false,
    sideShow: false,
    routes: [],
    addRoutes: [],
    // defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: []
  }),
  actions: {
    handleCollapse() {
      this.collapse = !this.collapse;
    },
    handleShow(isHide) {
      this.sideShow = isHide;
    },
    setRoutes(routes) {
      this.addRoutes = routes
      this.routes = constantRoutes.concat(routes)
    },
    setDefaultRoutes(routes) {
      this.defaultRoutes = constantRoutes.concat(routes)
    },
    setTopbarRoutes(routes) {
      this.topbarRouters = routes
    },
    setSidebarRouters(routes) {
      this.sidebarRouters = routes
    },
    generateRoutes(roleId) {

      return new Promise((resolve,reject) => {
        // 向后端请求路由数据
        loginUserRouterMenu({
          id: roleId
        }).then(res => {
          let data = res.concat(filterDynamicRoutes(systemRouters)).concat(mockRouters)
          const rdata = JSON.parse(JSON.stringify(data))
          const sdata = JSON.parse(JSON.stringify(data))
          const rewriteRoutes = filterAsyncRouter(rdata, false, true, true)
          const sidebarRoutes = filterAsyncRouter(sdata)
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
          asyncRoutes.forEach(route => {
            router.addRoute(route)
          })
          const topBarData = rewriteRoutes.filter(item => !item.hidden)
          this.setRoutes(rewriteRoutes)
          this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))
          this.setTopbarRoutes(topBarData)
          console.log('rewriteRoutes',rewriteRoutes)
          resolve(rewriteRoutes)
        }).catch((e) => {
          reject(e)
        })

      })



    },
    canJumpRoutre(path) {
      return  isPageExists(this.routes, path)
    }
  }
})

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false, isFrist = false) {
  return asyncRouterMap.filter(route => {
    if (isFrist && route.children) {
      route.component = 'Layout'
      route.meta.sidebarShow = route.children.filter(item => !item.hidden).length > 0
    }

    if (route.redirect) {
      let redirectPath = route.redirect.split(route.path + '/')[1]
      if (redirectPath && route?.children?.filter(item => redirectPath.includes(item.path)).length === 0) {
        delete route.redirect
        // route.meta.activeMenu = 0
      }
    }

    if (type && route.children) {
      route.children = filterChildren({ childrenMap: route.children, parentName: route.name })
    }

    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component)
      }
    }
    // console.log("route.component==",route.component)
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren({ childrenMap, parentName }, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    el.name = parentName + '/' + el.name
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          c.name = el.name + '/' + c.name
          if (c.children && c.children.length) {
            children = children.concat(filterChildren({ childrenMap: c.children, parentName: c.name }, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
      if (el.children && el.children.length) {
        children = children.concat(filterChildren({ childrenMap: el.children, parentName: el.name }, el))
        return
      }
    }
    children = children.concat(el)
  })
  return children
}
export function isPageExists(routes, targetPage) {
  for (const route of routes) {
    if (route.name === targetPage) {
      return true; // 找到目标页面
    }
    if (route.children) {
      if (isPageExists(route.children, targetPage)) {
        return true; // 在子路由中找到目标页面
      }
    }
  }
  return false; // 未找到目标页面
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    } else {
      res.push(route)
    }
  })
  return res
}

export const loadView = (view) => {
  let res;
  for (const path in modules) {

    const dir = path.split('views/')[1].split('.vue')[0];
    // if (dir === view) {
    if (view.includes(dir)) {
      res = () => modules[path]();
    }
  }
  return res;
}

export default usePermissionStore