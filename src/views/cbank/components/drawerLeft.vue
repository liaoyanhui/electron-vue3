<!--
 * @Description: 右滑模块-左侧导航
 * @Author: pgm
 * @Date: 2024-01-26 03:30:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-02-28 20:05:35
 * @FilePath: /cbank-client/src/views/cbank/components/drawerLeft.vue
-->
<template>
   <div class="d-flex flex-column al-center left-content clearfix">
    <template v-for="item in modelMenuList" :key="item.icon" >
      <div class="text-center item" v-hasPermi="item.permissions"  @click="changemodel(item)" v-if="item.status.includes(roomInfo.useStatus)" >
        <img :src="getImageUrl(item)" alt="">
        <div class="title color-fff65" :class="{ 'active':modelType == item.components}">{{ item.name }}</div>
      </div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  modelType: {
    type: String,
    required: true
  },
  roomInfo: {
    type: Object,
    required: true
  }
})
const emit = defineEmits()
const modelMenuList=ref([{
    name: "预定信息",
    components: 'reservation',
    icon: 'yuding',
    permissions:['cbank:control:yuyue'],
    status:[0,1,2,3,4,5,7]
  },
  {
    name: "收银点单",
    components: 'dishes',
    icon: 'diandan',
    permissions:['cbank:control:shouyindiandan'],
    status:[3,5,7]
  },
  
  {
    name: "结账",
    components: 'settleAccounts',
    icon: 'jiezhang',
    footer: false,
    permissions:['cbank:control:jiezhang'],
    status:[3,5,7]
  }])

const getImageUrl = (item) => {
  let name = props.modelType === item.components ? item.icon + '-active' : item.icon
  return new URL(`../../../assets/img/cbank/${name}.png`,import.meta.url).href
}

const changemodel = (item) => {
  let {components,name,footer=true} = item
  emit('update:model', {
    type: components,
    show: true,
    title: name,
    footer
  })
}
</script>

<style lang="scss" scoped>

:deep(.el-drawer__header){
  padding-left: 100px;
}
.left-content {
  
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 90px;
  color: #545F6A;
  box-shadow: 2px 0px 6px 0px rgba(0,0,0,0.27);
  padding-top: 46px;
  z-index: 2001;

  img{
    width: 26px;
    height: 26px;
    margin-bottom:6px;
  }
  .item{
    margin-bottom: 60px;
  }
  .active{
    color:#2AD1B7;
  }

}
</style>