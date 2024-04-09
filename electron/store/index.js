const { contextBridge } = require('electron')
const fs = require('fs')
const path = require('path')
const log = require('electron-log')

var storePath = path.resolve('./electron/store/')


var getDict = () => {
  try {
    delete require.cache[require.resolve('./dictStore.json')];
    const data = require('./dictStore.json')
    return data
  } catch (error) {
    return null
  }
}

var updateDict = source => {
  if (!fs.existsSync(storePath)) {
    fs.mkdir(storePath, () => { })
  }
  // 获取本地json 对比 替换 
  try {
    var jsonData;
    const { data, ms } = source;
    const newData = data.map(item => {
      item.diyKey = `${item.id}_${item.companyId}_${item.type}`;
      return item;
    })
    const oData = getDict();

    if (!oData) {
      jsonData = JSON.stringify({
        data: newData,
        ms: ms
      })
    } else {
      const oldData = oData.data.map(item => {
        item.diyKey = `${item.id}_${item.companyId}_${item.type}`;
        return item;
      });
      const oldMS = oData.ms;
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

      jsonData = JSON.stringify({
        data: oldData,
        ms,
      })
    }

    fs.writeFile(storePath + '/dictStore.json', jsonData, err => {
      if (err) throw err
    })
  } catch (error) {
    console.error('保存出错', error)
  }
}


contextBridge.exposeInMainWorld('storeAPI', {
  updateDict: data => updateDict(data),
  getDict: () => getDict()
})
