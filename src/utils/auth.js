/*
 * @Description: 
 * @Author: pgm
 * @Date: 2024-01-29 05:34:45
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-22 15:52:15
 * @FilePath: /cbank-client/src/utils/auth.js
 */
import Cookies from 'js-cookie'

const TokenKey = 'token'
const TokenKey2 = 'token2'
const CompanyId = 'companyId'
const UserName = 'nickname';

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}


export function removeToken() {
  return localStorage.removeItem(TokenKey)
}


export function getCompanyId() {
  return localStorage.getItem(CompanyId)
}

export function getUserName() {
  return localStorage.getItem(UserName)
}

export function setCompanyId(id) {
  return localStorage.setItem(CompanyId, id)
}

export function removeCompanyId() {
  return localStorage.removeItem(CompanyId)
}


export function getToken2() {
  return localStorage.getItem(TokenKey2)
}

export function setToken2(token) {
  return localStorage.setItem(TokenKey2, token)
}
