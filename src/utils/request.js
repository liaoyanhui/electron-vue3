import axios from 'axios';
import qs from "qs"
import { ElNotification, ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import cache from '@/plugins/cache'
import { ContentTypeEnum, ErrorCode } from './httpEnum';
import { getToken, getCompanyId } from '@/utils/auth'
import { tansParams, debounce } from '@/utils'
import useUserStore from '@/store/user'

import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const TIME_OUT = 20000
const BASE_URL = import.meta.env.VITE_BASE_API + "/cbank"
// const BASE_URL = 'http://192.168.0.118:8050/cbank'
// const BASE_URL = 'http://192.168.0.117:8040/cbank'
// 是否显示重新登录
export let isRelogin = { show: false };

const whiterUrl = ['/getAllCompanyData'] //重复请求白名单
const service = axios.create({
  baseURL: BASE_URL,
  timeout: TIME_OUT, // 超时时间
  withCredentials: true,
  headers: {
    'Content-Type': ContentTypeEnum.FORM_URLENCODED
  },
  // validateStatus: function (status) {
  //   return status >= 200 && status < 300; // 默认值
  // },
});
service.defaults.method = 'POST';
const errHandle = debounce((message) => {
  ElMessage({
    message: message,
    type: 'error',
    duration: 3 * 1000
  })
}, 1000, true)

/**
 * 请求拦截器
 */
service.interceptors.request.use(
  (config) => {
    const relativeUrl = config.url;
    if (relativeUrl.indexOf('/cmember') > -1) {
      config.baseURL = import.meta.env.VITE_BASE_API_MEMBER;
    }
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
    if (getToken() && !isToken) {
      config.headers['token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params);
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    const contentType = config.headers?.['Content-Type'] || ContentTypeEnum.FORM_URLENCODED;
    const companyId = getCompanyId()
    let data = config.data || {}
    if (!Reflect.has(data, 'companyId') && !!companyId) {
      data.companyId = companyId
    }

    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
      const requestObj = {
        url: config.url,
        data: typeof config.data === 'object' ? JSON.stringify(data) : data,
        time: new Date().getTime()
      }
      const requestSize = Object.keys(JSON.stringify(requestObj)).length; // 请求数据大小
      const limitSize = 5 * 1024 * 1024; // 限制存放数据5M
      if (requestSize >= limitSize) {
        console.warn(`[${config.url}]: ` + '请求数据大小超出允许的5M限制，无法进行防重复提交验证。')
        return config;
      }
      const sessionObj = cache.session.getJSON('sessionObj')

      if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
        cache.session.setJSON('sessionObj', requestObj)
      } else {
        const s_url = sessionObj.url;                // 请求地址
        const s_data = sessionObj.data;              // 请求数据
        const s_time = sessionObj.time;              // 请求时间
        const interval = 300;                       // 间隔时间(ms)，小于此时间视为重复提交
        if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url && !whiterUrl.includes(config.url)) {
          const message = '正在处理中，请稍后再试';
          console.warn(`[${s_url}]: ` + message)
          return Promise.reject(new Error(message))
        } else {
          cache.session.setJSON('sessionObj', requestObj)
        }
      }
    }
    if (config.method === 'post' || config.method === 'put') {
      if (ContentTypeEnum.FORM_DATA == contentType) {
        const fd = new FormData();
        Object.keys(data).forEach((key) => fd.append(key, data[key]));
        config.data = fd;
      } else if (ContentTypeEnum.FORM_URLENCODED == contentType) {
        config.data = qs.stringify(data);
      }
    }
    return config;
  },
  (error) => {
    console.log(error); // for debug
    Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
// 响应拦截器
service.interceptors.response.use(res => {
  // console.log('res.data=res=>', res)s

  let { isEnc = 'N' } = res.data
  let resText = res.data?.resText || res.data
  let data = {}
  if (isEnc === "Y") {

  }

  data = typeof resText === 'object' ? resText : JSON.parse(resText)


  // 未设置状态码则默认成功状态
  const code = data.code || 200;
  // 获取错误信息
  const msg = ErrorCode[code] || data.errorMsg || ErrorCode['default']
  // 二进制数据则直接返回
  if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
    return res
  }
  if (code == 401) {
    if (!isRelogin.show) {
      isRelogin.show = true;
      ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        isRelogin.show = false;
        useUserStore().logOut()
      }).catch(() => {
        isRelogin.show = false;
      });
    }
    return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
  } else if (code === 500) {
    ElMessage({
      message: msg,
      type: 'error'
    })
    return Promise.reject(new Error(msg))
  } else if (code === 601) {
    ElMessage({
      message: msg,
      type: 'warning'
    })
    return Promise.reject(new Error(msg))
  } else if (code != 0) {
    console.log('ElNotification', 'msg',)
    ElNotification.error({
      title: msg
    })
    return Promise.reject('error')
  } else {
    return Promise.resolve(res.data.result)
  }
},
  error => {
    console.log('err' + error)
    let {
      message
    } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    errHandle(message)
    return Promise.reject(error)
  }
)
export default service;