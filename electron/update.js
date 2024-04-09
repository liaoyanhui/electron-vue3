/*
 * @Description: 
 * @Author: pgm
 * @Date: 2024-01-16 18:28:40
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-22 13:39:55
 * @FilePath: /cbank-client/electron/update.js
 */
const { autoUpdater } = require('electron-updater');
const { dialog } = require("electron")
// 服务器静态文件地址，文章后面附上ng配置及需要上传的文件 / 更新地址
const updateUrl = 'https://image.hzxyle.com/cbank/package-test/'
// const updateUrl = 'https://image.hzxyle.com/cbank/package/42/'

// 自动更新
function handleUpdate(mainWindow, log) {
  log.info('aaaaa')
  // 设置是否自动下载，默认是true,当点击检测到新版本时，会自动下载安装包，所以设置为false
  autoUpdater.autoDownload = false;
  // 如果安装包下载好了，那么当应用退出后是否自动安装更新
  autoUpdater.autoInstallOnAppQuit = true;
  // 是否接受开发版，测试版之类的版本号
  autoUpdater.allowPrerelease = false;
  // 是否可以回退版本，比如从开发版降到旧的稳定版
  autoUpdater.allowDowngrade = false;
  autoUpdater.setFeedURL(updateUrl);
  autoUpdater.on("error", function (error) {
    log.info('检查更新出错', err)
    // 检查更新出错
  });
  autoUpdater.on("checking-for-update", function () {
    log.info('checking-for-update')
    // 检查中
  });
  autoUpdater.on("update-not-available", function (info) {
    log.info('update-not-available')
    // 已经是最新版
  });
  autoUpdater.on("update-available", function (info) {
    log.info('update-available')
    // 检测到新版本
    dialog
      .showMessageBox(mainWindow, {
        type: "info",
        title: "更新提示",
        defaultId: 0,
        cancelId: 1,
        message: "检测到新版本，是否立即更新？",
        buttons: ["确定", "取消"],
      })
      .then((res) => {
        if (res.response === 0) {
          // 执行下载安装包
          log.info('开始下载')
          autoUpdater.downloadUpdate();
        }
      }).catch((err) => {
        log.info('下载失败', err)
      });
  });
  autoUpdater.on("download-progress", function (progress) {
    log.info('download-progress', progress)
    // 下载进度
  });
  autoUpdater.on("update-downloaded", function (info) {
    log.info('update-downloaded')
    // 新安装包下载完成
    dialog
      .showMessageBox(mainWindow, {
        type: "info",
        title: "更新提示",
        defaultId: 0,
        cancelId: 1,
        message: "新版本下载完成，是否立即安装？",
        buttons: ["确定", "取消"],
      })
      .then((res) => {
        if (res.response === 0) {
          // 退出应用并安装更新
          autoUpdater.quitAndInstall();
          mainWindow.destroy();
        }
      });
  });

  // 执行自动更新检查
  autoUpdater.checkForUpdates();
}


module.exports = handleUpdate
