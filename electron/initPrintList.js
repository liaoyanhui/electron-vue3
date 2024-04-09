/*
 * @Description: 
 * @Author: pgm
 * @Date: 2024-03-12 20:16:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-12 22:35:16
 * @FilePath: /cbank-client/electron/initPrintList.js
 */
const { dialog, ipcMain } = require("electron")
const log = require('electron-log')
function initPrintList(win) {
 ipcMain.on('getPrintList', async (event, isShowMessage) => {
    log.info('initPrintList===>')
      try {
         // 在background.js里把win对象传递进来,通过win的webContents的getPrintersAsync方法获取到本地打印机，在渲染进程进行读取
        const list = await win.webContents.getPrintersAsync()
        // log.info('getPrintList===>',list)
        // event.sender.send('replyChannel', 'replyData');
        return list
      } catch (error) {
        console.log('error', error)
      }
  })
}
module.exports = initPrintList


