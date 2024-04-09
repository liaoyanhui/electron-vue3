/*
 * @Description: 
 * @Author: pgm
 * @Date: 2024-01-19 21:37:14
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-21 23:53:46
 * @FilePath: /cbank-client/src/store/settings.js
 */
import defaultSettings from '@/settings'
// import { useDynamicTitle } from '@/utils/dynamicTitle'
import { lSet,lGet } from '@/utils/storage'
import { defineStore } from 'pinia'
const { sideTheme, showSettings, topNav, tagsView, fixedHeader, sidebarLogo, dynamicTitle } = defaultSettings

const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''

const useSettingsStore = defineStore(
  'settings',
  {
    state: () => ({
      title: '',
      theme: storageSetting.theme || '#2ad1b7',
      sideTheme: storageSetting.sideTheme || sideTheme,
      showSettings: showSettings,
      topNav: storageSetting.topNav === undefined ? topNav : storageSetting.topNav,
      tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView,
      fixedHeader: storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader,
      sidebarLogo: storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo,
      dynamicTitle: storageSetting.dynamicTitle === undefined ? dynamicTitle : storageSetting.dynamicTitle,
      roomModeType: lGet('roomModeType') || 'large',
      roomSize: lGet('roomSize') ||200
    }),
    actions: {
      // 修改布局设置
      changeSetting(data) {
        const { key, value } = data
        if (this.hasOwnProperty(key)) {
          this[key] = value
        }
      },
      // 设置网页标题
      setTitle(title) {
        this.title = title
        // useDynamicTitle();
      },
      changeRoomSize(size) {
        if (size >= 199) {
          this.roomModeType = 'large'
        } else if( size<199 &&size>=160) {
          this.roomModeType = 'normal'
        } else if (size < 160) {
          this.roomModeType = 'small'
        }
        this.roomSize = size
        lSet('roomSize',size)
        lSet('roomModeType',this.roomModeType)
      }
    }
  })

export default useSettingsStore
