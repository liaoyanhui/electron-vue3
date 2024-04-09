<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-19 14:17:20
 * @LastEditTime: 2024-03-11 20:06:30
 * @FilePath: /cbank-client/src/views/memberManagement/memberInfo/memberInformation/index.vue
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
      <el-button class="mb-8" type="primary" icon="Plus" @click="handleAddCustomer">新增会员</el-button>
    </div>
    <div>
      <el-table :data="memberList" class="ml10 tbg" ref="tableRef">
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="入会时间" align="center" key="createTime" prop="createTime" />
        <el-table-column label="客人昵称" align="center" key="memberName" prop="memberName"  />
        <el-table-column label="性别" align="center" key="memberSexName" prop="memberSexName" :show-overflow-tooltip="true"  />
        <el-table-column label="手机号" align="center" key="memberMobile" prop="memberMobile" :show-overflow-tooltip="true" />
        <el-table-column label="来源渠道" align="center" key="sourceModeName" prop="sourceModeName" :show-overflow-tooltip="true" />
        <!-- <el-table-column label="次数" align="center" key="chargebackCount" prop="chargebackCount" :show-overflow-tooltip="true" /> -->
        <el-table-column label="备注" align="center" key="remark" prop="remark" :show-overflow-tooltip="true"  />
        <el-table-column label="操作" align="center"  width="230px" >
          <template #default="scope">
            <div class="handle-btn">
              <el-link :underline="false" type="primary" @click="handleCardInfor(scope.$index, scope.row)">会员卡信息</el-link>
              <!-- <el-button text type="danger" @click="handleGetRoomInfor(scope.$index, scope.row)">房台信息</el-button> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination  v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageRow" @pagination="getList" />
    </div>
    <MemberModal v-if="memberVisible" :visible="memberVisible" @cancel="handleCancelC" @success="handleSuccessC" />
    <CardInfoModal v-if="cardVisible" :visible="cardVisible" @cancel="handleCancelB" :dataSource="bindData"/>
    <!-- <RoomInforModa v-if="roomVisible" :visible="roomVisible" @cancel="handleCancelR" @success="handleSuccessR" :dataSource="roomData"/> -->
  </div>
</template>

<script setup>
  import { getMemberList } from '@/api/member';
  import MemberModal from './Modal/MemberModal.vue';
  import CardInfoModal from './Modal/CardInfoModal.vue';
  // import RoomInforModa from './Modal/RoomInforModa.vue';
  const { proxy } = getCurrentInstance();

  const memberVisible = ref(false);
  const cardVisible = ref(false);
  const roomVisible = ref(false);
  const total = ref(0);
  const initData = {
    pageNum: 1,
    pageRow: 10,
    isActive: 1,
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
  const memberList = ref([]);
  const bindData = ref(null);
  const roomData = ref(null);

  const { queryParams } = toRefs(data); 

  function getList() {
    getMemberList(queryParams.value).then(res => {
      if(res) {
        memberList.value = res.list;
        total.value = res.count;
      }
    });
  }

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
    memberVisible.value = true;
  }

  function handleGetRoomInfor(i,v) {
    roomVisible.value = true;
    roomData.value = v;
  }

  function handleCardInfor(i,v) {
    cardVisible.value = true;
    bindData.value = v.id;
  }

  // 新增客户
  function handleSuccessC() {
    memberVisible.value = false;
    getList();
  }
  function handleCancelC() {
    memberVisible.value = false;
  }

  // 会员卡信息
  function handleCancelB() {
    cardVisible.value = false;
    bindData.value = null;
  }

  // // 房台信息
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