/*
 * @Description: 
 * @Author: pgm
 * @Date: 2024-01-18 23:15:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-20 01:13:02
 * @FilePath: /cbank-client/src/store/user.js
 */
import { login, getInfo } from '@/api/login'
import { getToken, setToken, removeToken, setCompanyId } from '@/utils/auth'
import { lSet,lRemoveAll } from '@/utils/storage.js'
import router from '@/router/index'
import defAva from '@/assets/img/img.jpg'
import { defineStore } from 'pinia'
import { sseService } from '@/utils/eventsource'
import usePermissionStore from '@/store/permission'
const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      token: getToken(),
      id: '',
      nickname: '',
      avatar: '',
      logoPic: '',
      packagePic: '',
      bankName: '',
      roles: [],
      permissions: []
    }),
    actions: {
      // 账号密码s登录
      login(userInfo) {
        const userName = userInfo.username.trim()
        const password = userInfo.password
        const code = userInfo.code
        const uuid = userInfo.uuid
        return new Promise((resolve, reject) => {
          login({userName, password}).then(res => {
            let {token =''} = res
            if (token) {
              this.token = token
              setToken(token)
              resolve(token)
            } else {
              reject('登录失败')
            }            
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 获取用户信息
      getInfo() {
        return new Promise((resolve, reject) => {
          getInfo().then(res => {
            // this.permissions = ['*:*:*'] || res.permissions
            this.permissions = res.permissions
            this.nickname = res.nickname
            this.logoPic = res.logoPic
            this.packagePic=res.packagePic
            this.bankName = res.bankName
            if (res.sysRoleId == 0 && res.type == 1) { //超级管理员
              this.roles = ['admin']
            } else {
              this.roles =  ['ROLE_DEFAULT']
            }
            lSet('nickname',res.nickname)
            setCompanyId(res.companyId)
            resolve(res.sysRoleId)
          }).catch(error => {
              reject(error)
          })
          // this.roles = ['admin'] || ['ROLE_DEFAULT']
        })
      },
      // 退出系统
      logOut() {
        return new Promise((resolve, reject) => {
          console.log()
          this.token = ''
          this.roles = []
          this.permissions = []
          lRemoveAll()
          usePermissionStore().setRoutes([])
          removeToken()
          sseService.disconnect()
          router.replace('/login?redirect='+router.currentRoute.value.path)
          resolve()
        })
      }
    }
  })

export default useUserStore
