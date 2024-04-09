/*
 * @Description: 收银设置
 * @Author: 尚夏
 * @Date: 2024-02-06 13:29:12
 * @LastEditTime: 2024-02-18 17:32:10
 * @FilePath: /cbank-client/src/api/cashier/index.js
 */

import request from "@/utils/request";

// 收银设置方式列表
export const getPayMethodList = (params) => request({ url: "/cashRegister/payMethodList", data: params })

// 新增/编辑收银设置方式
export const payMethodEdit = (params) => request({ url: "/cashRegister/payMethodEdit", data: params })

// 修改排序
export const payMethodSort = (params) => request({ url: "/cashRegister/payMethodSort", data: params })

// 删除
export const payMethodDelete = (params) => request({ url: "/cashRegister/payMethodDelete", data: params })

// 收银参数查询
export const companyConfig = (params) => request({ url: "/cashRegister/companyConfig", data: params })

// 收银参数编辑
export const companyConfigEdit = (params) => request({ url: "/cashRegister/companyConfigEdit", data: params })

