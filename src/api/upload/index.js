/*
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-01-23 13:41:17
 * @LastEditTime: 2024-01-30 20:46:36
 * @FilePath: /cbank-client/src/api/upload/index.js
 */
import request from "@/utils/request";
import {
  ContentTypeEnum,
  ErrorCode
} from '@/utils/httpEnum';
// 上传图片
export const uploadImage = (params) => request({
  url: "/fileUpload/image", data: params, headers: {
    'content-type': ContentTypeEnum.FORM_DATA
  }
})