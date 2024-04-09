/*
 * @Description: 打印机
 * @Author: 尚夏
 * @Date: 2024-01-27 13:56:18
 * @LastEditTime: 2024-01-27 13:57:49
 * @FilePath: /cbank-client/src/store/printer.js
 */

import {
  getOrderPrintInPage
} from "@/api/system/other-system";
import { defineStore } from 'pinia'

const usepPrinterStore = defineStore(
  'printer', {
  state: () => ({

  }),
  actions: {
    // ajaxGetProductRecord(queryParams) {
    //   return new Promise(resolve => {
    //     let params = {
    //       ...queryParams,
    //       makeDepartmentId: '6',
    //     }
    //     getOrderPrintInPage(params).then(res => {
    //       resolve(res)
    //     })
    //   })
    // },
  }
})

export default usepPrinterStore