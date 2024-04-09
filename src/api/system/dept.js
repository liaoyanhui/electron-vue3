/*
 * @Description: 
 * @Author: pgm
 * @Date: 2024-01-30 16:54:10
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-11 21:13:48
 * @FilePath: /cbank-client/src/api/system/dept.js
 */

import request from '@/utils/request';

// 查询部门树
export function deptTreeSelect(data) {
  return request({
    url: '/system/dept/deptTree',
    data
  })
}
// 查询部门列表
export function listDept(data) {
  return request({
    url: '/system/dept/list',
    data
  })
}
