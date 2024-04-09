/*
 * @Description: 本地保存一份路由菜单方面日后查找
 * @Author: pgm
 * @Date: 2024-02-24 23:49:09
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-11 22:22:40
 * @FilePath: /cbank-client/src/router/modules/localRouter.js
 */

export const routerObj = [
  // {
  //   path: "/cbank",
  //   name: "cbank",
  //   hidden: false,
  //   redirect: "/cbank/index",
  //   meta: {
  //     title: "收银系统",
  //     permiss: "1",
  //   },
  //   component: "Layout",
  //   children: [
  //     {
  //       path: "index",
  //       component: "cbank/index",
  //       name: "cbank-index",
  //       meta: { title: "收银台" },
  //       hidden: true,
  //     },
  //   ]
  // },
  // {
  //   name: "system",
  //   path: "/system",
  //   hidden: false,
  //   component: "Layout",
  //   redirect: '/system/room-system/room-control',
  //   alwaysShow: true,
  //   meta: { title: "系统设置", sidebarShow: true },
  //   sideBar: true,
  //   children: [
  //     {
  //       name: "RoomSystem",
  //       path: "room-system",
  //       hidden: false,
  //       meta: { title: "房态设置" },
  //       children: [
  //         {
  //           path: "room-control",
  //           component: "system/roomSystem/roomControl",
  //           name: "roomContronl",
  //           meta: { title: "房台信息" }
  //         },
  //         {
  //           path: "room-diy",
  //           component: "system/roomSystem/roomDiy",
  //           name: "roomDiy",
  //           meta: { title: "房台个性化" }
  //         }
  //       ]
  //     },
  //     {
  //       name: "DishesMenuSystem",
  //       path: "dishes-menu-system",
  //       hidden: false,
  //       redirect: '/system/dishes-menu-system/dishes-menu-info-set',
  //       alwaysShow: true,
  //       meta: { title: "菜品设置" },
  //       children: [
  //         {
  //           path: "dishes-menu-info-set",
  //           component: "system/dishesMenuSystem/dishesMenuInfoSet.vue",
  //           name: "dishesMenuInfoSet",
  //           meta: { title: "菜品信息设置" }
  //         },
  //         {
  //           path: "package-config-set",
  //           component: "system/dishesMenuSystem/packageConfigSet.vue",
  //           name: "packageConfigSet",
  //           meta: { title: "套餐配置方案" }
  //         },
  //         {
  //           path: "unlimited-drinking",
  //           component: "system/dishesMenuSystem/unlimitedDrinking.vue",
  //           name: "unlimitedDrinking",
  //           meta: { title: "无限畅饮活动" }
  //         },
  //         {
  //           path: "buy-get-free",
  //           component: "system/dishesMenuSystem/buyGetFree.vue",
  //           name: "buyGetFree",
  //           meta: { title: "买几送几设置" }
  //         },
  //       ]
  //     },
  //     {
  //       name: "ProduceSystem",
  //       path: "produce-system",
  //       hidden: false,
  //       redirect: 'produce-set',
  //       meta: { title: "出品设置" },
  //       children: [
  //         {
  //           path: "produce-set",
  //           component: "system/produceSystem/produceSet.vue",
  //           name: "produceSystem",
  //           meta: { title: "出品设置" }
  //         },
  //         // {
  //         //   path: "produce-set-region",
  //         //   component: "system/produceSystem/produceSetRegion.vue",
  //         //   name: "produceSystemRegion",
  //         //   meta: { title: "区域出品设置" }
  //         // },
  //       ]
  //     },
  //     {
  //       name: "CashierSettings",
  //       path: "cashier-settings",
  //       hidden: false,
  //       redirect: 'payment-method-settings',
  //       meta: { title: "收银设置" },
  //       children: [
  //         {
  //           path: "payment-method-settings",
  //           component: "system/cashierSettings/paymentMethodSettings.vue",
  //           name: "paymentMethodSettings",
  //           meta: { title: "付款方式设置" }
  //         },
  //         {
  //           path: "cashier-parameter-settings",
  //           component: "system/cashierSettings/cashierParameterSettings.vue",
  //           name: "cashierParameterSettings",
  //           meta: { title: "收银参数设置" }
  //         },
  //       ]
  //     },
  //     {
  //       name: "OtherSystem",
  //       path: "other-system",
  //       hidden: false,
  //       redirect: '/system/other-system/printer-system',
  //       alwaysShow: true,
  //       meta: { title: "其他设置", showSidebar: true },
  //       children: [
  //         {
  //           path: "printer-system",
  //           component: "system/otherSystem/printerSystem.vue",
  //           name: "printerSystem",
  //           meta: { title: "打印机设置" }
  //         },
  //       ]
  //     }
  //   ]
  // },

  // {
  //   name: 'MemberManagement',
  //   path: '/member-management',
  //   hidden: false,
  //   component: "Layout",
  //   redirect: '/member-management/member-info/customer-information',
  //   alwaysShow: true,
  //   meta: { title: "会员管理", sidebarShow: true },
  //   sideBar: true,
  //   children: [
  //     {
  //       name: "MemberInfo",
  //       path: "member-info",
  //       hidden: false,
  //       meta: { title: "会员信息" },
  //       children: [
  //         {
  //           path: "customer-information",
  //           component: "memberManagement/memberInfo/customerInformation/index.vue",
  //           name: "CustomerInformation",
  //           meta: { title: "客户信息" }
  //         },
  //         {
  //           path: "member-information",
  //           component: "memberManagement/memberInfo/memberInformation/index.vue",
  //           name: "MemberInformation",
  //           meta: { title: "会员信息" }
  //         },
  //         {
  //           path: "member-card-information",
  //           component: "memberManagement/memberInfo/memberCardInformation/index.vue",
  //           name: "MemberCardInformation",
  //           meta: { title: "会员卡信息" }
  //         },
  //         {
  //           path: "member-recharge-records",
  //           component: "memberManagement/memberInfo/memberRechargeRecords/index.vue",
  //           name: "MemberRechargeRecords",
  //           meta: { title: "会员充值记录" }
  //         },
  //         {
  //           path: "member-consumption-records",
  //           component: "memberManagement/memberInfo/memberConsumptionRecords/index.vue",
  //           name: "MemberConsumptionRecords",
  //           meta: { title: "会员消费记录" }
  //         }
  //       ]
  //     },
  //     {
  //       name: "MemberBasic",
  //       path: "member-basic",
  //       hidden: false,
  //       meta: { title: "会员基础设置" },
  //       children: [
  //         {
  //           path: "member-card-type",
  //           component: "memberManagement/memberBasic/memberCardType/index.vue",
  //           name: "MemberCardType",
  //           meta: { title: "会员卡类型" }
  //         },
  //         {
  //           path: "member-basic-settings",
  //           component: "memberManagement/memberBasic/memberBasicSettings/index.vue",
  //           name: "MemberBasicSettings",
  //           meta: { title: "会员基础设置" }
  //         }
  //       ]
  //     },
  //     {
  //       "name": "GiftScheme",
  //       "path": "gift-scheme",
  //       "hidden": false,
  //       "component": "system/giftScheme/index",
  //       "meta": {
  //         "title": "赠送方案配置",
  //         "icon": "tree-table",
  //         "noCache": false,
  //         "link": null
  //       }
  //     },
  //     {
  //       "name": "GiftPermission",
  //       "path": "gift-permission",
  //       "hidden": false,
  //       "component": "system/giftPermission/index",
  //       "meta": {
  //         "title": "赠送权限配置",
  //         "icon": "tree-table",
  //         "noCache": false,
  //         "link": null
  //       }
  //     },
  //   ]
  // },
  // {
  //   path: "/production-live",
  //   name: "ProductionLive",
  //   hidden: false,
  //   redirect: "/production-live/index",
  //   meta: {
  //     title: "出品实况"
  //   },
  //   component: "Layout",
  //   children: [
  //     {
  //       path: "index",
  //       component: "productionLive/index",
  //       name: "Production-Live",
  //       meta: { title: "出品实况" },
  //       hidden: true
  //     }
  //   ]
  // },
  // {
  //   path: "/production-summary",
  //   name: "ProductionSummary",
  //   hidden: false,
  //   redirect: "/production-summary/index",
  //   meta: {
  //     title: "出品汇总"
  //   },
  //   component: "Layout",
  //   children: [
  //     {
  //       path: "index",
  //       component: "productionSummary/index",
  //       name: "Production-Summary",
  //       meta: { title: "出品汇总" },
  //       hidden: true
  //     }
  //   ]
  // },
  // {
  //   "name": "oldSystem",
  //   "path": "/personnel",
  //   "hidden": false,
  //   "redirect": "/personnel/user",
  //   "component": "Layout",
  //   "alwaysShow": true,
  //   "meta": {
  //     "title": "人事管理",
  //     "icon": "system",
  //     "noCache": false,
  //     "link": null,
  //     sidebarShow: true
  //   },
  //   "children": [{
  //     "name": "User",
  //     "path": "user",
  //     "hidden": false,
  //     "component": "system/user/index",
  //     "meta": {
  //       "title": "用户管理",
  //       "icon": "user",
  //       "noCache": false,
  //       "link": null
  //     }
  //   },
  //   {
  //     "name": "Role",
  //     "path": "role",
  //     "hidden": false,
  //     "component": "system/role/index",
  //     "meta": {
  //       "title": "角色管理",
  //       "icon": "peoples",
  //       "noCache": false,
  //       "link": null
  //     }
  //   },
  //   {
  //     "name": "Menu",
  //     "path": "menu",
  //     "hidden": false,
  //     "component": "system/menu/index",
  //     "meta": {
  //       "title": "菜单管理",
  //       "icon": "tree-table",
  //       "noCache": false,
  //       "link": null
  //     }
  //   },
  //   ]
  // },

  // {
  //   name: 'PendingCollection',
  //   path: '/pending-collection',
  //   hidden: false,
  //   component: "Layout",
  //   redirect: '/pending-collection/index',
  //   alwaysShow: true,
  //   meta: { title: "挂账回收" },
  //   sideBar: true,
  //   children: [
  //     {
  //       path: "index",
  //       component: "pendingCollection/index.vue",
  //       name: "PendingCollection",
  //       meta: { title: "挂账回收" },
  //       hidden: true
  //     }
  //   ]
  // },
  // {
  //   name: 'ReportForms',
  //   path: '/report-forms',
  //   hidden: false,
  //   component: "Layout",
  //   redirect: '/report-forms/comprehensive-statistics/opening-details',
  //   alwaysShow: true,
  //   meta: { title: "报表", sidebarShow: true },
  //   sideBar: true,
  //   children: [
  //     {
  //       name: "ComprehensiveStatistics",
  //       path: "comprehensive-statistics",
  //       hidden: false,
  //       meta: { title: "综合统计" },
  //       children: [
  //         {
  //           path: "opening-details",
  //           component: "reportForms/comprehensiveStatistics/OpeningDetails.vue",
  //           name: "OpeningDetails",
  //           meta: { title: "开台明细" }
  //         },
  //         {
  //           path: "booking-inquiry",
  //           component: "reportForms/comprehensiveStatistics/BookingInquiry.vue",
  //           name: "BookingInquiry",
  //           meta: { title: "订房查询" }
  //         },
  //         {
  //           path: "return-room-inquiry",
  //           component: "reportForms/comprehensiveStatistics/ReturnRoomInquiry.vue",
  //           name: "ReturnRoomInquiry",
  //           meta: { title: "返房查询" }
  //         },
  //         {
  //           path: "rotating-room-inquiry",
  //           component: "reportForms/comprehensiveStatistics/RotatingRoomInquiry.vue",
  //           name: "RotatingRoomInquiry",
  //           meta: { title: "轮房查询" }
  //         },
  //         {
  //           path: "order-details",
  //           component: "reportForms/comprehensiveStatistics/OrderDetails.vue",
  //           name: "OrderDetails",
  //           meta: { title: "落单明细" }
  //         },

  //         {
  //           path: "chargeback-details",
  //           component: "reportForms/comprehensiveStatistics/ChargebackDetails.vue",
  //           name: "ChargebackDetails",
  //           meta: { title: "退单明细" }
  //         },
  //         {
  //           path: "cashier-details",
  //           component: "reportForms/comprehensiveStatistics/CashierDetails.vue",
  //           name: "CashierDetails",
  //           meta: { title: "房台收银明细" }
  //         },
  //         {
  //           path: "pending-accounts-details",
  //           component: "reportForms/comprehensiveStatistics/PendingAccountsDetails.vue",
  //           name: "PendingAccountsDetails",
  //           meta: { title: "挂账明细" }
  //         },
  //         {
  //           path: "pending-account-recovery-details",
  //           component: "reportForms/comprehensiveStatistics/PendingAccountRecoveryDetails.vue",
  //           name: "PendingAccountRecoveryDetails",
  //           meta: { title: "挂账回收明细" }
  //         },
  //         {
  //           path: "on-stage-details",
  //           component: "reportForms/comprehensiveStatistics/OnStageDetails.vue",
  //           name: "OnStageDetails",
  //           meta: { title: "上台明细" }
  //         },
  //       ]
  //     },
  //     {
  //       name: "StatisticalSummary",
  //       path: "statistical-summary",
  //       hidden: false,
  //       meta: { title: "统计汇总" },
  //       children: [
  //         {
  //           path: "gift-summary",
  //           component: "reportForms/statisticalSummary/GiftSummary.vue",
  //           name: "GiftSummary",
  //           meta: { title: "赠送汇总" }
  //         },
  //         {
  //           path: "duty-summary",
  //           component: "reportForms/statisticalSummary/DutySummary.vue",
  //           name: "DutySummary",
  //           meta: { title: "值班汇总" }
  //         },
  //         {
  //           path: "pending-accounts-summary",
  //           component: "reportForms/statisticalSummary/PendingAccountsSummary.vue",
  //           name: "PendingAccountsSummary",
  //           meta: { title: "挂账汇总" }
  //         },
  //         {
  //           path: "on-stage-summary",
  //           component: "reportForms/statisticalSummary/OnStageSummary.vue",
  //           name: "OnStageSummary",
  //           meta: { title: "上台汇总" }
  //         },
  //         {
  //           path: "cashier-summary",
  //           component: "reportForms/statisticalSummary/CashierSummary.vue",
  //           name: "CashierSummary",
  //           meta: { title: "收银汇总" }
  //         },
  //       ]
  //     },
  //   ]
  // },
  // {
  //   name: 'BookingPerformance',
  //   path: '/booking-performance',
  //   hidden: false,
  //   component: "Layout",
  //   redirect: '/booking-performance/performance-set',
  //   alwaysShow: true,
  //   meta: { title: "订房业绩", sidebarShow: true },
  //   sideBar: true,
  //   children: [
  //     {
  //       path: "performance-set",
  //       component: "bookingPerformance/PerformanceSet.vue",
  //       name: "PerformanceSet",
  //       meta: { title: "业绩设置" }
  //     },
  //     {
  //       path: "group-booking-performance",
  //       component: "bookingPerformance/GroupBookingPerformance.vue",
  //       name: "GroupBookingPerformance",
  //       meta: { title: "分组订房业绩" }
  //     },
  //     {
  //       path: "personal-booking-performance",
  //       component: "bookingPerformance/PersonalBookingPerformance.vue",
  //       name: "PersonalBookingPerformance",
  //       meta: { title: "个人订房业绩" }
  //     },
  //     {
  //       path: "performance-inquiry",
  //       component: "bookingPerformance/PerformanceInquiry.vue",
  //       name: "PerformanceInquiry",
  //       meta: { title: "每月业绩查询" }
  //     },
  //     {
  //       path: "performance-analysis",
  //       component: "bookingPerformance/PerformanceAnalysis.vue",
  //       name: "PerformanceAnalysis",
  //       meta: { title: "业绩分析" }
  //     },
  //   ]
  // },
]