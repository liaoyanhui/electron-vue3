<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-19 14:17:20
 * @LastEditTime: 2024-03-11 20:06:13
 * @FilePath: /cbank-client/src/views/memberManagement/memberInfo/customerInformation/index.vue
-->

<template>
  <div class="app-container content-box p-24">
    <div class="search">
      <el-row>
        <el-col :lg="8">
          <div class="mr-8 mb-8">
            <span class="px-6 label">昵称</span>
            <el-input v-model="queryParams.memberName"  placeholder="请输入昵称" style="width: 180px" clearable/>
          </div>
        </el-col>
        <el-col :lg="8">
          <div class="mr-8 mb-8">
            <span class="px-6 label">手机号</span>
            <el-input v-model="queryParams.memberMobile"  placeholder="请输入手机号" style="width: 180px" clearable/>
          </div>
        </el-col>
        <el-col :lg="8">
          <div class="mr-8 mb-8">
            <span class="px-6 label">来源渠道</span>
            <el-select
              v-model="queryParams.sourceMode"
              class="m-2 mr-8"
              placeholder="请选择"
              style="width: 200px"
              clearable
              filterable
            >
              <el-option
                v-for="item in originList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-col>
      </el-row>
    
      <el-button class="mb-8" type="primary" @click="handleQuery">查询</el-button>
      <el-button class="mb-8" @click="handleReset">重置</el-button>
      <el-button class="mb-8" type="primary" icon="Plus" @click="handleAddCustomer">新增客户</el-button>
    </div>
    <div>
      <!-- <div class="mb-12">
        
      </div> -->
      <el-table :data="customerList" class="tbg" ref="tableRef">
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="注册时间" align="center" prop="createTime"   />
        <el-table-column label="客人昵称" align="center" prop="memberName"  />
        <el-table-column label="性别" align="center" prop="memberSexName" :show-overflow-tooltip="true"  />
        <el-table-column label="手机号" align="center" prop="memberMobile" :show-overflow-tooltip="true" />
        <el-table-column label="来源渠道" align="center" prop="sourceModeName" :show-overflow-tooltip="true" />
        <!-- <el-table-column label="次数" align="center" key="chargebackCount" prop="chargebackCount" :show-overflow-tooltip="true"  /> -->
        <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true"  />
        <el-table-column label="操作" align="center"  width="230px" >
          <template #default="scope">
            <div class="handle-btn">
              <!-- <el-button text type="primary" @click="handleGetRoomInfor(scope.$index, scope.row)">房台信息</el-button> -->
              <el-link :underline="false" type="danger" @click="handleBindMemberCard(scope.$index, scope.row)">绑定会员卡</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination  v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageRow" @pagination="getList" />
    </div>
    <CustomerModal v-if="customerVisible" :visible="customerVisible" @cancel="handleCancelC" @success="handleSuccessC" />
    <BindMemberCardModal v-if="bindVisible" :visible="bindVisible" @cancel="handleCancelB" @success="handleSuccessB" :dataSource="bindData"/>
    <!-- <RoomInforModa v-if="roomVisible" :visible="roomVisible" @cancel="handleCancelR" @success="handleSuccessR" :dataSource="roomData"/> -->
  </div>
</template>

<script setup>
  import { getMemberList } from '@/api/member';
  import CustomerModal from './Modal/CustomerModal.vue';
  import BindMemberCardModal from './Modal/BindMemberCardModal.vue';
  import { onMounted } from 'vue';
  // import RoomInforModa from './Modal/RoomInforModa.vue';
  const { proxy } = getCurrentInstance();

  const customerVisible = ref(false);
  const bindVisible = ref(false);
  const roomVisible = ref(false);
  const total = ref(0);
  const initData = {
    pageNum: 1,
    pageRow: 10,
    isActive: 0,
    memberName: undefined,
    memberMobile: undefined,
    sourceMode: undefined,
  };
  const data = reactive({
    queryParams: {
      ...initData,
    },
  });
  const originList = ref([
    { label: '线下手工注册', value: '0'},
    { label: '小程序注册', value: '1'},
    { label: 'App注册', value: '2'},
    { label: '订房自动创建', value: '3'},
    { label: '存取酒自创建', value: '4'},
  ]);
  const customerList = ref([]);
  const bindData = ref(null);
  const roomData = ref(null);

  const { queryParams } = toRefs(data); 

  function getList() {
    getMemberList(queryParams.value).then(res => {
      if(res) {
        customerList.value = res.list;
        total.value = res.count;
      }
    });
  }

  onMounted(() => {
    
  })

  function handleQuery() {
    getList();
  }
  
  function handleReset() {
    queryParams.value = {
      ...initData
    }
    getList();
  }
  
  function handleAddCustomer() {
    customerVisible.value = true;
  }

  // function handleGetRoomInfor(i,v) {
  //   roomVisible.value = true;
  //   roomData.value = v;
  // }

  function handleBindMemberCard(i,v) {
    bindVisible.value = true;
    bindData.value = v;
  }

  // 新增客户
  function handleSuccessC() {
    customerVisible.value = false;
    getList();
  }
  function handleCancelC() {
    customerVisible.value = false;
  }

  // 绑定会员卡
  function handleSuccessB() {
    bindVisible.value = false;
    bindData.value = null;
    getList();
  }
  function handleCancelB() {
    bindVisible.value = false;
    bindData.value = null;
  }

  // 房台信息
  // function handleSuccessR() {
  //   roomVisible.value = false;
  //   roomData.value = null;
  // }
  // function handleCancelR() {
  //   roomVisible.value = false;
  //   roomData.value = null;
  // }

  getList();
</script>

<style lang="scss" scoped>
.search {

  .label {
    display: inline-block;
    width: 80px;
  }
}
.content-box {
  border-radius: 10px;
  background: #323745;
}
</style>