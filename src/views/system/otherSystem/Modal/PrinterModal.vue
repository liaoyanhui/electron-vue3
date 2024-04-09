<!--
 * @Description: 新增/编辑打印机
 * @Author: 尚夏
 * @Date: 2024-01-29 10:44:46
 * @LastEditTime: 2024-02-26 20:45:34
 * @FilePath: /cbank-client/src/views/system/otherSystem/Modal/PrinterModal.vue
-->
<template>
  <el-dialog :title="title" :model-value="visible" width="500px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <el-form ref="printerRef" :model="form" :rules="rules" label-width="95px">
      <el-form-item label="设备名称" prop="deviceName">
        <el-input v-model="form.deviceName" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="品牌" prop="manufacturer">
        <el-select
          v-model="form.manufacturer"
          class="m-2 mr-8"
          style="width: 180px"
          placeholder="请选择品牌"
        >
          <el-option
            v-for="item in manufacturerList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备ID" prop="deviceId">
        <el-input v-model="form.deviceId" placeholder="请输入设备ID" />
      </el-form-item>
      <el-form-item label="使用区域" prop="printNode">
        <el-select
          v-model="form.printNode"
          class="m-2 mr-8"
          style="width: 180px"
          placeholder="请选择区域"
        >
          <el-option
            v-for="item in printNodeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="打印模板" prop="templateId">
        <el-select
          v-model="form.templateId"
          class="m-2 mr-8"
          style="width: 180px"
          placeholder="请选择打印机"
        >
          <el-option
            v-for="item in templateList"
            :key="item.id"
            :label="item.templateName"
            :value="item.id"
          />
        </el-select>
        <el-button type="primary" @click="handleAddTemplate">新增模板</el-button>
      </el-form-item>
      <el-form-item label="是否启用" prop="deviceStatus">
        <el-switch
          :model-value="form.deviceStatus == 1 ? true : false"
          @change="handleChange"
          class="ml-2"
        />     
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
    <TemplateModal :visible="visibleTemplate" @cancel="handleCancel" @success="handleSuccess" :dataSource="templateDataSource"/>
  </el-dialog>
</template>

<script setup>
  import { getTemplateListAll, addOrderPrint, updateOrderPrint, getPrinterArea, getBrand } from '@/api/system/other-system.js';
  import useProduceStore from '@/store/produce';
  import { computed, watchEffect, watch, onMounted } from 'vue';
  import TemplateModal from './TemplateModal.vue';

  const { proxy } = getCurrentInstance();

  const produceStore = useProduceStore();
  const printerRef = ref(null);
  const visibleTemplate = ref(false);

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

  const emit = defineEmits([ 'cancel', 'success']);

  const templateList = ref([]);
  const manufacturerList = ref([]);
  const printNodeList = ref([
    
  ]);
  function getPrinterTemplateList() {
    getTemplateListAll().then(res => {
      templateList.value = res;
    })
  };

  function getBrandList() {
    getBrand().then(res => {
      manufacturerList.value = res;
    })
  }

  function getPrinterNodeList() {
    getPrinterArea().then(res => {
      printNodeList.value = res;
    })
  }

  onMounted(() => {
    getPrinterTemplateList();
    getPrinterNodeList();
    getBrandList();
  })
 
  const initData = {
    deviceName: '',
    manufacturer: '',
    deviceId: '',
    templateId: undefined,
    deviceStatus: false,
  };
  const data = reactive({
    form: {
     ...initData
    },
    rules: {
      deviceName: [{ required: true, message: "不能为空", trigger: "blur" }],
      manufacturer: [{ required: true, message: "不能为空", trigger: "blur" }],
      deviceId: [{ required: true, message: "不能为空", trigger: "blur" }],
      templateId: [{ required: true, message: "请选择", trigger: "blur" }],
      deviceStatus: [{ required: true, message: "不能为空", trigger: "blur" }],
    }
  });

  const { form, rules } = toRefs(data);
  const { visible, dataSource }  = toRefs(props);

  const title = computed(
    () => {
      if (dataSource.value) {
        return '编辑设备';
      } else {
        return '新增设备';
      }
    },
  )

  watch(
    () => dataSource.value,
    ( val ) => {
      if (val) {
        form.value = {
          deviceName: val.deviceName,
          manufacturer: val.manufacturer,
          deviceId: val.deviceId,
          templateId: val.templateId,
          printNode: val.printNode,
          deviceStatus: val.deviceStatus == 1 ? true : false,
        }
     }
    },
    { deep: true, immediate: true }
  )

  function handleChange(val) {
    form.value.deviceStatus = val ? 1 : 0;
  }

  const templateDataSource = ref(null);
  function handleAddTemplate() {
    visibleTemplate.value = true;
    templateDataSource.value = null;
  }

  function handleCancel() {
    templateDataSource.value = null;
    visibleTemplate.value = false;
  }
  function handleSuccess() {
    visibleTemplate.value = false;
    templateDataSource.value = null;
    getPrinterTemplateList();
  }

  async function submitForm() {
    proxy.$refs["printerRef"].validate(valid => {
    if (valid) {
      let data = {
        deviceName: form.value.deviceName,
        manufacturer: form.value.manufacturer,
        deviceId: form.value.deviceId,
        templateId: form.value.templateId,
        deviceStatus: form.value.deviceStatus ? 1 : 0,
        printNode: form.value.printNode,
      };
      if(dataSource.value) {
        data.id = dataSource.value.id;
        updateOrderPrint(data).then(res => {
          if (res) {
            form.value = {
              ...initData
            };
            emit('success');
          }
        })
      } else {
        addOrderPrint(data).then(res => {
          if (res) {
            form.value = {
              ...initData
            };
            emit('success');
          }
        })
      }
    }})
    
  };
  function cancel() {
    form.value = {
      ...initData
    };
    emit('cancel');
  };

  function handleBeforeClose() {
    emit('cancel');
  }
</script>