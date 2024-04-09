/*
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-29 15:14:36
 * @LastEditTime: 2024-03-05 20:51:38
 * @FilePath: /cbank-client/src/api/bookingPerformance/index.js
 */

import request from "@/utils/request";

// 分组订房业绩
export const deptBookingPerformance = (params) => request({ url: "/performance/deptBookingPerformance", data: params })
// 个人订房业绩
export const personBookingPerformance = (params) => request({ url: "/performance/personBookingPerformance", data: params })

// 每月部门统计
export const monthPerformanceTotal = (params) => request({ url: "/performance/monthPerformanceTotal", data: params })
// 每月个人统计
export const monthPersonPerformanceTotal = (params) => request({ url: "/performance/monthPersonPerformanceTotal", data: params })

// 分组订房业绩详情
export const deptBookingPerformanceDetail = (params) => request({ url: "/performance/deptBookingPerformanceDetail", data: params })
// 个人订房业绩详情
export const personBookingPerformanceDetail = (params) => request({ url: "/performance/personBookingPerformanceDetail", data: params })
// 业绩设置列表
export const performanceList = (params) => request({ url: "/performance/performanceList", data: params })
// 业绩设置状态修改
export const performanceEnable = (params) => request({ url: "/performance/performanceEnable", data: params })
// 新增 编辑
export const performanceEdit = (params) => request({ url: "/performance/performanceEdit", data: params })
// 业绩修改记录
export const performanceRecord = (params) => request({ url: "/performance/performanceRecord", data: params })

// 分组订房业绩导出
export const deptBookingPerformanceExport = (params) => request({ url: "/performance/deptBookingPerformanceExport", data: params, responseType: 'blob' })
// 个人订房业绩导出
export const personBookingPerformanceExport = (params) => request({ url: "/performance/personBookingPerformanceExport", data: params, responseType: 'blob' })
// 每月业绩统计导出
export const monthPerformanceTotalExport = (params) => request({ url: "/performance/monthPerformanceTotalExport", data: params, responseType: 'blob' })
// 每月个人业绩导出
export const monthPersonPerformanceTotalExport = (params) => request({ url: "/performance/monthPersonPerformanceTotalExport", data: params, responseType: 'blob' })