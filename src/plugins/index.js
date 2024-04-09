/*
 * @Description: 
 * @Author: pgm
 * @Date: 2024-01-18 23:01:05
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-01-31 00:46:57
 * @FilePath: /cbank-client/src/plugins/index.js
 */
import tab from './tab'
import auth from './auth'
import cache from './cache'
import modal from './modal'
// import download from './download'

export default function installPlugins(app){
  // 页签操作
  app.config.globalProperties.$tab = tab
  // 认证对象
  app.config.globalProperties.$auth = auth
  // 缓存对象
  app.config.globalProperties.$cache = cache
  // 模态框对象
  app.config.globalProperties.$modal = modal
  // 下载文件
  // app.config.globalProperties.$download = download
}
