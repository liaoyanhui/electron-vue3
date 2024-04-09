/*
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-01-22 20:52:05
 * @LastEditTime: 2024-03-05 22:36:31
 * @FilePath: /cbank-client/src/api/system/room-system.js
 */
import request from "@/utils/request"

//场所包厢类型列表
export const getCompanyRoomTypeList = (params) => request({ url: "/companyRoomTypeList", data: params })
//新增场所包厢类型
export const addCompanyRoomType = (params) => request({ url: "/addCompanyRoomType", data: params })
//更新场所包厢类型
export const updateCompanyRoomTypeList = (params) => request({ url: "/updateRoomType", data: params })


//场所包厢列表
export const getCompanyRoomList = (params) => request({ url: "/companyRoomList", data: params })
//场所包厢列表简化（包厢设置列表）
export const companyRoomSimplifyList = (params) => request({ url: "/companyRoomSimplifyList", data: params })

//添加场所包厢
export const addCompanyRoom = (params) => request({ url: "/addCompanyRoom", data: params })
//更新场所包厢
export const updateCompanyRoom = (params) => request({ url: "/updateCompanyRoom", data: params })


//场所区域列表
export const getCompanyAreaList = (params) => request({ url: "/companyAreaList", data: params })
//添加场所区域
export const addCompanyArea = (params) => request({ url: "/addCompanyArea", data: params })
//更新场所区域
export const updateCompanyArea = (params) => request({ url: "/updateCompanyArea", data: params })



//获取房态个性化配置
export const getRoomStatusIndividuations = (params) => request({ url: "/getNewRoomStatusList", data: params })

//更新房态个性化
export const updateRoomStatusIndividuations = (params) => request({ url: "/updateRoomStatusIndividuations", data: params })