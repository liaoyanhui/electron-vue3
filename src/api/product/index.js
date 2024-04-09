/*
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-01-26 11:47:52
 * @LastEditTime: 2024-02-20 11:51:52
 * @FilePath: /cbank-client/src/api/product/index.js
 */

import request from "@/utils/request";

// 出品实况列表
export const getProductRecord = (params) => request({ url: "/product/record", data: params })

// 出品实况 实时推送列表
export const getProductDataRecord = (params) => request({ url: "/product/dataRecord", data: params })

// 重新打单
export const productReissue = (params) => request({ url: "/product/reissue", data: params })

// 退单
export const productChargeback = (params) => request({ url: "/product/chargeback", data: params })

// 菜品列表
export const productDishInfo = (params) => request({ url: "/product/dishInfo", data: params })

// 用户场所列表
export const getUserCompanyList = (params) => request({ url: "/getUserCompanyList", data: params })

// 双击下单 出品转换
export const cancelOrders = (data) => request({ url: "/product/cancelOrders", data })

// 批量转换
export const oneClickProduction = (data) => request({ url: "/product/oneClickProduction", data })

// 出品汇总列表
export const getSummaryList = (data) => request({ url: "/product/summary", data })

// 出品汇总导出
export const summaryExport = (data) => request({ url: "/product/summaryExport", data, responseType: 'blob' })



