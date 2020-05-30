<template>
  <div class="dealVipTable">
    <el-table
      class="fontClass"
      :data="tableData"
      :border="false"
      style="width: 100%">
      <el-table-column label="会员账号" min-width="140" align="left">
        <template scope="scope">
          <el-row>
            <el-col>
               <span v-if="scope.row.pin">{{scope.row.pin}}</span>
                <el-tooltip :content="scope.row.customerPin" popper-class="my_poper" placement="top" v-else-if="scope.row.customerPin">
                  <span class="clamp_two_row">
                    <span class="mi_icon">密</span>
                    {{scope.row.customerPin}}
                  </span>
                </el-tooltip>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="会员昵称" min-width="140" align="left">
        <template scope="scope">
          <el-row>
            <el-col>
              {{scope.row.userNick || '-'}}
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="会员等级" min-width="100" align="left">
        <template scope="scope">
          <el-row>
            <el-col>
              {{scope.row.gradeName}}
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="访问时间" min-width="100" align="left">
        <template scope="scope">
          <el-row>
            <el-col>
              {{scope.row.created}}
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import vipDetail from './vipDetail';
  import http from 'src/api/index.js';
  export default{
    data() {
      return{
        dialogVisible: false,
        vipDetail: {}
      }
    },
    props: {
      tableData: Array
    },
  }
</script>

<style lang="less" scoped>
  .dealVipTable{
    color:red !important;
  }
</style>
