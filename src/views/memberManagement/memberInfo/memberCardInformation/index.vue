<!--
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-02-19 14:31:29
 * @LastEditTime: 2024-03-22 16:41:31
 * @FilePath: /cbank-client/src/views/memberManagement/memberInfo/memberCardInformation/index.vue
-->
<template>
  <div class="app-container content-box p-24">
    <div class="search">
      <el-row>
        <el-col :lg="8">
          <div class="mr-8 mb-8">
            <span class="px-6 label">昵称</span>
            <el-input v-model="queryParams.memberName"  placeholder="请输入昵称" style="width: 200px" clearable/>
          </div>
        </el-col>
        <el-col :lg="8">
          <div class="mr-8 mb-8">
            <span class="px-6 label">手机号</span>
            <el-input v-model="queryParams.memberMobile"  placeholder="请输入手机号" style="width: 200px" clearable/>
          </div>
        </el-col>
        <el-col :lg="8">
          <div class="mr-8 mb-8">
            <span class="px-6 label">会员卡号</span>
            <el-input v-model="queryParams.accountCardNumber"  placeholder="请输入会员卡号" style="width: 200px" clearable/>
          </div>
        </el-col>
        <el-col :lg="8">
          <div class="mr-8 mb-8">
            <span class="px-6 label">会员卡类型</span>
            <el-select
              v-model="queryParams.accountTypeId"
              class="m-2 mr-8"
              placeholder="请选择"
              style="width: 200px"
              clearable
              filterable
            >
              <el-option
                v-for="item in memberCardTypeList"
                :key="item.id"
                :label="item.typeName"
                :value="item"
              />
            </el-select>
          </div>
        </el-col>
        <!-- <div class="mr-8 mb-8">
          <span class="px-6">会员卡状态</span>
          <el-select
            v-model="queryParams.memberCardStatus"
            class="m-2 mr-8"
            placeholder="请选择"
            style="width: 200px"
            clearable
            filterable
          >
            <el-option
              v-for="item in memberCardStatusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div> -->
        <el-button class="mb-8" type="primary" @click="handleQuery">查询</el-button>
        <el-button class="mb-8" @click="handleReset">重置</el-button>
      </el-row>
    </div>
    <div>
      <div class="mb-12">
        <el-button type="primary" icon="Plus" @click="handleAddMemberCard">新增会员卡</el-button>
        <el-button @click="handleEdit">修改</el-button>
        <el-button @click="handleDel">删除</el-button>
        <el-button @click="handleRecharge">充值</el-button>
        <!-- <el-button @click="handleMakingCard">制卡</el-button>
        <el-button @click="handleLoss">挂失</el-button>
        <el-button @click="handleActivation">激活</el-button>
        <el-button @click="handleExchange">换卡</el-button>
        <el-button @click="handleTurn">转卡</el-button> -->
        <el-button @click="handleTransactionDetails">交易明细</el-button>
        <el-button @click="handleExport">导出</el-button>
      </div>
      <el-table :data="cardList" class="ml10 tbg" ref="tableRef" highlight-current-row @current-change="handleCurrentChange">
        <el-table-column label="序号" type="index" width="50" />
        <el-table-column label="开卡时间" align="center" prop="createTime" :show-overflow-tooltip="true"  />
        <el-table-column label="会员卡号" align="center" prop="accountCardNumber"  />
        <el-table-column label="会员卡类型" align="center" prop="accountTypeName" :show-overflow-tooltip="true"  />
        <el-table-column label="客人昵称" align="center" prop="memberName" :show-overflow-tooltip="true" />
        <el-table-column label="性别" align="center"  prop="memberSexName" :show-overflow-tooltip="true" />
        <el-table-column label="手机号" align="center" prop="memberMobile" :show-overflow-tooltip="true"  />
        <el-table-column label="充值余额" align="center" prop="accountBalanceRecharge"  />
        <el-table-column label="赠送余额" align="center"  prop="accountBalanceDonate" />
        <el-table-column label="总余额" align="center" prop="accountBalance" />
        <el-table-column label="累计充值" align="center"  prop="accountTotalRecharge" />
        <el-table-column label="累计赠送" align="center" prop="AccountTotalDonate" />
        <el-table-column label="累计消费" align="center" prop="AccountTotalCost" />
        <el-table-column label="推荐人" align="center" prop="referrer" />
        <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
        <!-- <el-table-column label="是否制卡" align="center" prop="totalOutput" :show-overflow-tooltip="true"  />
        <el-table-column label="状态" align="center" prop="totalOutput" :show-overflow-tooltip="true"  /> -->
      </el-table>
      <pagination  v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageRow" @pagination="getList" />
    </div>
    <AddMemberCard v-if="addMemberVisible" :visible="addMemberVisible" @cancel="handleCancelM" @success="handleSuccessM"/>
    <EditMemberCard v-if="editMemberVisible" :visible="editMemberVisible" @cancel="handleCancelE" @success="handleSuccessE" :dataSource="currentRow"/>
    <RechargeModal v-if="rechargeVisible" :visible="rechargeVisible" @cancel="handleCancelR" @success="handleSuccessR" :dataSource="currentRow"/>
    <MakingCard v-if="makingCardVisible" :visible="makingCardVisible" @cancel="handleCancelD" @success="handleSuccessD"/>
    <ExchangeCard v-if="exchangeCardVisible" :visible="exchangeCardVisible" @cancel="handleCancelC" @success="handleSuccessC"/>
    <TurnCard v-if="turnCardVisible" :visible="turnCardVisible" @cancel="handleCancelT" @success="handleSuccessT"/>
    <TransactionDetails v-if="transactionVisible" :visible="transactionVisible" @cancel="handleCancelA" @success="handleSuccessA" :dataSource="currentRow"/>
  </div>
