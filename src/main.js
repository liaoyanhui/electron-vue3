/*
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-01-25 21:54:23
 * @LastEditTime: 2024-03-12 16:32:49
 * @FilePath: /cbank-client/src/main.js
 */


import { createApp } from 'vue'
import elementIcons from '@/components/SvgIcon/svgicon'
import 'element-plus/dist/index.css';
import '@/assets/styles/index.scss'  // global css

// 分页组件
import Pagination from '@/components/Pagination'
import App from './App.vue'
import store from './store'
import router from './router'
import directive from './directive' // directive
// 注册指令
import plugins from './plugins' // plugins
import { handleTree, resetForm, parseTime, addDateRange, selectDictLabel, selectDictLabels } from '@/utils'
import { getJson } from '@/utils/getAllComponentData';

import Print from 'vue3-print-nb'
// svg图标
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'
const app = createApp(App)
app.use(router)
app.use(store)
app.use(plugins)
app.use(elementIcons)
app.use(Print)
app.component('svg-icon', SvgIcon)

//全局组件
app.component('Pagination', Pagination)
// 全局方法挂载

app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels

getJson();
directive(app)
app.mount('#app')
