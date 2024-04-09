/*
 * @Description:
 * @Author: 尚夏
 * @Date: 2024-02-06 14:27:20
 * @LastEditTime: 2024-03-20 16:10:54
 * @FilePath: /cbank-client/src/utils/getAllComponentData.js
 */

import {
  getAllCompanyData
} from '@/api/cbank';
import {
  getToken
} from '@/utils/auth'
import {
  lSet,
  lGet,
  lRemove
} from './storage'
const loading =false
export async function getJson() {
  if (window.mainApi) {
    
    window.mainApi.ipcRenderer.on('setLocalJson', (event, arg) => {
      if (getToken()) { 
        getAllCompanyData({
          ms: arg
        }).then(res => {
          window.storeAPI.updateDict(res)
        })
      } 
    })
  } else {
    let allCompanyData = lGet('allCompanyData')
    let jsonData;
   
    if (getToken()) {
      let oldms = allCompanyData?.ms ?? undefined
    
      let timer = lGet('allCompanyDataTimer')
      // 解决1s内重复请求的问题
      if (timer && allCompanyData) {
        return allCompanyData?.data
      } else if (timer) { 
        return new Promise((resolve, reject) => {
          setTimeout(async() => {
            let data = await getJson()
            resolve(data);
          }, 500);
        });
      } else {
        lSet('allCompanyDataTimer',Date.now(),1)
      }
      try {
        const res = await getAllCompanyData({
          ms: oldms
        })
        let {
          data,
          ms
        } = res
        const newData = data.map(item => {
          item.diyKey = `${item.id}_${item.companyId}_${item.type}`;
          return item;
        })
        const oData = allCompanyData.data;

        if (!oData) {
          jsonData = {
            data: newData,
            ms: ms
          }
        } else {
          const oldData = oData.map(item => {
            item.diyKey = `${item.id}_${item.companyId}_${item.type}`;
            return item;
          });
          newData.forEach((element, eleIndex) => {
            oldData.forEach((item, index) => {
              if (element.diyKey == item.diyKey) {
                if (element.flag == 0) {
                  oldData[index] = element;
                } else if (element.flag == 1) {
                  oldData.splice(index, 1);
                  newData.splice(eleIndex, 1);
                }
              }
            })
          });
          // log.info(oldData, 'newData')
          const addSourceArr = newData.filter(item => {
            const dx = oldData.findIndex(c => c.diyKey === item.diyKey);
            if (dx > -1) {
              return false
            }
            return true;
          })

          // log.info(addSourceArr, 'addArr')
          if (addSourceArr && addSourceArr.length > 0) {
            oldData.push(...addSourceArr);
          }
          jsonData = {
            data: oldData,
            ms,
          }
        }
      } catch (e) {
        console.log('e====>', e)
        jsonData = undefined
        lRemove('allCompanyData')
      }
      if (jsonData) {
        lSet('allCompanyData', jsonData, 60 * 30)
        return jsonData.data
      } else {
        lRemove('allCompanyData')
        return []
      }
    }
  }

}