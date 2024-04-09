import request from '@/utils/request'

// 菜品分类树
export const getDishTypeSelect = (params) =>  request({url: '/order/oderTypeMenus',data:params})

// 菜品分类菜品列表-查询
export const getDishInfoSelect = (params) =>request({url: 'order/getDishInfoSelect', data:params})

// 菜品分类菜品单个详情-查询
export const getDishInfoSelectOne = (params) =>  request({url: '/dishes/dishInfoSelectOne',data:params})

//下单接口
export const createOrder = (params) => request({ url: "/order/produce", data: params })

//获取赠送用户
export const getGiftUsers = (params) => request({ url: "/gift/getGiftUsers", data: params })