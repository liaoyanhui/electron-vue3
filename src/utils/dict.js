/*
 * @Description: 
 * @Author: pgm
 * @Date: 2024-01-30 16:51:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-02-06 14:28:24
 * @FilePath: /cbank-client/src/utils/dict.js
 */
import useDictStore from '@/store/dict'
import { getDicts } from '@/api/system/dict/data'

/**
 * 获取字典数据
 */
export function useDict(...args) {
  const res = ref({});
  return (() => {
    args.forEach((dictType, index) => {
      res.value[dictType] = [];
      const dicts = useDictStore().getDict(dictType);
      if (dicts) {
        res.value[dictType] = dicts;
      } else {
        getDicts(dictType).then(resp => {
          res.value[dictType] = resp.data.map(p => ({ label: p.dictLabel, value: p.dictValue, elTagType: p.listClass, elTagClass: p.cssClass }))
        })
      }
    })
    return toRefs(res.value);
  })()
}