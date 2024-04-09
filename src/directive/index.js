/*
 * @Description: 
 * @Author: pgm
 * @Date: 2024-01-22 02:11:43
 * @LastEditors: 
 * @LastEditTime: 2024-03-02 20:14:17
 * @FilePath: /cbank-client/src/directive/index.js
 */
import hasRole from './permission/hasRole'
import hasPermi from './permission/hasPermi'
import copyText from './common/copyText'
import dblclick from './common/dblclick'

export default function directive(app){
  app.directive('hasRole', hasRole)
  app.directive('hasPermi', hasPermi)
  app.directive('copyText', copyText)
  app.directive('dblclick', dblclick)
}