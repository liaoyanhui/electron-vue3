/*
 * @Description: 
 * @Author: pgm
 * @Date: 2024-01-29 05:35:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-19 23:00:40
 * @FilePath: /cbank-client/src/api/common/common.js
 */
import request from '@/utils/request'

//场所列表
export const getCompanyList = (params) => request({ url: "/getCompanyList", data: params })
// 获取场所菜单
export const getCompanyMenu = (params) => request({ url: "/system/menu/getCompanyMenu", data: params })
// 给场所绑定菜单
export const bindingCompanyMenu = (params) => request({ url: "/system/menu/bindingCompanyMenu", data: params })
export const listDistribution = (params) => request({ url: "/system/menu/listDistribution", data: params })
export const updateCompanyInfo = (params) => request({ url: "/updateCompanyInfo", data: params })


// 获取场所用户按钮权限
export const getUserCompanyRole = (params) => request({ url: "/getUserCompanyRole", data: params })



export const getOrganizationList = (params) => request({ url: "/getOrganizationList", data: params })

export const getUserCompanyList = (params) => request({ url: "/getUserCompanyList", data: params })


//开台套餐列表-设置包厢，根据包厢类型
export const openRoomPackage = (params) => request({ url: "/dishes/openRoomPackage", data: params })
//开台套餐列表-开包使用
export const openPlatformPackageRoom = (params) => request({ url: "/dishes/openPlatformPackageRoom", data: params })



