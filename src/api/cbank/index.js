/*
 * @Description: 
 * @Author: pgm
 * @Date: 2024-01-25 20:24:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-18 14:41:29
 * @LastEditTime: 2024-02-05 14:01:45
 * @FilePath: /cbank-client/src/api/cbank/index.js
 */
import request from '@/utils/request'

//开台
export const directOpenRoom = (params) => request({ url: "/directOpenRoom", data: params })

//全部清台
export const clearAll = () => request({ url: "/clearAll" })

//入客
export const guestsEntering = (params) => request({ url: "/guestsEntering", data: params })

//清台单个包厢
export const clearRoom = (params) => request({ url: "/clearRoom", data: params })

//添加预约
export const addRoomReserve = (params) => request({ url: "/addRoomReserve", data: params })
//修改预约
export const updateRoomReserveInfo = (params) => request({ url: "/updateRoomReserveInfo", data: params })

//包厢详情
export const getRoomReserveInfo = (params) => request({ url: "/getRoomReserveInfo", data: params })
//预约换包
export const replaceRoom = (params) => request({ url: "/replaceRoom", data: params })

//预订转入客或取消预订使用
export const cancellationRoomReserveInfo = (params) => request({ url: "/cancellationRoomReserveInfo", data: params })
//开台后转台
export const changeRoom = (params) => request({ url: "/changeRoom", data: params })

//空包转维修
export const maintenanceRoom = (params) => request({ url: "/maintenanceRoom", data: params })
//并台
export const mergeOperate = (params) => request({ url: "/mergeOperate", data: params })
//并台房间信息
export const roomPayableInfo = (params) => request({ url: "/roomPayableInfo", data: params })
//并台记录
export const mergeList = (params) => request({ url: "/mergeList", data: params })
roomPayableInfo
//账单合计
export const settlementInfo = (params) => request({ url: "/settlementInfo", data: params })
//账单列表
export const getPackageList = (params) => request({ url: "/getPackageList", data: params })
//删除房费
export const cancellationRoomCost = (params) => request({ url: "/cancellationRoomCost", data: params })
//结账记录（结账列表）
export const cancellationList = (params) => request({ url: "/cancellationList", data: params })
//并台结账记录（并台结账列表）
export const cancellationMergeList = (params) => request({ url: "/cancellationMergeList", data: params })

//并台消费列表
export const getMergePackageList = (params) => request({ url: "/getMergePackageList", data: params })
//消费汇总列表
export const consumptionSummary = (params) => request({ url: "/consumptionSummary", data: params })

//结账时统计账单
export const allAmountStatistics = (params) => request({ url: "/allAmountStatistics", data: params })
//并台结账时统计账单
export const allMergeAmountStatistics = (params) => request({ url: "/allMergeAmountStatistics", data: params })
//修改单价
export const updateUnitPrice = (params) => request({ url: "/updateUnitPrice", data: params })
//添加房费
export const bindingPackage = (params) => request({ url: "/bindingPackage", data: params })
//退单接口
export const backGoods = (params) => request({ url: "/backGoods", data: params })
//结账
export const settlementRoom = (params) => request({ url: "/settlementRoom", data: params })
//并台结账
export const addSettlementMergeBill = (params) => request({ url: "/addSettlementMergeBill", data: params })
//反结账
export const backBill = (params) => request({ url: "/backBill", data: params })
//并台反结账
export const backMergeBill = (params) => request({ url: "/backMergeBill", data: params })
//补低消
export const completionMinConsume = (params) => request({ url: "/completionMinConsume", data: params })
//删除低消
export const completionMinConsumeCost = (params) => request({ url: "/completionMinConsumeCost", data: params })

// 存入本地的json数据
export const getAllCompanyData = (params) => request({ url: "/getAllCompanyData", data: params })
//确认收款
export const affirmRoom = (params) => request({ url: "/affirmRoom", data: params })
//并台确认收款
export const affirmMergeRoom = (params) => request({ url: "/affirmMergeRoom", data: params })

// 转房记录
export const roomReplaceRecordList = (params) => request({ url: "/getNewRoomReplaceRecordList", data: params })



/**营业汇总 */
//营业汇总
export const businessSummary = (params) => request({ url: "/businessSummary", data: params })
// 部门订房
export const departmentReservation = (params) => request({ url: "/departmentReservation", data: params })
// 部门返房
export const departmentBackRoom = (params) => request({ url: "/departmentBackRoom", data: params })
// 个人订房
export const personalReservation = (params) => request({ url: "/personalReservation", data: params })
// 部门订房
export const personalBackRoom = (params) => request({ url: "/personalBackRoom", data: params })

/**收银汇总 */
//收银汇总
export const cashierSummary = (params) => request({ url: "/cashierSummary", data: params })
//营业收款明细
export const revenueCollectionInfo = (params) => request({ url: "/revenueCollectionInfo", data: params })
//菜品统计
export const dishStatistics = (params) => request({ url: "/dishStatistics", data: params })
//今天挂账回收列表
export const pendingRecoveryInfo = (params) => request({ url: "/pendingRecoveryInfo", data: params })

//获取账单打印的html
export const orderPrintSettlement = (params) => request({ url: "/orderPrintSettlement", data: params })

//获取包厢台票记录
export const getUserTicketList = (params) => request({ url: "/third/getUserTicketList", data: params })



// // 部门返房
// export const departmentBackRoom = (params) => request({ url: "/departmentBackRoom", data: params })
// // 个人订房
// export const personalReservation = (params) => request({ url: "/personalReservation", data: params })
// // 部门订房
// export const personalBackRoom = (params) => request({ url: "/personalBackRoom", data: params })