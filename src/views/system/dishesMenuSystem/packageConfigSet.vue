<!--
 * @Description: 套餐配置方案
 * @Author: 尚夏
 * @Date: 2024-01-30 10:20:35
 * @LastEditTime: 2024-02-19 15:57:42
 * @FilePath: /cbank-client/src/views/system/dishesMenuSystem/packageConfigSet.vue
-->
<template>
  <div class="app-container">
    <div class="search">
      <div class="mr-8">
        <span class="px-6 fs-12">套餐类型</span>
        <el-select
          v-model="queryParams.packageType"
          class="m-2 mr-8"
          placeholder="请选择"
          style="width: 180px"
          clearable
        >
          <el-option
            v-for="item in packageTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="mr-8">
        <span class="px-6 fs-12">套餐名称</span>
        <el-input v-model="queryParams.name" placeholder="请输入套餐名称" style="width: 180px"/>
      </div>
      <div class="mr-8" v-if="queryParams.packageType == 2">
        <span class="px-6 fs-12">适用房型</span>
        <el-select
          v-model="queryParams.roomType"
          class="m-2 mr-8"
          placeholder="请选择"
          style="width: 180px"
          clearable
        >
          <el-option
            v-for="item in houseTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-button type="primary" @click="handleQuery">查询</el-button>
    </div>
    <div class="table-box bg-f">
      <div class="btns">
        <el-button type="primary" icon="Plus" @click="handleAddPackage(2)">新增开台套餐</el-button>
        <el-button type="primary" icon="Plus" @click="handleAddPackage(1)">新增普通套餐</el-button>
      </div>
      <el-table :data="packageList" class="ml10" ref="tableRef">
        <el-table-column label="图片" align="center" key="packagePic" prop="packagePic">
          <template #default="scope">
            <div style="display: flex; align-items: center">
                <el-image :src="scope.row.packagePic" style="width: 100px; height: 100px" fit="cover"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="套餐类型" align="center" key="packageType" prop="packageType" :formatter="(a,b,c,d) =>  c == 1 ? '普通套餐' : '开台套餐' " />
        <el-table-column label="套餐名称" align="center" key="name" prop="name" />
        <el-table-column label="套餐价格" align="center" key="price" prop="price" :formatter="(a,b,c,d) => fenToYuan(c) "/>
        <el-table-column label="适用房型" align="center" key="applicableRoomTypeName" prop="applicableRoomTypeName" />
        <el-table-column label="套餐明细" align="center">
          <template #default="scope">
              <el-button type="primary" @click="handleCheckDetail(scope.row)">查看套餐明细</el-button>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" align="center">
          <template #default="scope">
            <el-switch
                :model-value="scope.row.status == 1 ? true : false"
                @change="(e) => handleChange(scope.row.id, e)"
                class="ml-2"
                style="--el-switch-on-color: #13ce66;"
              />
          </template>
        </el-table-column>
        <el-table-column label="是否入低消" align="center" key="isHypothermia" prop="isHypothermia" :formatter="(a,b,c,d) => c == 1 ? '是' : '否' " :show-overflow-tooltip="true" />
        <el-table-column label="操作" align="center" width="160px">
          <template #default="scope">
             <el-link :underline="false" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-link>
             <el-link :underline="false" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <OpenPackageModal v-if="visible" :visible="visible" @cancel="handleCancel" @success="handleSuccess" :dataSource="dataSource" :pgType="pgType"/>
    <PackageDetailModal v-if="visibleDetail" :visible="visibleDetail" @success="handleSuccessDetail" :dataSource="detailList"/>
  </div>
</template>

<script setup>
  import { getOpenPlatformPackage, openPlatformPackageDelete, openPlatformPackageEnable } from '@/api/system/produce-system';
  import useProduceStore from '@/store/produce';
  import OpenPackageModal from './Modal/OpenPackageModal.vue';
  import PackageDetailModal from './Modal/PackageDetailModal.vue';
  import { fenToYuan, yuanTofen } from '@/utils/index.js';
  
  const { proxy } = getCurrentInstance();
  const produceStore = useProduceStore();
  const visible = ref(false);
  const total = ref(0);
  const houseTypeList = ref([]);
  const dataSource = ref(null);
  const detailList = ref(null);
  const visibleDetail = ref(false);
  const packageTypeList = ref([
    { id: 1, name: '普通套餐'},
    { id: 2, name: '开台套餐'},
  ]);
  const pgType = ref(null);
  const data = reactive({
    form: {},
    queryParams: {
      packageType: undefined,
      name: '',
      roomType: undefined
    },
  });
  const packageList = ref([]);
  const { queryParams, form } = toRefs(data);
  
  function getList(data) {
    getOpenPlatformPackage(data).then(res => {
      if (res) {
        packageList.value = res;
      }
    })
  }

  function getRoomList() {
    produceStore.ajaxCompanyRoomTypeList().then(res => {
      if(res) {
        houseTypeList.value = res;
      }
    })
  }

  onMounted(
    () => {
      getList(queryParams.value);
      getRoomList();
    }
  )

  function handleQuery() {
    const data = {
      packageType: queryParams.value.packageType,
      name: queryParams.value.name,
    }
    if ( queryParams.value.packageType == 2) {
      data.roomType = queryParams.value.roomType;
    }
    getList(data);
  }

  function handleEdit(index, item) {
    dataSource.value = item;
    visible.value = true;
    pgType.value = item.packageType;
  }

  function handleDel(index, item) {
    proxy.$modal.confirm('是否删除该套餐?').then(function () {
      let params = {
        id: item.id,
      }
      return openPlatformPackageDelete(params);
    }).then(() => {
      proxy.$modal.msgSuccess("操作成功");
      getList(queryParams.value);
    }).catch(function () {
    });
  }

  function handleAddPackage(type) {
    pgType.value = type;
    visible.value = true;
    dataSource.value = null;
  }

  function handleSuccess() {
    visible.value = false;
    getList(queryParams.value);
  }
  function handleCancel() {
    visible.value = false;
  }


  function handleSuccessDetail() {
    visibleDetail.value = false;
  }

  // 查看明细
  function handleCheckDetail(detail) {
    detailList.value = detail.id;
    visibleDetail.value = true;
  }

  // 是否启用
  function handleChange(id, val) {
    let text = val ? "启用" : "停用";
    proxy.$modal.confirm('是否确认' + text + '该套餐?').then(function () {
      let params = {
        id,
        status: val ? 1 : 0
      }
      return openPlatformPackageEnable(params);
    }).then(() => {
      proxy.$modal.msgSuccess(text + "成功");
      getList(queryParams.value);
    }).catch(function () {
    });
  }
</script>

<style lang="scss" scoped>
  .app-container {
    .search {
      display: flex;
      color: #fff;
      align-items: center;
      margin-bottom: 24px;
      > div {
        display: flex;
        align-items: center;
      }
    }
  }
  .table-box {
    min-height: calc(100vh - 130px - 40px);
    // border-radius: 10px;
    overflow: hidden;
    // padding: 24px;
  }
  .btns {
    margin-bottom: 24px;
  }
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>

<style lang="scss" scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>