<template>
  <el-table :data="list"  @selection-change="handleSelectionChange" class="border-l border-r" height='100%'>
    <el-table-column type="selection" width="40" align="center" />
    <el-table-column label="菜品名称" align="center"    min-width="110" >
      <template #default="scope">
        <div class="d-flex al-center product-item jc-center" >
                <div class="d-flex flex-column w100">
                  <div class="d-flex p-r w100">
                    <el-popover placement="bottom" :width="240" trigger="hover" v-if="scope.row.existActivity">
                        <template #reference>
                          <el-tag    size="small" class="p-a"  round effect="dark"  :type="scope.row.existActivity == 2?'success':'warning'">买送</el-tag>
                        </template>
                        <div>{{`买${scope.row.dishActivityResp.buyDishInfoCount}${scope.row.dishActivityResp.buyDishInfoUnit}`}}<span class="color-warning">{{`${scope.row.dishActivityResp.buyDishInfoName}`}}</span>送{{`${scope.row.dishActivityResp.giftDishInfoCount}${scope.row.dishActivityResp.giftDishInfoUnit}`}}<span class="color-green">{{`${scope.row.dishActivityResp.giftDishInfoName}` }}</span></div>
                      </el-popover>
                      <div class="w100">{{ scope.row.name }}</div>
                  </div>
                
                  <div class="ml-30 fs-12 color-fff65 text-left" v-if="scope.row.childDishes?.length>0">
                    <div v-for="item in scope.row.childDishes" :key="item.id"><span class="pr-6">{{ item.name }}</span><span v-if="item.count">x{{ item.count }}</span></div>
                  </div>
                  <!-- <div class="mt-2">￥{{ (scope.row.mealPrice/100).toFixed(2) }}</div> -->
                </div>
              </div>
      </template>

    </el-table-column>
    <el-table-column label="口味" align="center" key="tasteName" prop="tasteName"  min-width="80">
      <template #default="scope">
        <el-select
          v-model="scope.row.dishTasteId"
          placeholder="请选择默认口味"
          style="width: 80px"
          class="custom-select"
         
        >
          <el-option
            v-for="item in dishTasteList"
            :key="item.value"
            :label="item.tasteName"
            :value="item.id"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="数量" align="center" key="dishInfoCount" prop="dishInfoCount"   min-width="90"  >
      <template #default="scope">
        <el-input-number :disabled="scope.row.type == 4"  style="width: 78px" v-model="scope.row.dishInfoCount" size="small" :min="1" :precision="0" :step="1" :max="99"/>
      </template>
    </el-table-column>
    <el-table-column label="单位" align="center" key="unitName" prop="unitName"  min-width="50" />
    <el-table-column label="总价" align="center" key="mealPrice" prop="mealPrice" min-width="80"   >
      <template #default="scope">
       <div class="d-flex flex-column al-center">
        <div class="fw-500 nowrap">￥ {{fenToYuan(scope.row.mealPrice * scope.row.dishInfoCount) }}</div>
       </div>
       
      </template>
    </el-table-column>
    <!-- <el-table-column label="备注" align="center" key="remarks" prop="remarks"  min-width="80"  >
      <template #default="scope">
      <el-input v-model.trim="scope.row.remarks" size="small" placeholder="请输入备注" clearable   />
      </template>
    </el-table-column> -->
  </el-table>
</template>

<script setup>
import {fenToYuan} from '@/utils'
import {useDishesSystemStore} from '@/store/system'
import { computed } from 'vue';

const props = defineProps({
  cartList: {
    type: Array,
    required: true
  },
  cartSelected: {
    type: Array,
    required: true
  }
})
const emit = defineEmits();
const list = computed({
  get() {
    return props.cartList
  },
  set(val) {
    emit('update:cartList', val)
  }
})
const ids =computed({
  get() {
    return props.cartSelected
  },
  set(val) {
    emit('update:cartSelected', val)
  }
})

const dishTasteList = computed(()=>useDishesSystemStore().dishTasteSelectList)

/** 选择条数  */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  // single.value = selection.length != 1;  
};




</script>

<style scoped lang="scss">
.custom-select:deep(.el-select__wrapper)  {
  background-color: #2ad1b7;
  .el-select__placeholder,.el-select__icon{
    color: #fff
  }
}
</style>