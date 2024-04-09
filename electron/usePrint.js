const { ipcMain, BrowserWindow } = require("electron")
const log = require('electron-log')
const path = require("path")
module.exports = function usePrint() {
  /**主窗体的win对象 */
  ipcMain.on('handle_print', (e, { url, htmlText, deviceName, isShow = false, width,devTool }) => {
    // 创建一个新的隐藏窗口，用于打印
    let printWindow = new BrowserWindow({
      show: isShow, width:width, height: 1080, contextIsolation: false, enableRemoteModule: true, nodeIntegration: true,webSecurity: false,
    })
    if (devTool) {
      printWindow.webContents.openDevTools()
    }
    if (url) {
      printWindow.loadURL(url);
    } else {
      printWindow.loadURL('data:text/html,' + encodeURIComponent(htmlText))
    }
    printWindow.webContents.on('did-finish-load', () => {
      log.info('finish')
      printWindow.webContents.print({ deviceName, silent: true }, (success, errorType) => {
        if (!success) {
          log.info('errorTypeaa', errorType)
        } else {
          log.info('打印成功success');
        }
        if (!devTool) {
          printWindow.close();
        }
      })
    })
  })
}