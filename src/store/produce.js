/*
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-01-23 13:44:12
 * @LastEditTime: 2024-02-05 21:43:13
 * @FilePath: /cbank-client/src/store/produce.js
 */
import {
  getProductionDepartmentList, updateProductionDepartmentEnable, delProductionDepartmentDelete, getPrintList,
  updateProductionDepartmentEdit, getDishTypeSelect, updateDishInfo, companyRoomTypeList, productionDepartmentSelectAll, productionDepartmentByUser
} from "@/api/system/produce-system";
import { defineStore } from 'pinia'

const useProduceStore = defineStore(
  'produce', {
  state: () => ({

  }),
  actions: {
    ajaxProductionDepartmentList(queryParams) {
      return new Promise(resolve => {
        let params = {
          ...queryParams
        }
        getProductionDepartmentList(params).then(res => {
          resolve(res)
        })
      })
    },
    ajaxUpdateProductionDepartmentEnable(queryParams) {
      return new Promise(resolve => {
        let params = {
          ...queryParams
        }
        updateProductionDepartmentEnable(params).then(res => {
          resolve(res)
        })
      })
    },
    ajaxDelProductionDepartmentDelete(queryParams) {
      return new Promise(resolve => {
        let params = {
          ...queryParams
        }
        delProductionDepartmentDelete(params).then(res => {
          resolve(res)
        })
      })
    },
    ajaxUpdateProductionDepartmentEdit(queryParams) {
      return new Promise(resolve => {
        let params = {
          ...queryParams
        }
        updateProductionDepartmentEdit(params).then(res => {
          resolve(res)
        })
      })
    },
    ajaxUpdateDishInfo(queryParams) {
      return new Promise(resolve => {
        let params = {
          ...queryParams
        }
        updateDishInfo(params).then(res => {
          resolve(res)
        })
      })
    },
    ajaxGetDepartmentAll() {
      return new Promise(resolve => {
        productionDepartmentSelectAll().then(res => {
          // const arr = res;
          // arr.unshift({
          //   id: 0,
          //   departmentName: '全部'
          // })
          resolve(res)
        })
      })
    },
    ajaxGetDepartmentBuyUser() {
      return new Promise(resolve => {
        productionDepartmentByUser().then(res => {
          const arr = res;
          arr.unshift({
            id: 0,
            departmentName: '全部'
          })
          resolve(arr)
        })
      })
    },
    ajaxGetPrintList(queryParams) {
      return new Promise(resolve => {
        let params = {
          ...queryParams
        }
        getPrintList(params).then(res => {
          let arr = [];
          if (res) {
            arr = res.map(item => {
              return {
                value: item.id,
                label: item.deviceName,
              }
            })
          }
          resolve(arr)
        })
      })
    },
    ajaxCompanyRoomTypeList(queryParams) {
      return new Promise(resolve => {
        let params = {
          ...queryParams
        }
        companyRoomTypeList(params).then(res => {
          let arr = [];
          if (res) {
            arr = res.map(item => {
              return {
                value: item.id,
                label: item.typeName,
              }
            })
          }
          resolve(arr)
        })
      })
    },
    ajaxGetDishTypeSelect(queryParams) {
      return new Promise(resolve => {
        let params = {
          ...queryParams
        }
        getDishTypeSelect(params).then(res => {
          let arr = [];
          if (res && res.length > 0) {
            // 递归转换数据格式
            function func(list) {
              return list.map(item => {
                let items = {
                  value: item.id,
                  label: item.typeName,
                  parentId: item.parentId,
                  typeName: item.typeName,
                }
                if (item.children && item.children.length > 0) {
                  items.children = func(item.children);
                }
                return items;
              })
            }
            arr = func(res)
          }
          resolve(arr)
        })
      })
    },
  }
})

export default useProduceStore