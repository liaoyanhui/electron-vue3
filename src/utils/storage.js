/**
 * 设置sessionStorage
 * @param {string} key      要设置的key
 * @param {object} value    要设置的值
 * @param {int}    vaildSec 过期时间，秒
 */
function sSet (key, value, vaildSec) {
  // sessionStorage和localStorage只能存储字符串，所以在存取的时候需要转换成字符串
  if (value === '') {
    sessionStorage.removeItem(key)
  }

  const data = {
    data: value
  }
  // console.log(data)
  if (vaildSec > 0) {
    data.expire = new Date((new Date().getTime() + vaildSec * 1000))
  }
  sessionStorage.setItem(key, JSON.stringify(data))
}

/**
 * 获取key对应的值，同时做过期判断，过期则丢弃
 * @param  {string} key 要获取的key
 * @return {object}     JSON.parse处理好的数据
 */
function sGet (key) {
  let temp = sessionStorage.getItem(key)
  // console.log('场所信息==========================',temp)
  if (temp === null) {
    // 没有获取到数据
    return false
  }
  temp = JSON.parse(temp)
  if (temp.expire && new Date(temp.expire) < (new Date())) {
    return false // 数据已过期
  }
  if (temp.data === undefined || temp.data === null || temp.data === '' || JSON.stringify(temp.data) === '{}') {
    // 查询的key存在，但是值是空的
    return false
  }
  return temp.data
}

function sRemove (key) {
  sessionStorage.removeItem(key)
}

function sRemoveAll () {
  sessionStorage.clear()
}

/**
 * 设置localStorage
 * @param {string} key      要设置的key
 * @param {object} value    要设置的值
 * @param {int}    vaildSec 过期时间，秒
 */
function lSet (key, value, vaildSec) {
  // localStorage和localStorage只能存储字符串，所以在存取的时候需要转换成字符串
  if (value === '') {
    localStorage.removeItem(key)
  }
  const data = {
    data: value
  }
  if (vaildSec > 0) {
    data.expire = new Date((new Date().getTime() + vaildSec * 1000))
  }
  localStorage.setItem(key, JSON.stringify(data))
}

/**
 * 获取key对应的值，同时做过期判断，过期则丢弃
 * @param  {string} key 要获取的key
 * @return {object}     JSON.parse处理好的数据
 */
function lGet (key) {
  let temp = localStorage.getItem(key)
  if (temp === null) {
    // 没有获取到数据
    return false
  }
  temp = JSON.parse(temp)
  if (temp.expire && new Date(temp.expire) < (new Date())) {
    return false // 数据已过期
  }
  if (temp.data === null || temp.data === '' || JSON.stringify(temp.data) === '{}') {
    // 查询的key存在，但是值是空的
    return false
  }
  return temp.data
}

function lRemove (key) {
  localStorage.removeItem(key)
}

function lRemoveAll () {
  localStorage.clear()
}

export {
  sGet,
  sSet,
  sRemove,
  sRemoveAll,
  lGet,
  lSet,
  lRemove,
  lRemoveAll
}
