<!--
 * @Description: 模板管理操作
 * @Author: 尚夏
 * @Date: 2024-01-29 17:13:33
 * @LastEditTime: 2024-02-26 20:46:25
 * @FilePath: /cbank-client/src/views/system/otherSystem/Modal/TemplateModal.vue
-->
<template>
  <el-dialog :title="title" :model-value="visible" width="500px" append-to-body destroy-on-close :before-close="handleBeforeClose">
    <el-form ref="templateRef" :model="form" :rules="rules" label-width="95px">
      <el-form-item label="模板名称" prop="templateName">
        <el-input v-model="form.templateName" placeholder="请输入模板名称" />
      </el-form-item>
      <el-form-item label="适配品牌" prop="manufacturer">
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
      <el-form-item label="备注" prop="notes">
        <el-input v-model="form.notes" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="模板内容" prop="templateContent">
        <el-input
          v-model="form.templateContent"
          :rows="4"
          type="textarea"
          placeholder="请输入模板内容"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  import { getBrand, addOrderPrintTemplate, updateOrderPrintTemplate } from '@/api/system/other-system.js';
  import { onMounted } from 'vue';

  const title = ref('新增模板');
  const templateRef = ref(null);

  const emit = defineEmits([ 'cancel', 'success']);
  
  const total = ref(0);
  const manufacturerList = ref([]);
  const initData = {
    templateName: '',
    manufacturer: '',
    notes: '',
    templateContent: '',
  };
  
  const data = reactive({
    form: {
     ...initData
    },
    rules: {
      templateName: [{ required: true, message: "不能为空", trigger: "blur" }],
      manufacturer: [{ required: true, message: "不能为空", trigger: "blur" }],
      templateContent: [{ required: true, message: "不能为空", trigger: "blur" }],
    }
  });

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

  const { form, rules } = toRefs(data);
  const { visible, dataSource }  = toRefs(props);

  watch(
    () => dataSource.value,
    ( val ) => {
      if (val) {
        form.value = {
          templateName: val.templateName,
          manufacturer: val.manufacturer,
          notes: val.notes,
          templateContent: val.templateContent,
        }
     }
    },
    { deep: true, immediate: true }
  )
  
  function getBrandList() {
    getBrand().then(res => {
      manufacturerList.value = res;
    })
  }

  onMounted(() => {
    getBrandList();
  })

  function handleBeforeClose() {
    emit('cancel');
  }

  async function submitForm() {
    if(!templateRef.value) return;
    await templateRef.value.validate((valid, fields) => {
      if(valid) {
        const data = {
          templateName: form.value.templateName,
          manufacturer: form.value.manufacturer,
          notes: form.value.notes,
          templateContent: form.value.templateContent,
        }

        if(dataSource.value) {
          data.id = dataSource.value.id;
          updateOrderPrintTemplate(data).then(res => {
            if (res) {
              form.value = {
                ...initData
              };
              emit('success');
            }
          })
        } else {
          addOrderPrintTemplate(data).then(res => {
            if(res) {
              form.value = {
                ...initData
              };
              emit('success');
            }
          })
        }
      }
    })
  }
  function cancel() {
    emit('cancel');
  }
</script>
