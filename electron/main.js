// electron/main.js
const { app, BrowserWindow, Menu, screen, dialog, session, ipcMain } = require("electron")
const path = require("path")
const updateHandle = require("./update.js")
const initPrintList = require("./initPrintList.js")
const usePrint = require('./usePrint.js')
const remote = require("@electron/remote/main")
remote.initialize()//2
// require('@electron/remote/main').initialize()
// 是否是生产环境
const isPackaged = app.isPackaged
// 禁止显示默认菜单
Menu.setApplicationMenu(null)
const log = require('electron-log')

//打印log到本地
// if (isPackaged) {
//   log.transports.file.maxSize = 1002430 // 10M
//   log.transports.file.format =
//     '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
//   log.transports.file.resolvePath = () => './operation.log'
// }
log.info('中文');
log.info(isPackaged)

// 主窗口
let mainWindow
app.commandLine.appendSwitch('lang', 'zh-CN');
const createWindow = () => {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    // 默认窗口标题，如果由loadURL()加载的HTML文件中含有标签<title>，此属性将被忽略。
    title: "馨娱收银",
    // 设置窗口尺寸为屏幕工作区尺寸
    width: screen.getPrimaryDisplay().workAreaSize.width,
    height: screen.getPrimaryDisplay().workAreaSize.height,
    // 设置最小尺寸
    minWidth: 800,
    minHeight: 600,

    // 窗口图标。 在 Windows 上推荐使用 ICO 图标来获得最佳的视觉效果, 默认使用可执行文件的图标.
    // 在根目录中新建 build 文件夹存放图标等文件
    icon: path.resolve(__dirname, "../build/icon.ico"),
    webPreferences: {
      enableRemoteModule: true,
      // nodeIntegrationInWorker: true,
      nodeIntegration: true,//允许渲染进程使用nodejs
      // contextIsolation: false,//允许渲染进程使用nodejs
      // preload: path.join('file://', __dirname, '/preload.js')
      preload: path.join(__dirname, 'preload.js'),
      // preload: `${__dirname}/preload.js`
    }
  })
  remote.enable(mainWindow.webContents)//3

  // 更新
  if (isPackaged) {
    log.info('更新检查')
    updateHandle(mainWindow, log)
  }

  let template = [{
    label: "应用",
    submenu: [
      { label: "关于馨娱收银", selector: "orderFrontStandardAboutPanel:" },
      { type: "separator" },
      { label: "退出", accelerator: "Command+Q", click: function () { app.quit(); } }
    ]
  }, {
    label: "管理",
    submenu: [
      { label: "回退", accelerator: "CommandOrControl+Z", selector: "undo:" },
      { label: "前进", accelerator: "Shift+CommandOrControl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "刷新", accelerator: "CommandOrControl+R", click: function () { mainWindow.webContents.reload(); } },
      { label: "剪切", accelerator: "CommandOrControl+X", selector: "cut:" },
      { label: "复制", accelerator: "CommandOrControl+C", selector: "copy:" },
      { label: "黏贴", accelerator: "CommandOrControl+V", selector: "paste:" },
      { label: "全选", accelerator: "CommandOrControl+A", selector: "selectAll:" },
      { label: '打开控制台', accelerator: "CommandOrControl+shift+I+O+P", click: function () { mainWindow.webContents.openDevTools() }, visible: false }
    ]
  }];

  // 开发环境下，打开开发者工具。
  // if (!isPackaged) {
  // mainWindow.webContents.openDevTools()
  // }

  // 加载文件，load 的是 html 文件，要做特殊处理。
  function load() {
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
    log.info(isPackaged, 'hellow')
    if (!isPackaged) { // 开发环境
      mainWindow.loadURL('http://127.0.0.1:9527/');
      // mainWindow.webContents.openDevTools({ mode: "bottom" })
    } else { // 线上环境
      // mainWindow.loadURL('http://192.168.0.123:9527/');
      mainWindow.loadURL(path.join('file://', __dirname, '/dist/index.html'));
      // mainWindow.webContents.openDevTools({ mode: "bottom" })
    }

    // else {
    //   mainWindow.loadURL('http://192.168.0.127:9527/');
    //   mainWindow.webContents.openDevTools({ mode: "bottom" })
    // }
    // mainWindow.loadURL(isPackaged ? `file://${path.join(__dirname, "../dist/index.html")}` : "http://localhost:9527")
  }
  // 加载失败之后触发
  mainWindow.webContents.on("did-fail-load", () => {
    load()
  })
  mainWindow.webContents.on("before-input-event", (event, input) => {
    //全屏模式下esc键取消全屏
    if (input.key.toLowerCase() === "escape" && mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false)
    }
  })

  if (isPackaged) {
    // 当用户或页面想要导航时触发。
    // 它可能发生在 window.location 对象改变或用户点击页面上的链接时，可能会发生这种情况。
    // 当使用如 webContents.loadURL 和 webContents.back APIs 以编程方式导航时，将不会触发此事件。
    // 页面内导航也不会触发，例如点击锚点或更新 window.location.hash。 可使用 did-navigate-in-page 事件。
    mainWindow.webContents.on("will-navigate", (event, url) => {
      event.preventDefault()
      load()
    })

    // 禁止使用快捷键刷新
    // mainWindow.webContents.on("before-input-event", (event, input) => {
    //   mainWindow.webContents.setIgnoreMenuShortcuts(
    //     input.key.toLowerCase() === "f5" ||
    //     (input.control && input.key.toLowerCase() === "r") ||
    //     (input.meta && input.key.toLowerCase() === "r")
    //   );
    // });

    // 将 file://example.com/xxx 的 文件改为 https 协议
    // session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    //   //TODO
    //   console.log('details.url===>',details.url)
    //   if (/^file:\/\/example\.com\//.test(details.url)) {

    //   // if (/^file:\/\/example\.com\//.test(details.url)) {
    //     callback({
    //       redirectURL: details.url.replace(/^file/, "https")
    //     });
    //   } else {
    //     callback(details);
    //   }
    // });
    // // 请求接口时，如果是本站接口，则获取 .example.com 中的 cookie，添加到请求头中
    // session.defaultSession.webRequest.onBeforeSendHeaders(
    //   async (details, callback) => {
    //     if (isWeapi.test(details.url)) {
    //       const cookies = await getCookies();
    //       if (cookies) details.requestHeaders.cookie = cookies;
    //     }
    //     callback({
    //       requestHeaders: details.requestHeaders
    //     });
    //   }
    // );

    // // 接受到服务端响应时，如果是本站接口，则获取响应头中的 set-cookie，添加到 .example.com 的 cookie 中
    // session.defaultSession.webRequest.onHeadersReceived(
    //   async (details, callback) => {
    //     if (
    //       isWeapi.test(details.url) &&
    //       "responseHeaders" in details &&
    //       "set-cookie" in details.responseHeaders
    //     ) {
    //       await setCookies(details.responseHeaders["set-cookie"]);
    //     }
    //     callback({
    //       responseHeaders: details.responseHeaders
    //     });
    //   }
    // );
  }
  // 在窗口要关闭的时候触发
  mainWindow.on("close", (e) => {
    e.preventDefault()
    dialog
      .showMessageBox(mainWindow, {
        type: "info",
        title: "退出提示",
        defaultId: 0,
        cancelId: 1,
        message: "确定要退出吗？",
        buttons: ["退出", "取消"]
      })
      .then((res) => {
        if (res.response === 0) {
          // e.preventDefault();
          // mainWindow.destroy();
          app.exit(0)
        }
      })
  })

  load()
}
// // 限制只能打开一个窗口
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    // 当运行第二个实例时,将会聚焦到 mainWindow 这个窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      // mainWindow.show();
    }
  });
}

function getDictJson() {
  try {
    delete require.cache[require.resolve('./store/dictStore.json')];
    const data = require('./store/dictStore.json')
    mainWindow.webContents.send('setLocalJson', data.ms);
  } catch (error) {
    mainWindow.webContents.send('setLocalJson')
  }
}

ipcMain.on('getDictJson', () => {
  getDictJson();
})

// 在应用准备就绪时调用函数
app.whenReady().then(() => {
  createWindow()
  // 发消息 调用要存数据的接口
  getDictJson();
  setInterval(() => {
    getDictJson()
  }, 1000 * 60 * 10);
  // }, 1000*5);
  app.on("activate", () => {
    // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
    // 打开的窗口，那么程序会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  initPrintList(mainWindow)
  usePrint()
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})

// 如果开发环境使用了 nginx 代理，禁止证书报错
if (!isPackaged) {
  // 证书的链接验证失败时，触发该事件
  app.on("certificate-error", function (event, webContents, url, error, certificate, callback) {
    event.preventDefault()
    callback(true)
  })
}
