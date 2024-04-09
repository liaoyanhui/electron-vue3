<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-20 13:51:05
 * @LastEditTime: 2024-03-11 20:33:50
 * @FilePath: /cbank-client/src/views/system/user/Modal/LevelModal.vue
-->
<template>
  <el-dialog title="修改历史" :model-value="visible" width="622px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <el-tabs v-model="active" tab-position="left" style="height: 200px" class="demo-tabs">
      <el-tab-pane label="艺名" :name="1">
        <el-table ref="tableRef" :data="list" >
          <el-table-column label="新艺名" align="center" key="newNick" prop="newNick" :show-overflow-tooltip="true" />
          <el-table-column label="旧艺名" align="center" key="oldNick" prop="oldNick" :show-overflow-tooltip="true" />
          <el-table-column label="操作人" align="center" key="operator" prop="operator" />
          <el-table-column label="修改时间" align="center" key="updateTime" prop="updateTime" :show-overflow-tooltip="true"/>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="等级" :name="2">
        <el-table ref="tableRef" :data="list" >
          <el-table-column label="新等级" align="center" key="newLevelName" prop="newLevelName" :show-overflow-tooltip="true" />
          <el-table-column label="旧等级" align="center" key="oldLevelName" prop="oldLevelName" :show-overflow-tooltip="true" />
          <el-table-column label="操作人" align="center" key="operator" prop="operator" />
          <el-table-column label="修改时间" align="center" key="updateTime" prop="updateTime" :show-overflow-tooltip="true"/>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="收银权限" :name="3">
        <el-table ref="tableRef" :data="roleList" >
          <el-table-column label="新权限" align="center" key="newRoleName" prop="newRoleName" :show-overflow-tooltip="true" />
          <el-table-column label="旧权限" align="center" key="oldRoleName" prop="oldRoleName" :show-overflow-tooltip="true" />
          <el-table-column label="操作人" align="center" key="operator" prop="operator" />
          <el-table-column label="修改时间" align="center" key="updateTime" prop="updateTime" :show-overflow-tooltip="true"/>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup>
  import { userLevelHistory, userRoleHistory } from "@/api/system/user";
  const { proxy } = getCurrentInstance();
  const props = defineProps({
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
    userId: {
      type: Number,
      default: null,
    },
    activeName: {
      type: Number,
      default: 1
    }
  })
  const emit = defineEmits([ 'cancel', 'success']);
  const { visible, userId, activeName } = toRefs(props);

  const list = ref([]);
  const roleList = ref([]);
  const active = ref(1);
  watch(
    () => userId.value,
    ( val ) => {
      if(val) {
        userLevelHistory({id:val}).then(res => {
          if(res) {
            list.value = res;
          }
        })
        userRoleHistory({id: val}).then(res => {
          if(res) {
            roleList.value = res;
          }
        })
      }
    },
    { deep: true, immediate: true }
  )
  watch(
    () => activeName.value,
    ( val ) => {
      if(val) {
        active.value = val;
      }
    },
    { deep: true, immediate: true }
  )

  function handleBeforeClose() {
    emit('cancel');
  }
</script>
