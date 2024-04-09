/*
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-01-26 11:47:31
 * @LastEditTime: 2024-02-05 22:08:19
 * @FilePath: /cbank-client/src/store/product.js
 */

import {
  getProductRecord,
  productReissue,
  getProductDataRecord,
  getSummaryList
} from "@/api/product";
import { defineStore } from 'pinia'

const useProductStore = defineStore(
  'product', {
  state: () => ({

  }),
  actions: {
    ajaxGetProductRecord(queryParams) {
      return new Promise(resolve => {
        let params = {
          ...queryParams,
          // makeDepartmentId: ['6'],
        }
        getProductRecord(params).then(res => {
          resolve(res)
        })
      })
    },
    ajaxProductReissue(queryParams) {
      return new Promise(resolve => {
        let params = {
          ...queryParams,
          makeDepartmentId: ['6'],
        }
        productReissue(params).then(res => {
          resolve(res)
        })
      })
    },
    ajaxGetProductDataRecord(queryParams) {
      return new Promise(resolve => {
        let params = {
          ...queryParams,
          // makeDepartmentId: ['6'],
        }
        getProductDataRecord(params).then(res => {
          resolve(res)
        })
      })
    },
    ajaxGetSummaryList(queryParams) {
      return new Promise(resolve => {
        let params = {
          ...queryParams,
          // makeDepartmentId: ['6'],
        }
        getSummaryList(params).then(res => {
          resolve(res)
        })
      })
    },
  }
})

export default useProductStore