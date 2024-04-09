
import request from '@/utils/request';
import { parseStrEmpty } from "@/utils";

// 查询用户列表
export function listUser(data) {
  return request({
    url: '/system/user/list',
    data
  })
}
// 用户列表导出
export function listExport(data) {
  return request({
    url: '/system/user/listExport',
    data,
    responseType: 'blob'
  })
}

// 用户列表数据
export function userLevelHistory(data) {
  return request({
    url: '/system/user/userLevelHistory',
    data,
  })
}
// 用户权限历史
export function userRoleHistory(data) {
  return request({
    url: '/system/user/userRoleHistory',
    data,
  })
}

// 角色列表
export function apiroleList(data) {
  return request({
    url: '/system/user/apiRoleList',
    data
  })
}
// 等级列表
export function apiLevel(data) {
  return request({
    url: '/system/user/apiLevel',
    data
  })
}




