/*
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-22 16:51:12
 * @LastEditTime: 2024-03-06 17:35:56
 * @FilePath: /cbank-client/src/api/gift/index.js
 */
import request from '@/utils/request'

// 批量设置赠送方案
export const batchEditGiftPackage = (params) => request({ url: '/gift/batchEditGiftPackage', data: params })

// 设置赠送套餐
export const editGiftPackage = (params) => request({ url: '/gift/editGiftPackage', data: params })

// 查询套餐
export const giftPackageSelect = (params) => request({ url: '/gift/giftPackageSelect', data: params })

// 查询套餐明细
export const giftPackageSelectInfo = (params) => request({ url: '/gift/giftPackageSelectInfo', data: params })

// 删除套餐
export const giftPackageDelete = (params) => request({ url: '/gift/giftPackageDelete', data: params })

// 获取赠送权限用户数据
export const giftPermission = (params) => request({ url: '/gift/giftPermission', data: params })

// 新增/编辑 虚拟用户
export const editGift = (params) => request({ url: '/gift/editGift', data: params })

// 删除赠送权限
export const deleteGift = (params) => request({ url: '/gift/delete', data: params })

// 批量扣款
export const batchDeductions = (params) => request({ url: '/gift/batchDeductions', data: params })

// 批量充值
export const batchUsableAccount = (params) => request({ url: '/gift/batchUsableAccount', data: params })

// 批量编辑赠送权限
export const batchEditGift = (params) => request({ url: '/gift/batchEditGift', data: params })

// 批量或者单个启用/停用
export const enable = (params) => request({ url: '/gift/enable', data: params })

// 是否开启收银赠送
export const editGiftEnableBank = (params) => request({ url: '/gift/editGiftEnableBank', data: params })

// 获取记录列表
export const getTopUpRecord = (params) => request({ url: '/gift/getTopUpRecord', data: params })

// 批量绑定用户配置权限
export const batchBindUserGift = (params) => request({ url: '/gift/batchBindUserGift', data: params })
