<!--
 * @Description: 开台&&开台套餐选择
 * @Author: pgm
 * @Date: 2024-01-27 01:38:10
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-02-04 17:58:10
 * @FilePath: /cbank-client/src/views/cbank/components/openPlatformPackage.vue
-->


<template>
  <el-dialog v-bind="$attrs" v-model="show" width="350px" append-to-body destroy-on-close
    :before-close="handleBeforeClose">
    <el-form ref="dishTypeRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="开台套餐" prop="parentType">
        <el-select v-model="form.openPackage" placeholder="请选择开台套餐" style="width: 220px" class="custom-select">
          <el-option v-for="item in openPlatformPackageList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
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
import { createOrder } from '@/api/dishes/index'
import { directOpenRoom } from '@/api/cbank'
import { useDishesSystemStore } from '@/store/system'

const { proxy } = getCurrentInstance();
const dishesSystemSote = useDishesSystemStore()

onMounted(() => {
  let { roomId } = props.roomInfo
  dishesSystemSote.getDishInfoSelect({ type: 2, roomId}).then(res => {
    openPlatformPackageList.value = res.list
  })
})
const props = defineProps({
  roomInfo: {
    type: Object,
    require: true
  },
  value: {
    type: String,
    require: true,
    default: ''
  },

})

const data = reactive({
  form: {},
  rules: {
    typeName: [{ required: true, message: "分类不能为空", trigger: "blur" }],
  }
})
const emit = defineEmits(['update:value']);

const dishTypeList = ref([]);


const { form, rules } = toRefs(data);

const show = computed(() => {
  return props.value == 'openPlatformPackage'
})
const openPlatformPackageList = ref([])



function handleBeforeClose() {
  cancel()
}

function submitForm() {
  let { roomId, reserveId } = props.roomInfo
  let params = {
    roomId, reserveId
  }


  directOpenRoom(params).then(res => {
    if (res) {
      creatOrder(res)
    }
  }).catch(() => {

  })

  // cancel()
}
const creatOrder = (consumeHistoryId) => {
  let { roomId } = props.roomInfo
  let arry = []
  let openPackage = openPlatformPackageList.value.filter(item=>item.id == form.value.openPackage)[0]
  arry.push(openPackage)
  let produceSaveReqList = arry.map(item => {
    let { id, name, mealPrice, makeDepartmentId, type, dishInfoCount = 1, dishTasteId = '', remarks = '' } = item
    return {
      id, name, mealPrice, makeDepartmentId, type, dishInfoCount, dishTasteId, remarks
    }
  })
  let list = JSON.stringify(produceSaveReqList)
  let params = {
    roomId,
    roomConsumeHistoryId: consumeHistoryId,
    produceSaveReqs: list,
    roomAdminId: 1 //TODO
  }
  createOrder(params).then(res => {
    proxy.$modal.msgSuccess("开台成功");
    cancel()
  }).catch(() => {
  }).finally(() => {

  })
}
function cancel() {
  emit('update:value', '')
  form.value = {};
}
</script>