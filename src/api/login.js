/*
 * @Description: 
 * @Author: pgm
 * @Date: 2024-01-29 01:25:40
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-18 22:40:37
 * @FilePath: /cbank-client/src/api/login.js
 */
import request from '@/utils/request'

//账号密码登录
export const login = (params) => request({ url: "/bank/user/loginUser", data: params })
//获取登录二维码信息
export const loginQRCode = (params) => request({ url: "/bank/user/getLoginQRCode", data: params })
//二维码登录校验
export const loginKeUserStatus = (params) => request({ url: "/bank/user/loginKeUserStatus", data: params })

//获取登录用户信息
export const getInfo = (params) => request({ url: "/system/user/loginUserInfo", data: params })





