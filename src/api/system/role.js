
import request from '@/utils/request';

// 查询角色列表
export function listRole(data) {
  return request({
    url: '/system/role/list',
    data
  })
}
// 查询角色列表所有　
export function userRoleList() {
  return request({
    url: '/system/role/userRoleList',
  })
}

// 修改角色/新增
export function updateRole(data) {
  return request({
    url: '/system/role/edit',
    data: data
  })
}
// 角色绑定用户
export function roleBindingUser(data) {
  return request({
    url: '/system/role/roleBindingUser',
    data
  })
}

// 修改是否启用
export function changeStatus(data) {
  return request({
    url: '/system/role/changeStatus',
    data: data
  })
}

// 删除角色
export function delRole(data) {
  return request({
    url: '/system/role/delete',
    data
  })
}



