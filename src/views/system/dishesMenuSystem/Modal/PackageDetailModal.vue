<!--
 * @Description: 套餐详情
 * @Author: 尚夏
 * @Date: 2024-01-25 21:00:55
 * @LastEditTime: 2024-01-27 15:45:16
 * @FilePath: /cbank-client/src/views/system/dishesMenuSystem/Modal/PackageDetailModal.vue
-->
<template>
  <el-dialog :model-value="visible" width="1000px" 
    destroy-on-close :before-close="handleBeforeClose" align-center>
    <el-table :data="infoList" class="ml10" ref="tableRef">
      <el-table-column label="序号" align="center" key="id" prop="id" />
      <el-table-column label="品名" align="center" key="name" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="分类" align="center" key="dishTypeName" prop="dishTypeName" :show-overflow-tooltip="true" />
      <el-table-column label="售价" align="center" key="mealPrice" prop="mealPrice" :formatter="(a,b,c,d) => c/100 " :show-overflow-tooltip="true" />
      <el-table-column label="数量" align="center" key="count" prop="count" :show-overflow-tooltip="true" />
      <el-table-column label="单位" align="center" key="dishUnitName" prop="dishUnitName" :show-overflow-tooltip="true" />
      <el-table-column label="默认出品部门" align="center" key="departmentName" prop="departmentName" :show-overflow-tooltip="true" />
      <el-table-column label="是否入低消" align="center" key="inputLowConsumption" prop="inputLowConsumption" :formatter="(a,b,c,d) => c == 1 ? '是' : '否' " :show-overflow-tooltip="true" />
      <el-table-column label="是否可赠送" align="center" key="canGivenAsGift" prop="canGivenAsGift" :formatter="(a,b,c,d) => c == 1 ? '是' : '否' " :show-overflow-tooltip="true" />
      <el-table-column label="是否计入点单业绩" align="center" key="orderPerformance" prop="orderPerformance" :formatter="(a,b,c,d) => c == 1 ? '是' : '否' " :show-overflow-tooltip="true" />
      <el-table-column label="是否计入订房业绩" align="center" key="bookingPerformance" prop="bookingPerformance" :formatter="(a,b,c,d) => c == 1 ? '是' : '否' " :show-overflow-tooltip="true" />
      <el-table-column label="是否为赔偿品" align="center" key="compensationProducts" prop="compensationProducts" :formatter="(a,b,c,d) => c == 1 ? '是' : '否' " :show-overflow-tooltip="true" />
    </el-table>
    <div class="fw-600 m-6" style="textAlign: right">
      商品原价: {{ totalCount }}元
    </div>
  </el-dialog>
</template>

<script setup>
  import { packageConfigSelectInfo } from '@/api/system/produce-system';
  const props = defineProps({
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
    dataSource: {
      type: Number,
      default: null,
    }
  })
  const emit = defineEmits(['success']);
  const infoList = ref([]);
  const totalCount = ref(0);
  const { visible, dataSource } = toRefs(props);

  watch(
    () => dataSource.value,
    val => {
      if(val) {
        packageConfigSelectInfo({id:val}).then(res => {
          if (res) {
            infoList.value = res;
            let count = 0;
            res.forEach(item => {
              let price = item.mealPrice / 100;
              count += price * item.count;
            });
            totalCount.value = count || 0;
          }
        })
      }
    },
    { deep: true, immediate: true }
  )
  

  function handleBeforeClose() {
    emit('success')
  }
</script>
