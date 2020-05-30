<template>
  <el-dialog title="请选择邀请参与的活动" :visible.sync="visible">
    <div v-loading="listLoading"  v-if="tableData.length">
      <el-select v-model="queryData.activityStatus" style="margin-bottom:15px;">
        <el-option label="全部有效状态" value="valid,wait"></el-option>
        <el-option label="进行中" value="valid"></el-option>
        <el-option label="未开始" value="wait"></el-option>
      </el-select>
      <el-table
        :data="tableData"
        :border="false"
        style="width: 100%">
          <el-table-column label="活动名称" min-width="160" prop="activityName" align="left" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="开始时间" align="left" min-width="140">
            <template scope="scope">
                <el-row>
                    <el-col>
                        {{scope.row.startTime}}
                    </el-col>
                </el-row>
            </template>
        </el-table-column>
        <el-table-column label="结束时间" align="left" min-width="140">
            <template scope="scope">
                <el-row>
                    <el-col>
                        <span v-if="scope.row.endTime == '2037-12-31 23:59:59'">永久</span>
                        <span v-else>{{scope.row.endTime}}</span>
                    </el-col>
                </el-row>
            </template>
        </el-table-column>
        <el-table-column label="状态" align="left" min-width="70">
            <template scope="scope">
                <el-row>
                    <el-col>
                        {{statusMap[scope.row.status]}}
                    </el-col>
                </el-row>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="left" min-width="80">
          <template scope="scope">
            <span class="fc--red" v-if="scope.row.id === current.id">已选中</span>
            <el-button type="text" @click="checkActivity(scope.row)" v-else>选取</el-button>
          </template>
        </el-table-column>
        </el-table>
        <el-pagination
          layout="prev, pager, next"
          :current-page="queryData.pageNo"
          :page-size="queryData.pageSize"
          align="right"
          @current-change="getActivityList"
          :total="total">
        </el-pagination>
    </div>
    <div v-else class="noData">
      <p class="text">您当前没有正在进行中或未开始的的加购&关注有礼活动</p>
      <el-button type="primary" size="large" @click="toCreate">去创建</el-button>
    </div>
  </el-dialog>
</template>
<script>
import ajax from "src/api/index.js";
export default {
  props: {
      current: {
          type: Object,
          default: {}
      }
  },
  data() {
    return {
      visible:false,
      queryData: {
          pageNo: 1,
          pageSize: 10,
          activityStatus:'valid'
      },
      statusMap: {
          'wait': '未开始',
          'valid': '进行中',
          'invalid': '已结束'
      },
      tableData:[],
      total:0
    }
  },
  watch:{
    'queryData.activityStatus'() {
      this.queryData.pageNo = 1;
      this.getList();
    }
  },
  methods: {
    showDialog() {
      // console.log(this.current);
      this.getList(() => {
        this.visible = true;
      })
    },
    checkActivity(data) {
      this.$emit('selAct', data);
      this.visible = false;
    },
    getList(cb) {
        ajax({
          api_name:'signActivityList',
          data:{
            activityType: 'dynamic_wareFollow',
            ...this.queryData
          }
        }, result => {
          console.log(result);
          this.tableData = result.data.list;
          this.total = result.data.total;
          this.listLoading = false;
          cb && cb();
        }, error => {
          this.listLoading = false;
        })
    },
    getActivityList(page){
        this.queryData.pageNo = page || this.queryData.pageNo;
        this.listLoading = true;
        this.getList();
    },
    toCreate() {
      location.hash = "#/purchase"
    }
  }
}
</script>
<style lang="less" scoped>
  .noData {
    height:100px;
    text-align: center;
    padding:40px 0;
    .text {
      margin-bottom:20px;
      color: #999;
      font-size: 16px;
    }
  }
</style>
