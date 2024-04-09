<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-19 16:50:29
 * @LastEditTime: 2024-03-11 20:06:22
 * @FilePath: /cbank-client/src/views/memberManagement/memberInfo/customerInformation/Modal/RoomInforModa.vue
-->
<template>
  <el-dialog title="房台信息" :model-value="visible" width="908px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <el-table :data="roomList" class="ml10" ref="tableRef">
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="房台" align="center" key="room" prop="room" :show-overflow-tooltip="true" />
      <el-table-column label="流水号" align="center" key="manufacturerName" prop="manufacturerName" :show-overflow-tooltip="true" />
      <el-table-column label="订房人" align="center" key="booker" prop="booker" :show-overflow-tooltip="true" />
      <el-table-column label="时间" align="center" key="time" prop="time" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" width="170px">
        <template #default="scope">
          <el-link :underline="false" type="success" @click="handleDetail(scope.$index, scope.row)">查看明细</el-link>
        </template>
      </el-table-column>
    </el-table>
    <DetailModal :visible="detailVisible" @cancel="handleCancel" :dataSource="detailDataSource"/>
  </el-dialog>
</template>

<script setup>
  import { getTemplateList, delOrderPrintTemplate } from '@/api/system/other-system.js';
  import { onMounted } from 'vue';
  import DetailModal from './DetailModal.vue';
  
  const { proxy } = getCurrentInstance();
  const emit = defineEmits([ 'cancel', 'success']);
  const props = defineProps({
    visible: {
      type: Boolean,
      required: true,
      default: false,
    },
    dataSource: {
      type: Object,
      default: null,
    },
  });

  const data = reactive({
    queryParams: {
     pageNum: 1,
     pageRow: 10,
    },
  });

  const detailDataSource = ref(null);

  const roomList = ref([{}]);
  const { form, queryParams } = toRefs(data);
  const { visible, dataSource }  = toRefs(props);
  const detailVisible = ref(false);
  
  // function getTemplateLists() {
  //   getTemplateList(queryParams.value).then(res => {
  //     if(res) {
  //       roomList.value = res.list;
  //     }
  //   })
  // }
  onMounted(() => {
    // getTemplateLists();
  })

  function handleBeforeClose() {
    emit('cancel');
  }

  function handleDetail(index, item) {
    detailDataSource.value = item;
    detailVisible.value = true;
  }

  function handleCancel() {
    detailDataSource.value = null;
    detailVisible.value = false;
  }
  function handleSuccess() {
    detailVisible.value = false;
    detailDataSource.value = null;
    getTemplateLists();
  }

</script>
