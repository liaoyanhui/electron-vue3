<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-01-29 11:21:05
 * @LastEditTime: 2024-03-11 20:09:48
 * @FilePath: /cbank-client/src/views/system/otherSystem/Modal/TemplateManageModal.vue
-->
<template>
  <el-dialog :title="title" :model-value="visible" width="1100px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <div class="mb-12">
      <el-button type="primary" icon="Plus" @click="handleAdd">新增模板</el-button>
    </div>
    <el-table :data="templateList" class="ml10" ref="tableRef">
      <el-table-column label="模板名称" align="center" key="templateName" prop="templateName" :show-overflow-tooltip="true" />
      <el-table-column label="适配品牌型号" align="center" key="manufacturerName" prop="manufacturerName" :show-overflow-tooltip="true" />
      <el-table-column label="备注" align="center" key="notes" prop="notes" :show-overflow-tooltip="true" />
      <el-table-column label="最后更新时间" align="center" key="editTime" prop="editTime" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" width="170px">
        <template #default="scope">
          <div class="d-flex">
            <el-link :underline="false" type="danger" @click="handleDel(scope.$index, scope.row.id)">删除</el-link>
            <el-link :underline="false" type="success" @click="handleDetail(scope.$index, scope.row)">详情</el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageRow" @pagination="getTemplateLists" />
    <TemplateModal :visible="visibleTemplate" @cancel="handleCancel" @success="handleSuccess" :dataSource="templateDataSource"/>
  </el-dialog>
</template>

<script setup>
  import { getTemplateList, delOrderPrintTemplate } from '@/api/system/other-system.js';
  import { onMounted } from 'vue';
  import TemplateModal from './TemplateModal.vue';
  
  const { proxy } = getCurrentInstance();
  const title = ref('模板管理')
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

  const total = ref(0);
  const data = reactive({
    queryParams: {
     pageNum: 1,
     pageRow: 10,
    },
  });

  const templateDataSource = ref(null);

  const templateList = ref([]);
  const { form, queryParams } = toRefs(data);
  const { visible, dataSource }  = toRefs(props);
  const visibleTemplate = ref(false);
  
  function getTemplateLists() {
    getTemplateList(queryParams.value).then(res => {
      if(res) {
        templateList.value = res.list;
        total.value = res.count;
      }
    })
  }
  onMounted(() => {
    getTemplateLists();
  })

  function handleBeforeClose() {
    emit('cancel');
  }

  function handleAdd() {
    visibleTemplate.value = true;
  }

  function handleDel(index, id) {
    proxy.$modal.confirm('是否删除该模板?').then(function () {
      let params = {
        idList: [id],
      }
      return delOrderPrintTemplate(params);
    }).then(() => {
        proxy.$modal.msgSuccess("操作成功");
        getTemplateLists();
      }).catch(function () {
    });
  }
  function handleDetail(index, item) {
    templateDataSource.value = item;
    visibleTemplate.value = true;
  }

  function handleCancel() {
    templateDataSource.value = null;
    visibleTemplate.value = false;
  }
  function handleSuccess() {
    visibleTemplate.value = false;
    templateDataSource.value = null;
    getTemplateLists();
  }

</script>
