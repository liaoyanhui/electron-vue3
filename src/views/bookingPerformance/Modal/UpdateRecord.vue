<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-03-02 21:17:27
 * @LastEditTime: 2024-03-06 15:44:56
 * @FilePath: /cbank-client/src/views/bookingPerformance/Modal/UpdateRecord.vue
-->
<template>
  <el-dialog title="修改记录" :model-value="visible" width="950px" append-to-body destroy-on-close :before-close="handleBeforeClose" lock-scroll>
    <el-table :data="tableList" class="mt-40" ref="table2Ref">
      <el-table-column label="修改时间" align="center" prop="addTime" :show-overflow-tooltip="true" />
      <el-table-column label="操作人" align="center" prop="addUsername" :show-overflow-tooltip="true" />
      <el-table-column label="修改内容" align="center" prop="record" :show-overflow-tooltip="true"/>
    </el-table>
    <pagination  v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageRow" @pagination="getList" />
  </el-dialog>
</template>

<script setup>
  import { performanceRecord } from '@/api/bookingPerformance';
  import SelectPeople from '@/components/SelectPeople/SelectPeople.vue';
  const tableList = ref([]);
  const total = ref(0);
  const props = defineProps({
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
    dataSource: {
      type: Object,
      default: null
    }
  })
  const data = reactive({
    queryParams: {
      pageNum: 1,
      pageRow: 10,
    },
  });

  const { queryParams, rules } = toRefs(data);
  const emit = defineEmits([ 'cancel', 'success']);
  const { visible, dataSource } = toRefs(props);

  function handleBeforeClose() {
    emit('cancel');
  }

  function getList() {
    if(dataSource.value) {
      const data = {
        ...queryParams.value,
        ...dataSource.value,
      };
      performanceRecord(data).then(res => {
        if(res) {
          tableList.value = res.list;
          total.value = res.count;
        }
      })
    }
  }
 
  getList();
</script>



<style lang="scss" scoped>
.search {
  display: flex;
  align-items: center;
  margin: 0 0 24px 0;
  flex-wrap: wrap;
}
</style>