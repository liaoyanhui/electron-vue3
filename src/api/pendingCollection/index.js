/*
 * @Description: 
 * @Author: pgm
 * @Date: 2024-03-08 17:20:09
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-11 14:06:08
 * @FilePath: /cbank-client/src/api/pendingCollection/index.js
 */
import request from '@/utils/request'
//反挂账
export const backCredit = (params) => request({ url: "/backCredit", data: params })
//挂账确认回收
export const creditCollection = (params) => request({ url: "/creditCollection", data: params })
//挂账回收统计
export const getCreditPolymerizationList = (params) => request({ url: "/getCreditPolymerizationList", data: params })

//挂账回收订单详细信息列表
export const getCreditInfoList = (params) => request({ url: "/getCreditInfoList", data: params })
//挂账回收订单详细信息
export const getCreditInfo = (params) => request({ url: "/getCreditInfo", data: params })
//挂账回收已回收详情
export const recycledCreditBillInfo = (params) => request({ url: "/recycledCreditBillInfo", data: params })
//挂账回收已回收列表
export const recycledCreditBillList = (params) => request({ url: "/recycledCreditBillList", data: params })
//今天挂账回收列表
export const todayRecoveryList = (params) => request({ url: "/todayRecoveryList", data: params })