</template>

<script setup>
  import { getMemberCardList, getMemberCardTypes, delMemberCard, memberCardListExport } from '@/api/member';
  import AddMemberCard from './Modal/AddMemberCard.vue';
  import EditMemberCard from './Modal/EditMemberCard.vue';
  import RechargeModal from './Modal/RechargeModal.vue';
  import MakingCard from './Modal/MakingCard.vue';
  import ExchangeCard from './Modal/ExchangeCard.vue';
  import TurnCard from './Modal/TurnCard.vue';
  import TransactionDetails from './Modal/TransactionDetails.vue';
  import { fenToYuan, yuanTofen } from '@/utils/index.js';
  import { blobToFile } from '@/utils/index.js'

  const { proxy } = getCurrentInstance();
  const cardList = ref([]);
  const currentRow = ref()

  const addMemberVisible = ref(false);
  const editMemberVisible = ref(false);
  const rechargeVisible = ref(false);
  const makingCardVisible = ref(false);
  const exchangeCardVisible = ref(false);
  const turnCardVisible = ref(false);
  const transactionVisible = ref(false);

  const total = ref(0);
  const initData = {
    pageNum: 1,
    pageRow: 10,
    memberName: undefined,
    memberMobile: undefined,
    accountCardNumber: undefined,
    memberCardType: undefined,
    // memberCardStatus: undefined,
  };
  const data = reactive({
    queryParams: {
      ...initData
    },
  });
  const memberCardTypeList = ref([]);
  const memberCardStatusList = ref([]);
  const { queryParams } = toRefs(data); 

  function getList() {
    getMemberCardList(queryParams.value).then(res => {
      if(res) {
        total.value = res.count;
        cardList.value = res.list;
      }
    })
  }

  function getMemberCardTypesList() {
    getMemberCardTypes({searchSource: 0}).then(res => {
      if(res) {
        memberCardTypeList.value = res;
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
  function handleAddMemberCard() {
    addMemberVisible.value = true;
  }

  function handleCurrentChange(val) {
     currentRow.value = val
  }

  function handleEdit() {
    if(!currentRow.value) {
      proxy.$modal.msgWarning("请选择要修改的会员卡");
      return 
    }
    editMemberVisible.value = true;
  }
  function handleDel() {
    if(!currentRow.value) {
      proxy.$modal.msgWarning("请选择要删除的会员卡");
      return 
    }
    proxy.$modal.confirm('确认删除'+ currentRow.value.memberName +'吗?').then(function () {
      let params = {
        id: currentRow.value.id,
      }
      return delMemberCard(params);
    }).then(() => {
        proxy.$modal.msgSuccess("操作成功");
        getList();
      }).catch(function () {
    });
  }
  function handleRecharge() {
    if(!currentRow.value) {
      proxy.$modal.msgWarning("请选择要充值的会员卡");
      return 
    }
    rechargeVisible.value = true;
  }
  function handleMakingCard() {
    makingCardVisible.value = true;
  }
  function handleLoss() {
    // proxy.$modal.confirm('挂失确认?').then(function () {
    //   let params = {
    //     id: item.id,
    //   }
    //   return unlimitedDrinkingActivityDelete(params);
    // }).then(() => {
    //     proxy.$modal.msgSuccess("操作成功");
    //     getList();
    //   }).catch(function () {
    // });
  }
  function handleActivation() {
    // proxy.$modal.confirm('激活确认?').then(function () {
    //   let params = {
    //     id: item.id,
    //   }
    //   return unlimitedDrinkingActivityDelete(params);
    // }).then(() => {
    //     proxy.$modal.msgSuccess("操作成功");
    //     getList();
    //   }).catch(function () {
    // });
  }
  function handleExchange() {
    exchangeCardVisible.value = true;
  }
  function handleTurn() {
    turnCardVisible.value = true;
  }
  function handleTransactionDetails() {
    if(!currentRow.value) {
      proxy.$modal.msgWarning("请选择要查看明细的会员卡");
      return 
    }
    transactionVisible.value = true;
  }
  function handleExport() {
    proxy.$modal.confirm('是否导出数据?').then(function () {
      const data = { ...queryParams.value,
      pageNum: undefined, pageRow: undefined }
      return memberCardListExport(data);
    }).then((res) => {
      // , '会员卡信息列表.xlsx'
        blobToFile(res)
        proxy.$modal.msgSuccess("导出成功");
      }).catch(function () {
    });
  }
  
  // 新增会员弹窗
  function handleCancelM(){
    addMemberVisible.value = false;
  }
  function handleSuccessM() {
     addMemberVisible.value = false;
     currentRow.value = null;
     getList();
  } 
  // 编辑
  function handleCancelE(){
    editMemberVisible.value = false;
  }
  function handleSuccessE() {
    editMemberVisible.value = false;
    currentRow.value = null;
    getList();
  } 
  
  // 充值
  function handleCancelR(){
    rechargeVisible.value = false;
  }
  function handleSuccessR() {
    rechargeVisible.value = false;
    currentRow.value = null;
    getList();
  }

  // 制卡
  function handleCancelD(){
    makingCardVisible.value = false;
  }
  function handleSuccessD() {
    makingCardVisible.value = false;
  } 
  // 换卡
  function handleCancelC(){
    exchangeCardVisible.value = false;
  }
  function handleSuccessC() {
    exchangeCardVisible.value = false;
  } 
  // 转卡
  function handleCancelT(){
    turnCardVisible.value = false;
  }
  function handleSuccessT() {
    turnCardVisible.value = false;
  } 
  // 交易明细
  function handleCancelA(){
    transactionVisible.value = false;
  }
  function handleSuccessA() {
    transactionVisible.value = false;
  } 

  getList();
  getMemberCardTypesList();
</script>

<style lang="scss" scoped>
.search {

  .label {
    display: inline-block;
    width: 100px;
  }
}
.content-box {
  border-radius: 10px;
  background: #323745;
}
</style>