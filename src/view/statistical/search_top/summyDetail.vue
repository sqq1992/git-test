<template>
  <div>
      <el-dialog
          :title="title"
          :visible.sync="showSummary"
          :before-close="hideSummary"
          class="summaryDialog"
      >
        <el-table :data="summaryData" border stripe>
          <el-table-column>
             <template slot-scope="scope">
               {{scope.row.name}}
             </template>
          </el-table-column>
          <el-table-column label="参与情况汇总">
             <template slot-scope="scope">
               {{scope.row.summary}}
             </template>
          </el-table-column>
          <el-table-column label="大转盘">
             <template slot-scope="scope">
               {{scope.row.turntable}}
             </template>
          </el-table-column>
          <el-table-column label="签到">
             <template slot-scope="scope">
                {{scope.row.sign}}
             </template>
          </el-table-column>
          <el-table-column label="关注店铺">
             <template slot-scope="scope">
                {{scope.row.attention}}
             </template>
          </el-table-column>
          <el-table-column label="邀请好友关注店铺">
             <template slot-scope="scope">
                {{scope.row.inviteAttention}}
             </template>
          </el-table-column>
          <el-table-column label="完善会员信息">
             <template slot-scope="scope">
               {{scope.row.perfect}}
             </template>
          </el-table-column>
           <el-table-column label="抢红包">
             <template slot-scope="scope">
               {{scope.row.openRedEnvelope}}
             </template>
          </el-table-column>
           <el-table-column label="打地鼠">
             <template slot-scope="scope">
               {{scope.row.whackDiglett}}
             </template>
          </el-table-column>
           <el-table-column label="新人入会礼">
             <template slot-scope="scope">
               {{scope.row.newcomerActivity}}
             </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="hideSummary">取 消</el-button>
          <el-button type="primary" @click="hideSummary">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
export default {
  props:{
    title:[String],
    summaryData:[Array],
    showSummary:[Boolean]
  },
  created(){
    console.log(this.showSummary);
  },
  data() {
    return {
      dialogVisible:true
    }
  },
  methods:{
    hideSummary() {
      this.$emit('hideSummary');
    }
  }
}
</script>
<style lang="less">
 .summaryDialog{
    .el-dialog--small{
     min-width:900px;
     .el-dialog__header{
       font-size:16px;
       box-sizing:border-box;
       height:56px;
       line-height: 56px;
       padding:0;
       padding:0 24px;
       border-bottom:1px solid #eaeaea;
       .el-dialog__headerbtn{
         margin-top:15px;
       }
     }
     .el-table__header-wrapper{
       th{
        height:40px;
        line-height:40px;
        background: #EBEBEB;
        border-right: none;
        .cell{
          background: #EBEBEB;
          padding:0 5px;
          font-size:14px;
        }
       }
     }
    }
  }
</style>
