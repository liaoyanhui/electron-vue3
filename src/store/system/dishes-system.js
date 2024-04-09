import { getDishTasteSelect,getOpenPlatformPackage, editDishTaste, 
  delDishTaste, getDishUnitSelect, delDishUnit, editDishUnit, getDishTypeSelect, delDishType, getDishInfo
} from '@/api/system/produce-system';
import {openPlatformPackageRoom,openRoomPackage} from '@/api/common/common'
import {getDishInfoSelect} from '@/api/dishes'
const useDishesSystemStore = defineStore(
  'dishesSystemSote', {
  state: () => ({
      dishTasteSelectList: [], //菜品口味列表
      openPlatformPackageList: [], //开台套餐列表
      dishInfoSelect: [],
      openPlatformPackageRoomList: [],// 开台套餐设置列表
      openRoomPackageList: [] //开台套餐-包厢设置时根据包厢类型选择搜索列表
  }),
    actions: {
      //获取菜品口味列表
      getDishTastes() { 
        return new Promise(resolve => {
          getDishTasteSelect().then(res => {
            this.dishTasteSelectList = res
            resolve(res)
          })
        })
      },
       // 开台套餐
      getOpenPlatformPackage(data) {
        getOpenPlatformPackage(data).then(res => {
          if (res) {
            this.openPlatformPackageList = res;
          }
        })
      },
      
      getDishInfoSelect(data) {
        return new Promise(resolve => {
          getDishInfoSelect(data).then(res=>{ 
            this.dishInfoSelectList = res
            resolve(res)
          })
        })
      },
      getOpenPlatformPackageRoom(data) {
        return new Promise(resolve => {
          openPlatformPackageRoom(data).then(res=>{ 
            this.openPlatformPackageRoomList = res
            resolve(res)
          })
        })
      },
      getOpenRoomPackageList(data) {
        return new Promise(resolve => {
          openRoomPackage(data).then(res=>{ 
            this.openRoomPackageList = res
            resolve(res)
          })
        })
      }
  }
})

export default useDishesSystemStore