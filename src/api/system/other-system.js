/*
 * @Description: 其他设置
 * @Author: 尚夏
 * @Date: 2024-01-27 13:53:18
 * @LastEditTime: 2024-01-29 21:06:51
 * @FilePath: /cbank-client/src/api/system/other-system.js
 */

import request from "@/utils/request";

// 打印机列表
export const getOrderPrintInPage = (params) => request({ url: "/orderPrintInPage", data: params })

// 新增打印机
export const addOrderPrint = (params) => request({ url: "/addOrderPrint", data: params })

// 更新打印机
export const updateOrderPrint = (params) => request({ url: "/updateOrderPrint", data: params })

// 删除打印机
export const deleteOrderPrint = (params) => request({ url: "/deleteOrderPrint", data: params })

// 打印模板列表
export const getTemplateList = (params) => request({ url: "/orderPrintTemplateInPage", data: params })

// 打印机模板列表所有
export const getTemplateListAll = (params) => request({ url: "/orderPrintTemplateInAll", data: params })

// 删除模板列表
export const delOrderPrintTemplate = (params) => request({ url: "/deleteOrderPrintTemplate", data: params })

// 新建模板
export const addOrderPrintTemplate = (params) => request({ url: "/addOrderPrintTemplate", data: params })

// 更新模板
export const updateOrderPrintTemplate = (params) => request({ url: "/updateOrderPrintTemplate", data: params })

// 区域列表
export const getPrinterArea = (params) => request({ url: "/printerArea", data: params })

// 品牌
export const getBrand = (params) => request({ url: "/getBrand", data: params })

