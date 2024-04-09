/*
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-01-24 17:21:15
 * @LastEditTime: 2024-01-24 18:42:45
 * @FilePath: /cbank-client/src/store/upload.js
 */

import {
  uploadImage
} from "@/api/upload";
import { defineStore } from 'pinia'

const useUploadStore = defineStore(
  'upload', {
  state: () => ({

  }),
  actions: {
    ajaxUploadImage(queryParams) {
      return new Promise((resolve, reject) => {
        let params = {
          ...queryParams
        }
        uploadImage(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
  }
})

export default useUploadStore