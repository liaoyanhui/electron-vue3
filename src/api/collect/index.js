/*
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-29 15:14:36
 * @LastEditTime: 2024-03-05 16:09:31
 * @FilePath: /cbank-client/src/api/collect/index.js
 */

import request from "@/utils/request";

// 赠送汇总
export const giftTotal = (params) => request({ url: "/collect/giftTotal", data: params })
// 上台汇总
export const goOnStage = (params) => request({ url: "/collect/goOnStage", data: params })
// 挂账汇总
export const pendingAccount = (params) => request({ url: "/collect/pendingAccount", data: params })


// 赠送汇总导出
export const giftTotalExport = (params) => request({ url: "/collect/giftTotalExport", data: params, responseType: 'blob' })
// 上台汇总导出
export const goOnStageExport = (params) => request({ url: "/collect/goOnStageExport", data: params, responseType: 'blob' })
// 挂账汇总导出
export const pendingAccountExport = (params) => request({ url: "/collect/pendingAccountExport", data: params, responseType: 'blob' })
