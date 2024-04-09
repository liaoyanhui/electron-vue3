<template>
  <div class="tip color-fff fs-18">点击状态卡片可更改状态颜色</div>
  <el-row class="mt-30">
    <el-col :span="12">
      <el-row >
        <el-col :span="10" :push="1" v-for="(item,index) in roomDiyConfig" :key="index" >
          <div class="d-flex al-center mt-20">
            <div class="color-name color-fff fs-18 mr-4">{{ item.typeName }}</div>
            <div class="color-view" :style="`background-color: ${item.colour}`" @click="edit(item)"></div>
          </div>
        </el-col>
      </el-row>
    </el-col>
    
  </el-row>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog title="选择颜色" v-model="open" width="520px" append-to-body>
      <!-- <el-row class="mb-20 ">
        <el-col :span="5">选中的颜色</el-col>
        <el-col :span="6"><div class="color-box-select "  :style="`background-color: ${form.colour}`"></div></el-col>
      </el-row> -->
      <el-row >
        <el-col :span="6"  v-for="(item,index) in colorList" :key="index" @click="form.colour = item" class="mb-20">
          <div class="color-box" :class="{isActive:item ===form.colour}">
            <div class="color-box-select"  :style="`background-color: ${item}`"></div>
          </div>
          
        </el-col>
      </el-row>
      <template #footer>
        <div class="dialog-footer ">
          <el-button type="primary" @click="updateDiyConfig">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
</template>

<script setup>
import  {useRoomSystemStore} from '@/store/system'
import { updateRoomStatusIndividuations } from '@/api/system/room-system'
import { computed } from 'vue'
const { proxy } = getCurrentInstance();
const roomSystemStore = useRoomSystemStore()
const open = ref(false)
const roomDiyConfig = computed(()=> roomSystemStore.roomSystemStatusColorList)
const colorList =ref(["#FFFFFF","#41EED3","#9EB2FC","#DE5153","#BFBFBF","#CDEA6F","#9ADEFF","#EB834C","#F7F705","#5DEA20","#00A3F5","#CE6BE8","#FFC001","#00B050","#4C80EB","#8B63F0","#C6AC48","#18BF8E","#2688FC","#EE4699"])
const form = ref({
  id: null,
  colour: null,
  
})
function getDiyConfigList() {
  roomSystemStore.ajaxRoomSystemStatusColorList()
}
function updateDiyConfig() {
  updateRoomStatusIndividuations(form.value).then(res => {
    proxy.$modal.msgSuccess("修改成功");
    open.value = false;
    getDiyConfigList()
  })
 }
function edit(row) {
  form.value.id = row.id
  form.value.colour = row.colour
  open.value = true
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    colour: undefined,
  };
}

getDiyConfigList()

</script>

<style lang="scss" scoped>
.color-name{
  width: 80px;
}
.color-view{
  width: 120px;
  height: 40px;
  border-radius: 4px;
}
.color-box-select{
  width: 100px;
  height: 40px;
  border-radius: 4px;
  box-shadow:  2px 0 3px rgba(0,21,41,.1);
  
}
.color-box{
  width: 112px;
  height: 52px;
  padding: 5px;
  border-radius: 4px;
}
.color-box.isActive{
  border: 1px solid #2ad1b7;
}

</style>