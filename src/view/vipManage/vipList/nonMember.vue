<template>
  <div class="m-content inputSet" v-loading="loadingPage">
    <!-- <div class="m-content-main main_height inputSet"> -->
    <div class="clearfix m_b20">
      <div class="f-fl headLeft hidden">
        <div class="row_line inline_block">
          <span class="row-item__inline">会员账号：</span>
          <el-input @keyup.native.enter="memberList(true)" v-model.trim="userName" class="userName"></el-input>
        </div>
        <div class="row_line inline_block m_l10">
          <span class="row-item__inline">会员昵称：</span>
          <el-input @keyup.native.enter="memberList(true)" v-model.trim="userNick" class="userName"></el-input>
        </div>
      </div>
      <div class="f-fl hidden">
        <el-button type="primary" class="m_r10" size='small' @click="memberList(true)">查 询</el-button>
      </div>
    </div>
    <dealVipTable :tableData="tableData"></dealVipTable>
    <div class="text-right" v-if="pageInfo.total">
      <el-pagination
        :current-page="pageInfo.pageNo"
        @current-change="handleCurrentChange"
        :page-size="pageInfo.pageSize"
        layout="total, prev, pager, next"
        :total="pageInfo.total">
      </el-pagination>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
  import http from './../../../api/index.js';
  import dealVipTable from './nonMemberTable';
  export default{
    data() {
      return {
        loadingPage: false,
        userName: '',
        userNick: '',
        pageInfo: {
          pageNo: 1,
          pageSize: 10,
          total: 0
        },
        tableData: [],
      }
    },
    mounted() {
      this.memberList(true);
    },
    methods: {
      memberList(init) {
        this.loadingPage = true;
        if(init) {
          this.pageInfo.pageNo = 1;
        };
        http({
          api_name: 'memberList',
          vm: this,
          data: {
            pin: this.userName,
            userNick: this.userNick,
            pageNo: this.pageInfo.pageNo,
            pageSize: this.pageInfo.pageSize,
            isMember:false
          }
        }, (res) => {
          this.loadingPage = false;
          this.tableData = res.data ? (res.data.crmCustomerList ? res.data.crmCustomerList : []) : [];
          this.pageInfo.total = res.data ? (res.data.total ? res.data.total : (res.data.crmCustomerList ? res.data.crmCustomerList.length : 0)) : 0;
        }, (error) => {
          this.loadingPage = false;
        });
      },
      handleCurrentChange(e) {
        this.pageInfo.pageNo = Number(e);
        this.memberList();
      },
    },
    components: {
      dealVipTable
    }
  }
</script>

<style lang="less" scoped>
  .headLeft{
    width: 865px;
    .row_line{
      .row_name{

      }
      .center_name{
        width: 85px;
      }
      .userName{
        width: 150px;
      }
      .date {
        width: 80px;
      }

      .moneyOne{
        width: 68.5px;
      }
      .dateWidth{
        width: 115px;
      }
    }

    .row-item__inline {
      width: 7em;
      text-align: right;
      height: 28px;
      line-height: 28px;
      display: inline-block;
    }
    .m_l15{
      margin-left: 15px;
    }
  }
  .hidden{
    button{
      width: 70px;
    }
  }
</style>
