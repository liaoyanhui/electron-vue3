/*
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-21 16:46:40
 * @LastEditTime: 2024-03-22 16:19:12
 * @FilePath: /cbank-client/src/api/member/index.js
 */
import request from "@/utils/request";
import { getUserName } from '@/utils/auth'

export const getMemberList = (params) => request({ url: "/cmember/member/getMemberList", data: params })
// 根据手机号获取会员
export const getMember = (params) => request({ url: "/cmember/member/getMember", data: params })
// 新增/绑定 会员卡
export const addMember = (params) => request({
  url: "/cmember/member/addMember", data: {
    ...params,
    userName: JSON.parse(getUserName()).data
  }
})

// 会员卡列表
export const getMemberCardTypes = (params) => request({ url: "/cmember/member/getMemberCardTypes", data: params })
// 新增会员卡
export const addMemberCardTypes = (params) => request({
  url: "/cmember/member/addMemberCardTypes", data: {
    ...params,
    userName: JSON.parse(getUserName()).data
  }
})
// 编辑会员卡
export const updateMemberCardTypes = (params) => request({
  url: "/cmember/member/updateMemberCardTypes", data: {
    ...params,
    userName: JSON.parse(getUserName()).data
  }
})
// 删除会员卡
export const delMemberCardTypes = (params) => request({
  url: "/cmember/member/delMemberCardTypes", data: {
    ...params,
    userName: JSON.parse(getUserName()).data
  }
})
// 绑定会员卡
export const addMemberCard = (params) => request({
  url: "/cmember/member/addMemberCard", data: {
    ...params,
    userName: JSON.parse(getUserName()).data
  }
})
// 新增会员
export const addMemberWithCard = (params) => request({
  url: "/cmember/member/addMemberWithCard", data: {
    ...params,
    userName: JSON.parse(getUserName()).data
  }
})
// 根据会员ID获取会员卡信息
export const getMemberCardListById = (params) => request({ url: "/cmember/member/getMemberCardListById", data: params })
// 获取会员信息列表
export const getMemberCardList = (params) => request({ url: "/cmember/member/getMemberCardList", data: params })
// 删除会员卡
export const delMemberCard = (params) => request({
  url: "/cmember/member/delMemberCard", data: {
    ...params,
    userName: JSON.parse(getUserName()).data
  }
})
// 修改会员卡
export const updateMemberCard = (params) => request({
  url: "/cmember/member/updateMemberCard", data: {
    ...params,
    userName: JSON.parse(getUserName()).data
  }
})
// 获取交易明细
export const getMemberCardTrans = (params) => request({ url: "/cmember/member/getMemberCardTrans", data: params })
// 会员卡充值
export const rechargeMemberCard = (params) => request({
  url: "/cmember/member/rechargeMemberCard", data: {
    ...params,
    userName: JSON.parse(getUserName()).data
  }
})
// 会员卡充值记录
export const getRechargeDetails = (params) => request({ url: "/cmember/member/getRechargeDetails", data: params })
// 会员卡消费记录
export const getConsumeDetails = (params) => request({ url: "/cmember/member/getConsumeDetails", data: params })
// 导出会员卡信息
export const memberCardListExport = (params) => request({
  url: "/cmember/member/memberCardListExport", data: {
    ...params,
    userName: JSON.parse(getUserName()).data
  }, responseType: 'blob'
})
// 获取会员卡消费扣款规则列表
export const getConsumptionRules = (params) => request({ url: "/cmember/member/getConsumptionRules", data: params })
// 获取会员基础设置
export const getMemberBasicSetting = (params) => request({ url: "/cmember/member/getMemberBasicSetting", data: params })
// 设置会员基础设置
export const saveMemberBasicSetting = (params) => request({
  url: "/cmember/member/saveMemberBasicSetting", data: {
    ...params,
    userName: JSON.parse(getUserName()).data
  }
})

