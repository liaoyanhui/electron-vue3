/*
 * @Description: 
 * @Author: pgm
 * @Date: 2024-01-22 02:11:43
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-19 16:32:03
 * @FilePath: /cbank-client/src/directive/permission/hasPermi.js
 */
 /**
 * v-hasPermi 操作权限处理
 *
 */
 
import useUserStore from '@/store/user'

export default {
  mounted(el, binding, vnode) {
    const { value } = binding
    const all_permission = "*:*:*";
    const permissions = useUserStore().permissions || []

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value

      const hasPermissions = permissions.some(permission => {
        return all_permission === permission || permissionFlag.includes(permission)
      })
      console.log('hasPermissions',hasPermissions)
      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  }
}
