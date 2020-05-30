<template>
  <div class="send-record">
    <el-form inline>
      <el-form-item label="短信发送时间">
        <el-date-picker v-model="startTime" type="date" class="row_line" style="width:170px;"/>
        至
        <el-date-picker v-model="endTime" type="date" class="row_line" style="width:170px;"/>
      </el-form-item>
      <el-form-item label="用户名：">
        <el-input size="small" v-model="pin"></el-input>
      </el-form-item>
       <el-form-item label="手机号：">
        <el-input size="small" v-model="mobile"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="handleCurrentChange(1)">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      class="fontClass"
      :data="tableData"
      :border="false"
       v-loading="loading"
       style="width: 100%">
      <el-table-column label="发送时间" prop="sendTime" min-width="140" />
      <el-table-column label="买家用户名" prop="pin" min-width="120">
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
      <el-table-column label="手机号"  prop="mobile" min-width="120" />
      <el-table-column label="发送状态" min-width="100">
        <template scope="scope">
          <span :class="{'fc--red':scope.row.status == 2 || scope.row.status == 5}">
            {{
                scope.row.status == 0 ? '待发送' :
                scope.row.status == 1 ? '审核中' :
                scope.row.status == 2 ? '审核不通过' :
                scope.row.status == 3 ? '发送中' :
                scope.row.status == 4 ? '发送成功' :
                scope.row.status == 5 ? '发送失败' :
                scope.row.status == 6 ? '取消发送' : ''
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="短信数"  prop="count" min-width="80" />
      <el-table-column label="短信内容"  prop="content" />
  </el-table>
  <div class="table_footer" v-if="queryData.total">
      <el-pagination
          layout="prev, pager, next"
          :current-page="queryData.pageNo"
          :page-size="queryData.pageSize"
          @current-change="handleCurrentChange"
          :total="queryData.total">
      </el-pagination>
  </div>
  </div>
</template>

<script>
  import http from 'src/api'
  import dateFormat from '@/common/dateFormat.js'
  import {point} from 'src/common/point.js'
  export default{
    props:{
      msgType:[String,Number]
    },
    data() {
      return{
        vipDetail: {},
        statusObj: {
          '0': '未激活',
          '1': '已激活'
        },
        tableData:[
          {}
        ],
        activityName:'',
        startTime:'',
        endTime:'',
        queryData:{
          pageNo:1,
          pageSize:20,
          total:0
        },
        status:'',
        loading:true,
        rowObj:{},
        levelName:'',
        levelList:'',
      }
    },
    created(){
      this.searchData();
      if(this.msgType == 1) {//发货
        point('37977.40528.40532')
      } else if(this.msgType == 4) {//催付
        point('37977.40528.40530');
      }
    },
    methods: {
      handleCurrentChange(e) {
        this.queryData.pageNo = Number(e);
        this.searchData();
      },
      searchData() {
        let data = {
          type:this.msgType,
          pageNo:this.queryData.pageNo,
          pageSize:this.queryData.pageSize,
          startTime:this.startTime ? dateFormat(this.startTime,'YY-MM-DD') : '',
          endTime:this.endTime? dateFormat(this.endTime,'YY-MM-DD') : '',
          pin:this.pin,
          mobile:this.mobile
        }
        this.loading = true;
        http({
          api_name:'sendMsgDetail',
          data
        },(res) =>{
            this.tableData = res.data.list;
            this.queryData.total = res.data.total;
            console.log(this.queryData.total);
            this.loading = false;
        },error => {
            this.loading = false;
        })
      },
    },
  }
</script>
<style lang="less">
  .send-record {
    .el-input {
      .el-input__inner {
        width:100%;
        height:100%;
      }
    }
  }
</style>
<style lang="less" scoped>
  .table_footer{
    text-align: right;
  }

</style>
