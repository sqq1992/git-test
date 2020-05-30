<template>
  <div class="crm-table__log" style="margin-top:10px">
    <div class="title">
      发送记录仅支持查询9月17日功能发布后的验证码短信发送明细
    </div>
    <el-form inline>
      <el-form-item label="会员账号：">
        <el-input size="small" v-model="pin"></el-input>
      </el-form-item>
      <el-form-item label="短信发送时间：">
        <el-date-picker
          v-model="date"
          size="small"
          type="daterange"
          :clearable="false"
          placeholder="选择日期范围">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="text" @click="handleCurrentChange(1)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <slot></slot>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      class="fontClass"
      :data="tableData"
      :border="false"
      style="width: 100%">
      <el-table-column label="发送会员" prop="pin" min-width="140">
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
      <el-table-column label="发送条数" prop="count" min-width="120" />
      <el-table-column label="发送时间" prop="sendTime" min-width="120" />
      <el-table-column label="发送内容" prop="content" min-width="120" />
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
  import moment from 'moment'
  import dateFormat from './../../common/dateFormat.js'
  import http from 'src/api'
  export default {
    name: '',
    props: {
      type: String
    },
    created() {
      this.getData();
    },
    watch:{
      sendFlag() {
        this.getData(this.templateId);
      }
    },
    computed:{
      templateId() {
        return this.$store.state.sendLog.templateId;
      },
      sendFlag() {
        return this.$store.state.sendLog.sendFlag;
      }
    },
    data() {
      const limitDay = moment().subtract(30,'days')
      const now = moment()
      return {
        pin:'',
        mobile:'',
        tableData: [],
        date:[moment().subtract(29,'days'),now],
        queryData: {
          pageNo: 1,
          pageSize: 20,
          total:0
        },
        loading:true
      }
    },
    methods: {
      handleCurrentChange(e) {
        this.queryData.pageNo = Number(e);
        this.getData();
      },
      getData(id) {
        let data = {
          pin:this.pin,
          startTime:dateFormat(this.date[0], 'YY-MM-DD'),
          endTime:dateFormat(this.date[1], 'YY-MM-DD'),
          pageSize:this.queryData.pageSize,
          pageNo:this.queryData.pageNo,
          type:55
        }
        this.loading = true
        http({
          api_name:'sendMsgDetail',
          data
        },res => {
          this.tableData = res.data.list;
          this.queryData.total = res.data.total
          this.loading = false;
        },error => {
          this.loading = false;
          this.$message.error(error.message);
        })
      },

    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .title {
    position:absolute;
    top:21px;
    left:150px;
    font-size:12px;
    color:#999;
  }
  .el-form-item {
    margin-bottom: 16px;
  }
  .table_footer{
    text-align: right;
  }
</style>
