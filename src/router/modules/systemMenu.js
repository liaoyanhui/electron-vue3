/*
 * @Description: 菜单配置路由
 * @Author: pgm
 * @Date: 2024-02-26 15:40:00
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-19 20:31:58
 * @FilePath: /cbank-client/src/router/modules/systemMenu.js
 */


export const routerObj = [
  {
    "name": "oldSystem",
    "path": "/old-system",
    "hidden": false,
    "redirect": "/old-system/menu",
    "component": "Layout",
    "alwaysShow": true,
    "meta": {
      "title": "菜单管理",
      "icon": "system",
      "noCache": false,
      "link": null,
    },
    "roles": ['admin'],  
    "children": [
      {
        "name": "Menu",
        "path": "menu",
        "hidden": false, //菜单是否在左侧导航栏显示
        "component": "system/menu/index",
        "meta": {
          "title": "菜单管理",
          "icon": "tree-table",
          "noCache": false,
          "link": null
        }
      },
      {
        "name": "company-list",
        "path": "company-list",
        "hidden": false, 
        "component": "system/company/list.vue",
        "meta": {
          "title": "场所管理",
          "icon": "tree-table",
          "noCache": false,
          "link": null
        }
      }
    ]
  }
]