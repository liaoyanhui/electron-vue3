/*
 * @Description: 
 * @Author: pgm
 * @Date: 2024-01-27 00:39:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-18 16:36:57
 * @FilePath: /cbank-client/src/utils/eventsource.js
 */
import { getToken } from "@/utils/auth";
import { ref } from 'vue';
const BASE_URL = import.meta.env.VITE_BASE_API
var reconnectInterval = 2000;
// const BASE_URL = 'http://192.168.0.118:9030'
// const BASE_URL = 'https://api.hzxyle.com/diqu/cbank/api/test'

// // 接受参数
// const  sseChatParams =  {
//   url: string,// sse 连接
//   onmessage: (event) => {},// 处理消息的函数
//   onopen: () => {},// 建立连接触发的事件
//   finallyHandler: () => {},// 相当于 try_finally 中的 finally 部分，不管出现异常或者关闭必然会执行的代码块
// }

class SSEService {
  // 建立连接
  // { url = `${BASE_URL}/sse/push/chatSSE2/${token}`, onmessage, onopen, finallyHandler, eventList}
  connect(sseChatParams={}) {
    const token = getToken()
    if (!sseChatParams.url) {
      sseChatParams.url  = `${BASE_URL}/sse/push/chatSSE2/${token}`
    }
    if (!this.eventSource || this.eventSource?.readyState === 2) {
      this.eventSource = new EventSource(sseChatParams.url);
    } 
    if (sseChatParams.onopen != null) {
        this.eventSource.onopen = sseChatParams.onopen;
    }else{
        this.eventSource.onopen = () => {
            console.log('SSE 连接已开启');
        };
    }
    if (sseChatParams.onmessage != null) {
        this.eventSource.onmessage = sseChatParams.onmessage;
    } else {
      this.eventSource.onmessage = (event) => {
          
            console.log('收到消息：',this.eventSource?.readyState, event.data);
        };
    }
    if (sseChatParams.finallyHandler!=null) {
      this.finallyHandler = sseChatParams.finallyHandler;
    } else {
      this.finallyHandler = () => {
        console.log('sse链接finallyHandler')
      }
    }

    this.eventSource.onerror = (error) => {
        if (this.eventSource?.readyState === EventSource.CLOSED) {
          console.log("SSE 连接已关闭");
          // 连接已关闭，进行重连
          setTimeout(()=> {
            this.connect(sseChatParams); // 重新连接
          }, reconnectInterval);
        } else {
            console.error("SSE 错误：", error);
        }
        this.finallyHandler();
    };

    //添加自定义事件
    if (sseChatParams.eventList?.length > 0) {
      sseChatParams.eventList.forEach(item => {
        const eventName = Object.keys(item)[0]; // 获取对象中的事件名
        const eventHandler = item[eventName]; // 获取事件处理函数
        if (eventName && typeof eventHandler === 'function') {
          this.eventSource?.addEventListener(eventName, eventHandler);
        }
      })
    }
  }

  // 关闭连接
  disconnect() {
      if (this.eventSource) {
          this.eventSource.close();
          console.log("关闭 sse 连接")
          if (this.finallyHandler != null) {
              this.finallyHandler();
          }
      }
  }
  
  //卸载自定义事件
  removeEvent(eventList=[]) {
    if (eventList?.length > 0) {
      eventList.forEach(item => {
        const eventName = Object.keys(item)[0]; // 获取对象中的事件名
        const eventHandler = item[eventName]; // 获取事件处理函数
        if (eventName && typeof eventHandler === 'function') {
          this.eventSource?.removeEventListener(eventName, eventHandler);
        }
      })
    }
  }
}

export const sseService = new SSEService();


