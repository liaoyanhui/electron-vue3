/*
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-29 15:14:36
 * @LastEditTime: 2024-03-06 20:35:19
 * @FilePath: /cbank-client/src/api/synthesis/index.js
 */

import request from "@/utils/request";

// 订房查询
export const bookingSelect = (params) => request({ url: "/synthesis/bookingSelect", data: params })

// 开台明细
export const bookingPerformance = (params) => request({ url: "/synthesis/bookingPerformance", data: params })

// 轮房查询
export const rotateSelect = (params) => request({ url: "/synthesis/rotateSelect", data: params })

// 落单明细
export const placeOrderDetail = (params) => request({ url: "/synthesis/placeOrderDetail", data: params })

// 挂账明细
export const detailsPendingAccounts = (params) => request({ url: "/synthesis/detailsPendingAccounts", data: params })

// 返房查询
export const returnRoom = (params) => request({ url: "/synthesis/returnRoom", data: params })
// 退单明细
export const chargeBackDetail = (params) => request({ url: "/synthesis/chargeBackDetail", data: params })

// 上台明细
export const goOnStageDetail = (params) => request({ url: "/synthesis/goOnStageDetail", data: params })

// 订房导出
export const bookingSelectExport = (params) => request({ url: "/synthesis/bookingSelectExport", data: params, responseType: 'blob' })

// 开台明细导出
export const bookingPerformanceExport = (params) => request({ url: "/synthesis/bookingPerformanceExport", data: params, responseType: 'blob' })

// 轮房导出
export const rotateSelectExport = (params) => request({ url: "/synthesis/rotateSelectExport", data: params, responseType: 'blob' })

// 落单导出
export const placeOrderDetailExport = (params) => request({ url: "/synthesis/placeOrderDetailExport", data: params, responseType: 'blob' })

// 挂账明细导出
export const detailsPendingAccountsExport = (params) => request({ url: "/synthesis/detailsPendingAccountsExport", data: params, responseType: 'blob' })

// 返房查询导出
export const returnRoomExport = (params) => request({ url: "/synthesis/returnRoomExport", data: params, responseType: 'blob' })

// 退单明细导出
export const chargeBackDetailExport = (params) => request({ url: "/synthesis/chargeBackDetailExport", data: params, responseType: 'blob' })
// 上台明细导出
export const goOnStageDetailExport = (params) => request({ url: "/synthesis/goOnStageDetailExport", data: params, responseType: 'blob' })