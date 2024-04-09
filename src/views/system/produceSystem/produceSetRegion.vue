<!--
 * @Description: 区域出品设置
 * @Author: 尚夏
 * @Date: 2024-01-22 21:10:15
 * @LastEditTime: 2024-01-23 13:36:35
 * @FilePath: /cbank-client/src/views/system/produceSystem/produceSetRegion.vue
-->
<template>
  <div>
    <el-row>
      <el-col>
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['produce:region:set:add']">新增方案</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div class="plan-list">
          <ul>
            <li>
              <p>
                <span>方案一</span>
                <el-icon class="edit"><Edit color="#2AD1B7"/></el-icon>
              </p>
              <div class="plan-list-content">
                <div class="plan-list-content-left">
                  <ul>
                    <li>
                      <div>
                        <span class="label">房台</span>
                        <el-select
                          v-model="value"
                          class="m-2"
                          placeholder="Select"
                          size="large"
                          style="width: 240px"
                        >
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </div>
                    </li>
                  </ul>
                  <div class="add-room">
                    <el-icon><Plus color="#2AD1B7"/></el-icon>
                    <span>新增房台</span>
                  </div>
                </div>
                <div class="plan-list-content-right"></div>
              </div>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>

  function handleAdd() {}
</script>

<style lang="scss" scoped>
  .plan-list {
    margin: 24px 0;
    > ul {
      min-height: 176px;
      background: #FFFFFF;
      border-radius: 10px;
      padding: 0 24px;
      display: flex;
      > li {
        flex: 1;
        > p {
          display: flex;
          align-items: center;
          font-weight: 500;
          margin: 24px 0;
          > span {
            margin-right: 10px;
          }
          .edit {
            cursor: pointer;
          }
        }
      }
    }
  }
</style>