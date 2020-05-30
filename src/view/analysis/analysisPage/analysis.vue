<template>
  <div class="analysis" v-loading="isLoading">
    <div>
      分析时间：营销开始后的:
      <el-select size="small" style="width:100px;" v-model="lastDay">
        <el-option value="3" :label="'3天内'"></el-option>
        <el-option value="5" :label="'5天内'"></el-option>
        <el-option value="7" :label="'7天内'"></el-option>
      </el-select>
      <span>
        {{sendTime}} - {{endTime}}
      </span>
      <div class="analysis-info-box">
        <div class="info-title">营销效果_整体</div>
        <div class="info-content">
          <Content :analysisData="analysisData"/>
        </div>
      </div>
      <div class="analysis-info-box">
        <div class="info-title">营销效果_整体</div>
        <div class="info-content">
          <Chart :chartData="analysisData.list"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ajax from 'src/api/index.js'
import moment from 'moment'
import Content from './content'
import Chart from './chart'
import {point} from 'src/common/point.js'
export default {
  props: {
    id:[String,Number],
    sendTime:String,
    type: String
  },
  components:{
    Content,
    Chart
  },
  data() {
    return {
      lastDay:"7",
      endTime:'',
      analysisData:{},
      isLoading:false
    }
  },
  watch: {
    'lastDay'() {
      this.calcTime();
      this.queryData();
    }
  },
  created() {
    point('37977.39401.39427')
    this.calcTime();
    this.queryData();
  },
  methods: {
    calcTime() {
      let endTime = new Date(this.sendTime).getTime() + (this.lastDay - 1) * 86400000;
      this.endTime = moment(endTime).format("YYYY-MM-DD HH:mm:ss");
    },
    queryData() {
      this.isLoading = true;
      ajax({
        api_name: 'getMarketingAnalyzeData',
        data:{
          activityId:this.id,
          lastDay:this.lastDay,
          type: this.type
        },
        vm: this
      },
      result => {
        this.isLoading = false;
        this.$set(this,'analysisData', result.data);
      },
      error => {
        this.isLoading = false;
        this.$message({
            message: error || '未知错误！',
            type: 'error'
        });
      })
    }
  }
}
</script>
<style lang="less" scoped>
 .analysis-info-box {
    margin-top:10px;
    i {
      color:#20a0ff;
    }
    .info-title {
      height: 42px;
      padding: 0 10px;
      background: #f5f5f5;
      border: 1px solid #eaeaea;
      line-height: 42px;
      color: #333;
      font-size: 16px;
      font-family: microsoft yahei;
    }
    .info-content {
      margin-top: -1px;
      padding: 10px;
      border: 1px solid #eaeaea;
      background: #fff;
    }
  }
</style>
