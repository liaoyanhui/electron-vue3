<template>
  <div class="producer-set">
    <el-row>
      <el-col class="mb-24">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" >新增</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="mt20">
        <ul class="produce-list bg-black p-20 radius-8">
          <li v-for="(item, index) in dataSource" :key="index">
            <ul class="produce-list-items">
              <li>
                <span class="label">出品部门</span>
                <el-tooltip
                    class="box-item"
                    effect="dark"
                    placement="top-start"
                  >
                  <template #content>
                    <div>{{ item?.departmentName }}</div>
                  </template>
                    <span class="item-value">{{ item?.departmentName }}</span>
                  </el-tooltip>
              </li>
              <li>
                <span class="label">打印机</span>
                <span>{{ item?.printName }}</span>
              </li>
              <li>
                <span class="label">备注</span>
                 <el-tooltip
                    class="box-item"
                    effect="dark"
                    placement="top-start"
                  >
                  <template #content>
                    <div>{{ item?.remarks }}</div>
                  </template>
                    <span class="item-value">{{ item?.remarks }}</span>
                  </el-tooltip>
              </li>
              <li>
                <el-switch
                  :model-value="item.status == 1 ? true : false"
                  @change="(e) => handleChange(item.id, e)"
                  class="ml-2"
                  style="--el-switch-on-color: #13ce66;"
                />
                <span class="edit" @click="handleEdit(item)">编辑</span>
                <span class="del" @click="handleDel(item.id)">删除</span>
              </li>
            </ul>
          </li>
        </ul>
      </el-col>
      <div v-if="visible">
        <DepartmentModal :visible="visible" :editDepartmentId="editDepartmentId" @cancel="visible = false" @success="handleSuccess" :departmentInfo="departmentInfo"/>
      </div>
    </el-row>
  </div>
</template>

<script setup>
  import DepartmentModal from './Modal/DepartmentModal.vue';
  import useProduceStore from '@/store/produce';
  import { watchEffect } from 'vue';

  const { proxy } = getCurrentInstance();
  const produceStore = useProduceStore();

  const visible = ref(false);
  const value2 = ref(true);
  const dataSource = ref([{}]);
  // 编辑的id
  const editDepartmentId = ref(null);
  const departmentInfo = ref({});

  // 获取列表 
  function fetchList() {
    produceStore.ajaxProductionDepartmentList().then(res => {
      if (res) {
        dataSource.value = res.list;
      }
    })
  }
  watchEffect(() => {
    fetchList();
  })
  // 新增部门
  function handleAdd() {
    editDepartmentId.value = null;
    departmentInfo.value = {};
    visible.value = true;
  }

  // 编辑部门
  function handleEdit(item) {
    editDepartmentId.value = item.id;
    departmentInfo.value = {
      department: item.departmentName,
      printId: Number(item.printId),
      remarks: item.remarks,
      isEnable: item.status,
    }
    visible.value = true;
  }
  // 删除
  function handleDel(id) {
    proxy.$modal.confirm('是否删除该出品部门?').then(function () {
      let params = {
        ids: id,
      }
      return produceStore.ajaxDelProductionDepartmentDelete(params);
    }).then(() => {
        proxy.$modal.msgSuccess("操作成功");
        fetchList();
      }).catch(function () {
    });
  }

  // 是否启用
  function handleChange(id, val) {
    let text = val ? "启用" : "停用";
    proxy.$modal.confirm('是否确认' + text + '该出品部门?').then(function () {
      let params = {
        ids: id,
        status: val ? 1 : 0
      }
      return produceStore.ajaxUpdateProductionDepartmentEnable(params);
    }).then(() => {
      proxy.$modal.msgSuccess(text + "成功");
      fetchList();
    }).catch(function () {
      // row.status = row.status === "0" ? "1" : "0";
    });
  }

  // 新增成功回掉
  function handleSuccess() {
    visible.value = false;
    editDepartmentId.value = null;
    fetchList();
  }
</script>

<style scoped lang="scss">
  .producer-set {
    border-radius: 10px;
    min-height: calc(100vh - 120px);
  }
  .produce-list {
    > li {
      height: 95px;
    }
    > li:not(:last-child) {
      border-bottom: 1px solid var(--el-border-color-light);
    }
  } 
  .produce-list-items {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    li {
      flex: 1;
      display: flex;
      align-content: center;
    }
    li:nth-child(4) {
      flex: 1.5;
    }
    li:last-child {
      flex: 0.5;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .label {
      color: #545F6A;
      margin-right: 8px;
    }
    .edit {
      cursor: pointer;
      color: #2AD1B7;
    }
    .del {
      color: #F33B3B;
      cursor: pointer;
    }
    .item-value {
      display: inline-block;
      width: 200px;
      white-space: nowrap; /* 不换行 */
      overflow: hidden;    /* 隐藏超出部分 */
      text-overflow: ellipsis; /* 显示省略号 */
    }
  }
  // .tool-content {
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   white-space: nowrap;
  // }
  
  
</style>


