/*
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-01-23 13:41:17
 * @LastEditTime: 2024-03-14 17:18:32
 * @FilePath: /cbank-client/src/api/system/produce-system.js
 */
import request from "@/utils/request";
import {
  ContentTypeEnum,
  ErrorCode
} from '@/utils/httpEnum';
// 获取出品部门数据列表
export const getProductionDepartmentList = (params) => request({ url: "/dishes/productionDepartmentSelect", data: params })

// 更新出品部门是否启用
export const updateProductionDepartmentEnable = (params) => request({ url: "/dishes/productionDepartmentEnable", data: params })

// 删除出品部门
export const delProductionDepartmentDelete = (params) => request({ url: "/dishes/productionDepartmentDelete", data: params })

// 打印机列表
export const getPrintList = (params) => request({ url: "/dishes/printList", data: params })

// 新增或编辑部门
export const updateProductionDepartmentEdit = (params) => request({ url: "/dishes/productionDepartmentEdit", data: params })


/** 菜品  */

// 口味查询
export const getDishTasteSelect = (params) => request({ url: "/dishes/dishTasteSelect", data: params })

// 口味删除
export const delDishTaste = (params) => request({ url: "/dishes/dishTasteDelete", data: params })

// 口味添加
export const editDishTaste = (params) => request({ url: "/dishes/dishTasteEdit", data: params })

// 菜品单位查询
export const getDishUnitSelect = (params) => request({ url: "/dishes/dishUnitSelect", data: params })

// 单位删除
export const delDishUnit = (params) => request({ url: "/dishes/dishUnitDelete", data: params })

// 单位新增/编辑
export const editDishUnit = (params) => request({ url: "/dishes/dishUnitEdit", data: params })

// 菜品分类 查询
export const getDishTypeSelect = (params) => request({ url: "/dishes/dishTypeSelect", data: params })

// 菜品分类 新增/编辑
export const updateDishType = (params) => request({ url: "/dishes/dishTypeEdit", data: params })

// 商分类品删除
export const delDishType = (params) => request({ url: "/dishes/dishTypeDelete", data: params })

// 商品信息列表
export const getDishInfo = (params) => request({ url: "/dishes/dishInfoSelect", data: params })

// 新增/编辑菜品
export const updateDishInfo = (params) => request({ url: "/dishes/dishInfoEdit", data: params })

// 批量启用/停用
export const enableDishInfo = (params) => request({ url: "/dishes/dishInfoEnable", data: params })

// 批量绑定出品部门
export const batchBindingDepartment = (params) => request({ url: "/dishes/batchBindingDepartment", data: params })

// 删除商品
export const delDishInfo = (params) => request({ url: "/dishes/dishInfoDelete", data: params })

// 开台套餐查询
export const getOpenPlatformPackage = (params) => request({ url: "/dishes/openPlatformPackageSelect", data: params })

// 获取房型类型列表
export const companyRoomTypeList = (params) => request({ url: "/companyRoomTypeList", data: params })

// 新增/修改开台套餐
export const openPlatformPackageEdit = (params) => request({ url: "/dishes/openPlatformPackageEdit", data: params })

// 开台套餐删除
export const openPlatformPackageDelete = (params) => request({ url: "/dishes/openPlatformPackageDelete", data: params })

// 套餐明细
export const packageConfigSelectInfo = (params) => request({ url: "/dishes/packageConfigSelectInfo", data: params })

// 套餐是否启用
export const openPlatformPackageEnable = (params) => request({ url: "/dishes/openPlatformPackageEnable", data: params })

// 模板导出
export const exportTemplate = (params) => request({ url: "/dishes/exportTemplate", data: params, responseType: 'blob' })

// 批量导入
export const exportInformation = (params) => request({
  url: "/dishes/exportInformation", data: params, headers: {
    'content-type': ContentTypeEnum.FORM_DATA
  }
})

// 批量导出
export const checkOrAllExport = (params) => request({ url: "/dishes/checkOrAllExport", data: params, responseType: 'blob' })

// 无限畅饮列表
export const getUnlimitedDrinkingActivity = (params) => request({ url: "/dishes/unlimitedDrinkingActivitySelect", data: params })

// 新增/编辑畅饮活动
export const unlimitedDrinkingActivity = (params) => request({ url: "/dishes/unlimitedDrinkingActivity", data: params })

// 删除 畅饮活动
export const unlimitedDrinkingActivityDelete = (params) => request({ url: "/dishes/unlimitedDrinkingActivityDelete", data: params })

// 无限畅饮 是否启用
export const unlimitedDrinkingActivityEnable = (params) => request({ url: "/dishes/unlimitedDrinkingActivityEnable", data: params })

// 买几送几活动列表
export const getSendActivity = (params) => request({ url: "/dishes/getSendActivity", data: params })

// 买几送几活动 是否启用 
export const sendActivityEnable = (params) => request({ url: "/dishes/sendActivityEnable", data: params })

// 买几送几 新增/编辑
export const sendActivityEdit = (params) => request({ url: "/dishes/sendActivityEdit", data: params })

// 买几送几 删除
export const sendActivityDelete = (params) => request({ url: "/dishes/sendActivityDelete", data: params })

// 查询所有已启用出品部门
export const productionDepartmentSelectAll = (params) => request({ url: "/dishes/productionDepartmentSelectAll", data: params })

// 根据用户查询出品部门
export const productionDepartmentByUser = (params) => request({ url: "/dishes/productionDepartmentByUser", data: params })

// 出品部门查询
export const productionDepartmentGet = (params) => request({ url: "/dishes/productionDepartmentGet", data: params })

