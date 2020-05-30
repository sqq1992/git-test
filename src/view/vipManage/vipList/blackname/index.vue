<template>
  <div class="m-content inputSet" v-loading="loadingPage">
    <!-- <div class="m-content-main main_height inputSet"> -->
    <div class="clearfix m_b20">
      <div class="f-fl headLeft hidden">
        <div class="row_line inline_block">
          <span class="row_name inline_block">会员账号：</span>
          <el-input @keyup.native.enter="userPin && memberList(true)" v-model.trim="userPin" class="userName"></el-input>
        </div>
        <div class="row_line inline_block m_l10">
          <span class="row_name inline_block phone_name">会员手机号：</span>
          <el-input @keyup.native.enter="mobile && memberList(true)" v-model.trim="mobile" class="userName"></el-input>
        </div>
      </div>
      <div class="f-fl hidden m_l20">
        <el-button type='primary' size='small' @click="memberList(true)">查 询</el-button>
      </div>

      <div class="f-fr hidden m_l20">
        <addOneDialog @onConfirm="addBlackList"/>
        <addBatchDialog @refresh="memberList"/>
      </div>

    </div>
    <blackNameTable :tableData="tableData" @refresh="memberList"></blackNameTable>
    <div class="text-right" v-if="pageInfo.total">
      <el-pagination
        :current-page="pageInfo.pageNo"
        @current-change="handleCurrentChange"
        :page-size="pageInfo.pageSize"
        layout="total, prev, pager, next"
        :total="pageInfo.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import http from 'src/api';
  import blackNameTable from './blacknameTable';
  import addBatchDialog from './addBatchDialog';
  import addOneDialog from './addOneDialog';

  export default{
    data() {
      return {
        loadingPage: false,
        userPin: '',
        mobile: '',
        pageInfo: {
          pageNo: 1,
          pageSize: 10,
          total: 0
        },
        tableData: []
      }
    },
    created() {
      this.memberList(true);
    },
    methods: {
      memberList(init) {
        this.loadingPage = true;
        if(init) {
          this.pageInfo.pageNo = 1;
        };
        http({
          api_name: 'customerBlacklist',
          vm: this,
          data: {
            mobile: this.mobile,
            userPin: this.userPin,
            pageNo: this.pageInfo.pageNo,
            pageSize: this.pageInfo.pageSize,
          }
        }, ({data}) => {
          this.loadingPage = false;
          const {list = [],total = 0} = data
          this.tableData = list
          this.pageInfo.total = total;
        }, (error) => {
          this.loadingPage = false;
        });
      },

      addBlackList(type,blacklists,cb) {
        http({
          api_name: 'addCustomerBlacklist',
          vm: this,
          data: {
            type,
            blacklists,
          }
        }, () => {
          this.memberList(true);
          cb()
        });
      },

      handleCurrentChange(e) {
        this.pageInfo.pageNo = Number(e);
        this.memberList();
      }
    },
    components: {
      blackNameTable,
      addBatchDialog,
      addOneDialog,
    }
  }
</script>

<style lang="less" scoped>
  .headLeft{
    .row_line{
      .row_name{
        width: 70px;
        height: 28px;
        line-height: 28px;
        text-align: right;
      }
      .phone_name{
        width: 85px;
      }
      .date {
        width: 80px;
      }
      .userName{
        width: 125px;
      }
      .moneyOne{
        width: 68.5px;
      }
      .dateWidth{
        width: 115px;
      }
    }
  }
  .hidden{
    button{
      min-width: 70px;
    }
  }
</style>
