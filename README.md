<!--
 * @Description:
 * @Author: 尚夏
 * @Date: 2024-01-22 10:28:00
 * @LastEditTime: 2024-01-31 21:48:07
 * @FilePath: /cbank-client/README.md
-->

# cbank-client

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## 自动化打包多平台项目

```sh
./build.sh #跑sh命令需要给予权限 所以要先 chmod 777 build.sh
```

## 右键菜单

### 右键菜单(主进程)

```js
const remote = require("@electron/remote/main") //1
remote.initialize()//2
// main.js
const createWindow = () => {
  ...
   mainWindow = new BrowserWindow({
    ...
    webPreferences: {
      nodeIntegrationInWorker: true,
      nodeIntegration: true,//允许渲染进程使用nodejs
      preload: path.join(__dirname, 'preload.js'),
    }
  })
  remote.enable(mainWindow.webContents)//3
  ...
}

// preload.js
const Menu = require("@electron/remote").Menu;

contextBridge.exposeInMainWorld("menuApi", {
  showMenu: (args) => Menu.buildFromTemplate(args).popup(),
});
```

### 右键菜单(渲染层用法)

```html
<div @contextmenu="rightClick(data)">...</div>
```

```js
// data表示你需要传入的参数
function getContextTemlate(data) {
  const contextTemplate = [
    {
      label: "menu1",
      click: () => {
        doSomething(data);
      },
    },
    {
      label: "menu2",
      submenu: [{ label: "men2-child1" }, { label: "men2-child2" }],
    },
  ];
  return contextTemplate;
}

function rightClick(data) {
  const contextTemplate = getContextTemlate(data);
  window.menuApi.showMenu(contextTemplate);
}
```
