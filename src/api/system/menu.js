/*
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-01-31 15:09:01
 * @LastEditTime: 2024-03-11 21:10:17
 * @FilePath: /cbank-client/src/api/system/menu.js
 */
import request from '@/utils/request';

// 查询菜单列表
export function listMenu(data) {
  return request({
    url: '/system/menu/list',
    data
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/system/menu/treeSelect',
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(data) {
  return request({
    url: '/system/menu/treeSelectByRole',
    data
  })
}
// // 根据角色ID查询菜单下拉树结构
export function loginUserRouterMenu(data) {
  return request({
    url: '/system/menu/loginUserRouterMenu',
    data
  })
}

// 新增菜单/编辑
export function addMenu(data) {
  return request({
    url: '/system/menu/add',
    method: 'post',
    data: data
  })
}

// 删除菜单
export function delMenu(data) {
  return request({
    url: '/system/menu/delete',
    method: 'post',
    data: data
  })
}