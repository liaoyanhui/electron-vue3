/*
 * @Description: 
 * @Author: pgm
 * @Date: 2024-01-29 05:34:45
 * @LastEditors: 
 * @LastEditTime: 2024-03-11 21:05:46
 * @FilePath: /cbank-client/src/store/system/room-system.js
 */


import Cookies from 'js-cookie'
import { getCompanyAreaList, getCompanyRoomTypeList,getRoomStatusIndividuations } from "@/api/system/room-system";
const useRoomSystemStore = defineStore(
  'roomSystemStore', {
  state: () => ({
    roomSystem: {},
    roomSystemTypeMap: [],  //房台类型列表
      roomSystemAreaMap: [], //房台区域列表
      roomSystemStatusColorList: [], //房间状态颜色列表
  }),
    actions: {
      
    //获取房台类型列表
    ajaxRoomSystemTypeMap(queryParams) {
      return new Promise(resolve => {
        let params = {
          ...queryParams
        }
        getCompanyRoomTypeList(params).then(res => {
          this.roomSystemTypeMap = res
          resolve(res)
        })
      })
    },
    //获取房台区域列表
    ajaxRoomSystemAreaMap(queryParams) {
      return new Promise(resolve => {
        let params = {
          ...queryParams
        }
        getCompanyAreaList(params).then(res => {
          this.roomSystemAreaMap = res
          resolve(res)
        })
      })
    },

    //获取房间状态颜色列表
    ajaxRoomSystemStatusColorList() {
      return new Promise(resolve => { 
        let params = {
        }
        getRoomStatusIndividuations(params).then(res => {
          this.roomSystemStatusColorList = res
          resolve(res)
        })
      })
    
    }
  }
})

export default useRoomSystemStore