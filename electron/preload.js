/*
 * @Description:
 * @Author: 尚夏
 * @Date: 2024-01-27 17:06:34
 * @LastEditTime: 2024-02-06 14:54:07
 * @FilePath: /cbank-client/electron/preload.js
 */

const { contextBridge, ipcRenderer } = require("electron");
const Menu = require('@electron/remote').Menu;
require('./store/index.js');
// const log = require('electron-log')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  send: (channel, data) => ipcRenderer.invoke(channel, data),
  // 能暴露的不仅仅是函数，我们还可以暴露变量
})

contextBridge.exposeInMainWorld('mainApi', {
  ipcRenderer: {
    on: (channel, listener) => {
      ipcRenderer.on(channel, listener);
    },
    send: (channel, ...args) => {
      ipcRenderer.send(channel, ...args);
    }
  }
});
contextBridge.exposeInMainWorld('menuApi', {
  showMenu: (args) => Menu.buildFromTemplate(args).popup(),
});

// log.info(Menu, 'mmmmm111')